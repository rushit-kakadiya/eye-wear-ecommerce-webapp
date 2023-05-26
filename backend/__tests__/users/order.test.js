const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';
const apiKey = '';

// router.post('/checkout', authFilter, joiValidation.user.orderCheckout, userAPIController.checkout, genericResponse);
// router.post('/checkout_hto', authFilter, joiValidation.user.htoCheckout, userAPIController.htoCheckout, genericResponse);
// router.post('/createOrder', authFilter, userAPIController.createOrder, genericResponse);
// router.get('/order_list', authFilter, joiValidation.user.orderListResource, userAPIController.getUserOrderList, genericResponse);
// router.get('/order_details', authFilter, joiValidation.user.orderDetailsResource, userAPIController.getOrderDetails, genericResponse);
// router.post('/hto_reschedule', authFilter, joiValidation.user.rescheduleHTO, userAPIController.rescheduleHTOOrder, genericResponse);
// router.post('/cancel_order', authFilter, joiValidation.user.cancelOrder, userAPIController.cancelOrder, genericResponse);

describe('order Endpoints', () => {

  it('should load stores successfully', async () => {
    const res = await request(app)
      .get('/api/v1/user/stores')
      .set('x-api-key', apiKey);
    expect(res.statusCode).toEqual(200);
  });

  it('should load order list successfully', async () => {
    const res = await request(app)
      .get('/api/v1/user/order_list?page=1&is_hto=true')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should load order details successfully', async () => {
    const res = await request(app)
      .get('/api/v1/user/order_details?id=TUHJSJSE8ZD2JBSU')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should create an order', async () => {
    const res = await request(app)
      .post('/api/v1/user/checkout')
      .set('Authorization', mockToken)
      .send({
        'products': [{
          'sku_code': 'ST0601',
          'quantity': 1,
          'retail_price': 1295000,
          'discount_amount': 0,
          'addon_items': [
            {
              'addon_type': 'lense',
              'sku_code': 'SAT010202',
              'quantity': 3,
              'retail_price': 1100000
            }
          ]
        }],
        'address_id': '293ae18b-4e13-4f85-939b-a23d1d1d606e',
        'fulfillment_type': 1,
        'store_id': '7610',
        'voucher_code': 'voucher_code',
        'notes': 'NA notes take notes'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should create a hto order', async () => {
    const res = await request(app)
      .post('/api/v1/user/checkout_hto')
      .set('Authorization', mockToken)
      .send({
        'products': [{
          'sku_code': 'ST1707'
        }],
        'is_hto': true,
        'is_payment_required': false,
        'amount': 0,
        'address_id': '293ae18b-4e13-4f85-939b-a23d1d1d606e',
        'appointment_date': '2020-10-01',
        'timeslot_id': '293ae18b-4e13-4f85-939b-a23d1d1d606e',
        'notes': 'iced latte'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should reschedule a hto order', async () => {
    const res = await request(app)
      .post('/api/v1/user/hto_reschedule')
      .set('Authorization', mockToken)
      .send({
        'order_no': 'TUHJSJSE8ZD2JBSU',
        'appointment_date': '2020-11-01',
        'timeslot_id': '293ae18b-4e13-4f85-939b-a23d1d1d606e'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should cancel an order', async () => {
    const res = await request(app)
      .post('/api/v1/user/cancel_order')
      .set('Authorization', mockToken)
      .send({
        'order_no': 'W0GBXBTYTBWIQRCI'
      });
    expect(res.statusCode).toEqual(200);
  });


});
