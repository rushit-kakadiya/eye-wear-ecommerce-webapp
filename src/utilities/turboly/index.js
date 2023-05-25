
/*
 * @file: index.js
 * @description: It Contain function layer for turboly methods.
*/

const config = require('config');
const _ = require('lodash');
const db = require('../database');
const { utils, constants, messages } = require('../../core');
const {sendSingleUserNotification} = require('../notification');

const productStockDetails = async (sku_code, store_id) => {
    let options = {
        url: config.turboly.baseUrl + 'stocks',
        headers: {
            'X-AUTH-EMAIL': config.turboly.authEmail,
            'X-AUTH-TOKEN': config.turboly.authToken
        },
        method: 'GET',
        params: {
            sku: sku_code,
            store_id: store_id
        },
        data: {},
    };
    return utils.axiosClient(options);
};

const storeRegisters = async () => {
    let options = {
        url: config.turboly.baseUrl + 'registers',
        headers: {
            'X-AUTH-EMAIL': config.turboly.authEmail,
            'X-AUTH-TOKEN': config.turboly.authToken
        },
        method: 'GET',
        params: {},
        data: {},
    };
    return utils.axiosClient(options);
};

const processOrder = async (paymentReqID, user = {}) => {
    let order_no = '';
    try {
        let query = `select  oi.order_no, oi.sku, oi.retail_price, oi.discount_amount, oi.tax_rate, oi.quantity, 
            od.payment_amount, od.order_no, od.user_id, ua.* from order_details od 
            inner join order_items oi on od.order_no = oi.order_no
            inner join user_address ua on ua.user_id = od.user_id where od.payment_req_id = :payment_req_id and oi.status = 1`;
        let replacementes = {
            payment_req_id: paymentReqID
        };

        let orderItems = await db.rawQuery(query, 'SELECT', replacementes); // 1

        if(orderItems.length == 0) {
            throw new Error('db_failure');
        } else {
            order_no = orderItems[0].order_no;
            let turbolyOrderObj = {
                register_id: config.turbolyEcomOrder.registerID,
                store_id: config.turbolyEcomOrder.storeID,
                fulfillment_type: config.turbolyEcomOrder.fulfillmentType,
                customer: {
                    email: orderItems[0].email_id,
                    name: orderItems[0].receiver_name,
                    phone: orderItems[0].phone_number,
                    address: 'ADDRESS' // TODO: add address
                }
            };
            let saleLines = [];
            orderItems.forEach((orderItem) => {
                let saleObj = {
                    sku: orderItem.sku,
                    quantity: orderItem.quantity,
                    unit_price_ex_tax_before_discount: orderItem.retail_price,
                    tax_rate: orderItem.tax_rate,
                    unit_discount_amount: orderItem.discount_amount
                };
                
                saleLines.push(saleObj);
            });
            turbolyOrderObj.sale_lines = saleLines;
            turbolyOrderObj.invoice_no = orderItems[0].order_no;
            turbolyOrderObj.notes = orderItems[0].notes;
            turbolyOrderObj.payment_lines = [{
                payment_type_name: config.turbolyEcomOrder.paymentTypeName,
                payment_amount: orderItems[0].payment_amount
            }];

            let url = `${config.turboly.baseUrl}/v1/sales`;
            let options = {
                url: config.turboly.baseUrl + 'sales',
                headers: {
                    'X-AUTH-EMAIL': config.turboly.authEmail,
                    'X-AUTH-TOKEN': config.turboly.authToken
                },
                method: 'POST',
                params: {},
                data: {
                    sale: turbolyOrderObj
                },
            };

            const result = await utils.axiosClient(options);

            // await db.createTable('TurbolySaleDetails');
            await db.saveData(result.data.sale, 'TurbolySaleDetails'); // 2

            sendSingleUserNotification({
                user_id: orderItems[0].user_id, 
                message: messages.orderCompleted,
                type: constants.notificationType.orderCompleted
            });

            return {
                success: true,
                'order_status': 'turboly_confirmed',
                'order_no':  orderItems[0].order_no,
                'turboly_ref_code':  result.data.sale.ref_code
            };
        }
    } catch (error) {
        console.log('Turboly outer catch error: ', error.message);
        let response = {
            success: false,
            order_no
        };
        if (error.response) {
            if (error.response.status == 400) {
                try {
                    let errorObj = {};
                    errorObj.order_no = error.response.data.sale.ecommerce_ref_code;
                    errorObj.turboly_ref_code = error.response.data.sale.ref_code;
                    errorObj.workflow_state = error.response.data.sale.workflow_state;
                    errorObj.sale = error.response.data.sale;
                    errorObj.errors = error.response.data.errors;

                    response.order_no = errorObj.order_no;
                    response.turboly_ref_code = errorObj.turboly_ref_code;
                    response.order_status = 'turboly_draft';
                    response.message = error.response.data.errors[0].message;

                    // await db.createTable('TurbolyDraftData');
                    await db.saveData(errorObj, 'TurbolyDraftData'); // 2
                } catch (error) {
                    response.order_status = 'turboly_draft_save_error';
                    return response;
                } 
            } else {
                response.order_status = 'turboly_failed';
                response.message = error.response.data.errors[0].message;
            }
            return response;
        } else {
            response.order_status = 'turboly_failed';
            response.message = error.message;
        }
        return response;
    }   
};

module.exports = {
    productStockDetails,
    processOrder,
    storeRegisters
};
