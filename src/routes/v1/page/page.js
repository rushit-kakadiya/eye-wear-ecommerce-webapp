const { Router } = require('express');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const router = Router();

const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const { authProtected } = middleware.authChecker;
const pageAPIController = controller.page;

router.post('/', authProtected, joiValidation.page.addPage, pageAPIController.addPage, genericResponse);
router.get('/:type', authProtected, joiValidation.page.getPage, pageAPIController.getPage, genericResponse);

module.exports = () => router;