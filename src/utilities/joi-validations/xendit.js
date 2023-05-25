/*
 * @file: xendit.js
 * @description: It Contain function layer for admin portal field validations for xendit methods.
*/
const Joi = require('@hapi/joi');
const { createValidator } = require('express-joi-validation');
const regex = require('../regex');
const validator = createValidator({ passError: true });
const config = require('config');

const xenditInvoiceSchema = Joi.object({
    order_no: Joi.string()
        .trim()
        .required()
        .label('Order No'),
    amount: Joi.number()
        .required()
        .label('Amount'),
    payment_category:  Joi.number()
        .optional()
        .default(3)
        .label('Amount'), 
    created_by_staff: Joi.string().trim().optional().allow('', null).label('Created by staff'),
    optician: Joi.string().trim().optional().allow('', null).label('Optician'),   
    notes: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Notes'),
    payment_type: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Payment type'), 
    payment_method: Joi.number().optional().allow(0, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22).label('Payment Method')          
});

module.exports = {
    xenditInvoice: validator.body(xenditInvoiceSchema, {
        joi: { convert: true, allowUnknown: false }
    })
};