const _ = require('lodash');
const moment = require('moment-timezone');
const cron = require('node-cron');
const { utils, constants } = require('../core');
const { database: db } = require('../utilities');

const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

// const schedule =  '0 */1 * * * *';
const schedule = '0 4 * * *';

let cron_code = 'birthday_voucher';

const convertToUTCDate = (localdate, userTimeZone, day_end) => {
  let date = moment.tz(localdate.toISOString().substring(0, 10), userTimeZone);

  if (day_end) {
    date.endOf('day');
  } else {
    date.startOf('day');
  }

  return date.utc().format();
};

let task = cron.schedule(schedule, async () => {
  try {
    logger.info({ cron_code }, 'User birthday voucher cron started');

    let query = `select u.id, u.name, u.dob, vd.voucher_image_key from users u
            left join voucher_details vd on vd.user_id = u.id and vd.voucher_tag = 'birthday'
            where vd.id is null and u.dob is not null
            and EXTRACT(month from dob) in (EXTRACT(month from current_date), EXTRACT(month from current_date) + 1);`;

    let userTimeZone = 'asia/jakarta';
    let dbUsers = await db.rawQuery(query, 'SELECT', {});
    let pagedUsers = _.chunk(dbUsers, 500);

    for (let users of pagedUsers) {
      let vouchers = [];
      for (let user of users) {
        const current_date = new Date();
        const dob = new Date(user.dob);

        let birthday_day = dob.getDate();
        let birthday_month = dob.getMonth();
        let current_year = current_date.getFullYear();

        // TODO: first name and last name length check
        let name = user.name;
        name = name.replace(/\s\s+/g, ' ');
        let nameArr = name.split(' ');
        if (nameArr.length < 2) {
          continue;
        }

        let first_name = nameArr[0];
        let last_name = nameArr[1];

        let voucher_code =
          `${first_name.substring(0, 2).toUpperCase()}${last_name.substring(0, 2).toUpperCase()}HBD${utils.generateRandom(4, false)}`;

        let created_by = user.id;

        let start_at = new Date(Date.UTC(current_year, birthday_month, birthday_day - 7));
        let voucher_expiry_date = new Date(Date.UTC(current_year, birthday_month, birthday_day + 7));

        let voucherObj = {
          voucher_code: voucher_code,
          voucher_type: constants.voucherType.percentage,
          voucher_category: constants.voucherCategory.USER,
          voucher_tag: constants.voucherTag.BIRTHDAY,
          voucher_percentage: 25,
          voucher_amount: 0,
          voucher_max_amount: 500000,
          minimum_cart_amount: 1000000,
          voucher_title: 'ENJOY YOUR BIRTHDAY GIFT',
          sub_title: '25% OFF and Free Beverage',
          term_conditions: 'Voucher can\'t be combined with other discount/voucher,Can\'t apply for special edition frames,Maximum discount Rp 500.000',
          voucher_image_key: 'assets/vouchers/birthday-voucher.png',
          is_single_user: true,
          user_id: user.id,
          first_order: false,
          date_constraint: true,
          hide: false,
          start_at: convertToUTCDate(start_at, userTimeZone, false),
          expire_at: convertToUTCDate(voucher_expiry_date, userTimeZone, true),
          max_cart_size: 10,
          created_at: current_date,
          created_by: created_by,
          updated_at: current_date,
          updated_by: created_by
        };
        vouchers.push(voucherObj);
      }
      await db.saveMany(vouchers, 'VoucherDetails');
    }

    logger.info({ cron_code }, 'User birthday voucher cron completed');
  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
});


module.exports = [task];
