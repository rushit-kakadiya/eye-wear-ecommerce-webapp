const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';

describe('Cart Endpoints', () => {

  it('should add cart authentication Error', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/cart')
      .send({
        product_id: '403125',
        item_count: 1
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Please provide auth token');
  });

  it('should be on add cart success', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/cart')
      .set('Authorization', mockToken)
      .send({
        product_id: '403125',
        item_count: 1
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should be on update cart success', async () => {
    const res = await request(app)
      .put('/api/v1/catalogue/cart')
      .set('Authorization', mockToken)
      .send({
        id: 'f1391a29-d9de-4ff3-92d6-c29d2fca3d1b',
        item_count: 1
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should get cart authentication Error', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/cart');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Please provide auth token');
  });

  it('should get cart successfully', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/cart')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should be on addon cart success', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/cart/addon')
      .set('Authorization', mockToken)
      .send({
        addon_product_id: '403125',
        addon_item_count: 1,
        cart_id: 'bb536f5b-2e15-4cf2-9772-8aba1c61d0d2'
      });
    expect(res.statusCode).toEqual(200);
  });

});
