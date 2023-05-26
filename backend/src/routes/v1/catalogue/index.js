const { Router } = require('express');
const router = Router();

const middleware = require('../../../middleware');
const { locationFilter } = middleware.locationChecker;

const productAPI = require('./product');

router.use('/', locationFilter, productAPI());

module.exports = () => router;