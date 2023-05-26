const config = require('config');
const cron = require('node-cron');
const { utils, constants } = require('../core');
const { database: db } = require('../utilities');

const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

const schedule = '*/5 * * * *';
let cron_code = 'turboly_order_shipped';

let task = cron.schedule(schedule, async () => {
  try {
    // clear temp sale details table
    let query = 'truncate table temp_turboly_sale_details restart identity;';
    await db.rawQuery(query, 'SELECT', {});

    let pageLimit = 300;
    const response = await utils.axiosClient({
      url: config.turboly.baseUrl + 'sales',
      headers: {
        'X-AUTH-EMAIL': config.turboly.authEmail,
        'X-AUTH-TOKEN': config.turboly.authToken
      },
      method: 'GET',
      params: {
        page_limit: pageLimit,
        sales_type: constants.turboly_sale.ECOMMERCE,
        status: constants.turboly_order_status.ORDER_IN_TRANSIT
      },
      data: {},
    });

    if (response.status == 200) {
      await db.saveMany(response.data.result, 'TempTurbolySaleDetails');
      for (let i = 2; i <= response.data.pages; i++) {
        const result = await utils.axiosClient({
          url: config.turboly.baseUrl + 'sales',
          headers: {
            'X-AUTH-EMAIL': config.turboly.authEmail,
            'X-AUTH-TOKEN': config.turboly.authToken
          },
          method: 'GET',
          params: {
            page: i,
            page_limit: pageLimit,
            sales_type: constants.turboly_sale.ECOMMERCE,
            status: constants.turboly_order_status.ORDER_IN_TRANSIT
          },
          data: {},
        });
        if (result.status == 200) {
          await db.saveMany(result.data.result, 'TempTurbolySaleDetails');
        }
      }
    }

    let query1 = `update turboly_sale_details set 
			workflow_state = tmp.status
			from temp_turboly_sale_details tmp
			where tmp.ref_code = turboly_sale_details.ref_code`;

    let query2 = `update order_details set 
			order_status = :order_status,
			updated_at = current_timestamp
			from turboly_order_mapping mp
			inner join turboly_sale_details sale on mp.turboly_invoice_id = sale.ecommerce_ref_code
			where mp.order_no = order_details.order_no 
			and sale.workflow_state = :workflow_state
			and order_details.order_status = :current_status`;

    let replacements = {
      order_status: constants.order_status.ORDER_SHIPPED,
      workflow_state: constants.turboly_order_status.ORDER_IN_TRANSIT,
      current_status: constants.order_status.ORDER_PICKUP_PENDING
    };

    await db.rawQuery(query1, 'SELECT', {});
    await db.rawQuery(query2, 'SELECT', replacements);
    await db.rawQuery(query, 'SELECT', {});
    logger.info({ cron_code }, 'Turboly products stock completed');
  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
});


module.exports = [task];
