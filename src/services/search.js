
const config = require('config');
const moment = require('moment');
const _ = require('lodash');
const db = require('../utilities/database');
const elasticsearch = require('../utilities/elasticsearch');
const { messages, utils, constants, errorHandler } = require('../core');
const { cache } = require('../middleware');


const catalogueService = require('./catalogue');

const popularSearch = async (payload, user = {}) => {
  return {
    popularSearchKeys: ['FILMORE', 'HAMILTON', 'UNO', 'NATASHA', 'DARWIN']
  };
};

const textSearch = async (payload, user = {}) => {
  let storeQuery = {
    query_string: {
      query: `*${payload.text}*`,
      fields: ['name', 'store_code', 'store_region'],
    },
  };

  let productsQuery = {
    query_string: {
      query: `*${payload.text}*`,
      fields: [
        'frame_name',
        'variant_name',
        'frame_code',
        'variant_code',
        'sku_code',
        'material',
        'gender',
        'fit',
        // 'face_shape',
        // 'frame_shape',
        // 'gender'
      ],
    },
  };

  let productSortArray = [{'frame_rank': { 'order': 'desc' }}];

  const productdata = await elasticsearch.searchInIndex(
    'products',
    productsQuery,
    0,
    20,
    [
      'turboly_id',
      'sku_code',
      'frame_name',
      'frame_code',
      'variant_name',
      'variant_code',
      'product_brand',
      'image_key_sunglass',
      'image_key_eyeglass',
      'retail_price',
      'product_category',
      'image_key'
    ],
    productSortArray
  );
  const storeData = await elasticsearch.searchInIndex(
    'stores',
    storeQuery,
    0,
    20,
    []
  );

  let productResults = productdata.hits.hits;
  let storeResults = storeData.hits.hits;

  let response = {
    product: {
      eyeglasses_count: 0,
      sunglasses_count: 0,
      eyeglasses: [],
      sunglasses: [],
      eyeglassFrames: [],
      sunglassFrames: [],
    },
    store: {
      count: 0,
      data: [],
    },
  };

  storeResults.forEach((data) => {
    let store = data._source;
    store.base_url = config.s3URL;
    response.store.data.push(store);
  });

  let eyeglassesSKU =  [];
  let sunglassesSKU =  [];
  let eyeglassesFrameCodes = [];
  let sunglassesFrameCodes = [];
  for(data of productResults) {
    let product = data._source;
    product.baseUrl = config.s3URL;

    if (
        product.product_category == 1
          && (payload.product_category == 1 || payload.product_category == 3)
    ) {
      response.product.eyeglasses.push(product);
      eyeglassesFrameCodes.push(product.frame_code);
      eyeglassesSKU.push(product.sku_code);
    } else if (
        product.product_category == 2
          && (payload.product_category == 2 || payload.product_category == 3)
    ) {
      response.product.sunglasses.push(product);
      sunglassesSKU.push(product.sku_code);
      sunglassesFrameCodes.push(product.frame_code);
    }
  }

  response.product.eyeglasses_count = response.product.eyeglasses.length;
  response.product.sunglasses_count = response.product.sunglasses.length;

  if(eyeglassesSKU.length > 0) {
    response.product.eyeglassFrames = await catalogueService.getSKUFrames(
      eyeglassesFrameCodes,
      eyeglassesSKU, 
      config.turbolyEcomOrder.storeID,
      payload.country_code,
      user.id, 
      false
    );
  }

  if(sunglassesSKU.length > 0) {
    response.product.sunglassFrames = await catalogueService.getSKUFrames(
      sunglassesFrameCodes,
      sunglassesSKU, 
      config.turbolyEcomOrder.storeID,
      payload.country_code,
      user.id,
      true
    );
  }

  response.store.count = response.store.data.length;

  return response;
};


module.exports = {
  popularSearch,
  textSearch
};
