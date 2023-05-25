const config = require('config');

const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: config.paypal.mode,
  client_id: config.paypal.clientID,
  client_secret: config.paypal.clientSecret
});


const db = require('../utilities/database');
const { messages, constants } = require('../core');

const create = async(payload) => {
    try {

        let orderDetailQuery = `select od.order_no, od.payment_req_id, od.payment_amount, od.order_amount,
            od.currency_code, od.country_code, od.order_discount_amount 
            from order_details od
            where od.user_id = :user_id and od.payment_req_id = :payment_id`;

        let orderItemsQuery = ` select oi.id as order_item_id, oi.quantity, oi.sku,
            oi.currency_code, oi.retail_price, oi.discount_amount, oi.user_credit, oi.status from order_items oi
            inner join order_details od on od.order_no = oi.order_no
            where od.user_id = :user_id and od.payment_req_id = :payment_id and oi.status = 1`;

        let orderItemAddonQuery = `select oia.id as order_addon_item_id, oia.quantity, oia.sku,
            oia.currency_code, oia.retail_price, oia.discount_amount, oia.user_credit, oia.status 
            from order_item_addons oia
            inner join  order_items oi on oi.id = oia.order_item_id
            inner join order_details od on od.order_no = oi.order_no
            where od.user_id = :user_id and od.payment_req_id = :payment_id and oia.status = 1`;

        let orderPromiseArray = [];

        let replacements = {
            user_id: payload.user_id,
            payment_id: payload.payment_id
        };

        orderPromiseArray.push(db.rawQuery(orderDetailQuery, 'SELECT', replacements));
        orderPromiseArray.push(db.rawQuery(orderItemsQuery, 'SELECT', replacements));
        orderPromiseArray.push(db.rawQuery(orderItemAddonQuery, 'SELECT', replacements));

        let orderResults = await Promise.all(orderPromiseArray);

        let orderDetails = orderResults[0];
        let orderItems = orderResults[1];
        let orderItemAddons = orderResults[2];

        let create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: config.paypal.return_url,
                cancel_url: config.paypal.cancel_url
            },
            transactions: [
                {
                    item_list: {
                        items: []
                    },
                    amount: {
                        currency: 'USD',
                        total: 0
                    },
                    description: 'This is the payment description'
                }
            ]
        };

        create_payment_json.transactions[0].amount.currency = orderDetails[0].currency_code;
        create_payment_json.transactions[0].amount.total = orderDetails[0].payment_amount.toFixed(2);

        for(orderItem of orderItems) {
            let item = {
                name: 'item',
                sku: orderItem.sku,
                price: (orderItem.retail_price - orderItem.discount_amount - orderItem.user_credit).toFixed(2),
                currency: orderItem.currency_code,
                quantity: orderItem.quantity.toString()
            };
            create_payment_json.transactions[0].item_list.items.push(item);
        }

        for(orderItemAddon of orderItemAddons) {
            let item = {
                name: 'item',
                sku: orderItemAddon.sku,
                price: (orderItemAddon.retail_price - orderItemAddon.discount_amount - orderItemAddon.user_credit).toFixed(2),
                currency: orderItemAddon.currency_code,
                quantity: orderItemAddon.quantity.toString()
            };
            create_payment_json.transactions[0].item_list.items.push(item);
        }

        let paymentRequestData = {
            user_id: payload.user_id,
            order_no: orderDetails[0].order_no,
            external_id: payload.payment_id,
            amount: orderDetails[0].payment_amount,
            created_by: payload.user_id,
            payment_method: constants.payment_method.PAYPAL,
            customer_details: create_payment_json
        };
        
        let addOnDeleteQuery = 'delete from cart_addon_items cai where cart_id in (select id from cart_items ci where user_id = :user_id)';
        await db.rawQuery(addOnDeleteQuery, 'SELECT', {
            user_id: payload.user_id
        });
        await db.deleteRecord({
            user_id: payload.user_id
        }, 'CartItems');

        await db.saveData(paymentRequestData, 'PaymentRequest');

        return new Promise((resolve, reject) => {  
            paypal.payment.create(create_payment_json, async (error, payment) => {
                if (error) {
                    reject(error);
                } else {
                    let paymentAuthResponse = {
                        id: payment.id,
                        external_id: payload.payment_id,
                        amount: +payment.transactions[0].amount.total,
                        suggested_amount: +payment.transactions[0].amount.total,
                        expected_amount: +payment.transactions[0].amount.total,
                        authorized_amount: +payment.transactions[0].amount.total,
                        currency: payment.transactions[0].amount.currency,
                        created: payment.create_time,
                        paypal_response: payment,
                        status: 'CREATED'
                    };

                    await db.updateOneByCondition({
                        order_status: constants.order_status.PAYMENT_PENDING,
                        updated_at: new Date(),
                        updated_by: payload.user_id,
                        status: 1,
                        payment_status: constants.order_status.PAYMENT_PENDING
                    }, {
                        payment_req_id: payload.payment_id
                    }, 'OrderDetail');

                    await db.saveData(paymentAuthResponse, 'PaymentAuthResponse');
                    resolve(payment);
                }
            });
        });
    } catch (error) {
        return error.message;
    }
};

const success = async(payload) => {
    try {

        let PayerID = payload.PayerID;
        let paymentId = payload.paymentId;
        let execute_payment_json = {
            payer_id: PayerID,
            transactions: [
                {
                    amount: {
                        currency: 'USD',
                        total: '1.00'
                    }
                }
            ]
        };

        return new Promise((resolve, reject) => {  
            paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
                if (error) {
                    reject(error);
                } else {

                    let paymentAuthResponse = await db.findOneByCondition(
                        { 
                            id: payload.paymentId
                        },
                        'PaymentAuthResponse', 
                        ['id', 'external_id']
                    );

                    paymentAuthResponse = paymentAuthResponse.toJSON();

                    let paymentResponse = {
                        id: payment.id,
                        paypal_token: payment.token,
                        payer_id: payment.PayerID,
                        external_id: paymentAuthResponse.payment_id,
                        amount: +payment.transactions[0].amount.total,
                        suggested_amount: +payment.transactions[0].amount.total,
                        expected_amount: +payment.transactions[0].amount.total,
                        authorized_amount: +payment.transactions[0].amount.total,
                        currency: payment.transactions[0].amount.currency,
                        paypal_response: payment,
                        created: payment.create_time,
                        updated: payment.update_time,
                        status: 'APPROVED'
                    };


                    await db.updateOneByCondition({
                        order_status: constants.order_status.PAYMENT_CONFIRMED,
                        updated_at: new Date(),
                        payment_status: constants.order_status.PAYMENT_CONFIRMED,
                        payment_category: 3
                    }, {
                        payment_req_id: paymentAuthResponse.external_id,
                    }, 'OrderDetail');

                    await db.saveData(paymentResponse, 'PaymentResponse');
                    resolve(payment);
                }
            });
        });
    } catch (error) {
        return error.message;
    }
};

const cancel = async(payload) => {
    try {
        console.log('--- cancel payment payload: ', payload);
        return payload;
    } catch (error) {
        return error.message;
    }
};

const cancelPayment = async(payload) => {
    try {
        let order_query = 'select * from order_details where payment_req_id = :payment_id and user_id = :user_id and status = 1';
        let replacements = {
            payment_id: payload.payment_id,
            user_id: payload.user_id
        };

        let orderDetails = await db.rawQuery(order_query, 'SELECT', replacements);

        if(orderDetails.length === 0) {
            throw new Error('Invalid cancel request');
        }

        if(orderDetails[0].order_status !== constants.order_status.PAYMENT_PENDING) {
            throw new Error('Invalid request');
        }

        const orderUpdateObj = db.updateOneByCondition({
            order_status: constants.order_status.PAYMENT_FAILED,
            updated_at: new Date(),
            updated_by: payload.user_id,
            status: 1,
            payment_status: constants.order_status.PAYMENT_FAILED
        }, {
            payment_req_id: payload.payment_id
        }, 'OrderDetail'); // 4
        const orderHistoryObj = db.saveData({
            order_no: orderDetails[0].order_no,
            status: constants.order_status.PAYMENT_FAILED,
            source: 'paypal'
        }, 'OrdersHistory');
        await Promise.all([orderUpdateObj, orderHistoryObj]);

        return 'OK';
    } catch (error) {
        return error.message;
    }
};

module.exports = {
    create,
    success,
    cancel,
    cancelPayment
};