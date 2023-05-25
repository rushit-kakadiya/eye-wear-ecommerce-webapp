const config = require('config');
const cron = require('node-cron');
const { database: db } = require('../utilities');
const bunyanLogger = require('../core/bunyanLogger');
const { user } = require('../utilities/joi-validations');
const logger = bunyanLogger.getInstance();
const schedule = '0 0 * * *';
let cron_code = 'update_user_level';



let task = cron.schedule(schedule, async () => {
  try {

    let levelsquery = `select id, total_referral, total_purchase
                            from user_tier
                            where update_require = true`;
    const processlevel = await db.rawQuery(levelsquery, 'SELECT');

    processlevel.map(
      async (obj) => {
        let level = '';

        if ((obj.total_referral < 2) || (obj.total_purchase < 5000000)) {
          level = 1;
        }

        if ((obj.total_referral >= 2 && obj.total_purchase < 6) || (obj.total_purchase >= 5000000 && obj.total_purchase < 10000000)) {
          level = 2;
        }

        if ((obj.total_referral >= 6) || (obj.total_purchase >= 10000000)) {
          level = 3;
        }

        await db.updateOneByCondition({
          tier: level,
          update_require: false,
          last_updated: new Date()
        }, {
          id: obj.id,
        }, 'UserTier');

      }
    );

  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
  timezone: 'Asia/Jakarta'
});


module.exports = [task];
