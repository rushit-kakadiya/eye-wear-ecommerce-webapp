const config = require('config');
const cron = require('node-cron');
const { util, constants, sendFCM } = require('../core');
const { database: db } = require('../utilities');
const { appTitle } = config.get('fcm');
const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();
const schedule = '0 9 * * *';
let cron_code = 'send_birthday_voucher_notification';
//const schedule =  '0 */1 * * * *';


let task = cron.schedule(schedule, async () => {
  try {

    let query = `select ud.device_token as dt, u.id as userid, u.name, u.dob, vd.voucher_percentage 
                 from users u
                 inner join voucher_details vd 
                     on vd.user_id = u.id and vd.voucher_tag = 'birthday'
                 inner join user_devices ud
                     on u.id = ud.user_id
                 where
                     vd.is_expired = false and 
                 EXTRACT(month from u.dob) = EXTRACT(month from current_date) and
                 EXTRACT(day from u.dob) = EXTRACT(day from current_date)
                 order by u.id;`;

    let orders = await db.rawQuery(query, 'SELECT');
    let type = constants.notificationType.birthdayVoucherNotification;
    let title = 'HEY IT’S YOUR DAY! \ud83c\udf81';
    let group = [];


    if (orders.length > 0) {

      orders.forEach(({ userid, name, dt, voucher_percentage }) => {
        let body = `Happy birthday to you, ${name}!\nRaise your glasses and treat yourself. Enjoy ${voucher_percentage}% OFF only for you!`;
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
