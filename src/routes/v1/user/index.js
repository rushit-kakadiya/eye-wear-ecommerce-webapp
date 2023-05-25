const { Router } = require('express');
const router = Router();

const middleware = require('../../../middleware');
const { locationFilter } = middleware.locationChecker;

const userAPI = require('./user');

router.use('/', locationFilter, userAPI());

module.exports = () => router;