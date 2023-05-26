const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';

describe('User Address Endpoints', () => {

  it('should get a address authentication Error', async () => {
    const res = await request(app)
      .get('/api/v1/user/address');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Please provide auth token');
  });

  it('should get a address successfully', async () => {
    const res = await request(app)
      .get('/api/v1/user/address')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should add a address authentication Error', async () => {
    const res = await request(app)
      .post('/api/v1/user/address');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Please provide auth token');
  });

  it('should add a address successfully', async () => {
    const res = await request(app)
      .post('/api/v1/user/address')
      .set('Authorization', mockToken)
      .send({
        receiver_name: 'test',
        label_address: '#87',
        phone_number: '+919876543210',
        email: 'test@yopmail.com',
        street: '13 no gali',
        zip_code: '1234',
        province: 'xyz',
        district: 'sangrur',
        sub_district: 'longowal',
        //is_primary:
        lat: '30.704649',
        long: '76.717873'
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should update a address successfully', async () => {
    const res = await request(app)
      .put('/api/v1/user/address')
      .set('Authorization', mockToken)
      .send({
        id: '7fc9e547-19d7-4d07-bc8b-565dd8a49d33',
        receiver_name: 'test',
        label_address: '#87',
        phone_number: '+919876543210',
        email: 'test@yopmail.com',
        street: '13 no gali',
        zip_code: '1234',
        province: 'xyz',
        district: 'sangrur',
        sub_district: 'longowal',
        //is_primary:
        lat: '30.704649',
        long: '76.717873'
      });
    expect(res.statusCode).toEqual(200);
  });

});
