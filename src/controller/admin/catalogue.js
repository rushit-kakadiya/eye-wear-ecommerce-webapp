const { messages, errorHandler } = require('../../core');
const service = require('../../services');
const layer = 2;

const getOthersProduct = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getOthersProduct();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateOrderDelivery = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateOrderDelivery(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  getOthersProduct,
  updateOrderDelivery
};
