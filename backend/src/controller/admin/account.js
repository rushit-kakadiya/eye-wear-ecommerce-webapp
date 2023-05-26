const { messages, errorHandler, constants } = require('../../core');
const service = require('../../services');
const layer = 2;

const resetPassword = async (req, res, next) => {
  req.logLevel = 1;
  if (req.user.role !== 1) throw errorHandler.customError(messages.systemError);
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.admin.resetPassword(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message.message;
    req.error = { message: error.message, field: error.message.field };
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};



const resetTimezone = async (req, res, next) => {
  req.logLevel = 1;
  if (req.user.role !== 1) throw errorHandler.customError(messages.systemError);
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.admin.resetTimezone(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message.message;
    req.error = { message: error.message, field: error.message.field };
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  resetPassword,
  resetTimezone
};
