
const Xendit = require('xendit-node');
const config = require('config');
// https://www.npmjs.com/package/xendit-node#create-charge
const db = require('../utilities/database');
const { utils, constants, errorHandler, messages } = require('../core');
const { purchaseNotification, htoNotification, paymetInstructionNotification, referralCreditNotification } = require('../utilities/notification');
const { creditEyewearPoints } = require('./user');
const { addCustomerActivityLogs } = require('./admin/logs');
const xendit = new Xendit({ secretKey: config.xendit.secretKey});
const {Card, VirtualAcc, Disbursement, Invoice  } = xendit;
const card = new Card({});
const virtualAcc = new VirtualAcc({});
const disbursement = new Disbursement({});
const invoice = new Invoice({});
/*************** create token *************/
// https://js.xendit.co/test_tokenize.html?_ga=2.239283397.734798076.1594711425-1599941407.1591334300
// https://js.xendit.co/test_authenticate.html?_ga=2.68631064.867224787.1594980102-1599941407.1591334300


let updateOrderPaymentDetails = async (order_status, order_details, payment_category = 3, created_by_staff = null, optician = null) => {
    let transaction = await db.dbTransaction();
    try {
        let promiseArr = [];
        let userQueryResult = [];
        let orderQueryResult = [];
        let user_id = order_details.user_id;
        let current_date = new Date();

        if(order_status === constants.order_status.PAYMENT_CONFIRMED){
            let userQuery = `select ur.user_id as referrer_user_id from users us
                inner join user_referral ur on us.registration_referral_code = ur.referral_code
                where us.id = :user_id and us.status = 1 and ur.status = 1`;

            let orderQuery = `select * from order_details
                where user_id = :user_id and status = 1 and order_status in (:order_status_list)`;

            // TODO: check for order status list later

            let replacements = {
                user_id,
                order_status_list: [
                    'payment_confirmed',
                    'order_confirmed',
                    'order_delivered'
                ]
            };

            let promiseArr1 = [];

            promiseArr1.push(db.rawQuery(userQuery, 'SELECT', replacements));
            promiseArr1.push(db.rawQuery(orderQuery, 'SELECT', replacements));

            let results = await Promise.all(promiseArr1);

            userQueryResult = results[0];
            orderQueryResult = results[1];

            if (userQueryResult.length == 1 && orderQueryResult.length == 0) {
                let referrerUser = userQueryResult[0];

                let userCreditQuery  = `select opening_balance, closing_balance from user_credits
                    where status = 1 and user_id = :referrer_user_id
                    order by created_at desc limit 1`;

                replacements.referrer_user_id = referrerUser.referrer_user_id;

                let userCreditResults = await db.rawQuery(userCreditQuery, 'SELECT', replacements);

                let credit_amount = constants.referralDetails.referralAmount;
                let opening_balance = 0;

                if(userCreditResults.length !== 0) {
                    opening_balance = userCreditResults[0].closing_balance;
                }

                let closing_balance = opening_balance + credit_amount;

                let credit_expiry_date = new Date();
                credit_expiry_date.setFullYear(credit_expiry_date.getFullYear() + 1);

                let userCreditObj = {
                    user_id: referrerUser.referrer_user_id,
                    credit_amount: credit_amount,
                    opening_balance: opening_balance,
                    closing_balance: closing_balance,
                    activity_type: 'ORDER',
                    activity_reference_id: order_details.id,
                    transaction_type: 'CREDIT',
                    created_at: current_date,
                    created_by: user_id,
                    updated_at: current_date,
                    updated_by: user_id,
                    status: 1
                };

                const userCreditSave = db.saveData(userCreditObj, 'UserCredits', transaction);

                promiseArr.push(userCreditSave);
            }

            if(orderQueryResult.length == 0) {
                const userUpdate = db.updateOneByCondition({
                    is_first_order: 1,
                    updated_at: current_date,
                    updated_by: user_id,
                }, {
                    id: user_id
                }, 'User', transaction);
                promiseArr.push(userUpdate);
            }
        }

        let deleteCartItems =  db.deleteRecord({
            user_id: order_details.user_id
        }, 'CartItems', transaction);

        let deleteAddonItems = db.deleteRecord({
            user_id: order_details.user_id
        }, 'CartAddonItems', transaction);

        const orderDetailData = {
            order_status: order_status,
            updated_at: current_date,
            updated_by: user_id,
            status: 1,
            payment_status: order_status,
            payment_category
        };
        if(created_by_staff){
            orderDetailData.created_by_staff=created_by_staff;
        }
        if(optician){
            orderDetailData.optician=optician;
        }
        const orderUpdate = db.updateOneByCondition(orderDetailData, { id: order_details.id }, 'OrderDetail', transaction);

        let orderHistoryObj = {
            order_no: order_details.order_no,
            status: order_status,
            source: 'xendit',
            created_at: new Date(),
            created_by: user_id
        };
        const orderHistorySave = db.saveData(orderHistoryObj, 'OrdersHistory', transaction);

        promiseArr.push(deleteCartItems);
        promiseArr.push(deleteAddonItems);
        promiseArr.push(orderUpdate);
        promiseArr.push(orderHistorySave);

        await Promise.all(promiseArr);
        
        if(order_status === constants.order_status.PAYMENT_CONFIRMED || order_details.payment_status === constants.payment_status.PARTIAL_PAID){
            await creditEyewearPoints(order_details);
            await addCustomerActivityLogs({
                user_id,
                action: order_status === constants.order_status.PAYMENT_CONFIRMED ? constants.logs_action.payment_confirmed : constants.logs_action.partial_paid,
                created_by: user_id
            });
            purchaseNotification(order_details.order_no);
        }

        if (userQueryResult.length == 1 && orderQueryResult.length == 0) {
           referralCreditNotification(order_details.id);
        }
        await transaction.commit();
        return true;
    } catch(error) {
        await transaction.rollback();
        console.log('Error: ', error);
        throw errorHandler.customError(messages.systemError);
    }
};

const cardPayment = async (payload, user = {}) => {
    const { token_id, auth_id, amount, card_cvn, external_id, is_save_card, user_id, currency = 'IDR' } = payload;
    const order_details = await db.findOneByCondition({ payment_req_id: external_id}, 'OrderDetail'); // 1
    if(!order_details) {
        throw new Error('Invalid payment request');
    }
    
    try {
        let paymentRequestData = {
            user_id,
            order_no: order_details.order_no,
            order_id: order_details.order_id,
            external_id,
            token_id,
            auth_id,
            amount,
            created_by: user_id,
            payment_method: constants.payment_method.CARD,
            created_at: new Date()
        };
        await db.updateOneByCondition({status: false, updated_at: new Date()}, {
            order_no: order_details.order_no
        }, 'PaymentRequest');
        
        await db.saveData(paymentRequestData, 'PaymentRequest'); // 2

        const charge = await card.createCharge({
            tokenID: token_id,
            amount: amount,
            authID: auth_id,
            cardCvn: card_cvn,
            externalID: external_id,
            capture: false,
            currency
        });

        await db.saveData(charge, 'PaymentAuthResponse'); // 3

        const captureChargeResponse = await card.captureCharge({
            chargeID: charge.id,
            amount: charge.authorized_amount,
        });

        await db.saveData(captureChargeResponse, 'PaymentResponse');

        let order_status = constants.order_status.PAYMENT_CONFIRMED;

        await updateOrderPaymentDetails(order_status, order_details);

        return {
            success: true,
            order_status,
            order_no: order_details.order_no
        };
    } catch (error) {
        console.log('Error: ', error);
        let order_status = constants.order_status.PAYMENT_FAILED;
        await updateOrderPaymentDetails(order_status, order_details);

        return {
            success: false,
            order_status,
            order_no: order_details.order_no
        };
    }
};

/*************** create charge *************/
const createCharge = async (payload) => {
    const {token_id, auth_id, amount, card_cvn, external_id, is_save_card, user_id, currency = 'IDR'} = payload;
    const orderDetails = await db.findByCondition({ payment_req_id: external_id}, 'OrderDetail');
        if(orderDetails.length === 0) {
            throw new Error('Invalid payment request');
        }
    try {

        let paymentRequestData = {
            user_id,
            order_no: orderDetails[0].order_no,
            external_id,
            token_id,
            auth_id,
            amount,
            created_by: user_id,
            payment_method: constants.payment_method.CARD,
            created_at: new Date()
        };

        let type = 1;
        if(orderDetails[0].is_hto) {
            type = 2;
        }

        let deleteCartItems =  db.deleteRecord({
            user_id,
            type,
        }, 'CartItems');

        let addOnDeleteQuery = 'delete from cart_addon_items cai where cart_id in (select id from cart_items ci where user_id = :user_id and "type" = :type)';
        let replacements = {
            user_id,
            type,
        };

        let deleteAddOn =  db.rawQuery(addOnDeleteQuery, 'SELECT', replacements);
        let savePaymentReq = db.saveData(paymentRequestData, 'PaymentRequest');

        let promiseArr = [];
        promiseArr.push(deleteCartItems);
        promiseArr.push(deleteAddOn);
        promiseArr.push(savePaymentReq);

        await Promise.all(promiseArr);

        const charge = await card.createCharge({
            tokenID: token_id,
            amount: amount,
            authID: auth_id,
            cardCvn: card_cvn,
            externalID: external_id,
            capture: false,
            currency
        });

        await db.saveData(charge, 'PaymentAuthResponse'); // 3

        if(is_save_card){
            const card = await db.findOneByCondition({card_number: charge.masked_card_number}, 'UserCards', ['id']);
            if(card){
                await db.updateOneByCondition({token_id}, {id: card.id}, 'UserCards');
            } else {
                await db.saveData({
                    token_id,
                    user_id,
                    card_number: charge.masked_card_number,
                    card_brand: charge.card_brand,
                    card_type: charge.card_type
                }, 'UserCards');
            }
        }
        const captureChargeRes = await captureCharge(charge);
        const orderDetail = db.saveData({order_no: orderDetails[0].order_no, status: captureChargeRes.order_status, source: 'xendit', created_at: new Date(), created_by: user_id}, 'OrdersHistory');

        const order = db.updateOneByCondition({
            order_status: captureChargeRes.order_status,
            updated_at: new Date(),
            status: 1,
            payment_category: 3,
            payment_status: captureChargeRes.order_status
        }, {
            payment_req_id: external_id
        }, 'OrderDetail');

        await Promise.all([order,orderDetail]);
        if(captureChargeRes.order_status === constants.order_status.PAYMENT_CONFIRMED){
            if(orderDetails[0].is_hto) {
                htoNotification(orderDetails[0].order_no);
            } else {
                await creditEyewearPoints(orderDetails[0]);
                purchaseNotification(orderDetails[0].order_no);
            }
        }

        captureChargeRes.order_no = orderDetails[0].order_no;
        return captureChargeRes;
    } catch (error) {
        const order = db.updateOneByCondition({
            order_status: constants.order_status.PAYMENT_FAILED,
            updated_at: new Date(),
            status: 1,
            payment_status: constants.order_status.PAYMENT_FAILED,
        }, {
            payment_req_id: external_id
        }, 'OrderDetail'); // 4
        const orderDetail = db.saveData({order_no: orderDetails[0].order_no, status: constants.order_status.PAYMENT_FAILED, source: 'xendit', created_at: new Date(), created_by: user_id}, 'OrdersHistory');
        await Promise.all([order, orderDetail]);
        return {
            success: false,
            'order_status': constants.order_status.PAYMENT_FAILED,
        };
    }
};

const captureCharge = async (payload) => {
    try {
        const captureChargeResponse = await card.captureCharge({
            chargeID: payload.id,
            amount: payload.authorized_amount,
        });

        await db.saveData(captureChargeResponse, 'PaymentResponse');

        return {
            success: true,
            order_status: constants.order_status.PAYMENT_CONFIRMED
        };
    } catch (error) {
        console.log('Error: ', error);
        return {
            success: false,
            order_status: constants.order_status.PAYMENT_FAILED
        };
    }
};

const createRefund = async (payload) => {
    return await card.createRefund({
        chargeID: payload.charge_id,
        amount: payload.amount,
        externalID: payload.external_id,
    });
};

const createFixedVA = async (payload) => {
    const { external_id, bank_code, name, amount, user_id, currency = 'IDR', payment_category } = payload;

    const orderDetails = await db.findOneByCondition({ payment_req_id: external_id }, 'OrderDetail');

    if(!orderDetails) {
        throw new Error('Invalid payment request');
    }
    try {
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        let paymentRequestData = {
            user_id: orderDetails.user_id,
            external_id,
            order_no: orderDetails.order_no,
            bank_code,
            name,
            amount,
            expiration_time: expirationDate,
            currency,
            created_by: user_id,
            payment_method: constants.payment_method.VIRTUAL_ACCOUNT,
            created_at: new Date()
        };
        await db.updateOneByCondition({status: false, updated_at: new Date()}, {
            order_no: orderDetails.order_no
        }, 'PaymentRequest');

        await db.saveData(paymentRequestData, 'PaymentRequest');

        let xenditRequestData = {
            externalID: payload.external_id,
            bankCode: payload.bank_code,
            name: payload.name,
            suggestedAmt: payload.amount,
            expectedAmt: payload.amount,
            expirationDate: expirationDate
            //isSingleUse?: boolean;
        };

        let paymentInstructionType = 'mandiri-instruction';
        if(payload.bank_code == 'BCA') {
            xenditRequestData.isClosed = true;
            paymentInstructionType = 'bca-instruction';
        }
        const xenditPaymentResponse =  await virtualAcc.createFixedVA(xenditRequestData);
        await db.saveData(xenditPaymentResponse, 'PaymentAuthResponse');
        xenditPaymentResponse.order_no = orderDetails.order_no;

        let order_status = constants.order_status.PAYMENT_PENDING;

        await updateOrderPaymentDetails(order_status, orderDetails, payment_category);
        await addCustomerActivityLogs({
            user_id: orderDetails.user_id,
            action: constants.logs_action.processed_payment_via + ' VA ' + bank_code,
            created_by: user_id
        });
        paymetInstructionNotification(orderDetails.order_no, paymentInstructionType);

        return xenditPaymentResponse;
    } catch (error) {
        console.log('Error: ', error);
        let order_status = constants.order_status.PAYMENT_FAILED;
        await updateOrderPaymentDetails(order_status, orderDetails);

        return {
            success: false,
            order_status,
            order_no: orderDetails.order_no
        };
    }

};

const createVADisbursement = async (payload) => {
    try {
        const { user_id, external_id, bank_code, name, account_number, amount, currency = 'IDR'} = payload;

        // let paymentRequestData = {
        //     user_id,
        //     external_id,
        //     bank_code,
        //     name,
        //     account_number,
        //     amount,
        //     created_by: user_id,
        //     currency,
        //     payment_method: constants.payment_method.CARDLESS_PAYMENT
        // };

        // await db.saveData(paymentRequestData, 'PaymentReversalRequest');
        // await db.createTable('PaymentReversalAuthResponse');

        const paymentResponse =  await disbursement.create({
            externalID: payload.external_id,
            bankCode: payload.bank_code,
            accountHolderName: payload.name,
            accountNumber: payload.account_number,
            description: 'Payment for nasi padang',
            amount: payload.amount
        });

        // let paymentResponse = {
        //     id: result.data.id,
        //     user_id: result.data.user_id,
        //     external_id: result.data.external_id,
        //     amount: result.data.amount,
        //     bank_code: result.data.bank_code,
        //     account_holder_name: result.data.account_holder_name,
        //     disbursement_description: result.data.disbursement_description,
        //     status: result.data.status,
        // }

        // await db.saveData(paymentResponse, 'PaymentAuthResponse');

        return paymentResponse;

    } catch (err) {
        throw new Error(err);
    }
};

const cardLessPayment = async(payload) => {
    const { user_id, cardless_credit_type, external_id, amount, payment_type, items, customer_details, shipping_address, currency = 'IDR' } = payload;

    const orderDetails = await db.findOneByCondition({
        payment_req_id: external_id
    }, 'OrderDetail');
    if(!orderDetails) {
        throw new Error('Invalid payment request');
    }

    let userAddress = await db.findOneByCondition({id: orderDetails.address_id}, 'UserAddress');
    if(!userAddress){
        userAddress = await db.findOneByCondition({user_id: orderDetails.user_id, is_primary: true}, 'UserAddress');
    }
    if(userAddress) {
        payload.shipping_address = {
            first_name: userAddress.receiver_name,
            last_name: '-',
            address: userAddress.address,
            city: userAddress.city,
            postal_code: userAddress.zip_code,
            phone: userAddress.phone_number,
            country_code: userAddress.country
        };
    } else {
        let storeAddress =  await db.rawQuery(`select * from eyewear.stores where id=${orderDetails.store_id} and status = 1`, 'SELECT', {});
        storeAddress = storeAddress.length ? storeAddress[0] : {};

        payload.shipping_address = {
            first_name: storeAddress.name,
            last_name: '-',
            address: storeAddress.address,
            city: userAddress.city,
            postal_code: userAddress.zipcode,
            phone: userAddress.phone,
            country_code: userAddress.country
        };
    }

    try {
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        let paymentRequestData = {
            user_id: orderDetails.user_id,
            cardless_credit_type,
            external_id,
            order_no: orderDetails.order_no,
            amount,
            payment_type,
            items,
            customer_details,
            shipping_address,
            expiration_time: expirationDate,
            currency,
            created_by: user_id,
            payment_method: constants.payment_method.CARDLESS_PAYMENT,
            created_at: new Date()
        };
        await db.updateOneByCondition({status: false, updated_at: new Date()}, {
            order_no: orderDetails.order_no
        }, 'PaymentRequest');

        await db.saveData(paymentRequestData, 'PaymentRequest');
        const created_by = payload.user_id;
        delete payload.user_id;

        let options = {
            url: `${config.xendit.baseUrl}/cardless-credit`,
            headers: {
                'Authorization': `Basic ${utils.base64Encryption(`${config.xendit.secretKey}:`)}`
            },
            method: 'POST',
            data: {
                ...payload,
                //'expiration_time': date, //default expiration time 24 hours in kredivo
                'redirect_url': config.xendit.cardless_redirect_url,
                'callback_url': config.xendit.cardless_callback_url
            }
        };
        const result = await utils.axiosClient(options);

        let paymentResponse = {
            id: result.data.order_id,
            redirect_url: result.data.redirect_url,
            external_id: result.data.external_id,
            order_id: result.data.order_id,
            cardless_credit_type: result.data.cardless_credit_type
        };

        await db.saveData(paymentResponse, 'PaymentAuthResponse');
        let order_status = constants.order_status.PAYMENT_PENDING;

        await updateOrderPaymentDetails(order_status, orderDetails);

        result.data.order_no = orderDetails.order_no;
        result.data.order_status = order_status;
        await addCustomerActivityLogs({
            user_id: orderDetails.user_id,
            action: constants.logs_action.processed_payment_via + ' cardless ',
            created_by
        });
        return result.data;
    } catch (error) {
        console.log('Error: ', error);
        let order_status = constants.order_status.PAYMENT_FAILED;
        await updateOrderPaymentDetails(order_status, orderDetails);

        return {
            success: false,
            order_status,
            order_no: orderDetails.order_no
        };
    }

};

const authReversal = async(payload) => {
    try {
        let options = {
            url: `${config.xendit.baseUrl}/credit_card_charges/${payload.charge_id}/auth_reversal`,
            headers: {
                'Authorization': `Basic ${utils.base64Encryption(`${config.xendit.secretKey}:`)}`
            },
            method: 'POST',
            data: {
                'external_id': payload.external_id
            }
        };
        const result = await utils.axiosClient(options);
        return {
            success: true,
            order_status: 'payment_reversal_successfull'
        };
    } catch (error) {
        return {
            success: false,
            order_status: 'payment_reversal_failed'
        };
    }
};

const getChargeStatus = async (chargeID) => {
    return await card.getCharge({ chargeID });
};

const createInvoice = async (payload) => {
    const replacements = {
        order_no: payload.order_no
    };
    let orderDetail =  await db.rawQuery(`select od.id, od.user_id, od.order_no, od.payment_status, od.payment_req_id, od.currency_code, u.name, u.email, u.country_code, u.mobile from order_details od
    left join users u on u.id = od.user_id where od.order_no = :order_no`, 'SELECT', replacements);
    if(orderDetail.length === 0) throw new Error('Invalid order number');
    let orderItems =  await db.rawQuery(`select oi.retail_price, oi.sku, oi.quantity, oi.item_discount_amount, oi.discount_amount from order_items oi
    where oi.order_no = :order_no`, 'SELECT', replacements);
    let orderAddons =  await db.rawQuery(`select oi.retail_price, oi.sku, oi.quantity, oi.item_discount_amount, oi.discount_amount from order_item_addons oi
    where oi.order_no = :order_no`, 'SELECT', replacements);
    const items = orderItems.concat(orderAddons).reduce((accum, row) => {
        accum.discount+=row.item_discount_amount+row.discount_amount;
        accum.list.push({
            name: row.sku,
            quantity: row.quantity,
            price: row.retail_price
        });
        return accum;
    }, {list:[], discount: 0});
    try {        
        let options = {
            url: `${config.xendit.baseUrl}/v2/invoices`,
            headers: {
                'Authorization': `Basic ${utils.base64Encryption(`${config.xendit.secretKey}:`)}`
            },
            method: 'POST',
            data: {
                'external_id': orderDetail[0].payment_req_id,
                'amount': payload.amount,
                'description': `Invoice Order - ${payload.order_no}`,
                'invoice_duration': 86400,
                'customer': {
                    'given_names': orderDetail[0].name,
                    'email': orderDetail[0].email,
                    'mobile_number': orderDetail[0].country_code.includes('+') ? orderDetail[0].country_code+orderDetail[0].mobile : '+'+orderDetail[0].country_code+orderDetail[0].mobile
                },
                'customer_notification_preference': {
                    'invoice_created': [
                    'whatsapp',
                    'email'
                    ],
                    'invoice_reminder': [
                    'whatsapp',
                    'email'
                    ],
                    'invoice_paid': [
                    'whatsapp',
                    'email'
                    ],
                    'invoice_expired': [
                    'whatsapp',
                    'email'
                    ]
                },
                'currency': orderDetail[0].currency_code,
                items: items.items,
                'fees': [
                    {
                    'type': 'Discount',
                    'value': items.discount
                    }
                ]
            }
        };
        const result = await utils.axiosClient(options);
        let paymentRequestData = {
            user_id: orderDetail[0].user_id,
            external_id: orderDetail[0].payment_req_id,
            order_no: orderDetail[0].order_no,
            bank_code: 'xendit-invoice',
            name: orderDetail[0].name,
            amount: payload.amount,
            expiration_time: result.data.expiry_date,
            currency: result.data.currency,
            created_by: payload.created_by,
            payment_method: constants.payment_method.XENDIT_INVOICE,
            created_at: new Date(),
            notes: payload.notes || ''
        };
        // await db.updateOneByCondition({status: false, updated_at: new Date()}, {
        //     order_no: orderDetail[0].order_no
        // }, 'PaymentRequest');

        await db.saveData(paymentRequestData, 'PaymentRequest');

       const xenditPaymentResponse = {
        id: result.data.id,
        name: orderDetail[0].name,
        amount: payload.amount,
        suggested_amount: payload.amount,
        expected_amount: payload.amount,
        authorized_amount: result.data.amount,
        currency: result.data.currency,
        business_id: result.data.id,
        bank_code: 'XENDIT_INVOICE',
        owner_id: result.data.user_id,
        merchant_id: result.data.merchant_name,
        created: new Date(),
        external_id: result.data.external_id,
        expiration_date: new Date(result.data.expiry_date),
        status: result.data.status
       };
        await db.saveData(xenditPaymentResponse, 'PaymentAuthResponse');

        let order_status = constants.order_status.PAYMENT_PENDING;

        await updateOrderPaymentDetails(order_status, orderDetail[0], payload.payment_category, payload.created_by_staff || '', payload.optician || '');
        await addCustomerActivityLogs({
            user_id: orderDetail[0].user_id,
            action: constants.logs_action.processed_payment_via + ' xendit invoice ',
            created_by: payload.created_by
        });
        return result.data;
    } catch (error) {
        console.log('Error: ', error);
        let order_status = constants.order_status.PAYMENT_FAILED;
        await updateOrderPaymentDetails(order_status, orderDetail[0]);

        return {
            success: false,
            order_status,
            order_no: orderDetail[0].order_no
        };
    }
};

module.exports = {
    createCharge,
    captureCharge,
    createRefund,
    createFixedVA,
    createVADisbursement,
    cardLessPayment,
    authReversal,
    getChargeStatus,
    cardPayment,
    createInvoice
};
