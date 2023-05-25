/*
 * @file: page.js
 * @description: It Contain function layer for page field validations methods.
*/
const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate);
const { createValidator } = require('express-joi-validation');
const validator = createValidator({ passError: true });

const getProductsSchema = Joi.object({
    page: Joi.number()
        .required()
        .label('Page No'),
    type: Joi.string()
        .trim()
        .optional()
        .default('frame')
        .allow('frame', 'clip-on', 'lens', 'contact-lens', 'others')
        .label('Product Type'),
    search: Joi.string()
        .trim()
        .optional()
        .allow('')
        .default('')
        .label('Search')   
});

const addLensesSchema = Joi.object({
    sku_code: Joi.string()
        .trim()
        .required()
        .label('SKU Code'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    brand: Joi.string()
        .trim()
        .required()
        .label('Brand'),  
    retail_price: Joi.number()
        .required()
        .label('Price'),
    lense_type_name: Joi.string()
        .trim()
        .required()
        .label('Lens Type Name'), 
    prescription_name: Joi.string()
        .trim()
        .required()
        .label('Prescription Name'),
    filter_type_name: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Filter Type Name'),  
    index_value: Joi.string()
        .trim()
        .required()
        .label('Index Value'),
    category_name: Joi.string()
        .trim()
        .required()
        .label('Category Name') 
});

const getProductDetailSchema = Joi.object({
    sku: Joi.string()
        .required()
        .trim()
        .label('SKU'),
    type: Joi.string()
        .required()
        .trim()
        .label('Type')    
});

const manageProductSchema = Joi.object({
    sku: Joi.string()
        .required()
        .trim()
        .label('SKU Code'),
    type: Joi.string()
        .required()
        .trim()
        .label('Product Type'),  
    status: Joi.number()
        .required()
        .label('Status')   
});

const addClipOnSchema = Joi.object({
    sku_code: Joi.string()
        .trim()
        .required()
        .label('SKU Code'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    retail_price: Joi.number()
        .required()
        .label('Price'),
    color: Joi.string()
        .trim()
        .required()
        .label('Color'),
    size: Joi.string()
        .trim()
        .required()
        .label('Size'),
    frame_sku: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Frame') 
});


const addOthersProuctSchema = Joi.object({
    sku: Joi.string()
        .trim()
        .required()
        .label('SKU Code'),
    price: Joi.number()
        .required()
        .label('Price'),
    name: Joi.string()
        .trim()
        .label('Name'),
    description: Joi.string()
        .trim()
        .required()
        .label('Color')
});

const addContactLensesSchema = Joi.object({
    sku_code: Joi.string()
        .trim()
        .required()
        .label('SKU Code'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    brand: Joi.string()
        .trim()
        .required()
        .label('Brand'),  
    retail_price: Joi.number()
        .required()
        .label('Price'),
    description: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Description')
});

const showFrameOnAppSchema = Joi.object({
    sku_code: Joi.string()
        .trim()
        .required()
        .label('SKU Code'),
    category: Joi.string()
        .trim()
        .required()
        .valid('optical', 'sunwear')
        .label('Category'),
    status: Joi.boolean()
        .required()
        .label('Category Status'),
});

module.exports = {
    getProductsList: validator.query(getProductsSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addLenses: validator.body(addLensesSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    getProductDetail: validator.query(getProductDetailSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    manageProduct: validator.body(manageProductSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addClipOn: validator.body(addClipOnSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addOthersProuct: validator.body(addOthersProuctSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addContactLenses: validator.body(addContactLensesSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    showFrameOnApp: validator.body(showFrameOnAppSchema, {
        joi: { convert: true, allowUnknown: false }
    })
};