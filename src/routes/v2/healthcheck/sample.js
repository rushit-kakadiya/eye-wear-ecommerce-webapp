const { Router } = require('express');
const router = Router();

const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const { genericResponse } = response.common;

const { authProtected, authFilter } = middleware.authChecker;
const sampleAPIController = controller.healthcheck;

router.route('/protected')
  .get(authProtected, sampleAPIController.protectedApi,  genericResponse);

router.route('/open')
  .get(sampleAPIController.open,  genericResponse);

module.exports = () => router;
