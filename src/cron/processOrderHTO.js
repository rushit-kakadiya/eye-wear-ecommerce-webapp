const config = require('config');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const { utils, constants, messages } = require('../core');
const { database: db } = require('../utilities');
const { sendSingleUserNotification } = require('../utilities/notification');
const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

const schedule = '*/5 * * * *';
let cron_code = 'turboly_process_hto_order';

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
      is_hto: true,
      status: 1
    };

    let orderList = await db.rawQuery(orderQuery, 'SELECT', orderReplacements); // 1

    for (order of orderList) {
      let orderItemsQuery = `select oi.order_no, oi.discount_amount, oi.quantity, oi.product_category,
				p.sku, p.retail_price, p.tax_rate
				from order_items oi inner join products p on p.sku = concat('HTO', oi.sku)
				where oi.order_no = :order_no and oi.status = 1`;

      let orderAddressQuery = `select receiver_name, phone_number, email, address from user_address ua where id = '${order.address_id}'`;

      let orderItemReplacements = {
        order_no: order.order_no
      };

      let orderItems = await db.rawQuery(orderItemsQuery, 'SELECT', orderItemReplacements); // 2
      let addressDetails = await db.rawQuery(orderAddressQuery, 'SELECT', {}); // 3

      if (orderItems.length == 0 || addressDetails.length == 0) {
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
          address: addressDetails[0].address
        }
      };

      let saleLines = [];
      let sunwearLenseAddon = {
        sku: 'SAT030401',
        quantity: 1,
        unit_price_ex_tax_before_discount: 0,
        tax_rate: 0,
        unit_discount_amount: 0
      };
      for (orderItem of orderItems) {
        const saleObj = {
          sku: orderItem.sku,
          quantity: orderItem.quantity,
          unit_price_ex_tax_before_discount: orderItem.retail_price,
          tax_rate: orderItem.tax_rate,
          unit_discount_amount: orderItem.discount_amount
        };
        saleLines.push(saleObj);

        if (orderItem.product_category == 2) {
          let lenseAddon = saleLines.find(addon => addon.sku_code == 'SAT030401');
          if (lenseAddon) {
            lenseAddon.quantity += 1;
          } else {
            saleLines.push(sunwearLenseAddon);
          }
        }
      }

      turbolyOrderObj.sale_lines = saleLines;
      turbolyOrderObj.invoice_no = invoice_no;
      // turbolyOrderObj.invoice_no = order_no;
      turbolyOrderObj.notes = notes;
      turbolyOrderObj.payment_lines = [{
        payment_type_name: config.turbolyEcomOrder.paymentTypeName,
        payment_amount: order.payment_amount
      }];

      console.log(turbolyOrderObj);

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

      promiseArray.push(saveResponse);
      promiseArray.push(updateOrder);
      promiseArray.push(saveTurbolyMapping);

      await Promise.all(promiseArray);

      // TODO: message is an Object
      sendSingleUserNotification({
        user_id: order.user_id,
        message: messages.orderCompleted['en'],
        type: constants.notificationType.orderCompleted
      });

    }
    logger.info({ cron_code }, 'Turboly HTO process order completed');
  } catch (error) {
    if (error.response && error.response.data) {
      console.log('----------------', error.response.data.errors);
      logger.error({ cron_code, turboly_response: error.response.data }, error);
    } else {
      logger.error({ cron_code }, error);
    }
  }
}, {
  scheduled: false,
});


module.exports = [task];
