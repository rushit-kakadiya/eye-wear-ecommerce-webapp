const { Router } = require('express');
const router = Router();

const middleware = require('../../../middleware');
const controller = require('../../../controller');
const response = require('../../../response');
const joiValidation  = require('../../../utilities/joi-validations');
const { genericResponse } = response.common;

const { authProtected, authFilter, authFilterAndUnAuthFilter } = middleware.authChecker;
const cache = middleware.cache;
const catalogueAPIController = controller.catalogue;

router.get('/', authFilterAndUnAuthFilter, joiValidation.catalogue.products, catalogueAPIController.getProducts, genericResponse);
router.get('/filters', authProtected, catalogueAPIController.getFilters, genericResponse);
router.post('/filteredProduct', authFilterAndUnAuthFilter, joiValidation.catalogue.filterProduct, catalogueAPIController.filterProducts, genericResponse);
router.post('/filteredProductCount', authFilterAndUnAuthFilter, joiValidation.catalogue.filterProduct, catalogueAPIController.filterProductsCount, genericResponse);

router.get('/search', authFilterAndUnAuthFilter, joiValidation.catalogue.searchProduct, catalogueAPIController.esTextSearch, genericResponse);
router.get('/esProductSearch', authFilterAndUnAuthFilter, joiValidation.catalogue.searchProduct, catalogueAPIController.esProductSearch, genericResponse);
router.post('/cart', authFilter , joiValidation.catalogue.addCart, catalogueAPIController.addCart, genericResponse);
router.get('/cart', authFilter, catalogueAPIController.getCart, genericResponse);
router.put('/cart', authFilter ,  joiValidation.catalogue.updateCart, catalogueAPIController.updateCart, genericResponse);
router.get('/productDetails', authFilterAndUnAuthFilter, joiValidation.catalogue.productDetail, catalogueAPIController.getProductDetails, genericResponse);
router.delete('/cart', authFilter ,  joiValidation.catalogue.removeCart, catalogueAPIController.removeCart, genericResponse);
router.delete('/cartById', authFilter ,  joiValidation.catalogue.deleteCart, catalogueAPIController.deleteCart, genericResponse);

router.get('/productStockDetails', authFilterAndUnAuthFilter, joiValidation.catalogue.productStockDetails, catalogueAPIController.getProductStockDetails, genericResponse);
router.get('/lenses', authFilterAndUnAuthFilter, joiValidation.catalogue.searchLenses, catalogueAPIController.searchLenses, genericResponse);
router.get('/lenseSKU', authFilterAndUnAuthFilter, joiValidation.catalogue.searchLenses, catalogueAPIController.searchLenseSKU, genericResponse);

router.get('/hto_check', authFilterAndUnAuthFilter, joiValidation.catalogue.htoCheck, catalogueAPIController.htoCheck, genericResponse);
router.get('/hto_slot', authFilterAndUnAuthFilter, joiValidation.catalogue.emptyResource, catalogueAPIController.htoSlot, genericResponse);
// router.post('/save_prescription', authFilterAndUnAuthFilter, joiValidation.catalogue.filterProduct, catalogueAPIController.filterProducts, genericResponse);

router.post('/cart/addon', authFilter , joiValidation.catalogue.addCartAddon, catalogueAPIController.addCartAddon, genericResponse);
router.put('/cart/addon', authFilter , joiValidation.catalogue.updateCartAddon, catalogueAPIController.updateCartAddon, genericResponse);
router.delete('/cart/addon', authFilter , joiValidation.catalogue.removeCartAddon, catalogueAPIController.deleteCartAddon, genericResponse);

router.get('/scan_qr', authFilterAndUnAuthFilter, joiValidation.catalogue.productDetail, catalogueAPIController.getQRProduct, genericResponse);
// router.get('/lense_details', authFilterAndUnAuthFilter, cache.get, joiValidation.catalogue.emptyResource, catalogueAPIController.lenseDetails, cache.set, genericResponse);
router.get('/lense_details', authFilterAndUnAuthFilter, joiValidation.catalogue.emptyResource, catalogueAPIController.lenseDetails, genericResponse);
router.get('/clipons', authFilterAndUnAuthFilter, catalogueAPIController.clipOns, genericResponse);
router.get('/cart/clipons', authFilter, joiValidation.user.userId, catalogueAPIController.cartClipOns, genericResponse);
router.get('/packaging', authFilterAndUnAuthFilter, catalogueAPIController.getPackaging, genericResponse);
router.post('/toppick-cart', authFilter, joiValidation.catalogue.topPickAddResource, catalogueAPIController.addTopPick, genericResponse);
router.put('/cart/packaging', authFilter , joiValidation.catalogue.updateCartPackages, catalogueAPIController.updateCartPackages, genericResponse);
router.get('/influencer', authFilterAndUnAuthFilter, joiValidation.catalogue.emptyResource, catalogueAPIController.influencerList, genericResponse);

router.post('/save-recently-viewed', authFilter, joiValidation.catalogue.skuBodyValidation, catalogueAPIController.saveRecentlyViewed, genericResponse);
router.get('/get-recently-viewed-list', authFilter, joiValidation.catalogue.emptyResource, catalogueAPIController.getRecentlyViewedList, genericResponse);
router.get('/get-recently-viewed-frames', authFilter, joiValidation.catalogue.emptyResource, catalogueAPIController.getRecentlyViewedFrames, genericResponse);

module.exports = () => router;
