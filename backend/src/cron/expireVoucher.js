const config = require('config');
const cron = require('node-cron');
const { database: db } = require('../utilities');
const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();
const schedule = '0 9,12,15,18 * * *';
let cron_code = 'expire_voucher_code';



let task = cron.schedule(schedule, async () => {
  try {
    let query = 'update voucher_details set is_expired = true where expire_at < NOW()';
    await db.rawQuery(query, 'SELECT');

  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
  timezone: 'Asia/Jakarta'
});


module.exports = [task];
