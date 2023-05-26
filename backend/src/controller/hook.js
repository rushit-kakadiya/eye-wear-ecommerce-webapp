const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;

const xendit = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.hook.xendit(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const xenditCardLess = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.hook.xenditCardLess(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const xenditVADisbursement = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.hook.xenditVADisbursement(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const ninjaExpress = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.hook.ninjaExpress(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const turbolyProductUpdate = async (req, res, next) => {
  req.logLevel = 1;
  try {
    console.log(req.headers, 'turbolyProductUpdate', JSON.stringify(req.body));
    const payload = req.body;
    req.data = await service.hook.turbolyProductUpdate(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const turbolyOrderUpdate = async (req, res, next) => {
  req.logLevel = 1;
  try {
    console.log(req.headers, 'turbolyOrderUpdate', JSON.stringify(req.body));
    const payload = req.body;
    req.data = await service.hook.turbolyOrderUpdate(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const xenditInvoice = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.hook.xenditInvoice(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


module.exports = {
  xendit,
  xenditCardLess,
  xenditVADisbursement,
  ninjaExpress,
  turbolyProductUpdate,
  turbolyOrderUpdate,
  xenditInvoice
};
