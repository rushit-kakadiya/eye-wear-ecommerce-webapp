const request = require('supertest');
const app = require('../../src/app');

describe('OTP Endpoints', () => {

  it('should be on send otp', async () => {
    const res = await request(app)
      .post('/api/v1/user/otp/send')
      .send({
        number: '9888246081',
        country_code: '91'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should be on verify otp', async () => {
    const res = await request(app)
      .post('/api/v1/user/otp/verify')
      .send({
        otp: '632420'
      });
    expect(res.statusCode).toEqual(200);
  });

});
