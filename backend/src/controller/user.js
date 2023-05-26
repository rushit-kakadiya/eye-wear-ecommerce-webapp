const { messages, errorHandler } = require('../core');
const service = require('../services');
const layer = 2;

const getConfigDetails = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.user.getConfigDetails(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const register = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.user.register(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const login = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.user.login(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const logout = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.headers.authorization.split(' ');
    req.data = await service.user.logout(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getUserProfile = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.user.getUserData(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userProfile = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    payload.updated_by = req.user.id;
    await service.user.updateUserData(payload);
    req.message = messages.profileUpdated;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getStores = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.user.getStores(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getWishlist = async (req, res, next) => {
  req.logLevel = 1;
  const payload = {
    user_id: req.user.id
  };
  if (req.location) {
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
  } else {
    payload.country_code = constants.location.country_code;
    payload.currency_code = constants.location.currency_code;
  }
  try {
    req.data = await service.user.getWishlist(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addWishlist = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  payload.created_at = new Date();
  payload.updated_at = new Date();
  payload.created_by = req.user.id;
  if (req.location) {
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
  } else {
    payload.country_code = constants.location.country_code;
    payload.currency_code = constants.location.currency_code;
  }
  try {
    await service.user.addWishlist(payload);
    req.message = messages.wishlistAdded;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const removeWishlist = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;

  if (req.location) {
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
  } else {
    payload.country_code = constants.location.country_code;
    payload.currency_code = constants.location.currency_code;
  }

  try {
    await service.user.removeWishlist(payload);
    req.message = messages.wishlistRemoved;
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
    let payload = {};
    payload.user_id = req.user.id;
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
    req.data = await service.user.getCart(payload);
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
    req.data = await service.user.addCart(payload);
    req.message = messages.itemAdded;
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
    const response = await service.user.updateCart(payload);
    req.data = response;
    req.message = messages.itemUpdated;
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
    await service.user.deleteCart(payload);
    req.message = messages.itemRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const clearCart = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    await service.user.clearCart(payload);
    req.message = messages.itemRemoved;
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
    payload.country_code = req.location.country_code;
    await service.user.addCartAddon(payload);
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
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
    req.data = await service.user.updateCartAddon(payload);
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
    await service.user.deleteCartAddon(payload);
    req.message = messages.itemRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userOtp = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    req.data = await service.user.userOtp(payload);
    req.message = messages.otpSent;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userOtpVerify = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    await service.user.userOtpVerify(payload);
    req.message = messages.otpVerified;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userPayment = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.xendit.createCharge(payload);
    // req.data = await service.xendit.captureCharge(charge, req.user);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const captureUserPayment = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.xendit.captureCharge({
      id: req.body.charge_id,
      authorized_amount: req.body.amount
    }, req.user);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const refundUserPayment = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.xendit.createRefund(req.body);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userVAPayment = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    req.data = await service.xendit.createFixedVA(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const createVADisbursement = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    req.data = await service.xendit.createVADisbursement(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const cardLessPayment = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    req.data = await service.xendit.cardLessPayment(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const checkout = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    const response = await service.user.checkout(payload, req.user);
    req.data = response;
    req.message = messages.orderSuccess;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoCheckout = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    const response = await service.user.htoCheckout(payload, req.user);
    req.data = response;
    req.message = messages.htoOrderSuccess;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const createOrder = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    await service.user.createOrder(payload);
    req.message = messages.otpVerified;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userAddress = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  payload.created_by = req.user.id;
  try {
    req.data = await service.user.userAddress(payload);
    req.message = messages.addressAdded;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userAddressUpdate = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  payload.updated_by = req.user.id;
  try {
    await service.user.userAddressUpdate(payload);
    req.message = messages.addressUpdated;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getUserAddress = async (req, res, next) => {
  req.logLevel = 1;
  const user_id = req.user.id;
  try {
    req.data = await service.user.getUserAddress(user_id);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getUserOrderList = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.user_id = req.user.id;
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
    req.data = await service.user.getUserOrderList(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getOrderDetails = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.user_id = req.user.id;
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
    req.data = await service.user.getOrderDetails(payload);
    next();
  } catch (error) {
    console.log('Error: ', error);
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getNotifications = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.query;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.getNotifications(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const authReversal = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    req.data = await service.xendit.authReversal(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userSettings = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  payload.updated_by = req.user.id;
  try {
    await service.user.updateUserData(payload);
    req.message = messages.settingsUpdated;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const removeAddress = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.params;
  payload.user_id = req.user.id;
  try {
    await service.user.removeAddress(payload);
    req.message = messages.addressRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const rescheduleHTOOrder = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    // await service.user.rescheduleHTOOrder(payload);
    req.data = await service.user.rescheduleHTOOrder(payload);
    req.message = messages.orderRescheduled;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const cancelOrder = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    const response = await service.user.cancelOrder(payload);
    req.data = response;
    req.message = messages.orderCancelled;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const fileUpload = async (req, res, next) => {
  req.logLevel = 1;
  //console.log('req.files.file', req.files.file);
  const payload = req.files.file;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.fileUpload(payload);
    //console.log('req.data', req.data);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const savedCardData = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.savedCardData(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getSavedCard = async (req, res, next) => {
  req.logLevel = 1;
  const user_id = req.user.id;
  try {
    req.data = await service.user.getSavedCard(user_id);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateSavedCard = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.updateSavedCard(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const deleteSavedCard = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.params;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.deleteSavedCard(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const returnOrder = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    await service.user.returnOrder(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const orderHistory = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.query;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.orderHistory(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getPrescriptions = async (req, res, next) => {
  req.logLevel = 1;
  const user_id = req.user.id;
  try {
    req.data = await service.user.getPrescriptions(user_id);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updatePrescription = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.updatePrescription(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addPrescription = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.addPrescription(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const sendNotification = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    req.data = await service.user.sendNotification(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addPrescriptionToCart = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.body;
  try {
    req.data = await service.user.addPrescriptionToCart(payload, req.user.id);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getVoucherDetails = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.query;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.getVoucherDetails(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const deletePrescription = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.params;
  try {
    await service.user.deletePrescription(payload);
    req.message = messages.prescriptionRemoved;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoBook = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.user.htoBook(payload);
    req.message = messages.htoOrderSuccess;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoReschedule = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.user.htoReschedule(payload);
    req.message = messages.orderRescheduled;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoCancel = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.user.htoCancel(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoAppointmentList = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.user_id = req.user.id;
    req.data = await service.user.htoAppointmentList(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const appointmentDetail = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.user_id = req.user.id;
    req.data = await service.user.appointmentDetail(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const submitReferralCode = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.user.submitReferralCode(payload, req.user);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const referralList = async (req, res, next) => {
  req.logLevel = 1;
  const payload = req.query;
  payload.user_id = req.user.id;
  try {
    req.data = await service.user.referralList(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const voucherList = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.user_id = req.user.id;
    req.data = await service.user.voucherList(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userVoucherList = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.user_id = req.user.id;
    req.data = await service.user.userVoucherList(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const userCheckout = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.country_code = req.location.country_code;
    payload.currency_code = req.location.currency_code;
    req.data = await service.user.userCheckout(payload, req.user);
    if (req.data) {
      await service.admin.addOrderHistory({
        order_no: req.data.order_no,
        status: `order_created_by_${req.user.name.replace(' ', '_')}_on_app`,
        source: 'app',
        created_by: req.user.id
      });
    }
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const cardPayment = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.xendit.cardPayment(payload, req.user);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const saturdayPoints = async (req, res, next) => {
  req.logLevel = 1;
  const user_id = req.user.id;
  try {
    req.data = await service.user.saturdayPoints(user_id);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const tierInfo = async (req, res, next) => {
  req.logLevel = 1;
  const user_id = req.user.id;
  try {
    req.data = await service.user.tierInfo(user_id);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const saturdayPointsRewards = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.user.saturdayPointsRewards();
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


module.exports = {
  getConfigDetails,
  register,
  login,
  logout,
  getStores,
  addWishlist,
  removeWishlist,
  getWishlist,
  addCart,
  getCart,
  updateCart,
  deleteCart,
  clearCart,
  addCartAddon,
  updateCartAddon,
  deleteCartAddon,
  userOtp,
  userOtpVerify,
  userPayment,
  captureUserPayment,
  refundUserPayment,
  userVAPayment,
  cardLessPayment,
  checkout,
  htoCheckout,
  createOrder,
  userAddress,
  userAddressUpdate,
  getUserAddress,
  getNotifications,
  getUserOrderList,
  getOrderDetails,
  authReversal,
  getUserProfile,
  userProfile,
  userSettings,
  removeAddress,
  createVADisbursement,
  rescheduleHTOOrder,
  cancelOrder,
  fileUpload,
  savedCardData,
  getSavedCard,
  deleteSavedCard,
  updateSavedCard,
  returnOrder,
  orderHistory,
  getPrescriptions,
  updatePrescription,
  addPrescription,
  sendNotification,
  addPrescriptionToCart,
  getVoucherDetails,
  deletePrescription,
  htoBook,
  htoReschedule,
  htoCancel,
  htoAppointmentList,
  appointmentDetail,
  submitReferralCode,
  referralList,
  voucherList,
  userVoucherList,
  userCheckout,
  cardPayment,
  saturdayPoints,
  tierInfo,
  saturdayPointsRewards
};
