const config = require('config');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const { utils, constants, messages } = require('../core');
const { database: db } = require('../utilities');
const { sendSingleUserNotification } = require('../utilities/notification');

const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

const schedule = '*/5 * * * *';
let cron_code = 'turboly_process_order';

let task = cron.schedule(schedule, async () => {
  try {
    let orderQuery = `select order_no, user_id, store_id, register_id, address_id, payment_req_id, 
			payment_amount, order_amount, order_discount_amount, notes, fulfillment_type,
			us.name, us.mobile, us.email
			from order_details od
			inner join users us on us.id = od.user_id
			where od.order_status = :order_status and od.is_hto = :is_hto and od.status = :status
			order by od.created_at limit 10`;

    let orderReplacements = {
      order_status: constants.order_status.PAYMENT_CONFIRMED,
      is_hto: false,
      status: 1
    };

    let orderList = await db.rawQuery(orderQuery, 'SELECT', orderReplacements); // 1

    for (order of orderList) {
      let orderItemsQuery = `select oi.order_no, oi.discount_amount, oi.quantity,
				oi.retail_price, p.sku, p.tax_rate
				from order_items oi inner join products p on p.sku =oi.sku
				where oi.order_no = :order_no and oi.status = 1`;
      let orderItemAddOnQuery = `select oia.quantity, p.sku, oia.retail_price, oia.discount_amount, p.tax_rate 
				from order_item_addons oia inner join products p on p.sku =oia.sku
				where oia.order_no = :order_no and oia.status = 1;`;

      let orderItemReplacements = {
        order_no: order.order_no
      };

      let orderItems = await db.rawQuery(orderItemsQuery, 'SELECT', orderItemReplacements); // 2
      let orderItemAddOns = await db.rawQuery(orderItemAddOnQuery, 'SELECT', orderItemReplacements); // 3

      if (orderItems.length == 0 || orderItemAddOns.length == 0) {
        throw new Error('db_failure');
      }

      let order_no = order.order_no;
      let invoice_no = `${order_no}/${utils.generateRandom(4, true).toUpperCase()}`;
      let notes = order.notes;

      let turbolyOrderObj = {
        register_id: parseInt(order.register_id),
        store_id: parseInt(order.store_id),
        fulfillment_type: order.fulfillment_type,
        customer: {
          name: order.name,
          email: order.email,
          phone: order.mobile,
          address: 'NA'
        }
      };

      if (order.fulfillment_type == 1) {
        let orderAddressQuery = `select receiver_name, phone_number, email, address from user_address ua where id = '${order.address_id}'`;
        let addressDetails = await db.rawQuery(orderAddressQuery, 'SELECT', {});
        if (addressDetails.length != 0) {
          turbolyOrderObj.customer.address = addressDetails[0].address || 'NA';
        }
      }

      let saleLines = [];
      for (orderItem of orderItems) {
        const saleObj = {
          sku: orderItem.sku,
          quantity: orderItem.quantity,
          unit_price_ex_tax_before_discount: orderItem.retail_price,
          tax_rate: orderItem.tax_rate,
          unit_discount_amount: orderItem.discount_amount
        };
        saleLines.push(saleObj);
      }

      for (orderItemAddOn of orderItemAddOns) {
        const saleObj = {
          sku: orderItemAddOn.sku,
          quantity: orderItemAddOn.quantity,
          unit_price_ex_tax_before_discount: orderItemAddOn.retail_price,
          tax_rate: orderItemAddOn.tax_rate,
          unit_discount_amount: orderItemAddOn.discount_amount
        };
        saleLines.push(saleObj);
      }

      turbolyOrderObj.sale_lines = saleLines;
      turbolyOrderObj.invoice_no = invoice_no;
      // turbolyOrderObj.invoice_no = order_no;
      turbolyOrderObj.notes = notes;
      turbolyOrderObj.payment_lines = [{
        payment_type_name: config.turbolyEcomOrder.paymentTypeName,
        payment_amount: order.payment_amount
      }];

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

      let promiseArray = [];
      let saveResponse = db.saveData(result.data.sale, 'TurbolySaleDetails');
      let updateOrder = db.updateOneByCondition({
        order_status: constants.order_status.ORDER_CONFIRMED,
        updated_at: new Date(),
        updated_by: order.user_id
      }, {
        payment_req_id: order.payment_req_id
      }, 'OrderDetail');

      promiseArray.push(db.saveData({ order_no, status: constants.order_status.ORDER_CONFIRMED, source: 'turboly' }, 'OrdersHistory'));

      let orderMappingJSON = {
        order_no: order_no,
        turboly_invoice_id: invoice_no,
        created_by: order.user_id,
      };

      let saveTurbolyMapping = db.saveData(orderMappingJSON, 'TurbolyOrderMapping');

      // let orderItemUpdateQuery = `update product_stocks set 
      // 	quantity = product_stocks.quantity - oi.quantity
      // 	from order_details od (nolock)
      // 	inner join order_items oi (nolock) on od.order_no = oi.order_no
      // 	where od.payment_req_id = :payment_req_id and product_stocks.sku = oi.sku`;

      // let orderItemAddOnUpdateQuery = `update product_stocks set 
      // 	quantity = product_stocks.quantity - oi.quantity
      // 	from order_details od (nolock)
      // 	inner join order_item_addons oi (nolock) on od.order_no = oi.order_no
      // 	where od.payment_req_id = :payment_req_id and product_stocks.sku = oi.sku`;

      promiseArray.push(saveResponse);
      promiseArray.push(updateOrder);
      promiseArray.push(saveTurbolyMapping);
      // promiseArray.push(db.rawQuery(orderItemUpdateQuery, 'SELECT', replacementes));
      // promiseArray.push(db.rawQuery(orderItemAddOnUpdateQuery, 'SELECT', replacementes));

      await Promise.all(promiseArray);

      // TODO: message is an Object
      sendSingleUserNotification({
        user_id: order.user_id,
        message: messages.orderCompleted['en'],
        type: constants.notificationType.orderCompleted
      });

    }
    logger.info({ cron_code }, 'Turboly products stock completed');
  } catch (error) {
    if (error.response && error.response.data) {
      logger.error({ cron_code, turboly_response: error.response.data }, error);
    } else {
      logger.error({ cron_code }, error);
    }
  }
}, {
  scheduled: false,
});


module.exports = [task];
