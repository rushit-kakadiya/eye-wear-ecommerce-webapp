/*
 * @file: page.js
 * @description: It Contain function layer for page field validations methods.
*/
const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate);
const { createValidator } = require('express-joi-validation');
const validator = createValidator({ passError: true });

const pageSchema = Joi.object({
    title: Joi.string() 
        .trim()
        .required()
        .label('Pagr Title'),
    contact_us: Joi.any()
        .required()
        .label('Contact Us'),
    content: Joi.any()
        .required()
        .label('Content'),
    type: Joi.string() 
        .trim()
        .required()
        .allow('faq')
        .label('Type')
});

const getPageSchema = Joi.object({
    type: Joi.string() 
        .trim()
        .required()
        .allow('faq')
        .label('Type')
});

const holidaysSchema = Joi.object({
    year: Joi.string() 
        .trim()
        .required()
        .label('Year'),
    dates: Joi.any() 
        .required()
        .label('Dates List')
});

module.exports = {
    addPage: validator.body(pageSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    getPage: validator.params(getPageSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    holidays:  validator.body(holidaysSchema, {
        joi: { convert: true, allowUnknown: false }
    })
};