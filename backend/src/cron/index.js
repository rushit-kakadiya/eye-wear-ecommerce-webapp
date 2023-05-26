
const cronJobs = () => {
  let tasks = [];
  // add new folder in require as an argument to below function;

  //  const productUpdateJob = require('./productUpdate');
  //  const productStockUpdateJob = require('./productStockUpdate');
  //  const orderDeliveryJob = require('./orderDelivery');
  //  const processOrderJob = require('./processOrder');
  //  const processOrderHTOJob = require('./processOrderHTO');
  //  const orderPickupUpdateJob = require('./orderPickupUpdate');
  //  const orderPickupStoreUpdateJon = require('./orderPickupStoreUpdate');
  //  const orderShippedUpdateJob = require('./orderShippedUpdate');
  //  const orderCompleteUpdateUpdateJob = require('./orderCompleteUpdate');
  //  const updatePaymentStatusJob = require('./updatePaymentStatus');
  const pendingPayment = require('./pendingPayment');
  const sendWhishlist = require('./sendWishlist');
  const cancelPayment = require('./cancelPayment');
  const expireVoucher = require('./expireVoucher');
  const processUserReferral = require('./processUserReferral');
  const processUserPayment = require('./processUserPayment');
  const processUserLevel = require('./processUserLevel');
  const birthdayVoucherJob = require('./birthdayVoucher');
  const birthdayVoucherNotificationJob = require('./birthdayVoucherNotification');
  const logoutStaff = require('./logoutStaff');

  // tasks.push(...productUpdateJob);
  // tasks.push(...productStockUpdateJob);
  // tasks.push(...orderDeliveryJob);
  // tasks.push(...processOrderJob);
  // tasks.push(...processOrderHTOJob);
  // tasks.push(...orderPickupUpdateJob);
  // tasks.push(...orderPickupStoreUpdateJon);
  // tasks.push(...orderShippedUpdateJob);
  // tasks.push(...orderCompleteUpdateUpdateJob);
  // tasks.push(...updatePaymentStatusJob);
  tasks.push(...pendingPayment);
  tasks.push(...sendWhishlist);
  tasks.push(...cancelPayment);
  tasks.push(...expireVoucher);
  tasks.push(...processUserReferral);
  tasks.push(...processUserPayment);
  tasks.push(...processUserLevel);
  tasks.push(...birthdayVoucherJob);
  tasks.push(...birthdayVoucherNotificationJob);
  tasks.push(...logoutStaff);

  tasks.forEach((task) => {
    task.start();
  });
};

module.exports = cronJobs;
