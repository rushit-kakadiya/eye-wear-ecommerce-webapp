const { messages, errorHandler, constants } = require('../../core');
const service = require('../../services');
const layer = 2;

const addVoucher = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.admin.addVoucher(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getVoucher = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.created_by = req.user.id;
    req.data = await service.admin.getVoucher(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getVoucherDetail = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.created_by = req.user.id;
    req.data = await service.admin.getVoucherDetail(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateVoucher = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateVoucher(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const deleteVoucher = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.params;
    payload.updated_by = req.user.id;
    req.data = await service.admin.deleteVoucher(payload);
    req.message = messages.voucherRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const applyDiscount = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.applyDiscount(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error.message, display, req, res);
  }
};

const fileUpload = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.files.file;
    payload.user_id = req.user.id;
    req.data = await service.admin.fileUpload(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  addVoucher,
  getVoucher,
  getVoucherDetail,
  updateVoucher,
  deleteVoucher,
  applyDiscount,
  fileUpload
};
