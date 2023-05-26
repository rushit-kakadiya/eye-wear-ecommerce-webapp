const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;


const create = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.paypal.create(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, 1, error, display, req, res);
  }
};

const success = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    await service.paypal.success(payload);
    res.render('success');
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, 1, error, display, req, res);
  }
};

const cancel = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    await service.paypal.cancel(payload);
    res.render('cancel');
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, 1, error, display, req, res);
  }
};

const cancelPayment = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.paypal.cancelPayment(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, 1, error, display, req, res);
  }
};

module.exports = {
  create,
  success,
  cancel,
  cancelPayment
};
