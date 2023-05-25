const { Router } = require('express');

const healthRoute = require('./healthcheck');

const router = Router();

router.use('/healthcheck', healthRoute());

module.exports = () => router;