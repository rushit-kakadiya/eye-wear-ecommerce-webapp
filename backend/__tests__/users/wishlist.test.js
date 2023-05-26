const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';

describe('User wishlist Endpoints', () => {
  it('should be on add wishlist success', async () => {
    const res = await request(app)
      .post('/api/v1/user/wishlist')
      .set('Authorization', mockToken)
      .send({
        product_id: '403125'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should be on get a wishlist authentication Error', async () => {
    const res = await request(app)
      .get('/api/v1/user/wishlist');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Please provide auth token');
  });

  it('should be on get a wishlist successfully', async () => {
    const res = await request(app)
      .get('/api/v1/user/wishlist')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should be on a wishlist removed', async () => {
    const res = await request(app)
      .delete('/api/v1/user/wishlist')
      .set('Authorization', mockToken)
      .send({
        product_id: ['407601', '407577']
      });
    expect(res.statusCode).toEqual(200);
  });

});
