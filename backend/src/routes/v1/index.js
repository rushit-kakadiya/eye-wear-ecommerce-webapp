const { Router } = require('express');

const healthRoute = require('./healthcheck');
const userRoute = require('./user');
const catalogueRoute = require('./catalogue');
const searchRoute = require('./search');
const hooksRoute = require('./hook');
const ninjaRoute = require('./ninja-express');
const pageRoute = require('./page');
const sicepatRoute = require('./sicepat-express');
const adminRoute = require('./admin');
const paypalRoute = require('./paypal');

const router = Router();

router.use('/healthcheck', healthRoute());
router.use('/user', userRoute());
router.use('/catalogue', catalogueRoute());
router.use('/search', searchRoute());
router.use('/hook', hooksRoute());
router.use('/ninja-express', ninjaRoute());
router.use('/page', pageRoute());
router.use('/sicepat', sicepatRoute());
router.use('/admin', adminRoute());
router.use('/paypal', paypalRoute());

module.exports = () => router;
