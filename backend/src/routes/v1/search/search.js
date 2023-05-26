const { Router } = require('express');
const router = Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const { authFilter, authFilterAndUnAuthFilter } = middleware.authChecker;
const searchAPIController = controller.search;

router.get('/text', authFilterAndUnAuthFilter, joiValidation.search.searchProduct, searchAPIController.textSearch, genericResponse);
router.get('/popular', authFilterAndUnAuthFilter, searchAPIController.popularSearch, genericResponse);

module.exports = () => router;