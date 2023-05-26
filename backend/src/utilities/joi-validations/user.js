/*
 * @file: user.js
 * @description: It Contain function layer for user field validations methods.
*/
const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate);
const { createValidator } = require('express-joi-validation');
const { constants } = require('../../core');
const validator = createValidator({ passError: true });
const config = require('config');

const loginSchema = Joi.object({
    mobile: Joi.string()
        .trim()
        .required()
        .regex(/^[0-9]{1,12}$/)
        .error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case 'any.empty':
                        err.message = 'Phone number is not allowed to be empty';
                        break;
                    default:
                        err.message = 'Please provide valid phone number';
                        break;
                }
            });
            return errors;
        })
        .label('Mobile No'),
    country_code: Joi.string().trim().regex(/^\+?\d{1,3}$/).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Code is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid code';
                    break;
            }
        });
        return errors;
    }).label('Country Code'),
    otp: Joi.string()
        .trim()
        .required()
        .label('OTP'),
    device_token: Joi.string()
        .trim()
        .optional()
        .allow('')
        .allow(null)
        .label('Device Token'),
    device_type: Joi.string()
        .trim()
        .optional()
        .valid('', constants.device.ios, constants.device.android, constants.device.web, constants.device.hybrid)
        .allow('')
        .label('Device Type')
});

const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(5)
        .max(50)
        .regex(/^[a-zA-Z ]*$/)
        .required()
        .error(errors => {
            errors.forEach(err => {
                switch (err.code) {
                    case 'string.empty':
                        err.message = 'Name is not allowed to be empty';
                        break;
                    case 'string.min':
                        err.message = 'Name length must be at least 4 characters long';
                        break;
                    case 'string.max':
                        err.message = 'Name length must be less than or equal to 50 characters long';
                        break;
                    default:
                        err.message = 'Please provide valid name';
                        break;
                }
            });
            return errors;
        })
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .optional()
        .allow('')
        .label('Email'),
    mobile: Joi.string()
        .trim()
        .required()
        .regex(/^[0-9]{1,12}$/)
        .error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case 'any.empty':
                        err.message = 'Phone number is not allowed to be empty';
                        break;
                    default:
                        err.message = 'Please provide valid phone number';
                        break;
                }
            });
            return errors;
        })
        .label('Mobile No'),
    country_code: Joi.string().trim().regex(/^\+?\d{1,3}$/).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Code is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid code';
                    break;
            }
        });
        return errors;
    }).label('Country Code'),
    gender: Joi.number()
        .optional()
        .allow('')
        .label('Gender'),
    dob: Joi.date()
        .format('YYYY-MM-DD')
        .options({ convert: true })
        .raw()
        .optional()
        .label('Date of birth'),
    device_token: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Device Token'),
    device_type: Joi.string()
        .trim()
        .optional()
        .valid('', constants.device.ios, constants.device.android, constants.device.web, constants.device.hybrid)
        .allow('')
        .label('Device Type'),
    is_referral_code: Joi.boolean()
        .optional()
        .valid(true, false)
        .default(false)
        .label('Primary Address'),
    referral_code: Joi.string()
        .trim()
        .optional()
        .default('')
        .allow('')
        .label('Referral Code'),
    channel: Joi.string().optional().label('Channel')
});

const userProfileSchema = Joi.object({
    name: Joi.string()
        .trim()
        .optional()
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .optional()
        .label('Email'),
    mobile: Joi.string()
        .trim()
        .optional()
        .regex(/^[0-9]{1,12}$/)
        .error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case 'any.empty':
                        err.message = 'Phone number is not allowed to be empty';
                        break;
                    default:
                        err.message = 'Please provide valid phone number';
                        break;
                }
            });
            return errors;
        })
        .label('Mobile No'),
    // country_code: Joi.string().trim().regex(/^\+?\d{1,3}$/).optional().error(errors => {
    //     errors.forEach(err => {
    //         switch (err.type) {
    //             case 'any.empty':
    //                 err.message = 'Code is not allowed to be empty';
    //                 break;
    //             default:
    //                 err.message = 'Please provide valid code';
    //                 break;
    //         }
    //     });
    //     return errors;
    // }).label('Country Code'),
    gender: Joi.number()
        .optional()
        .label('Gender'),
    dob: Joi.date()
        .format('YYYY-MM-DD')
        .options({ convert: true })
        .raw()
        .optional()
        .label('Date of birth'),
    profile_image: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Profile Image'),
    language: Joi.string()
        .trim()
        .optional()
        .valid('en-US')
        .label('language'),
    country_code: Joi.string()
        .trim()
        .optional()
        .valid('US', 'SG', 'ID')
        .label('Country Code'),
    currency_code: Joi.string()
        .trim()
        .optional()
        .valid('USD', 'IDR', 'SGD')
        .label('Currency Code'),
    timezone: Joi.string()
        .trim()
        .optional()
        .valid('+0700')
        .label('Timezone')
});

const wishlistSchema = Joi.object({
    product_id: Joi.string()
        .trim()
        .required()
        .label('Product id'),
    product_category: Joi.number()
        .optional()
        .valid(1, 2, 3)
        .label('Product Category'),
    sku_code: Joi.string()
        .trim()
        .required()
        .label('SKU Code'),
    user_id: Joi.string()
        .trim()
        .optional()
        .label('User Id')
});

const removeWishlistSchema = Joi.object({
    product_id: Joi.array().items(Joi.object().keys({
        sku_code: Joi.string()
            .trim()
            .required()
            .label('Product sku'),
        product_category: Joi.number()
            .required()
            .valid(1, 2, 3)
            .label('Product Category')
    }))
        .required()
        .label('Product ids')
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
    item_count: Joi.number()
        .optional()
        .min(1)
        .max(5)
        .label('Item Count')
});

const deleteCartSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Cart id')
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
    lense_color_code: Joi.string()
        .trim()
        .optional()
        .default('CLEAR')
        .label('lense color code'),
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

const updateCartAddonSchema = Joi.object({
    cart_id: Joi.string()
        .trim()
        .required()
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
    lense_color_code: Joi.string()
        .trim()
        .optional()
        .default('CLEAR')
        .label('lense color code'),
    addon_item_count: Joi.number()
        .optional()
        .label('Item Count')
});

const removeCartAddonSchema = Joi.object({
    id: Joi.array()
        .min(1)
        .required()
        .label('Addon id')
});

const storeSchema = Joi.object({
    id: Joi.string()
        .trim()
        .label('Store id'),
    lat: Joi.number()
        .label('Latitude'),
    long: Joi.number()
        .label('Longitude'),
});

const userOtpSchema = Joi.object({
    number: Joi.string().trim().regex(/^[0-9]{1,12}$/).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Number is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid number';
                    break;
            }
        });
        return errors;
    }).label('Number'),
    country_code: Joi.string().trim().regex(/^\+?\d{1,3}$/).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Code is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid code';
                    break;
            }
        });
        return errors;
    }).label('Country Code'),
    type: Joi.string()
        .trim()
        .optional()
        .allow('CITCALL','MSG','')
        .label('Type'),
});

const otpSchema = Joi.object({
    otp: Joi.string().trim().regex(/^[0-9]{4,20}$/).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'OTP is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid OTP';
                    break;
            }
        });
        return errors;
    }).label('OTP')
});

const paymentSchema = Joi.object({
    token_id: Joi.string()
        .trim()
        .required()
        .label('Token id'),
    auth_id: Joi.string()
        .trim()
        .required()
        .label('Auth id'),
    amount: Joi.string()
        .trim()
        .required()
        .label('Amount'),
    card_cvn: Joi.string()
        .trim()
        .required()
        .label('Card CVN'),
    external_id: Joi.string()
        .trim()
        .required()
        .label('External Id'),
    is_save_card: Joi.boolean()
        .optional()
        .label('Is save card'),
    currency: Joi.string()
        .optional()
        .valid('IDR', 'SGD', 'USD')
        .label('Is save card'),
});

const capurePaymentSchema = Joi.object({
    charge_id: Joi.string()
        .trim()
        .required()
        .label('Token id'),
    amount: Joi.string()
        .trim()
        .required()
        .label('Amount')
});

const refundPaymentSchema = Joi.object({
    charge_id: Joi.string()
        .trim()
        .required()
        .label('Token id'),
    amount: Joi.string()
        .trim()
        .required()
        .label('Amount'),
    external_id: Joi.string()
        .trim()
        .required()
        .label('External Id')
});

const userVAPaymentSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    bank_code: Joi.string()
        .trim()
        .required()
        .valid(constants.virtual_account.mandiri, constants.virtual_account.bri, constants.virtual_account.bni, constants.virtual_account.bca)
        .label('Bank Code'),
    account_number: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Bank account number'),
    amount: Joi.string()
        .trim()
        .required()
        .label('Amount'),
    external_id: Joi.string()
        .trim()
        .required()
        .label('External Id'),
    payment_category: Joi.number()
        .optional()
        .default(3)
        .label('Payment Category'),    
});

const checkoutSchema = Joi.object({
    products: Joi.array().items(
        Joi.object().keys({
            sku_code: Joi.string().min(6).max(20).required().label('Frame SKU'),
            quantity: Joi.number().min(1).max(5).required().label('Quantity'),
            retail_price: Joi.number().min(0).required().label('Retail Price'),
            discount_amount: Joi.number().min(0).required().label('Discount Price'),
            addon_items: Joi.array().items(
                Joi.object().keys({
                    addon_type: Joi.string().required().label('Addon type'),
                    sku_code: Joi.string().min(6).max(20).required().label('Addon SKU'),
                    quantity: Joi.number().min(1).max(5).required().label('Quantity'),
                    retail_price: Joi.number().min(0).required().label('Retail Price'),
                }).required().label('addon')
            ).required()
                .label('Addon items'),
        }).required().label('product')
    ).optional()
        .label('Products'),
    fulfillment_type: Joi.number().valid(0, 1).min(0).max(1).required().label('Fulfillment type'),
    store_id: Joi.number().optional().default(config.turbolyEcomOrder.storeID).label('Store ID'),
    address_id: Joi.string().min(36).max(36).optional().label('Address'),
    voucher_code: Joi.string().optional().default('NA').label('Voucher Code'),
    voucher_id: Joi.string().optional().label('Voucher Id'),
    notes: Joi.string().optional().label('Notes'),
    user_id: Joi.string().optional().label('User Id'),
    sales_channel: Joi.string().optional().label('Sales Channel'),
    pick_up_store_id: Joi.number().optional().label('Pick up Store ID'),
    hto_appointment_no: Joi.string().optional().default(null).allow('', null).label('HTO Appointment No')
});

const addressSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .optional()
        .label('User Id'),
    id: Joi.string()
        .trim()
        .optional()
        .label('Address Id'),
    receiver_name: Joi.string()
        .trim()
        .required()
        .label('Receiver name'),
    label_address: Joi.string()
        .trim()
        .required()
        .label('Label address'),
    phone_number: Joi.string()
        .trim()
        .required()
        .label('Phone Number'),
    email: Joi.string()
        .trim()
        .email()
        .optional()
        .allow('')
        .label('Email'),
    note: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Note'),
    zip_code: Joi.string()
        .trim()
        .required()
        .label('Zip code'),
    address: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Address'),
    address_details: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Address Detail'),
    city: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('City'),
    province: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Province'),
    country: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Country'),
    lat: Joi.number()
        .optional()
        .label('Latitude'),
    long: Joi.number()
        .optional()
        .label('Longitude'),
    is_primary: Joi.boolean()
        .optional()
        .label('Primary Address')
});

const htoCheckoutSchema = Joi.object({
    products: Joi.array().items(
        Joi.object().keys({
            sku_code: Joi.string().min(6).max(20).required().label('Product ID'),
        }).required().label('product')
    ).required()
        .label('Products'),
    is_hto: Joi.boolean().valid(true).required().label('HTO'),
    is_payment_required: Joi.boolean().required().label('Payment required'),
    amount: Joi.number().min(0).required().label('Amount'),
    store_id: Joi.number().optional().default(config.turbolyEcomOrder.storeID).label('Store ID'),
    address_id: Joi.string().min(36).max(36).required().label('Address'),
    appointment_date: Joi.date().format('YYYY-MM-DD').when('is_payment_required', { is: false, then: Joi.required(), otherwise: Joi.optional() }).label('Appointment Date'),
    timeslot_id: Joi.string().min(36).max(36).when('is_payment_required', { is: false, then: Joi.string().required(), otherwise: Joi.string().optional() }).label('Timeslot id:'),
    notes: Joi.string().required().label('Notes')
});

const notificationSchema = Joi.object({
    page: Joi.number()
        .required()
        .label('Page number')
});

const orderListSchema = Joi.object({
    page: Joi.number()
        .required()
        .label('Page number'),
    is_hto: Joi.boolean()
        .required()
        .label('HTO'),
});

const orderDetailsSchema = Joi.object({
    id: Joi.string()
        .required()
        .label('Order ID')
});

const emptySchema = Joi.object({});

const userSettingsSchema = Joi.object({
    is_send_notifications: Joi.boolean()
        .optional()
        .label('Send notifications'),
    is_send_email: Joi.boolean()
        .optional()
        .label('Send email'),
    is_send_newsletter: Joi.boolean()
        .optional()
        .label('Send news letter'),
    currency: Joi.string()
        .required()
        .label('Currency'),
    language: Joi.string()
        .required()
        .label('Language')
});

const authReversalSchema = Joi.object({
    charge_id: Joi.string()
        .required()
        .label('Charge ID'),
    external_id: Joi.string()
        .required()
        .label('External ID')
});

const cardlessUserPaymentSchema = Joi.object({
    cardless_credit_type: Joi.string()
        .trim()
        .required()
        .valid(constants.cardless_type.kredivo)
        .label('Cardless Type'),
    external_id: Joi.string()
        .trim()
        .required()
        .label('External ID'),
    amount: Joi.number()
        .required()
        .label('Amount'),
    payment_type: Joi.string()
        .trim()
        .required()
        .valid(
            constants.cardless_payment_type.days30,
            constants.cardless_payment_type.months3,
            constants.cardless_payment_type.months6,
            constants.cardless_payment_type.months12
        )
        .label('Payment Type'),
    items: Joi.array().items(Joi.object().keys({
        id: Joi.string().trim().required().label('Id'),
        name: Joi.string().trim().required().label('Name'),
        price: Joi.number().required().label('Price'),
        type: Joi.string().trim().required().label('Type'),
        url: Joi.string().trim().required().label('Url'),
        quantity: Joi.number().required().label('quantity'),
    }))
        .required()
        .label('items'),
    customer_details: Joi.object().keys({
        first_name: Joi.string().required().trim().label('First Name'),
        last_name: Joi.string().required().trim().label('Last Name'),
        email: Joi.string().required().trim().label('Email'),
        phone: Joi.string().required().trim().label('Phone'),
    }).required().label('Customer details')
});

const removeAddressSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Address id')
});

const deletePrescriptionSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Prescription id')
});

const vaDisbursementSchema = Joi.object({
    external_id: Joi.string()
        .trim()
        .required()
        .label('External id'),
    bank_code: Joi.string()
        .trim()
        .required()
        .valid(constants.virtual_account.mandiri, constants.virtual_account.bri, constants.virtual_account.bni, constants.virtual_account.bca)
        .label('Bank Code'),
    account_number: Joi.string()
        .trim()
        .required()
        .label('Bank account number'),
    amount: Joi.string()
        .trim()
        .required()
        .label('Amount'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name')
});

const rescheduleHTOSchema = Joi.object({
    order_no: Joi.string().required().label('Order No'),
    appointment_date: Joi.date().required().label('Appointment Date'),
    timeslot_id: Joi.string().min(36).max(36).required().label('Timeslot ID:'),
});

const cancelOrderSchema = Joi.object({
    order_no: Joi.string().required().label('Order No'),
    is_hto: Joi.boolean().optional().default(false).label('Is HTO order')
});

const savedCardSchema = Joi.object({
    token_id: Joi.string()
        .trim()
        .required()
        .label('Token id'),
    card_holder_name: Joi.string()
        .trim()
        .required()
        .label('Card holder name'),
    card_number: Joi.string()
        .trim()
        .required()
        .label('Card CVN'),
    card_brand: Joi.string()
        .trim()
        .required()
        .label('Card CVN'),
    card_type: Joi.string()
        .trim()
        .required()
        .label('Card CVN'),
    is_primary: Joi.boolean()
        .optional()
        .label('Primary Card')
});

const updateCardSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Card id'),
    is_primary: Joi.boolean()
        .required()
        .label('Primary Card')
});

const deleteCardSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Card id')
});

const trackNoSchema = Joi.object({
    trackNo: Joi.string()
        .trim()
        .required()
        .label('Track Number')
});

const userIdSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .optional()
        .label('User Id')
});

const addPrescriptionSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .required()
        .label('User Id'),
    label: Joi.string()
        .trim()
        .required()
        .label('Label'),
    spheris_r: Joi.string()
        .trim()
        .required()
        .label('Spheris Right'),
    spheris_l: Joi.string()
        .trim()
        .required()
        .label('Spheris Left'),
    cylinder_r: Joi.string()
        .trim()
        .required()
        .label('Cylinder Right'),
    cylinder_l: Joi.string()
        .trim()
        .required()
        .label('Cylinder Left'),
    axis_r: Joi.string()
        .trim()
        .required()
        .label('Axis Right'),
    axis_l: Joi.string()
        .trim()
        .required()
        .label('Axis Left'),
    addition_r: Joi.string()
        .trim()
        .required()
        .label('Addition Right'),
    addition_l: Joi.string()
        .trim()
        .required()
        .label('Addition Left'),
    pupilary_distance: Joi.string()
        .trim()
        .required()
        .label('Pupilary Pistance'),
    is_primary: Joi.boolean()
        .optional()
        .label('Primary Prescription')
});

const updatePrescriptionSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Id'),
    user_id: Joi.string()
        .trim()
        .required()
        .label('User Id'),
    label: Joi.string()
        .trim()
        .required()
        .label('Label'),
    spheris_r: Joi.string()
        .trim()
        .required()
        .label('Spheris Right'),
    spheris_l: Joi.string()
        .trim()
        .required()
        .label('Spheris Left'),
    cylinder_r: Joi.string()
        .trim()
        .required()
        .label('Cylinder Right'),
    cylinder_l: Joi.string()
        .trim()
        .required()
        .label('Cylinder Left'),
    axis_r: Joi.string()
        .trim()
        .required()
        .label('Axis Right'),
    axis_l: Joi.string()
        .trim()
        .required()
        .label('Axis Left'),
    addition_r: Joi.string()
        .trim()
        .required()
        .label('Addition Right'),
    addition_l: Joi.string()
        .trim()
        .required()
        .label('Addition Left'),
    pupilary_distance: Joi.string()
        .trim()
        .required()
        .label('Pupilary Pistance'),
    is_primary: Joi.boolean()
        .optional()
        .label('Primary Prescription')
});

const addPrescriptionToCartSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Id'),
    cart_id: Joi.string()
        .trim()
        .required()
        .label('Cart Id'),
    type: Joi.string()
        .trim()
        .required()
        .allow('cart', 'addon')
        .label('Type')
});

const voucherSchema = Joi.object({
    voucherCode: Joi.string()
        .trim()
        .required()
        .label('Voucher code')
});

const sendNotificationSchema = Joi.object({
    order_no: Joi.string()
        .required()
        .label('Order number'),
    is_hto: Joi.boolean()
        .required()
        .label('HTO'),
});

const htoBookSchema = Joi.object({
    address_id: Joi.string().min(36).max(36).required().label('Address'),
    timeslot_id: Joi.string().min(36).max(36).required().label('Timeslot id:'),
    appointment_date: Joi.date().required().format('YYYY-MM-DD').label('Appointment Date'),
    store_id: Joi.number().optional().default(config.turbolyEcomOrder.storeID).label('Store ID'),
    notes: Joi.string().required().label('Notes'),
    sales_channel: Joi.string().optional().label('Sales Channel')
});

const htoRescheduleSchema = Joi.object({
    appointment_id: Joi.string().min(36).max(36).required().label('Appointment Id'),
    timeslot_id: Joi.string().min(36).max(36).required().label('Timeslot ID:'),
    appointment_date: Joi.date().required().label('Appointment Date'),
});

const htoCancelSchema = Joi.object({
    appointment_id: Joi.string().required().label('Appointment ID')
});

const htoAppointmentListSchema = Joi.object({
    page: Joi.number()
        .optional()
        .default(1)
        .label('Page number'),
});

const htoDetailSchema = Joi.object({
    appointment_id: Joi.string().min(36).max(36).required().label('Appointment Id'),
});

const submitReferralCodeSchema = Joi.object({
    referral_code: Joi.string().required().label('referral code')
});

const userCheckoutSchema = Joi.object({
    fulfillment_type: Joi.number().valid(0, 1).min(0).max(1).required().label('Fulfillment type'),
    store_id: Joi.number().optional().default(config.turbolyEcomOrder.storeID).label('Store ID'),
    address_id: Joi.string().min(36).max(36).optional().label('Address'),
    is_referral_credit: Joi.boolean().valid(true, false).optional().default(false).label('Apply referral credit flag'),
    is_voucher_code: Joi.boolean().valid(true, false).optional().default(false).label('Apply voucher code flag'),
    is_eyewear_points_credit: Joi.boolean().valid(true, false).optional().default(false).label('Apply eyewear points credit flag'),
    voucher_code: Joi.string().optional().default('NA').label('Voucher Code'),
    sales_channel: Joi.string().optional().default(constants.sale_channel.APP).label('Sales Channel'),
    notes: Joi.string().optional().default('NA').label('Notes'),
});

const zipCodeCheckSchema = Joi.object({
    zip_code: Joi.string()
        .required()
        .label('zip code')
});

module.exports = {
    userLogin: validator.body(loginSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userRegister: validator.body(registerSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userProfile: validator.body(userProfileSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addWishlist: validator.body(wishlistSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    removeWishlist: validator.body(removeWishlistSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addCart: validator.body(addCartSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateCart: validator.body(updateCartSchema, {
            joi: { convert: true, allowUnknown: false }
    }),
    deleteCart: validator.body(deleteCartSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addCartAddon: validator.body(addCartAddonSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateCartAddon: validator.body(updateCartAddonSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    removeCartAddon: validator.body(removeCartAddonSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userOtp: validator.body(userOtpSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    otpVerify: validator.body(otpSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    searchStore: validator.params(storeSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userPayment: validator.body(paymentSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    captureUserPayment: validator.body(capurePaymentSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    refundUserPayment: validator.body(refundPaymentSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userVAPayment: validator.body(userVAPaymentSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    orderCheckout: validator.body(checkoutSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userAddress: validator.body(addressSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoCheckout: validator.body(htoCheckoutSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    notification: validator.query(notificationSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    emptyResource: validator.params(emptySchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    orderListResource: validator.query(orderListSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    orderDetailsResource: validator.query(orderDetailsSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    authReversal: validator.body(authReversalSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userSettings: validator.body(userSettingsSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    cardlessUserPayment: validator.body(cardlessUserPaymentSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    removeAddress: validator.params(removeAddressSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    deletePrescription: validator.params(deletePrescriptionSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    vaDisbursement: validator.body(vaDisbursementSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    rescheduleHTO: validator.body(rescheduleHTOSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    cancelOrder: validator.body(cancelOrderSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    savedCardData: validator.body(savedCardSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateCardData: validator.body(updateCardSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    deleteCardData: validator.params(deleteCardSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    orderNo: validator.query(cancelOrderSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    trackNo: validator.query(trackNoSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userId: validator.query(userIdSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addPrescription: validator.body(addPrescriptionSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updatePrescription: validator.body(updatePrescriptionSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addPrescriptionToCart: validator.body(addPrescriptionToCartSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    getVoucherDetails: validator.query(voucherSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    sendNotification: validator.body(sendNotificationSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoBook: validator.body(htoBookSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoReschedule: validator.body(htoRescheduleSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoCancel: validator.body(htoCancelSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoAppointmentList: validator.query(htoAppointmentListSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoDetail: validator.query(htoDetailSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    submitReferralCode: validator.body(submitReferralCodeSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userCheckout: validator.body(userCheckoutSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    zipCodeCheck: validator.query(zipCodeCheckSchema, {
        joi: { convert: true, allowUnknown: false }
    })
};
