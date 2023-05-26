const request = require('supertest');
const app = require('../../src/app');

const mockToken = 'Bearer ';

describe('catalogue Endpoints', () => {

  it('should load products successfully', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue?page=1&is_hto=true')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should load filtered products count', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/filteredProductCount')
      .set('Authorization', mockToken)
      .send({
        fit: [],
        frame_shape: [],
        material: [],
        color: ['black'],
        face_shape: [],
        gender: ['men'],
        sort_by: {
          key: 'price',
          order: 'asc'
        }
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should load filtered products', async () => {
    const res = await request(app)
      .post('/api/v1/catalogue/filteredProduct')
      .set('Authorization', mockToken)
      .send({
        fit: [],
        frame_shape: [],
        material: [],
        color: ['black'],
        face_shape: [],
        gender: ['men'],
        sort_by: {
          key: 'price',
          order: 'asc'
        }
      });
    expect(res.statusCode).toEqual(200);
  });

  it('should load productDetails successfully', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/productDetails?id=FR0020')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should load productStockDetails successfully', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/productStockDetails?id=ST0107')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should load lenses successfully', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/lenses?category=lense_category&id=NA')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should load lense SKU successfully', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/lenseSKU?id=203af1b9-0b4b-4257-8aff-728677f8d727&category=lense_type')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should check hto check availablity', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/hto_check?zipcode=10120')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should load available hto slot list', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/hto_slot')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

  it('should load product based on qr(SKU)', async () => {
    const res = await request(app)
      .get('/api/v1/catalogue/scan_qr?id=ST1707')
      .set('Authorization', mockToken);
    expect(res.statusCode).toEqual(200);
  });

});
