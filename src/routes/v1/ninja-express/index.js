const { Router } = require('express');
const router = Router();

const ninjaAPI = require('./ninja');

router.use('/', ninjaAPI());

module.exports = () => router;