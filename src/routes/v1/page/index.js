const { Router } = require('express');
const router = Router();

const pageAPI = require('./page');

router.use('/', pageAPI());

module.exports = () => router;