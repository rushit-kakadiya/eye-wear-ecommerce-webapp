const { Router } = require('express');
const router = Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const { authFilter, authFilterAndUnAuthFilter, aclFilter } = middleware.authChecker;
const adminAPIController = controller.admin;

router.post('/login', joiValidation.admin.login, adminAPIController.login, genericResponse);
router.get('/order', authFilter, aclFilter, joiValidation.admin.getOrders, adminAPIController.getOrders, genericResponse);
router.post('/user', authFilter, aclFilter, joiValidation.admin.addUser, adminAPIController.addUser, genericResponse);
router.put('/user', authFilter, aclFilter, joiValidation.admin.updateUser, adminAPIController.updateUser, genericResponse);
router.get('/user', authFilter, aclFilter, joiValidation.admin.getUsers, adminAPIController.getUser, genericResponse);
router.get('/user-search', authFilter, aclFilter, adminAPIController.setElasticUserSearch, genericResponse);
router.get('/user/search', authFilter, aclFilter, joiValidation.admin.searchUser, adminAPIController.searchUser, genericResponse);
router.get('/user/address', authFilter, aclFilter, joiValidation.admin.userData, adminAPIController.getUserAddress, genericResponse);
router.post('/user/address', authFilter, aclFilter, joiValidation.user.userAddress, adminAPIController.addUserAddress, genericResponse);
router.put('/user/address', authFilter, aclFilter, joiValidation.user.userAddress, adminAPIController.updateUserAddress, genericResponse);
router.post('/user/cart', authFilter, aclFilter, joiValidation.catalogue.addCart, adminAPIController.addToCart, genericResponse);
router.get('/user/cart', authFilter, aclFilter, joiValidation.user.userId, adminAPIController.getCart, genericResponse);
router.delete('/user/cart', authFilter, aclFilter, joiValidation.catalogue.deleteCart, adminAPIController.removeCart, genericResponse);
router.post('/order', authFilter, aclFilter, joiValidation.admin.draftOrder, adminAPIController.addDraftOrder, genericResponse);
router.get('/lenses', authFilter, adminAPIController.getLenses, genericResponse);
router.post('/user/cart/addon', authFilter, aclFilter, joiValidation.catalogue.addMultiAddon, adminAPIController.addCartAddon, genericResponse);
router.put('/user/cart/addon', authFilter, aclFilter, joiValidation.catalogue.addMultiAddon, adminAPIController.updateCartAddon, genericResponse);
router.get('/user/cart/addon', authFilter, aclFilter, joiValidation.user.userId, adminAPIController.getLenseOnly, genericResponse);
router.post('/user/prescription', authFilter, aclFilter, joiValidation.user.addPrescription, adminAPIController.addPrescription, genericResponse);
router.get('/user/prescription', authFilter, aclFilter, joiValidation.user.userId, adminAPIController.getPrescriptions, genericResponse);
router.put('/user/prescription', authFilter, aclFilter, joiValidation.user.updatePrescription, adminAPIController.updatePrescription, genericResponse);
router.post('/user/checkout', authFilter, aclFilter, joiValidation.admin.orderCheckout, adminAPIController.checkout, genericResponse);
router.delete('/user/cart/addon', authFilter , aclFilter, joiValidation.catalogue.removeCartAddon, adminAPIController.deleteCartAddon, genericResponse);
router.post('/user/payment', authFilter , aclFilter, joiValidation.admin.inStorePayment, adminAPIController.inStorePayment, genericResponse);
router.get('/banks', adminAPIController.bankList, genericResponse);
router.get('/order-detail', authFilter, aclFilter, joiValidation.user.orderDetailsResource , adminAPIController.orderDetails, genericResponse);
router.get('/order-pdf', authFilter, aclFilter, joiValidation.user.orderNo , adminAPIController.downloadPDF, genericResponse);
router.put('/user/cart/warranty', authFilter, aclFilter, joiValidation.catalogue.updateCart , adminAPIController.itemWarranty, genericResponse);
router.put('/user/cart/discount', authFilter, aclFilter, joiValidation.admin.updateDiscount , adminAPIController.applyVoucher, genericResponse);
router.put('/order/cancel', authFilter, aclFilter, joiValidation.admin.cancelOrder , adminAPIController.cancelOrder, genericResponse);
router.get('/dashboard', authFilter, aclFilter, joiValidation.admin.dashboardData, adminAPIController.dashboardData, genericResponse);
router.get('/customer-detail', authFilter, aclFilter, joiValidation.admin.customerDetail, adminAPIController.customerDetail, genericResponse);
router.delete('/user/cart/discount', authFilter, aclFilter, joiValidation.admin.removeDiscount , adminAPIController.removeDiscount, genericResponse);
router.put('/process-order', authFilter, aclFilter, joiValidation.admin.processOrder, adminAPIController.processOrder, genericResponse);
router.put('/update-optician-staff', authFilter, aclFilter, joiValidation.admin.updateOrderStaffOptician, adminAPIController.updateOrderStaffOptician, genericResponse);
router.post('/wishlist', authFilter, joiValidation.user.addWishlist, adminAPIController.addWishlist, genericResponse);
router.get('/export/:type', authFilter, aclFilter, joiValidation.admin.exportData, adminAPIController.exportData, genericResponse);
router.get('/hto/order-detail', authFilter, aclFilter, joiValidation.admin.orderHtoDetail, adminAPIController.getOrderHtoDetail, genericResponse);
router.post('/hto/appointment', authFilter, aclFilter, joiValidation.admin.htoAppointmentBook, adminAPIController.htoAppointmentBook, genericResponse);
router.get('/hto/slots', authFilter, aclFilter, joiValidation.admin.userData, adminAPIController.htoSlots, genericResponse);
router.get('/optician', authFilter, adminAPIController.getOptician, genericResponse);
router.put('/hto-detail', authFilter, aclFilter, joiValidation.admin.updateHtoDetail, adminAPIController.updateHtoDetail, genericResponse);
router.get('/staff', authFilter, adminAPIController.getStaff, genericResponse);
router.put('/stock-store', authFilter, joiValidation.admin.updateStockStoreInOrder, adminAPIController.updateStockStoreInOrder, genericResponse);
router.get('/optician/calendar', authFilter, joiValidation.admin.opticianCalendar, adminAPIController.getOpticianCalendar, genericResponse);
router.put('/change-lens', authFilter, joiValidation.admin.changeLens, adminAPIController.changeLens, genericResponse);

router.get('/members/performance', adminAPIController.getMembersPerformance, genericResponse);
router.get('/member/orders', adminAPIController.getMemberOrders, genericResponse);
router.get('/member/summary', adminAPIController.getMemberSummary, genericResponse);
router.get('/optician/appoitments', adminAPIController.getOpticianAppointments, genericResponse);

router.get('/search', authFilterAndUnAuthFilter, joiValidation.catalogue.searchProduct, adminAPIController.esTextSearch, genericResponse);
router.put('/order/status', authFilter, aclFilter, joiValidation.admin.processOrder, adminAPIController.updateOrderStatus, genericResponse);
router.get('/discount-categories', authFilterAndUnAuthFilter, adminAPIController.getDiscountCategories, genericResponse);
router.get('/product-sku', authFilter, joiValidation.admin.productSku, adminAPIController.getProductSku, genericResponse);
router.post('/voucher', authFilter, aclFilter, joiValidation.admin.addVoucher, adminAPIController.addVoucher, genericResponse);
router.post('/file-upload', authFilter, multipartMiddleware, adminAPIController.fileUpload, genericResponse);
router.get('/voucher', authFilter, aclFilter, joiValidation.admin.getVoucher, adminAPIController.getVoucher, genericResponse);
router.get('/voucher-detail', authFilter, aclFilter, joiValidation.admin.getVoucherDetail, adminAPIController.getVoucherDetail, genericResponse);
router.put('/voucher', authFilter, aclFilter, joiValidation.admin.updateVoucher, adminAPIController.updateVoucher, genericResponse);
router.delete('/voucher/:id', authFilter, aclFilter, joiValidation.admin.deleteRecord, adminAPIController.deleteVoucher, genericResponse);
router.put('/apply-voucher', authFilter, aclFilter, joiValidation.admin.applyVoucher, adminAPIController.applyDiscount, genericResponse);
router.get('/contact-lens', authFilter, adminAPIController.getContactLens, genericResponse);
router.post('/elastic-data', authFilter, joiValidation.admin.elasticType, adminAPIController.setElasticData, genericResponse);
router.delete('/order/:id', authFilter, aclFilter, joiValidation.admin.deleteRecord, adminAPIController.deleteOrder, genericResponse);
router.get('/others-product', authFilter, adminAPIController.getOthersProduct, genericResponse);
router.put('/order-delivery', authFilter, aclFilter, joiValidation.admin.orderDelivery, adminAPIController.updateOrderDelivery, genericResponse);
/****** Admin Management ******/
router.get('/roles', authFilterAndUnAuthFilter, adminAPIController.getRoles, genericResponse);
router.get('/admin-management', authFilter, aclFilter, joiValidation.admin.getUsers, adminAPIController.getAdminUsers, genericResponse);
router.put('/admin-management/password', authFilter, aclFilter, joiValidation.admin.password, adminAPIController.changeAdminUserPassword, genericResponse);
router.post('/admin-management', authFilter, aclFilter, joiValidation.admin.addAdminUser, adminAPIController.addAdminUser, genericResponse);
router.put('/admin-management', authFilter, aclFilter, joiValidation.admin.updateAdminUser, adminAPIController.updateAdminUser, genericResponse);
router.put('/admin-management/status', authFilter, aclFilter, joiValidation.admin.updateAdminUserStatus, adminAPIController.updateAdminUserStatus, genericResponse);

router.put('/account/reset-password', authFilter, joiValidation.admin.resetPassword, adminAPIController.resetPassword, genericResponse);
router.put('/account/reset-timezone', authFilter, joiValidation.admin.resetTimezone, adminAPIController.resetTimezone, genericResponse);

/****** Store Management ******/
router.get('/store', authFilterAndUnAuthFilter, joiValidation.admin.getStores, adminAPIController.getStores, genericResponse);
router.get('/store-details', authFilterAndUnAuthFilter, adminAPIController.storeDetail, genericResponse);
router.post('/store', authFilter, aclFilter, joiValidation.admin.addStore, adminAPIController.addStore, genericResponse);
router.put('/store', authFilter, aclFilter, joiValidation.admin.updateStore, adminAPIController.updateStore, genericResponse);
router.put('/store/activity', authFilter, aclFilter, joiValidation.admin.updateStoreActivity, adminAPIController.storeActivity, genericResponse);
router.post('/store/images', authFilter, multipartMiddleware,  adminAPIController.storeImages, genericResponse);


/****** Product Management ******/
router.get('/frame/names', authFilterAndUnAuthFilter, adminAPIController.getFrameNames, genericResponse);
router.get('/frame-name/details', authFilterAndUnAuthFilter, adminAPIController.frameNameDetails, genericResponse);
router.post('/frame/name', authFilter, aclFilter, joiValidation.admin.addFrameName, adminAPIController.addFrameName, genericResponse);
router.put('/frame/name', authFilter, aclFilter, joiValidation.admin.addFrameName, adminAPIController.updateFrameName, genericResponse);
router.put('/frame-name/activity', authFilter, aclFilter, joiValidation.admin.updateFrameNameActivity, adminAPIController.updateFrameNameActivity, genericResponse);

router.get('/frame/colors',  authFilterAndUnAuthFilter, adminAPIController.getFrameColors, genericResponse);
router.get('/frame-color/details', authFilterAndUnAuthFilter, adminAPIController.frameColorDetails, genericResponse);
router.post('/frame/color', authFilter, aclFilter, joiValidation.admin.addFrameColor, adminAPIController.addFrameColor, genericResponse);
router.put('/frame/color', authFilter, aclFilter, joiValidation.admin.addFrameColor, adminAPIController.updateFrameColor, genericResponse);
router.put('/frame-color/activity', authFilter, aclFilter, joiValidation.admin.updateFrameColorActivity, adminAPIController.updateFrameColorActivity, genericResponse);
router.post('/frame-color/images', authFilter, multipartMiddleware, adminAPIController.frameColorImages, genericResponse);

router.get('/products-list', authFilter, aclFilter, joiValidation.products.getProductsList, adminAPIController.getProductsList, genericResponse);

/***** Employee Management ******/
router.get('/employee', authFilter, aclFilter, joiValidation.admin.getUsers, adminAPIController.getEmployee, genericResponse);
router.post('/employee', authFilter, aclFilter, joiValidation.admin.addEmployee, adminAPIController.addEmployee, genericResponse);
router.put('/employee', authFilter, aclFilter, joiValidation.admin.updateEmployee, adminAPIController.updateEmployee, genericResponse);
router.delete('/employee/:id', authFilter, aclFilter, joiValidation.admin.deleteRecord, adminAPIController.deleteEmployee, genericResponse);

router.get('/product/detail', authFilter, aclFilter, joiValidation.products.getProductDetail, adminAPIController.getProductDetail, genericResponse);
router.put('/manage/product', authFilter, aclFilter, joiValidation.products.manageProduct, adminAPIController.manageProduct, genericResponse);

router.post('/lenses', authFilter, aclFilter, joiValidation.products.addLenses, adminAPIController.addLenses, genericResponse);
router.put('/lenses', authFilter, aclFilter, joiValidation.products.addLenses, adminAPIController.EditLenses, genericResponse);

router.post('/clip-on', authFilter, aclFilter, joiValidation.products.addClipOn, adminAPIController.addClipOn, genericResponse);
router.put('/clip-on', authFilter, aclFilter, joiValidation.products.addClipOn, adminAPIController.editClipOn, genericResponse);

router.post('/others', authFilter, aclFilter, joiValidation.products.addOthersProuct, adminAPIController.addOthersProuct, genericResponse);
router.put('/others', authFilter, aclFilter, joiValidation.products.addOthersProuct, adminAPIController.editOthersProuct, genericResponse);

router.get('/frame-size/availability', authFilterAndUnAuthFilter, joiValidation.admin.frameSizeAvialability, adminAPIController.frameSizeAvialability, genericResponse);
router.post('/frame', authFilterAndUnAuthFilter, joiValidation.admin.addFrameSku, adminAPIController.addFrameSku, genericResponse);
router.put('/frame', authFilterAndUnAuthFilter, joiValidation.admin.updateFrameSku, adminAPIController.updateFrameSku, genericResponse);
router.get('/frame', authFilter, aclFilter,  adminAPIController.viewFrameSku, genericResponse);
router.get('/frame/gallery', authFilter, aclFilter,  adminAPIController.viewFrameGallery, genericResponse);
router.get('/frame/variants', authFilter, aclFilter,  adminAPIController.viewFrameVariants, genericResponse);
router.put('/frame-image', authFilter, aclFilter, joiValidation.admin.setFrameImages, adminAPIController.getEmployee, genericResponse);


router.post('/contact-lens', authFilter, aclFilter, joiValidation.products.addContactLenses, adminAPIController.addContactLens, genericResponse);
router.put('/contact-lens', authFilter, aclFilter, joiValidation.products.addContactLenses, adminAPIController.EditContactLens, genericResponse);
router.post('/redeem-coffee', authFilter, joiValidation.admin.redeemCoffee, adminAPIController.redeemCoffeeInStore, genericResponse);
router.post('/lens-upload', authFilter, aclFilter, multipartMiddleware, adminAPIController.lensUpload, genericResponse);
router.put('/show-frame-on-app', authFilter, aclFilter, joiValidation.products.showFrameOnApp, adminAPIController.showFrameOnApp, genericResponse);
router.post('/xendit-invoice', authFilter, joiValidation.xendit.xenditInvoice, adminAPIController.createInvoice, genericResponse);

module.exports = () => router;