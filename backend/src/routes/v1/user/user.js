const { Router } = require('express');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const router = Router();

const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const { authProtected, authFilter, authFilterAndUnAuthFilter } = middleware.authChecker;
const cache = middleware.cache;
const userAPIController = controller.user;

router.get('/config', authProtected, userAPIController.getConfigDetails, genericResponse);
router.post('/register', joiValidation.user.userRegister, userAPIController.register, genericResponse);
router.post('/login', joiValidation.user.userLogin, userAPIController.login, genericResponse);
router.delete('/logout', authFilter, userAPIController.logout, genericResponse);
router.get('/stores', authProtected, joiValidation.user.searchStore, userAPIController.getStores, genericResponse);
router.get('/wishlist', authFilter, userAPIController.getWishlist, genericResponse);
router.post('/wishlist', authFilter, joiValidation.user.addWishlist, userAPIController.addWishlist, genericResponse);
router.delete('/wishlist', authFilter, joiValidation.user.removeWishlist, userAPIController.removeWishlist, genericResponse);

router.post('/cart', authFilter , joiValidation.user.addCart, userAPIController.addCart, genericResponse);
router.get('/cart', authFilter, joiValidation.user.emptyResource, userAPIController.getCart, genericResponse);
router.put('/cart', authFilter ,  joiValidation.user.updateCart, userAPIController.updateCart, genericResponse);
router.delete('/cartById', authFilter ,  joiValidation.user.deleteCart, userAPIController.deleteCart, genericResponse);
router.delete('/clear-cart', authFilter ,  joiValidation.user.emptyResource, userAPIController.clearCart, genericResponse);

router.post('/cart/addon', authFilter , joiValidation.user.addCartAddon, userAPIController.addCartAddon, genericResponse);
router.put('/cart/addon', authFilter , joiValidation.user.updateCartAddon, userAPIController.updateCartAddon, genericResponse);
router.delete('/cart/addon', authFilter , joiValidation.user.removeCartAddon, userAPIController.deleteCartAddon, genericResponse);

router.post('/otp/send', authProtected, joiValidation.user.userOtp, userAPIController.userOtp, genericResponse);
router.post('/otp/verify', authProtected, joiValidation.user.otpVerify, userAPIController.userOtpVerify, genericResponse);
router.post('/payment', authFilter, joiValidation.user.userPayment, userAPIController.userPayment, genericResponse);
router.post('/payment/capture', authFilter, joiValidation.user.captureUserPayment, userAPIController.captureUserPayment, genericResponse);
router.post('/payment/refund', authFilter, joiValidation.user.refundUserPayment, userAPIController.refundUserPayment, genericResponse);
router.post('/auth_reversal', authFilter, joiValidation.user.authReversal, userAPIController.authReversal, genericResponse);
router.post('/cardless-payment', authFilter, joiValidation.user.cardlessUserPayment, userAPIController.cardLessPayment, genericResponse);
router.post('/va-payment', authFilter, joiValidation.user.userVAPayment, userAPIController.userVAPayment, genericResponse);
router.post('/va-disbursement', authFilter, joiValidation.user.vaDisbursement, userAPIController.createVADisbursement, genericResponse);
router.post('/checkout', authFilter, joiValidation.user.orderCheckout, userAPIController.checkout, genericResponse);
router.post('/checkout_hto', authFilter, joiValidation.user.htoCheckout, userAPIController.htoCheckout, genericResponse);
router.post('/createOrder', authFilter, userAPIController.createOrder, genericResponse);
router.post('/address', authFilter, joiValidation.user.userAddress, userAPIController.userAddress, genericResponse);
router.put('/address', authFilter, joiValidation.user.userAddress, userAPIController.userAddressUpdate, genericResponse);
router.get('/address', authFilter, userAPIController.getUserAddress, genericResponse);
router.delete('/address/:id', authFilter, joiValidation.user.removeAddress, userAPIController.removeAddress, genericResponse);
router.get('/notifications', authFilter, joiValidation.user.notification, userAPIController.getNotifications, genericResponse);
router.get('/profile', authFilter, joiValidation.user.emptyResource, userAPIController.getUserProfile, genericResponse);
router.put('/profile', authFilter, joiValidation.user.userProfile, userAPIController.userProfile, genericResponse);
router.get('/order_list', authFilter, joiValidation.user.orderListResource, userAPIController.getUserOrderList, genericResponse);
router.get('/order_details', authFilter, joiValidation.user.orderDetailsResource, userAPIController.getOrderDetails, genericResponse);
router.put('/settings', authFilter, joiValidation.user.userSettings, userAPIController.userSettings, genericResponse);
router.post('/hto_reschedule', authFilter, joiValidation.user.rescheduleHTO, userAPIController.rescheduleHTOOrder, genericResponse);
router.post('/cancel_order', authFilter, joiValidation.user.cancelOrder, userAPIController.cancelOrder, genericResponse);
router.post('/file-upload', authFilter, multipartMiddleware, userAPIController.fileUpload, genericResponse);
router.post('/saved-cards', authFilter, joiValidation.user.savedCardData, userAPIController.savedCardData, genericResponse);
router.get('/saved-cards', authFilter, userAPIController.getSavedCard, genericResponse);
router.put('/saved-cards', authFilter, joiValidation.user.updateCardData, userAPIController.updateSavedCard, genericResponse);
router.delete('/saved-cards/:id', authFilter, joiValidation.user.deleteCardData, userAPIController.deleteSavedCard, genericResponse);
router.post('/return-order', authFilter, joiValidation.user.cancelOrder, userAPIController.returnOrder, genericResponse);
router.get('/order-history', authFilter, joiValidation.user.orderNo, userAPIController.orderHistory, genericResponse);
router.get('/prescriptions', authFilter, userAPIController.getPrescriptions, genericResponse);
router.put('/prescription', authFilter, joiValidation.user.updatePrescription, userAPIController.updatePrescription, genericResponse);
router.post('/prescription', authFilter, joiValidation.user.addPrescription, userAPIController.addPrescription, genericResponse);
router.post('/send/notification', joiValidation.user.sendNotification, userAPIController.sendNotification, genericResponse);
router.put('/prescription-to-cart', authFilter, joiValidation.user.addPrescriptionToCart, userAPIController.addPrescriptionToCart, genericResponse);
router.get('/voucher-details', authFilter, joiValidation.user.getVoucherDetails, userAPIController.getVoucherDetails, genericResponse);

router.delete('/prescription/:id', authFilter, joiValidation.user.deletePrescription, userAPIController.deletePrescription, genericResponse);

router.post('/book-hto', authFilter, joiValidation.user.htoBook, userAPIController.htoBook, genericResponse);
router.post('/reschedule-hto', authFilter, joiValidation.user.htoReschedule, userAPIController.htoReschedule, genericResponse);
router.post('/cancel-hto', authFilter, joiValidation.user.htoCancel, userAPIController.htoCancel, genericResponse);
router.get('/hto-appointment-list', authFilter, joiValidation.user.htoAppointmentList, userAPIController.htoAppointmentList, genericResponse);
router.get('/appointment-detail', authFilter, joiValidation.user.htoDetail, userAPIController.appointmentDetail, genericResponse);

router.post('/submit-referral-code', authFilter, joiValidation.user.submitReferralCode, userAPIController.submitReferralCode, genericResponse);
router.get('/referral-list', authFilter, joiValidation.user.emptyResource, userAPIController.referralList, genericResponse);
router.get('/voucher-list', authFilter, joiValidation.user.emptyResource, userAPIController.voucherList, genericResponse);
router.get('/user-voucher-list', authFilter, joiValidation.user.emptyResource, userAPIController.userVoucherList, genericResponse);


router.post('/user-checkout', authFilter, joiValidation.user.userCheckout, userAPIController.userCheckout, genericResponse);
router.post('/card-payment', authFilter, joiValidation.user.userPayment, userAPIController.cardPayment, genericResponse);


router.get('/saturday/points', authFilter, userAPIController.saturdayPoints, genericResponse);
router.get('/saturday/points/rewards', authFilter, userAPIController.saturdayPointsRewards, genericResponse);
router.get('/tier/info', authFilter, userAPIController.tierInfo, genericResponse);


module.exports = () => router;
