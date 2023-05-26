const config = require('config');
const cron = require('node-cron');
const { utils } = require('../core');
const { database: db } = require('../utilities');

const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

// const schedule =  '0 */1 * * * *';
const schedule = '0 */1 * * *';

let cron_code = 'turboly_product_stock_update';

let task = cron.schedule(schedule, async () => {
  try {
    let pageLimit = 300;
    const response = await utils.axiosClient({
      url: config.turboly.baseUrl + 'stocks',
      headers: {
        'X-AUTH-EMAIL': config.turboly.authEmail,
        'X-AUTH-TOKEN': config.turboly.authToken,
      },
      method: 'GET',
      params: {
        page_limit: pageLimit,
        include_zero_quantity: true,
        store_id: config.turbolyEcomOrder.storeID,
      },
      data: {},
    });

    // clear product table
    let query = 'truncate table turboly_product_stocks restart identity';
    await db.rawQuery(query, 'SELECT', {});

    if (response.status == 200) {
      await db.saveMany(response.data.stocks, 'TurbolyProductStock');
      for (let i = 2; i <= response.data.pages; i++) {
        const result = await utils.axiosClient({
          url: config.turboly.baseUrl + 'stocks',
          headers: {
            'X-AUTH-EMAIL': config.turboly.authEmail,
            'X-AUTH-TOKEN': config.turboly.authToken,
          },
          method: 'GET',
          params: {
            page: i,
            page_limit: pageLimit,
            include_zero_quantity: true,
            store_id: config.turbolyEcomOrder.storeID,
          },
          data: {},
        });
        if (result.status == 200) {
          await db.saveMany(result.data.stocks, 'TurbolyProductStock');
        }
      }
    }

    let query1 = `update product_stocks set 
			updated_at = current_timestamp, quantity = tps.quantity, reserved = tps.reserved, in_transit_orders = tps.in_transit_orders, in_transit_transfers = tps.in_transit_transfers
			from turboly_product_stocks tps where tps.product_id = product_stocks.product_id`;
    let query2 = `update product_stocks set 
			updated_at = current_timestamp, quantity = 0, reserved = 0, in_transit_orders = 0, in_transit_transfers = 0
			where product_id not in (select product_id from turboly_product_stocks)`;
    let query3 = 'insert into product_stocks select * from turboly_product_stocks where product_id not in (select product_id from product_stocks)';

    await db.rawQuery(query1, 'SELECT', {});
    await db.rawQuery(query2, 'SELECT', {});
    await db.rawQuery(query3, 'SELECT', {});
    await db.rawQuery(query, 'SELECT', {});
    logger.info({ cron_code }, 'Turboly product stocks update complete');
  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
});


module.exports = [task];
