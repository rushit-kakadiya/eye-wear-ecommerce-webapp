const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';

describe('Payment Endpoints', () => {

  it('should be on card payment charge', async () => {
    const res = await request(app)
      .post('/api/v1/user/payment')
      .set('Authorization', mockToken)
      .send({
        token_id: '5f119315c279260019590dce',
        auth_id: '5f119320c279260019590dcf',
        amount: 75000,
        card_cvn: '123',
        external_id: '12345698960586',
        is_save_card: true
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should be on card payment capture', async () => {
    const res = await request(app)
      .post('/api/v1/user/payment/capture')
      .set('Authorization', mockToken)
      .send({
        charge_id: '5f119315c279260019590dce',
        amount: 75000
      });
    expect(res.statusCode).toEqual(200);
  });


});
