const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;

const sicepatAvialiblityCheck = async (req, res, next) => {
  req.logLevel = 1;
  try {
    let payload = req.query;
    req.data = await service.sicepatExpress.sicepatAvialiblityCheck(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getCustomerOrigin = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.sicepatExpress.getCustomerOrigin();
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const trackOrder = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const { trackNo } = req.query;
    req.data = await service.sicepatExpress.trackOrder(trackNo);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const generateOrder = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.sicepatExpress.generateOrder(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const cancelOrderPickup = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.sicepatExpress.cancelOrderPickup(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  sicepatAvialiblityCheck,
  getCustomerOrigin,
  trackOrder,
  generateOrder,
  cancelOrderPickup
};
