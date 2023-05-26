const { responseHandler, errorHandler } = require('../core');
const service = require('../services');

const layer = 2;

const protectedApi = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.healthcheck.protectedApi();
    next();
  } catch (error) {
    console.log(error);
    const display = 'Display SMS';
    req.error = error;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const open = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.healthcheck.open({ status: 'open' });
    next();
  } catch (error) {
    console.log(error);
    const display = 'Display SMS';
    req.error = error;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


module.exports = {
  protectedApi,
  open
};
