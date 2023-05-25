const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;

const generateOAuthAccessToken = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.params;
    req.data = await service.ninjaExpress.generateOAuthAccessToken(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const holidays = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    await service.ninjaExpress.holidays(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateHolidays = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    await service.ninjaExpress.updateHolidays(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  generateOAuthAccessToken,
  holidays,
  updateHolidays
};
