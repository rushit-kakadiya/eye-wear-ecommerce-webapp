const config = require('config');
const cron = require('node-cron');
const { util, constants, sendFCM } = require('../core');
const { database: db } = require('../utilities');
const { appTitle } = config.get('fcm');
const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();
const schedule = '0 9,12,15,18 * * *';
let cron_code = 'send_pending_payment';



let task = cron.schedule(schedule, async () => {
  try {

    let query = `select  distinct ud.device_token as dt, u.id as userid , od.order_status, u.email, u.name, ud.device_token, od.created_at
                from order_details od
                left join users u on u.id = od.user_id
                right join user_devices ud on u.id = ud.user_id
                where order_status = 'payment_pending'
                and od.created_at >= NOW() - '1 day'::INTERVAL
                order by od.created_at desc limit 10`;


    let orders = await db.rawQuery(query, 'SELECT');
    let type = constants.notificationType.paymentPending;
    let title = 'Tick tock! Time is running out \u23F1';
    let group = [];


    if (orders.length > 0) {
      orders.forEach(({ userid, name, dt }) => {
        let body = `Hi ${name}! Your order still waiting for you. Click here to complete your purchase. \u{1F64C}`;
        group[userid] = group[userid] || { userid, title: title, body: body, token: [] };
        group[userid].token.push(dt);
      });


      for (var key in group) {
        if (group.hasOwnProperty(key)) {
          sendFCM(group[key].token, group[key].title, { en: group[key].body }, {
            messageFrom: appTitle,
            type: type
          });
        }
      }
    }

  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
  timezone: 'Asia/Jakarta'
});


module.exports = [task];
