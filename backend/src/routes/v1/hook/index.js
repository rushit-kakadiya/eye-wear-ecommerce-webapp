const { Router } = require('express');
const router = Router();

const hookAPI = require('./hook');

router.use('/', hookAPI());

module.exports = () => router;