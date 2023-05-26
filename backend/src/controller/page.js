const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;

const addPage = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    await service.page.addPage(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getPage = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.params;
    req.data = await service.page.getPage(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  addPage,
  getPage
};
