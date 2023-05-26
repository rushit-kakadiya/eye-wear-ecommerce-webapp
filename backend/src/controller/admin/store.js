const db = require('../../utilities/database');
const { utils, errorHandler, messages } = require('../../core');
const service = require('../../services');
const layer = 2;

const getStores = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getStores(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const addStore = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.admin.addStore(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateStore = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateStore(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const storeDetail = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.storeDetail(payload.id);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const storeActivity = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.admin.storeActivity(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const storeImages = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.files.file;
    payload.user_id = req.user.id;
    payload.type = req.body.type;
    payload.id = req.body.id;
    req.data = await service.admin.storeImages(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const redeemCoffeeInStore = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.admin.redeemCoffeeInStore(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  getStores,
  addStore,
  updateStore,
  storeDetail,
  storeActivity,
  storeImages,
  redeemCoffeeInStore
};
