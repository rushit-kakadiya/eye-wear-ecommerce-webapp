const cron = require('node-cron');
const { constant, utils } = require('../core');
const { database: db } = require('../utilities');
const service = require('../services');

const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

// const schedule =  '0 */1 * * * *';
const schedule = '0 */1 * * *';

let cron_code = 'update_payment_status';

let task = cron.schedule(schedule, async () => {
  try {
    let date = new Date((new Date().getTime() - (24 * 60 * 60 * 1000)));

    let query = `select req.created_at, req.amount, auth.expiration_date, auth.bank_code from payment_request req 
			inner join payment_auth_response auth on auth.external_id = req.external_id
			left join payment_response res on res.external_id = req.external_id
			where req.payment_method = :payment_method and auth.status = :auth_status
			and (res.status is null or res.status = :res_status) and auth.expiration_date < :expiration_date`;

    let replacements = {
      payment_method: constant.payment_method.VIRTUAL_ACCOUNT,
      auth_status: constant.payment_status.PENDING,
      res_status: constant.payment_status.FAILED,
      expiration_date: date.toISOString()
    };

    let paymentAuthResponse = await db.rawQuery(query, 'SELECT', replacements);

    let transaction = await db.dbTransaction();
    const promise = paymentAuthResponse.map(async (row, index) => {
      const order = await db.findOneByCondition({ payment_req_id: row.external_id }, 'OrderDetail', ['order_no']);
      const orderHistory = db.saveData({ order_no: order.order_no, status: constant.order_status.PAYMENT_FAILED, source: 'app' }, 'OrdersHistory', transaction);
      const orderDetails = db.updateOneByCondition({
        order_status: constant.order_status.PAYMENT_FAILED,
        updated_at: new Date()
      }, {
        order_no: order.order_no
      }, 'OrderDetail', transaction);

      const PaymentAuth = db.updateOneByCondition({
        status: constant.payment_status.FAILED
      }, {
        external_id: row.external_id
      }, 'PaymentAuthResponse', transaction);

      await Promise.all([orderHistory, orderDetails, PaymentAuth]);
      return await transaction.commit();
    });
    Promise.all(promise)
      .then(res => console.log('result => '))
      .catch(error => {
        //console.log('error => ', JSON.stringify(error));
        transaction.rollback();
      });
    isRunningFlag = false;
    logger.info({ cron_code }, 'update payment complete');
  } catch (error) {
    logger.error({ cron_code }, error);
    transaction.rollback();
  }
}, {
  scheduled: false,
});


module.exports = [task];
