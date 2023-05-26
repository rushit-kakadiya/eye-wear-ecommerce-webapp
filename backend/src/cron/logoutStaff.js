const cron = require('node-cron');
const { database: db } = require('../utilities');
const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();
const schedule = '0 0 * * *';
let cron_code = 'logout_staff';

let task = cron.schedule(schedule, async () => {
  try {

    let query = 'delete from user_devices ud using users u where u.id = ud.user_id and u."role" = 1';

    await db.rawQuery(query, 'SELECT');

  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
  timezone: 'Asia/Jakarta'
});


module.exports = [task];
