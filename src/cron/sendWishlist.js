const config = require('config');
const cron = require('node-cron');
const { utils } = require('../core');
const { database: db } = require('../utilities');
const bunyanLogger = require('../core/bunyanLogger');
const { wishlistNotification } = require('../utilities/notification');
const logger = bunyanLogger.getInstance();
const schedule = '0 19 * * *';
let cron_code = 'send_wishlist_email';

let task = cron.schedule(schedule, async () => {
  try {
    let query = `select uw.user_id as userid, uw.product_category as productcategory, uw.sku_code as sku,  pip.currency_code
                                u.name, u.email, pip.retail_price as retailprice, p.name as productname  from user_wishlists  uw 
                                left join users u on u.id = uw.user_id
                                left join user_location ul on ul.user_id = u.id
                                left join products p on p.sku = uw.sku_code
                                left join product_international_prices pip on pip.sku_code = uw.sku_code and pip.currency_code = ul.currency_code
                                where uw.created_at >= NOW() - '1 day'::INTERVAL 
                                and uw.user_id != uw.created_by
                                order by uw.created_at desc`;

    let whishlists = await db.rawQuery(query, 'SELECT');


    if (whishlists.length > 0) {
      let group = [];
      whishlists.forEach(({ userid, productcategory, sku, name, email, retailprice, currency_code, productname }) => {
        group[userid] = group[userid] || { userid, email, name, skus: [] };
        group[userid].skus.push({ sku, productcategory, retailprice, productname, currency_code });
      });


      for (var key in group) {
        if (group.hasOwnProperty(key)) {
          wishlistNotification(group[key].skus, group[key].email, group[key].name);
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
