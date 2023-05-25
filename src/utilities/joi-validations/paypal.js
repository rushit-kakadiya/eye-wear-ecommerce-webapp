/*
 * @file: paypal.js
 * @description: It Contain function layer for paypal field validations methods.
*/
const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate);
const { createValidator } = require('express-joi-validation');
const validator = createValidator({ passError: true });

const createPaypalPaymentSchema = Joi.object({
    payment_id: Joi.string()
        .required()
        .label('Payment ID')
});

const emptySchema = Joi.object({});

module.exports = {
    createPaypalPayment: validator.body(createPaypalPaymentSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    emptyResource: validator.params(emptySchema, {
        joi: { convert: true, allowUnknown: false }
    })
};