const { Router } = require('express');
const router = Router();

const sicepatAPI = require('./sicepat');

router.use('/', sicepatAPI());

module.exports = () => router;