const { Router } = require('express');
const router = Router();
const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const paypalAPIController = controller.paypal;
const { authFilter } = middleware.authChecker;

router.post('/create', authFilter, joiValidation.paypal.createPaypalPayment, paypalAPIController.create, genericResponse);
router.get('/success', paypalAPIController.success);
router.get('/cancel', paypalAPIController.cancel);

router.post('/cancel-payment', authFilter, joiValidation.paypal.createPaypalPayment, paypalAPIController.cancelPayment, genericResponse);

module.exports = () => router;