/*
 * @file: search.js
 * @description: It Contain function layer for search field validations methods.
*/
const Joi = require('@hapi/joi');
const { createValidator } = require('express-joi-validation');
const validator = createValidator({ passError: true });
const config = require('config');



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
        .default(3)
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

const emptySchema = Joi.object({});

module.exports = {
    searchProduct: validator.query(textSearchSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    emptyResource: validator.query(emptySchema, {
        joi: { convert: true, allowUnknown: false }
    })
};