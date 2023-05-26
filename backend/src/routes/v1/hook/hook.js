const { Router } = require('express');
const router = Router();
const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const { genericResponse } = response.common;

const hooksAPIController = controller.hook;
const { callBackProtected, callBackCardlessProtected, callBackNinjaProtected } = middleware.authChecker;

router.post('/xendit', callBackProtected, hooksAPIController.xendit, genericResponse);
router.post('/xendit/cardless', callBackCardlessProtected, hooksAPIController.xenditCardLess, genericResponse);
router.post('/xendit/va-disbursement', callBackProtected, hooksAPIController.xenditVADisbursement, genericResponse);
router.post('/ninja-express', callBackNinjaProtected, hooksAPIController.ninjaExpress, genericResponse);
router.post('/turboly/product-update', hooksAPIController.turbolyProductUpdate, genericResponse);
router.post('/turboly/order-update', hooksAPIController.turbolyOrderUpdate, genericResponse);
router.post('/xendit-invoice', hooksAPIController.xenditInvoice, genericResponse);

module.exports = () => router;