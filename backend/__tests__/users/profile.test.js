const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';

describe('User profile and settings', () => {

  it('should be on update user profile', async () => {
    const res = await request(app)
      .put('/api/v1/user/profile')
      .set('Authorization', mockToken)
      .send({
        name: 'Jasdeep',
        mobile: '9888246081',
        country_code: '91',
        gender: 1,
        email: 'jasdeep@supertal.io',
        dob: '1989-08-07'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should be on update user settings', async () => {
    const res = await request(app)
      .put('/api/v1/user/settings')
      .set('Authorization', mockToken)
      .send({
        is_send_notifications: true,
        is_send_email: true,
        is_send_newsletter: true,
        currency: 'IDR',
        language: 'English'
      });
    expect(res.statusCode).toEqual(200);
  });

});
