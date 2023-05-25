const { Router } = require('express');
const router = Router();
const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const ninjaExpressAPIController = controller.ninjaExpress;
const { authProtected } = middleware.authChecker;

router.post('/access-token', ninjaExpressAPIController.generateOAuthAccessToken, genericResponse);
router.post('/holidays', authProtected, joiValidation.page.holidays, ninjaExpressAPIController.holidays, genericResponse);
router.put('/holidays', authProtected, joiValidation.page.holidays, ninjaExpressAPIController.updateHolidays, genericResponse);

module.exports = () => router;