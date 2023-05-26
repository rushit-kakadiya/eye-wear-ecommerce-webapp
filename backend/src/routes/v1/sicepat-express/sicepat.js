const { Router } = require('express');
const router = Router();
const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const sicepatExpressAPIController = controller.sicepatExpress;
const { authFilter } = middleware.authChecker;

router.get('/sicepat-avialiblity', authFilter, joiValidation.user.zipCodeCheck, sicepatExpressAPIController.sicepatAvialiblityCheck, genericResponse);
router.get('/customer-origin', authFilter, sicepatExpressAPIController.getCustomerOrigin, genericResponse);
router.get('/track-order', authFilter, joiValidation.user.trackNo, sicepatExpressAPIController.trackOrder, genericResponse);
router.post('/order', authFilter, sicepatExpressAPIController.generateOrder, genericResponse);
router.get('/cancel-order-pickup', authFilter, joiValidation.user.trackNo, sicepatExpressAPIController.cancelOrderPickup, genericResponse);

module.exports = () => router;