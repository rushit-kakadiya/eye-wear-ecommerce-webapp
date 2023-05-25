const config = require('config');
const cron = require('node-cron');
const { utils, constants } = require('../core');
const { database: db } = require('../utilities');
const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();
const schedule = '0 1 * * *';
let cron_code = 'cancel_payment';

let task = cron.schedule(schedule, async () => {
  try {
    let query = `select od.id, od.order_status 
                 from order_details od 
                 where od.created_at <= NOW() - '1 day'::INTERVAL  
                 and od.order_status = 'payment_pending' 
                 order by od.created_at desc`;
    let orders = await db.rawQuery(query, 'SELECT');


    if (orders.length > 0) {
      let orderData = [];
      orders.map((item) => {
        orderData.push(item.id);
      });

      let updateReplacements = {
        orders: orderData,
        status: constants.order_status.PAYMENT_FAILED,
      };
      let updatePaymentStatusQuery = 'UPDATE order_details SET order_status = :status where id IN ( :orders )';
      await db.rawQuery(updatePaymentStatusQuery, 'SELECT', updateReplacements);
    }
  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
  timezone: 'Asia/Jakarta'
});


module.exports = [task];
