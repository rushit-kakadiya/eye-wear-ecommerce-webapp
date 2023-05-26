const healthcheck = require('./healthcheck');
const user = require('./user');
const catalogue = require('./catalogue');
const search = require('./search');
const hook = require('./hook');
const ninjaExpress = require('./ninjaExpress');
const page = require('./page');
const sicepatExpress = require('./sicepatExpress');
const admin = require('./admin');
const paypal = require('./paypal');

module.exports = {
  healthcheck,
  user,
  catalogue,
  search,
  hook,
  ninjaExpress,
  page,
  sicepatExpress,
  admin,
  paypal
};
