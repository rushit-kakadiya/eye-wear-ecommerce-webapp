const { Router } = require('express');
const router = Router();

const sampleAPI = require('./sample');

router.use('/', sampleAPI());

module.exports = () => router;
