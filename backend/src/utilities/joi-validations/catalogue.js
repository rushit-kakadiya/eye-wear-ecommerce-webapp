/*
 * @file: catalogue.js
 * @description: It Contain function layer for catalogue field validations methods.
*/
const Joi = require('@hapi/joi');
const { createValidator } = require('express-joi-validation');
const validator = createValidator({ passError: true });
const config = require('config');

const productSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Product id'),
    store_id: Joi.number()
        .optional()
        .default(config.turbolyEcomOrder.storeID)
        .label('store id'),
    product_category: Joi.number()
        .required()
        .default(1)
        .valid(1, 2)
        .label('Product category ')
});

const skuSchema = Joi.object({
    sku_code: Joi.string()
        .trim()
        .required()
        .label('Product Sku'),

    product_category: Joi.number()
        .optional()
        .default(1)
        .valid(1, 2)
        .label('Product category '),
    sku_category: Joi.number()
        .optional()
        .default('FRAME')
        .valid('FRAME', 'LENS', 'CONTACTS_LENS')
        .label('SKU category ')
});

const productStockDetailsSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Product id'),
    product_category: Joi.number()
        .default(1)
        .valid(1, 2)
        .label('Product category '),
    lat: Joi.number()
        .label('Latitude'),
    long: Joi.number()
        .label('Longitude'),
});

const catalogueSchema = Joi.object({
    page: Joi.number()
        .required()
        .default(1)
        .label('page'),
    store_id: Joi.number()
        .optional()
        .default(config.turbolyEcomOrder.storeID)
        .label('store id'),
    product_category: Joi.number()
        .required()
        .default(1)
        .valid(1, 2)
        .label('Product category '),
    is_hto: Joi.boolean()
    .required()
    .label('HTO')
});

const frameFilterSchema = Joi.object({
    fit: Joi.array().items(Joi.string().trim())
        .required()
        .label('Fit'),
    frame_shape: Joi.array().items(Joi.string().trim())
        .required()
        .label('Frame Shape'),
    material: Joi.array().items(Joi.string().trim())
        .required()
        .label('Frame Material'),
    color: Joi.array().items(Joi.string().trim())
        .required()
        .label('Frame Color'),
    face_shape: Joi.array().items(Joi.string().trim())
        .required()
        .label('Face Shape'),
    gender: Joi.array().items(Joi.string().trim())
        .required()
        .label('Gender: '),
    prices: Joi.array().items(Joi.string().trim())
        .optional()
        .default([])
        .label('Prices: '),
    price: Joi.object().keys({
        min_price: Joi.number()
            .default(0)
            .optional()
            .label('Mininum amount: '),
        max_price: Joi.number()
            .default(100000000)
            .optional()
            .label('Maximum amount: '),
    }).optional().default({}).label('Price'),
    sort_by: Joi.object().keys({
        key: Joi.string()
            .required()
            .trim()
            .valid('bestseller', 'new_arrival', 'frame_name', 'price', 'recommended', 'rank')
            .label('sort by key: '),
        order: Joi.string()
        .required()
        .trim()
        .valid('asc', 'desc')
        .label('Order by: '),
    }).required().label('Sort: '),
    store_id: Joi.number()
        .optional()
        .default(config.turbolyEcomOrder.storeID)
        .label('store id'),
    is_hto: Joi.boolean()
        .optional()
        .default(false)
        .label('HTO '),
    product_category: Joi.number()
        .required()
        .default(1)
        .valid(1, 2)
        .label('Product category '),
    page: Joi.number()
        .optional()
        .default(1)
        .label('page ')
});

const textSearchSchema = Joi.object({
    text: Joi.string()
        .trim()
        .required()
        .label('Product search text:'),
    store_id: Joi.string()
        .trim()
        .optional(config.turbolyEcomOrder.storeID)
        .label('Store ID'),
    product_category: Joi.number()
        .optional()
        .default(1)
        .valid(1, 2, 3)
        .label('Product category '),
    from: Joi.number()
        .optional()
        .allow('')
        .label('From: '),
    size: Joi.number()
        .optional()
        .allow('')
        .label('size: '),
});

const addCartSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .optional()
        .label('User Id'),
    prescription_id: Joi.string()
        .trim()
        .optional()
        .allow(null,'')
        .label('Prescription Id'),
    product_id: Joi.string()
        .trim()
        .required()
        .label('Product id'),
    sku_code: Joi.string()
        .trim()
        .required()
        .label('SKU Code'),
    item_count: Joi.number()
        .required()
        .label('Item Count'),
    type: Joi.number()
        .optional()
        .valid(1,2)
        .label('Type'),
    product_category: Joi.number()
        .optional()
        .valid(1,2,3)
        .label('Product Category')
});

const updateCartSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Cart id'),
    prescription_id: Joi.string()
        .trim()
        .optional()
        .allow(null,'')
        .label('Prescription Id'),
    item_count: Joi.number()
        .optional()
        .label('Item Count'),
    type: Joi.number()
        .optional()
        .valid(1,2)
        .label('Type'),
    product_category: Joi.number()
        .optional()
        .valid(1,2,3)
        .label('Product Category'),
    product_id: Joi.string()
        .trim()
        .optional()
        .label('Product id'),
    sku_code: Joi.string()
        .trim()
        .optional()
        .label('Product sku'),
    is_warranty: Joi.number()
        .optional()
        .valid(0,1,2)
        .default(0)
        .label('Cart Warranty'),
});

const removeCartSchema = Joi.array().items(Joi.object().keys({
    sku_code: Joi.string()
        .trim()
        .required()
        .label('Product sku'),
    product_category: Joi.number()
        .required()
        .valid(1,2,3)
        .label('Product Category'),
    type: Joi.number()
        .required()
        .valid(1,2,3)
        .label('Type Category')
}));

const removeCartAddonSchema = Joi.object({
    id: Joi.array()
        .min(1)
        .required()
        .label('Addon id'),
    user_id: Joi.string()
        .trim()
        .optional()
        .label('User id')
});


const deleteCartSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Cart id'),
    user_id: Joi.string()
        .trim()
        .optional()
        .label('User id')
});


const addCartAddonSchema = Joi.object({
    cart_id: Joi.string()
        .trim()
        .required()
        .label('Cart id'),
    addon_product_id: Joi.string()
        .trim()
        .required()
        .label('Addon Product id'),
    addon_product_sku: Joi.string()
        .trim()
        .required()
        .label('Addon Product sku'),
    addon_item_count: Joi.number()
        .required()
        .label('Item Count'),
    userd_id: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('User Id'),
    type: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Lens Type')
});

const addMultiCartAddonSchema = Joi.object({
    cart_id: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Cart id'),
    addon_product_id: Joi.array()
        .min(1)
        .required()
        .label('Addon Product id'),
    addon_product_sku: Joi.array()
        .min(1)
        .required()
        .label('Addon Product sku'),
    addon_item_count: Joi.number()
        .required()
        .label('Item Count'),   
    user_id: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('User Id'),
    type: Joi.array()
        .min(1)
        .optional()
        .allow(null, '')
        .label('Lens Type'),
    current_addon_product_sku: Joi.array()
        .min(1)
        .optional()
        .label('Current Addon sku'),
    is_sunwear: Joi.boolean()
        .optional()
        .allow(false, true)
        .label('Is Sunwear Lens'),
    category: Joi.number()
        .optional()
        .allow(1,2,3,4) // 1 => lens, 2 => clipon, 3 => contact-lens, 4=> others product
        .default(1)
        .label('Addon Category')    
});

const updateCartAddonSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .optional()
        .label('User id'),
    cart_id: Joi.string()
        .trim()
        .optional()
        .label('Cart id'),
    current_addon_product_sku: Joi.string()
        .trim()
        .required()
        .label('Current add on product sku'),
    addon_product_id: Joi.string()
        .trim()
        .required()
        .label('Product id'),
    addon_product_sku: Joi.string()
        .trim()
        .required()
        .label('Product Sku'),
    addon_item_count: Joi.number()
        .optional()
        .label('Item Count')
});

const lensesFetchSchema = Joi.object({
    category: Joi.string()
        .trim()
        .required()
        .label('Category'),
    id: Joi.string()
    .trim()
    .required()
    .max(36)
    .label('Category'),
    store_id: Joi.number()
        .optional()
        .default(config.turbolyEcomOrder.storeID)
        .label('store id'),
});

const htoCheckSchema = Joi.object({
    zipcode: Joi.string()
        .optional()
        .label('Province'),
    lat: Joi.number()
        .optional()
        .label('Latitude'),
    long: Joi.number()
        .optional()
        .allow('')
        .label('Longitude')
});

const htoSlotSchema = Joi.object({
    start_date: Joi.date()
        .required()
        .label('Start Date')
});

const topPickAddSchema = Joi.object({
    store_id: Joi.number()
        .optional()
        .default(config.turbolyEcomOrder.storeID)
        .label('store id'),
    product_category: Joi.number()
        .required()
        .default(1)
        .valid(1, 2)
        .label('Product category ')
});

const emptySchema = Joi.object({});

const updateCartPackagesSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Cart id'),
    sku: Joi.string()
        .trim()
        .required()
        .label('Product SKU '),
    type: Joi.string()
        .trim()
        .optional()
        .allow('frame','addon', 'clipon')
        .label('Type')
});

module.exports = {
    products: validator.query(catalogueSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    skuBodyValidation: validator.body(skuSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    skuQueryValidation: validator.query(skuSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    filterProduct: validator.body(frameFilterSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addProduct: validator.body(productSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    searchProduct: validator.query(textSearchSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addCart: validator.body(addCartSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateCart: validator.body(updateCartSchema, {
            joi: { convert: true, allowUnknown: false }
    }),
    productDetail: validator.query(productSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    productStockDetails: validator.query(productStockDetailsSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    removeCart: validator.body(removeCartSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    removeCartAddon: validator.body(removeCartAddonSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    deleteCart: validator.body(deleteCartSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addCartAddon: validator.body(addCartAddonSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addMultiAddon: validator.body(addMultiCartAddonSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateCartAddon: validator.body(updateCartAddonSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    searchLenses: validator.query(lensesFetchSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoCheck: validator.query(htoCheckSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    topPickAddResource: validator.body(topPickAddSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    emptyResource: validator.query(emptySchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateCartPackages: validator.body(updateCartPackagesSchema, {
        joi: { convert: true, allowUnknown: false }
    })
};