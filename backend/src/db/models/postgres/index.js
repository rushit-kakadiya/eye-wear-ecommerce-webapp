const UserModal = require('./user');
const catalogueModal = require('./catalogue');
const Order = require('./order');
const Payment = require('./payment');
const Page = require('./page');
const NinjaExpress = require('./ninja-express');
const Holidays = require('./holidays');
const AccessTokens = require('./access-tokens');
const OrdersHistory = require('./orders-history');
const Voucher = require('./voucher');
const DeliveryPartners = require('./delivery-partners');
const Sicepat = require('./sicepat');
const Logs = require('./logs-history');
const RedeemCoffeeLogs = require('./redeem-coffee-logs');

module.exports = {
  ...UserModal,
  ...catalogueModal,
  ...Order,
  ...Payment,
  ...Page,
  ...NinjaExpress,
  ...Holidays,
  ...AccessTokens,
  ...OrdersHistory,
  ...Voucher,
  ...DeliveryPartners,
  ...Sicepat,
  ...Logs,
  ...RedeemCoffeeLogs
};
