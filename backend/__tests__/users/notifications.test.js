const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';

describe('Notifications Endpoints', () => {

  it('should be on get a notification authentication Error', async () => {
    const res = await request(app)
      .get('/api/v1/user/notifications?page=1');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Please provide auth token');
  });

  it('should be on get a notification list successfully', async () => {
    const res = await request(app)
      .get('/api/v1/user/notifications?page=1')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });
});
