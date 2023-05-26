const config = require('config');
const _ = require('lodash');
const db = require('../utilities/database');
const { constant } = require('../core');
const { purchaseNotification, referralCreditNotification } = require('../utilities/notification');
const { creditEyewearPoints } = require('./user');
const { addCustomerActivityLogs } = require('./admin/logs');

let updateOrderPaymentDetails = async (order_status, order_details, external_id) => {
    let transaction = await db.dbTransaction();
    try {
        let promiseArr = [];
        let userQueryResult = [];
        let orderQueryResult = [];
        let user_id = order_details.user_id;
        let current_date = new Date();

        if(order_status === constant.order_status.PAYMENT_CONFIRMED){
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

                let credit_amount = constant.referralDetails.referralAmount;
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
            promiseArr.push(addCustomerActivityLogs({
                user_id,
                action: constants.logs_action.payment_confirmed,
                created_by: user_id
            }));
        }

        const orderUpdate = db.updateOneByCondition({
            order_status: order_status,
            updated_at: current_date,
            updated_by: user_id,
            status: 1,
            payment_status: order_status === constant.order_status.PAYMENT_CONFIRMED &&  order_details.payment_category !== 3 ? order_details.payment_category === 1 ? constant.payment_status.PARTIAL_PAID : constant.payment_status.REMAINING_PAID : order_status
        }, {
            id: order_details.id
        }, 'OrderDetail', transaction);

        let orderHistoryObj = {
            order_no: order_details.order_no,
            status: order_status === constant.order_status.PAYMENT_CONFIRMED &&  order_details.payment_category !== 3 ? order_details.payment_category === 1 ? constant.payment_status.PARTIAL_PAID : constant.payment_status.REMAINING_PAID : order_status,
            source: 'xendit',
            created_at: new Date(),
            updated_by: user_id
        };
        const orderHistorySave = db.saveData(orderHistoryObj, 'OrdersHistory', transaction);

        promiseArr.push(orderUpdate);
        promiseArr.push(orderHistorySave);

        await Promise.all(promiseArr);

        await transaction.commit();

        
        if(order_status === constant.order_status.PAYMENT_CONFIRMED){
            await creditEyewearPoints(order_details);
            // await db.updateOneByCondition({status: true, updated_at: new Date()}, {
            //     external_id
            // }, 'PaymentRequest'); 
            purchaseNotification(order_details.order_no);
        }


        if (userQueryResult.length == 1 && orderQueryResult.length == 0) {
            referralCreditNotification(order_details.id);
        }
        

        return {
            success: true,
            message: 'Update success'
        };
    } catch(error) {
        await transaction.rollback();
        console.log('Error: ', error);
        return {
            success: false,
            message: 'Update success'
        };
    }
};

/*********** Virtual Account Callback Hook *************/
const xendit = async (payload) => {
    // console.log('virtual account =>>>>>>>>>>>>>>>>>>>', payload);
    const orderDetails = await db.findOneByCondition({
        payment_req_id: payload.external_id
    }, 'OrderDetail');

    if(!orderDetails) {
        throw new Error('Invalid payment request');
    }

    payload.status = constant.payment_status.CAPTURED;
    await db.saveData(payload, 'PaymentResponse');
    await db.updateOneByCondition({
        status: payload.status
    }, {
        external_id: payload.external_id
    }, 'PaymentAuthResponse');

    let order_status = constant.order_status.PAYMENT_CONFIRMED;

    await updateOrderPaymentDetails(order_status, orderDetails, payload.external_id);

    return {
        message: 'Payment captured successfully.'
    };

};

/*********** Cardless Payment Callback Hook *************/
const xenditCardLess = async (payload) => {
    // console.log('xenditCardLess =>>>>>>>>>>>>>>>>>>>', payload);

    const orderDetails = await db.findOneByCondition({
        payment_req_id: payload.external_id
    }, 'OrderDetail');

    if(!orderDetails) {
        throw new Error('Invalid payment request');
    }

    let order_status = constant.order_status.PAYMENT_PENDING;
    payload.id = payload.transaction_id;

    if(payload.transaction_status == 'settlement') {
        order_status = constant.order_status.PAYMENT_CONFIRMED;
        payload.status = constant.payment_status.CAPTURED;
    } else if(payload.transaction_status == 'pending') {
        // TODO: partial payment pending check
        order_status = constant.order_status.PAYMENT_PENDING;
        payload.status = constant.payment_status.FAILED;
    } else if(payload.transaction_status == 'deny') {
        order_status = constant.order_status.PAYMENT_FAILED;
        payload.status = constant.payment_status.FAILED;
    } else if(payload.transaction_status == 'cancel') {
        order_status = constant.order_status.PAYMENT_FAILED;
        payload.status = constant.payment_status.FAILED;
    } else if(payload.transaction_status == 'expire') {
        order_status = constant.order_status.PAYMENT_FAILED;
        payload.status = constant.payment_status.FAILED;
    }

    await db.saveData(payload, 'PaymentResponse');
    await db.updateOneByCondition({
        status: payload.status
    }, {
        external_id: payload.external_id
    }, 'PaymentAuthResponse');
    await updateOrderPaymentDetails(order_status, orderDetails, payload.external_id);

    return {
        message: 'Payment captured successfully.'
    };
};

const xenditVADisbursement = async (payload) => {
    console.log('payload', payload);
    // {
    //     "id": "57e214ba82b034c325e84d6e",
    //     "user_id": "57c5aa7a36e3b6a709b6e148",
    //     "external_id": "disbursement_123124123",
    //     "amount": 150000,
    //     "bank_code": "BCA",
    //     "account_holder_name": "LUCKY BUSINESS",
    //     "transaction_id": "57ec8b7e906aa2606ecf8ffc",
    //     "transaction_sequence": "1799",
    //     "disbursement_id": "57ec8b8130d2d0243f438e11",
    //     "disbursement_description": "Test disbursement",
    //     "failure_code": "INVALID_DESTINATION",
    //     "is_instant": false,
    //     "status": "FAILED",
    //     "updated": "2016-10-10T08:15:03.404Z",
    //     "created": "2016-10-10T08:15:03.404Z"
    // }
};

const ninjaExpress = async (payload) => {
    // console.log('ninjaExpress payload => ', payload);
    if(payload && payload['previous_status']) {
        await db.updateOneByCondition({
            is_updated: true,
            updated_at: new Date()
        }, {
            id: payload.id,
            status: payload['previous_status']
        }, 'NinjaExpress');
    }
    let promiseArr = [];
    promiseArr.push(db.saveData({order_no: payload.shipper_order_ref_no, status: payload.status, created_at: new Date()}, 'OrdersHistory'));
    promiseArr.push(db.saveData(payload, 'NinjaExpress'));
    return await Promise.all(promiseArr);
};

const turbolyProductUpdate = async (payload) => {
    // console.log('turbolyProductUpdate payload', payload);
    // return await db.saveMany(payload, 'Products');
};

const turbolyOrderUpdate = async (payload) => {
    //console.log('turbolyOrderUpdate payload', payload);
    // let updateOrder =  db.updateOneByCondition({
    //     order_status: constant.order_status.ORDER_CONFIRMED,
    //     updated_at: new Date()
    // }, {
    //     payment_req_id: payload.payment_req_id
    // }, 'OrderDetail');
};

const xenditInvoice = async (payload) => {
    console.log('xenditInvoice=payload', payload);
    // {
    //     "id": "579c8d61f23fa4ca35e52da4",
    //     "external_id": "invoice_123124123",
    //     "user_id": "5781d19b2e2385880609791c",
    //     "is_high": true,
    //     "payment_method": "BANK_TRANSFER",
    //     "status": "PAID",
    //     "merchant_name": "Xendit",
    //     "amount": 50000,
    //     "paid_amount": 50000,
    //     "bank_code": "PERMATA",
    //     "paid_at": "2016-10-12T08:15:03.404Z",
    //     "payer_email": "wildan@xendit.co",
    //     "description": "This is a description",
    //     "adjusted_received_amount": 47500,
    //     "fees_paid_amount": 0,
    //     "updated": "2016-10-10T08:15:03.404Z",
    //     "created": "2016-10-10T08:15:03.404Z",
    //     "currency": "IDR",
    //     "payment_channel": "PERMATA",
    //     "payment_destination": "888888888888"
    // }
    const orderDetails = await db.findOneByCondition({
        payment_req_id: payload.external_id
    }, 'OrderDetail');

    if(!orderDetails) {
        throw new Error('Invalid payment request');
    }
    await db.updateOneByCondition({
        payment_type: payload.payment_method,
        status: payload.status === 'PAID' ? constant.payment_status.CAPTURED : constant.payment_status.FAILED
    }, {
        external_id: payload.external_id
    }, 'PaymentAuthResponse');

    await db.saveData(payload, 'PaymentResponse');

    let order_status = payload.status === 'PAID' ? constant.order_status.PAYMENT_CONFIRMED : constant.order_status.PAYMENT_FAILED;

    await updateOrderPaymentDetails(order_status, orderDetails, payload.external_id);
    return {
        message: 'Payment captured successfully.'
    };
};

module.exports = {
    xendit,
    xenditCardLess,
    xenditVADisbursement,
    ninjaExpress,
    turbolyProductUpdate,
    turbolyOrderUpdate,
    xenditInvoice
};
