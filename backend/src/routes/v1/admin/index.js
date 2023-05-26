const { Router } = require('express');
const router = Router();

const adminAPI = require('./admin');

router.use('/', adminAPI());

module.exports = () => router;