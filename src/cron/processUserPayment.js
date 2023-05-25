const config = require('config');
const cron = require('node-cron');
const { database: db } = require('../utilities');
const bunyanLogger = require('../core/bunyanLogger');
const { constants } = require('../core');
const { user } = require('../utilities/joi-validations');
const logger = bunyanLogger.getInstance();
const schedule = '0 23 * * *';
let cron_code = 'update_user_level';


let task = cron.schedule(schedule, async () => {
  try {
    const { order_status } = constants;
    let orderquery = `select id,user_id, payment_amount from order_details od 
                            where od.order_status in ('${order_status.PAYMENT_CONFIRMED}', '${order_status.ORDER_PENDING}', '${order_status.ORDER_CONFIRMED}', '${order_status.ORDER_READY_FOR_COLLECT}', '${order_status.ORDER_READY_FOR_DELIVERY}', '${order_status.ORDER_IN_TRANSIT}', '${order_status.ORDER_DELIVERED}', '${order_status.ORDER_COMPLETED}')
                            and od.status = 1 and index_order = false and currency_code = 'IDR'`;


    const orders = await db.rawQuery(orderquery, 'SELECT');

    const orderresult = Object.values(orders.reduce((res, obj) => {
      res[obj.user_id] = res[obj.user_id] || { user_id: obj.user_id, total_amount: 0, ids: [] };
      res[obj.user_id].total_amount = (obj.user_id in res ? res[obj.user_id].total_amount : 0) + obj.payment_amount,
        res[obj.user_id].ids.push(obj.id);
      return res;
    }, []));

    orderresult.map(async (obj) => {

      const isUser = await db.findOneByCondition({ user_id: obj.user_id }, 'UserTier', ['id']);
      if (isUser) {
        await db.updateOneByCondition({
          total_purchase: obj.total_amount,
          update_require: true
        }, {
          user_id: obj.user_id
        }, 'UserTier');
      }
      else {
        let referObj = {
          user_id: obj.user_id,
          total_referral: 0,
          total_purchase: obj.total_amount,
          update_require: true
        };
        await db.saveData(referObj, 'UserTier');
      }

      let replacements = {
        idstr: obj.ids
      };

      let update = 'update  order_details set index_order = true where id in (:idstr)';
      await db.rawQuery(update, 'SELECT', replacements);

    });

  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
  timezone: 'Asia/Jakarta'
});


module.exports = [task];
