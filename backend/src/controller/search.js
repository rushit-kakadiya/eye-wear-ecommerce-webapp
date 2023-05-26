const _ = require('lodash');
const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;

const popularSearch = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = {};
    payload.country_code = req.location.country_code;
    req.data = await service.search.popularSearch(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const textSearch = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    req.data = await service.search.textSearch(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

// const esTextSearch = async (req, res, next) => {
//   req.logLevel = 1;
//   try {
//     const payload = req.query;
//     payload.country_code = req.location.country_code;
//     req.data = await service.catalogue.esTextSearch(payload);
//     next();
//   } catch (error) {
//     const display = error.message;
//     req.error = error.message;
//     errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);   
//   }
// };

// const esProductSearch = async (req, res, next) => {
//   req.logLevel = 1;
//   try {
//     const payload = req.query;
//     req.data = await service.catalogue.esProductSearch(payload, req.user);
//     next();
//   } catch (error) {
//     const display = error.message;
//     req.error = error.message;
//     errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);   
//   }
// }; 

module.exports = {
  popularSearch,
  textSearch,
  // esTextSearch,
  // esProductSearch
};
