const request = require('supertest');
const app = require('../../src/app');

describe('User login/signup Endpoints', () => {
  it('should be on register user success', async () => {
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({
        name: 'rushit',
        mobile: '9876543210',
        country_code: '62',
        gender: '1'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should be on login failed', async () => {
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({
        mobile: '9876543210',
        country_code: '62',
        otp: '632422'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should be on login success', async () => {
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({
        mobile: '9876543210',
        country_code: '62',
        otp: '632420'
      });
    expect(res.statusCode).toEqual(200);
  });
});

