const { messages, errorHandler, constants } = require('../core');
const service = require('../services');
const layer = 2;
const { wishlistNotification } = require('../utilities/notification');
const voucher = require('./admin/voucher');
const contactLens = require('./admin/contactLens');
const elasticData = require('./admin/elasticData');
const catalogue = require('./admin/catalogue');
const userManagement = require('./admin/userManagement');
const account = require('./admin/account');
const store = require('./admin/store');
const products = require('./admin/products');

const login = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.admin.login(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addDraftOrder = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.admin.addDraftOrder(payload, req.user.id);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getOrders = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.admin_store_id = req.user.store_id;
    if (payload['is_hto']) {
      req.data = await service.admin.getHtoOrders(payload);
    } else {
      req.data = await service.admin.getOrders(payload);
    }
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addUser = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.user.addUserByAdmin(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateUser = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.user.updateUserByAdmin(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getUser = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getUsers(req.query);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const searchUser = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.user.searchUser(req.query);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getUserAddress = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.user.getUserAddress(req.query.user_id);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addUserAddress = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.body.created_by = req.user.id;
    req.data = await service.user.userAddress(req.body);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateUserAddress = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.body.updated_by = req.user.id;
    req.data = await service.user.userAddressUpdate(req.body);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addToCart = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.body.created_by = req.user.id;
    req.data = await service.admin.addCart(req.body, true);
    req.message = messages.success;
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
    req.data = await service.admin.getCart(req.query.user_id);
    req.message = messages.success;
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
    req.data = await service.admin.deleteCart(req.body);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getLenses = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getLenses();
    req.message = messages.success;
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
    payload.created_by = req.user.id;
    req.data = await service.admin.addCartAddon(payload);
    req.message = messages.success;
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
    payload.created_by = req.user.id;
    req.data = await service.admin.addCartAddon(payload, true);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getLenseOnly = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getLenseOnly(payload);
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
  try {
    const payload = req.body;
    req.data = await service.user.addPrescription(payload);
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
  const { user_id } = req.query;
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
  try {
    const payload = req.body;
    req.data = await service.user.updatePrescription(payload);
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
  try {
    const payload = req.body;
    const user = await service.user.getUserInfo(payload.user_id);
    delete payload.user_id;
    const adminId = req.user.id;
    req.data = await service.admin.checkout(payload, user, adminId);
    if (req.data) {
      await service.admin.deleteDraftOrder({ user_id: user.id });
      await service.admin.addOrderHistory({
        order_no: req.data.order_no,
        status: `order_created_by_${req.user.name.replace(' ', '_')}_on_POS`,
        source: 'app',
        created_by: adminId
      });
    }
    req.message = messages.success;
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
    req.data = await service.admin.deleteCartAddon(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const inStorePayment = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.admin.inStorePayment(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const bankList = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = constants.banks;
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const orderDetails = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.adminId = req.user.id;
    payload.adminEmail = req.user.email;
    req.data = await service.admin.orderDetails(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const downloadPDF = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.downloadPDF(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const itemWarranty = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.admin.itemWarranty(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const applyVoucher = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.admin.applyVoucher(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const cancelOrder = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.admin.cancelOrder(payload);
    req.message = messages.orderPaymentCancelled;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const dashboardData = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.dashboardData(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const customerDetail = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.customerDetail(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const removeDiscount = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    req.data = await service.admin.removeDiscount(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const processOrder = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.admin.processOrder(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateOrderStaffOptician = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    req.data = await service.admin.updateOrderStaffOptician(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addWishlist = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    payload.created_at = new Date();
    payload.updated_at = new Date();
    req.data = await service.user.addWishlist(payload);
    //wishlistNotification(payload.sku_code, payload.user_id, payload.product_category);
    req.message = messages.wishlistAdded;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const exportData = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.admin_store_id = req.user.store_id;
    if (req.params.type === 'customers') {
      req.data = await service.admin.exportUsers(payload);
    } else if (req.params.type === 'orders') {
      if (payload['is_hto']) {
        req.data = await service.admin.exportHtoOrders(payload);
      } else {
        req.data = await service.admin.exportOrders(payload);
      }
    }
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getOrderHtoDetail = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getOrderHtoDetail(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoSlots = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.user.htoSlot(payload);
    req.message = messages.htoOrderSuccess;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const htoAppointmentBook = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.admin.htoAppointmentBook(payload);
    req.message = messages.htoOrderSuccess;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getOptician = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getOptician();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateHtoDetail = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateHtoDetail(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getStaff = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getStaff();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateStockStoreInOrder = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateStockStoreInOrder(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getOpticianCalendar = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    payload.updated_by = req.user.id;
    req.data = await service.admin.getOpticianCalendar(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const changeLens = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.changeLens(payload);
    if (req.data) {
      await service.admin.addOrderHistory({
        order_no: payload.order_no,
        status: `Lens_edited_by_${req.user.name.replace(' ', '_')}`,
        source: 'app'
      });
    }
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getMembersPerformance = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getMembersPerformance(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getMemberOrders = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getMemberOrders(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getMemberSummary = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getMemberSummary(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};


const getOpticianAppointments = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getOpticianAppointment(payload);
    req.message = messages.success;
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
    req.data = await service.admin.esTextSearch(payload);
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateOrderStatus = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateOrderStatus(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getDiscountCategories = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = constants.promoDiscountLayers;
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getProductSku = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getProductSku(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const setElasticUserSearch = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.user.getUser();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const deleteOrder = async (req, res, next) => {
  req.logLevel = 1;
  if (req.user.role !== 1 && !constants.emailsForDeleteOrder.includes(req.user.email)) throw errorHandler.customError(messages.systemError);
  try {
    const payload = req.params;
    payload.updated_by = req.user.id;
    req.data = await service.admin.deleteOrder(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const createInvoice = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.xendit.createInvoice(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  login,
  addDraftOrder,
  getOrders,
  addUser,
  getUser,
  updateUser,
  searchUser,
  getUserAddress,
  addUserAddress,
  updateUserAddress,
  addToCart,
  getCart,
  removeCart,
  getLenses,
  addCartAddon,
  updateCartAddon,
  getLenseOnly,
  addPrescription,
  getPrescriptions,
  updatePrescription,
  checkout,
  deleteCartAddon,
  inStorePayment,
  bankList,
  orderDetails,
  downloadPDF,
  itemWarranty,
  applyVoucher,
  cancelOrder,
  dashboardData,
  customerDetail,
  removeDiscount,
  processOrder,
  updateOrderStaffOptician,
  addWishlist,
  exportData,
  getOrderHtoDetail,
  htoSlots,
  htoAppointmentBook,
  getOptician,
  updateHtoDetail,
  getStaff,
  updateStockStoreInOrder,
  getOpticianCalendar,
  changeLens,
  getMembersPerformance,
  getMemberOrders,
  getMemberSummary,
  getOpticianAppointments,
  esTextSearch,
  updateOrderStatus,
  getDiscountCategories,
  getProductSku,
  setElasticUserSearch,
  deleteOrder,
  createInvoice,
  ...voucher,
  ...contactLens,
  ...elasticData,
  ...catalogue,
  ...userManagement,
  ...account,
  ...store,
  ...products
};
