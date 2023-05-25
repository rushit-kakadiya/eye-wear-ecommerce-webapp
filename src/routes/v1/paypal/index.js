const { Router } = require('express');
const router = Router();

const paypalAPI = require('./paypal');

router.use('/', paypalAPI());

module.exports = () => router;