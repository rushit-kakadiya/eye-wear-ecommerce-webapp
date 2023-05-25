const config = require('config');
const _ = require('lodash');
const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;

const getProducts = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    req.data = await service.catalogue.getProducts(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const filterProducts = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.country_code = req.location.country_code;
    req.data = await service.catalogue.filterProducts(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const filterProductsCount = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.country_code = req.location.country_code;
    req.data = await service.catalogue.filterProductsCount(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getFilters = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = {};
    payload.country_code = req.location.country_code;
    req.data = await service.catalogue.getFilters(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const esTextSearch = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    req.data = await service.catalogue.esTextSearch(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const esProductSearch = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.catalogue.esProductSearch(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addCart = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    payload.created_by = req.user.id;
    payload.created_at = new Date();
    payload.updated_at = new Date();
    req.data = await service.catalogue.addCart(payload);
    req.message = messages.itemAdded;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getCart = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const user_id = req.user.id;
    req.data = await service.catalogue.getCart(user_id);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getProductDetails = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    const response = await service.catalogue.getProductDetails(payload, req.user);
    if (_.isUndefined(response)) {
      throw new Error('Invalid SKU');
    }
    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getProductStockDetails = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    const response = await service.catalogue.getProductStockDetails(payload, req.user);
    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateCart = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    payload.updated_by = req.user.id;
    const response = await service.catalogue.updateCart(payload);
    req.data = response;
    req.message = messages.itemUpdated;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const removeCart = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = { data: req.body };
    payload.user_id = req.user.id;
    await service.catalogue.removeCart(payload);
    req.message = messages.itemRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const deleteCart = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    await service.catalogue.deleteCart(payload);
    req.message = messages.itemRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const createOrder = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    req.data = await service.catalogue.createOrder(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addCartAddon = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    payload.created_by = req.user.id;
    payload.created_at = new Date();
    payload.updated_at = new Date();
    await service.catalogue.addCartAddon(payload);
    req.message = messages.itemAdded;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateCartAddon = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    payload.updated_by = req.user.id;
    req.data = await service.catalogue.updateCartAddon(payload);
    req.message = messages.itemUpdated;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const deleteCartAddon = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    await service.catalogue.deleteCartAddon(payload);
    req.message = messages.itemRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const searchLenses = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    const response = await service.catalogue.searchLenses(payload, {});

    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const searchLenseSKU = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    const response = await service.catalogue.searchLenseSKU(payload, {});

    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getQRProduct = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    const response = await service.catalogue.getQRProduct(payload, {});

    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoCheck = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    const response = await service.catalogue.htoCheck(payload, {});

    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoSlot = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    const response = await service.catalogue.htoSlot(payload, {});

    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const lenseDetails = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    const response = await service.catalogue.lenseDetails(payload, {});

    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addTopPick = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    const user = req.user;

    const response = await service.catalogue.addTopPick(payload, user);

    req.data = response;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const clipOns = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.catalogue.clipOns();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const cartClipOns = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    if (!payload['user_id']) {
      payload.user_id = req.user.id;
    }
    req.data = await service.admin.getClipOns(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getPackaging = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.catalogue.getPackaging();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateCartPackages = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.catalogue.updateCartPackages(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const influencerList = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.catalogue.influencerList(payload = {});
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const saveRecentlyViewed = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.country_code = req.location.country_code;
    payload.store_id = config.turbolyEcomOrder.storeID;
    req.data = await service.catalogue.saveRecentlyViewed(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getRecentlyViewedList = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    payload.store_id = config.turbolyEcomOrder.storeID;
    req.data = await service.catalogue.getRecentlyViewedList(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getRecentlyViewedFrames = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.country_code = req.location.country_code;
    payload.store_id = config.turbolyEcomOrder.storeID;
    req.data = await service.catalogue.getRecentlyViewedFrames(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  getProducts,
  getFilters,
  esTextSearch,
  esProductSearch,
  getProductDetails,
  getProductStockDetails,
  addCart,
  getCart,
  filterProducts,
  filterProductsCount,
  updateCart,
  removeCart,
  deleteCart,
  createOrder,
  addCartAddon,
  updateCartAddon,
  searchLenses,
  getQRProduct,
  searchLenseSKU,
  htoCheck,
  htoSlot,
  deleteCartAddon,
  lenseDetails,
  clipOns,
  cartClipOns,
  addTopPick,
  getPackaging,
  updateCartPackages,
  influencerList,
  saveRecentlyViewed,
  getRecentlyViewedList,
  getRecentlyViewedFrames
};
