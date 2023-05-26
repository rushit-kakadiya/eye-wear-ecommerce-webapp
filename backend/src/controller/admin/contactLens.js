const { messages, errorHandler, constants } = require('../../core');
const service = require('../../services');
const layer = 2;

const getContactLens = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getContactLens();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  getContactLens
};
