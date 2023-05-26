const { messages, errorHandler, constants } = require('../../core');
const service = require('../../services');
const layer = 2;

const getRoles = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getRoles();
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getAdminUsers = async (req, res, next) => {
  req.logLevel = 1;
  try {
    req.data = await service.admin.getAdminUsers(req.query);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const changeAdminUserPassword = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.changeAdminUserPassword(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addAdminUser = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.admin.addAdminUser(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateAdminUser = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateAdminUser(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateAdminUserStatus = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateAdminUserStatus(payload);
    req.message = payload.status === 1 ? messages.userActivated : messages.userDeactivated;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const getEmployee = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.query;
    req.data = await service.admin.getEmployee(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const addEmployee = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.created_by = req.user.id;
    req.data = await service.admin.addEmployee(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const updateEmployee = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.body;
    payload.updated_by = req.user.id;
    req.data = await service.admin.updateEmployee(payload);
    req.message = messages.success;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

const deleteEmployee = async (req, res, next) => {
  req.logLevel = 1;
  try {
    const payload = req.params;
    payload.updated_by = req.user.id;
    req.data = await service.admin.deleteEmployee(payload);
    req.message = messages.deletedSuccessfully;
    next();
  } catch (error) {
    const display = error.message;
    req.error = error.message;
    errorHandler.errorFunction(layer, req.logLevel, error, display, req, res);
  }
};

module.exports = {
  getRoles,
  getAdminUsers,
  changeAdminUserPassword,
  addAdminUser,
  updateAdminUser,
  updateAdminUserStatus,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee
};
