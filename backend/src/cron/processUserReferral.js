const config = require('config');
const cron = require('node-cron');
const { database: db } = require('../utilities');
const bunyanLogger = require('../core/bunyanLogger');
const { user } = require('../utilities/joi-validations');
const logger = bunyanLogger.getInstance();
const schedule = '0 22 * * *';
let cron_code = 'update_user_level';



let task = cron.schedule(schedule, async () => {
  try {


    let referquery = `select u.id, u.registration_referral_code , ur.user_id, u.registration_referral_code 
                            from users u left join user_referral ur on ur.referral_code = u.registration_referral_code 
                            where ( u.registration_referral_code  != '' and u.registration_referral_code is not null ) and index_referral = false`;

    const refrer = await db.rawQuery(referquery, 'SELECT');

    const refrerresult = Object.values(refrer.reduce((res, obj) => {
      res[obj.user_id] = res[obj.user_id] || { code: obj.registration_referral_code, user_id: obj.user_id, referral: 0, ids: [] };
      res[obj.user_id].referral = res[obj.user_id].referral + 1,
        res[obj.user_id].ids.push(obj.id.toString());
      return res;
    }, []));



    refrerresult.map(async (obj) => {

      const isUser = await db.findOneByCondition({ user_id: obj.user_id }, 'UserTier', ['id']);
      if (isUser) {
        await db.updateOneByCondition({
          total_referral: obj.referral,
          update_require: true
        }, {
          user_id: obj.user_id
        }, 'UserTier');
      }
      else {
        let referObj = {
          user_id: obj.user_id,
          total_referral: obj.referral,
          total_purchase: 0,
          update_require: true
        };
        await db.saveData(referObj, 'UserTier');
      }

      let replacements = {
        idstr: obj.ids
      };

      let update = 'update  users set index_referral = true where id in (:idstr)';
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
