const { Router } = require('express');
const router = Router();


const middleware = require('../../../middleware');
const { locationFilter } = middleware.locationChecker;

const searchAPI = require('./search');

router.use('/', locationFilter, searchAPI());

module.exports = () => router;