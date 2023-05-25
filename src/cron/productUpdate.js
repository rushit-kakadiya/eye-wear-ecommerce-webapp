const config = require('config');
const cron = require('node-cron');
const { utils } = require('../core');
const { database: db } = require('../utilities');

const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

const schedule = '0 */1 * * * *';
// const schedule =  '0 */1 * * *';

let cron_code = 'turboly_product_update';

let task = cron.schedule(schedule, async () => {
  try {
    let pageLimit = 300;
    const response = await utils.axiosClient({
      url: config.turboly.baseUrl + 'products',
      headers: {
        'X-AUTH-EMAIL': config.turboly.authEmail,
        'X-AUTH-TOKEN': config.turboly.authToken
      },
      method: 'GET',
      params: {
        page_limit: pageLimit,
        active: false,
      },
      data: {},
    });

    // clear product table
    // let query = 'truncate table turboly_products restart identity';
    // await db.rawQuery(query, 'SELECT', {});

    if (response.status == 200) {
      await db.saveMany(response.data.products, 'TurbolyProducts');
      for (let i = 2; i <= response.data.pages; i++) {
        const result = await utils.axiosClient({
          url: config.turboly.baseUrl + 'products',
          headers: {
            'X-AUTH-EMAIL': config.turboly.authEmail,
            'X-AUTH-TOKEN': config.turboly.authToken
          },
          method: 'GET',
          params: {
            page: i,
            page_limit: pageLimit,
            active: false,
          },
          data: {},
        });
        if (result.status == 200) {
          await db.saveMany(result.data.products, 'TurbolyProducts');
        }
      }
    }

    // let query1 = `update products set
    // 	sku = tp.sku, retail_price = tp.retail_price, tax_rate = tp.tax_rate,
    // 	tax_name = tp.tax_name, updated_at = current_timestamp, active = tp.active
    // 	from turboly_products tp where tp.id = products.id`;
    // let query2 = 'update products set active = false, updated_at = current_timestamp where id not in (select id from turboly_products)';
    // let query3 = 'insert into products select * from turboly_products where id not in (select id from products)';
    // let query4 = `update frame_master set is_hto = true from products 
    // 				where concat('HTO',frame_master.sku_code) = products.sku`;

    // await db.rawQuery(query1, 'SELECT', {});
    // await db.rawQuery(query2, 'SELECT', {});
    // await db.rawQuery(query3, 'SELECT', {});
    // await db.rawQuery(query4, 'SELECT', {});
    // await db.rawQuery(query, 'SELECT', {});

    logger.info({ cron_code }, 'Turboly products update completed');
  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
});


module.exports = [task];
