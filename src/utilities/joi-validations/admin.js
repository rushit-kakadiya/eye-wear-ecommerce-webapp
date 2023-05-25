/*
 * @file: admin.js
 * @description: It Contain function layer for admin portal field validations methods.
*/
const Joi = require('@hapi/joi');
const { createValidator } = require('express-joi-validation');
const regex = require('../regex');
const validator = createValidator({ passError: true });
const config = require('config');

const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required()
        .label('Email'),
    password: Joi.string()
        .trim()
        .required()
        .label('Password'),
    role: Joi.number()
        .required()
        .label('Role')
});

const getOrdersSchema = Joi.object({
    page: Joi.number()
        .required()
        .label('Page No'),
    order_status: Joi.string()
        .trim()
        .optional()
        .default('all')
        .label('Order Status'),
    search: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Search'),
    is_hto: Joi.boolean()
        .optional()
        .default(false)
        .label('Is Hto'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Store Id'),
    start_date: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Start Date'),
    end_date: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('End Date'),
    date_search: Joi.string()
        .trim()
        .optional()
        .allow('', null, 'createdby', 'htoby', 'completedby')
        .label('Date Search'),
    sales_channel: Joi.string()
        .trim()
        .optional()
        .allow('', null, 'app', 'store', 'whatsapp', 'website', 'hto')
        .label('Sales Channel'),
    sales_person: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Sales Person'),
    optician: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Optician'),
    payment_method: Joi.number()
        .optional()
        .allow(null, '')
        .label('Payment Method'),  
    payment_status: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Payment Status')        
});

const addUserSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .label('Email'),
    mobile: Joi.string().trim().regex(regex.validateMobile).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Mobile is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid number';
                    break;
            }
        });
        return errors;
    }).label('Mobile'),
    country_code: Joi.string().trim().regex(regex.validateMobileCode).required().error(errors => {
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
    gender: Joi.string()
        .trim()
        .required()
        .label('Gender'),
    dob: Joi.string()
        .trim()
        .allow('')
        .required()
        .label('DOB')
});

const updateUserSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('User Id'),
    address_id: Joi.string()
        .trim()
        .optional()
        .label('Address Id'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .label('Email'),
    mobile: Joi.string().trim().regex(regex.validateMobile).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Mobile is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid number';
                    break;
            }
        });
        return errors;
    }).label('Mobile'),
    country_code: Joi.string().trim().regex(regex.validateMobileCode).required().error(errors => {
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
    gender: Joi.string()
        .trim()
        .required()
        .label('Gender'),
    dob: Joi.string()
        .trim()
        .allow('')
        .required()
        .label('DOB')
});

const searchUserSchema = Joi.object({
    text: Joi.string()
        .trim()
        .required()
        .allow('')
        .label('Text')
});

const userDataSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .required()
        .allow('')
        .label('User Id')
});

const removeCartSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .required()
        .allow('')
        .label('User Id'),
    sku_code: Joi.string()
        .trim()
        .required()
        .label('Product sku'),
    product_category: Joi.number()
        .required()
        .valid(1, 2, 3)
        .label('Product Category'),
    type: Joi.number()
        .required()
        .valid(1, 2, 3)
        .label('Type Category')
});

const draftOrderSchema = Joi.object({
    user_id: Joi.string()
        .trim()
        .required()
        .label('User Id'),
    address_id: Joi.string()
        .trim()
        .optional()
        .allow(null)
        .label('Address Id'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Store Id')
});

const inStorePaymentSchema = Joi.object({
    external_id: Joi.string()
        .trim()
        .required()
        .label('External Id'),
    auth_id: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Auth Id'),
    amount: Joi.string()
        .trim()
        .required()
        .label('Amount'),
    payment_type: Joi.string()
        .trim()
        .required()
        .label('Payment type'),
    bank_code: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Bank Code'),
    name: Joi.string()
        .trim()
        .required()
        .label('Card Holder Name'),
    expiration_time: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Expiration Time'),
    card_type: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Card Type'),
    created_by_staff: Joi.string().trim().optional().allow('', null).label('Created by staff'),
    optician: Joi.string().trim().optional().allow('', null).label('Optician'),
    payment_method: Joi.number().required().allow(0, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22).label('Payment Method'),
    payment_category: Joi.number()
        .optional()
        .label('Payment Category'),
    notes: Joi.string()
        .trim()
        .optional()
        .allow(null, '')
        .label('Notes')
});

const updateOrderStaffOpticianSchema = Joi.object({
    external_id: Joi.string()
        .trim()
        .required()
        .label('External Id'),
    created_by_staff: Joi.string().trim().optional().allow('', null).label('Created by staff'),
    optician: Joi.string().trim().optional().allow('', null).label('Optician'),
    payment_category: Joi.number()
        .required()
        .label('Payment Category')
});

const updateDiscountSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Id'),
    type: Joi.string()
        .trim()
        .required()
        .allow('frame','addon')
        .label('Type'),
    discount_amount: Joi.number()
        .required()
        .label('Discount Amount'),
    discount_type: Joi.number()
        .allow(1,2)
        .required()
        .label('Discount Type'),
    discount_note: Joi.string()
        .trim()
        .required()
        .label('Discount note'),
});

const cancelOrderSchema = Joi.object({
    order_no: Joi.string()
        .trim()
        .required()
        .label('Order Number')
});

const getUsersSchema = Joi.object({
    page: Joi.number()
        .required()
        .label('Page No'),
    search: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Search'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Store Id'),
    channel: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Channel'),
    created_at: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Created Date'),
    dob: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Date of Birth'),
    role: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Role')            
});

const dashboardDataSchema = Joi.object({
    duration: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Duration'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Store Id'),
    start_date: Joi.any()
        .optional()
        .allow('')
        .label('Start Date'),
    end_date: Joi.any()
        .optional()
        .allow('')
        .label('End Date')
});

const customerDetailSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Customer Id'),
    type: Joi.string()
        .trim()
        .required()
        .valid('summary', 'history', 'wishlist', 'cart', 'referral', 'hto_appointment')
        .label('Type'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Store Id')
});

const removeDiscountSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Id'),
    type: Joi.string()
        .trim()
        .required()
        .allow('frame','addon')
        .label('Type')
});

const processOrderSchema = Joi.object({
    order_no: Joi.string()
        .trim()
        .required()
        .label('Order Number'),
    order_status: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Order Status')
});

const exportDataSchema = Joi.object({
    search: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Search'),
    order_status: Joi.string()
        .trim()
        .optional()
        .label('Order Status'),
    is_hto: Joi.boolean()
        .optional()
        .default(false)
        .label('Is Hto'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Store Id'),
    start_date: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Start Date'),
    end_date: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('End Date'),
    date_search: Joi.string()
        .trim()
        .optional()
        .allow('', null, 'createdby', 'htoby', 'completedby')
        .label('Date Search'),
    sales_channel: Joi.string()
        .trim()
        .optional()
        .allow('', null, 'app', 'store', 'whatsapp', 'website', 'hto', 'booking_link')
        .label('Sales Channel'),
    sales_person: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Sales Person'),
    optician: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Optician'),
    payment_method: Joi.number()
        .optional()
        .allow(null)
        .label('Payment Method'),
    dob: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Date of Birth'),    
    payment_status:  Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Payment Status'),   
});

const orderHtoDetailSchema = Joi.object({
    id: Joi.string()
        .required()
        .trim()
        .label('Id')
});

const updateHtoDetailSchema = Joi.object({
    optician_id: Joi.string()
        .optional()
        .trim()
        .label('Optician Id'),
    appointment_id: Joi.string()
        .required()
        .trim()
        .label('Appointment Id'),
    appointment_date: Joi.date().optional().label('Appointment Date'),
    slot_id: Joi.string().min(36).max(36).optional().label('Timeslot id'),
    status: Joi.string().optional().allow('','appointment_confirmed', 'appointment_completed','appointment_cancelled').label('Status'),
    comment: Joi.string().optional().allow('').label('Comment')
});

const htoAppointmentBookSchema = Joi.object({
    appointment_no: Joi.string().optional().label('Appointment No'),
    address_id: Joi.string().min(36).max(36).required().label('Address'),
    timeslot_id: Joi.string().min(36).max(36).required().label('Timeslot id:'),
    appointment_date: Joi.date().required().label('Appointment Date'),
    store_id: Joi.number().optional().label('Store ID'),
    notes: Joi.string().required().label('Notes'),
    user_id: Joi.string().required().label('User Id'),
    status: Joi.number().optional().default(1).label('Store ID'),
    sales_channel: Joi.string().optional().label('Sales Channel')
});

const updateStockStoreInOrderSchema = Joi.object({
    order_no: Joi.string().required().trim().label('Order No'),
    stock_store_id: Joi.string().required().trim().label('Stock store id')
});

const opticianCalendarSchema = Joi.object({
    month: Joi.number().optional().default(0).label('Month')
});

const changeLensSchema = Joi.object({
    old_lens_sku: Joi.string()
        .required()
        .trim()
        .label('Old Lens sku'),
    order_no: Joi.string()
        .required()
        .trim()
        .label('Order No'),
    order_item_id: Joi.string()
        .required()
        .trim()
        .label('Order Item Id'),
    new_lens_sku: Joi.array()
        .min(1)
        .required()
        .label('Old Lens sku'),
    type: Joi.array()
        .min(1)
        .optional()
        .allow(null, '')
        .label('Lens Type'),
    is_sunwear: Joi.boolean()
        .optional()
        .allow(false, true)
        .label('Is Sunwear Lens'),
    addon_item_count: Joi.number()
        .required()
        .label('Item Count'),
    is_update: Joi.boolean()
        .optional()
        .allow(false, true)
        .default(false)
        .label('Is Update Lens'),
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
    from: Joi.number()
        .optional()
        .allow('')
        .label('From: '),
    size: Joi.number()
        .optional()
        .allow('')
        .label('size: '),
});

const productSkuSchema = Joi.object({
    type: Joi.string().required().allow('frames', 'lens', 'clipons').label('Type')
});

const addVoucherSkuSchema = Joi.object({
    voucher_title: Joi.string().trim().required().label('Discount Title'),
    voucher_code: Joi.string().trim().required().label('Promo Code'),
    discount_category: Joi.string().trim().required().label('Discount Category'),
    discount_sub_category: Joi.string().trim().required().label('Discount Sub Category'),
    voucher_type: Joi.string().trim().required().allow(1,2).label('Discount Type'),
    voucher_type_value: Joi.number().required().label('Discount Value'),
    minimum_cart_amount: Joi.number().optional().label('Minimum Purchase Amount'),
    min_cart_count: Joi.number().optional().default(0).label('Minimum Quantity of items'),
    voucher_sku_mapping_type: Joi.number().required().allow(1, 2, 3).label('Applies to'), //1=> (All Products and global check) or (exclude or global check), 2=> voucher_excludes_sku only or all product only , 3: voucher_includes_sku
    voucher_sku_mapping: Joi.array().items(Joi.object().keys({
        type: Joi.string().required().allow('frames', 'lens', 'clipons').label('Product Type'),
        sku_code: Joi.string()
            .trim()
            .required()
            .label('Product sku')
    })).optional().label('Voucher Sku Mapping'),
    max_count: Joi.number().required().label('Max. Voucher Amount can be used in total'), // how many times we can used it
    voucher_max_amount: Joi.number().required().label('Max. Discount'),
    is_single_user: Joi.boolean().optional().allow(false, true).default(false).label('Limit to one use per customer'),
    start_at: Joi.any().required().label('Schedule start at'),
    expire_at: Joi.any().required().label('Schedule end at'),
    avilabilty_type: Joi.array().required().label('Avilabilty'), // 1 => store, 2 => mobile, 3 => hto, 4 => whatsapp, 5 => website
    term_conditions: Joi.string().trim().optional().allow('').default(null).label('Terms and Conditions'),
    voucher_image_key: Joi.string().trim().optional().allow('').default(null).label('Voucher image'),
    sub_title: Joi.string().trim().optional().allow('').default(null).label('Voucher Preview Title'),
    first_order: Joi.boolean().optional().allow(false, true).default(false).label('First time purchase only'),
});

const getVoucherSchema = Joi.object({
    page: Joi.number().required().label('Page No'),
    limit: Joi.number().optional().label('Page Limit'),
    status: Joi.string().trim().optional().allow('all', 'active', 'scheduled', 'expired', 'inactive').default('all').label('Status'),
    search: Joi.string().trim().optional().allow('').label('Search'),
    discount_category: Joi.string().trim().optional().allow('').label('Discount category'),
    discount_sub_category: Joi.string().trim().optional().allow('').label('Discount sub category')
});

const getVoucherDetailSchema = Joi.object({
    id: Joi.string().trim().required().label('Id')
});

const updateVoucherSchema = Joi.object({
    id: Joi.string().trim().required().label('Discount ID'),
    start_at: Joi.any().optional().label('Schedule start at'),
    expire_at: Joi.any().required().label('Schedule end at'),
    term_conditions: Joi.string().trim().optional().label('Terms and Conditions'),
    voucher_image_key: Joi.string().trim().optional().label('Voucher image'),
    sub_title: Joi.string().trim().optional().allow('').label('Voucher Preview Title')
});

const deleteSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Id')
});

const applyVoucherSchema = Joi.object({
    voucher_id: Joi.string()
        .trim()
        .required()
        .label('Voucher Id'),
    user_id: Joi.string()
        .trim()
        .required()
        .label('User Id')    
});

const elasticTypeSchema = Joi.object({
    type: Joi.number()
        .required()
        .allow(1,2,3) // 1 => products, 2 => admin product, 3 => users
        .label('Elastic Type')  
});

const updateStoreActivitySchema = Joi.object({
    id: Joi.number()
        .required()
        .label('Store Id'),
    status: Joi.string()
        .required()
        .allow('true', 'false') 
        .label('Status')  
});

const addFrameColorSchema = Joi.object({
    variant_code: Joi.string()
        .trim()
        .required()
        .label('Color Code'),  
    variant_name: Joi.string()
        .trim()
        .required()
        .label('Color Name'),
    variant_color_group: Joi.array()
        .required()
        .label('Color Group')
});

const addFrameNameSchema = Joi.object({
    frame_code: Joi.string()
        .trim()
        .required()
        .label('Frame Code'),  
    frame_description: Joi.string()
        .trim()
        .required()
        .label('Frame Description'),
    frame_name: Joi.string()
        .trim()
        .required()
        .label('Frame Name'),
    frame_shape: Joi.array()
        .required()
        .label('Frame Shape'),  
    gender: Joi.string()
        .trim()
        .required()
        .label('Gender'),
    material: Joi.string()
        .trim()
        .required()
        .label('Material'),
    frame_price: Joi.number()
        .required()
        .label('Price'),
    fit: Joi.array()
        .optional()
        .label('Fit'), 
});

const updateFrameNameActivitySchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Frame Name Id'),
    type: Joi.string()
        .required()
        .label('Type'),
    status: Joi.string()
        .required()
        .allow('true', 'false') 
        .label('Status')  
});


const updateFrameColorActivitySchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Frame Color Id'),
    type: Joi.string()
        .required()
        .label('Type'),
    status: Joi.string()
        .required()
        .allow('true', 'false') 
        .label('Status')  
});

const orderDeliverySchema = Joi.object({
    order_no: Joi.string()
        .trim()
        .required()
        .label('Order No'),
    delivery_partner: Joi.string()
        .trim()
        .required()
        .label('Delivery Partner'),  
    airway_bill_no: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('airway Bill No'),
    scheduled_delivery_date: Joi.any()
        .required()
        .label('Schedule end at'),      
});

const resetPasswordSchema = Joi.object({
    old_password: Joi.string()
        .trim()
        .required()
        .label('Old Password'),
    new_password: Joi.string().trim().regex(regex.validatePassword).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'New Password is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid new password';
                    break;
            }
        });
        return errors;
    }).label('New Password'),  
    confirm_password: Joi.string().trim().regex(regex.validatePassword).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Confirm Password is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid confirm password';
                    break;
            }
        });
        return errors;
    }).label('Confirm Password'),    
});

const resetTimezoneSchema = Joi.object({
    time_zone: Joi.string()
        .trim()
        .required()
        .label('Timezone'),  
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
    user_id: Joi.string().required().label('User Id'),
    sales_channel: Joi.string().required().label('Sales Channel'),
    pick_up_store_id: Joi.number().optional().label('Pick up Store ID'),
    hto_appointment_no: Joi.string().optional().default(null).allow('', null).label('HTO Appointment No')
});

const passwordSchema = Joi.object({
    password: Joi.string().trim().regex(regex.validatePassword).required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case 'any.empty':
                        err.message = 'Password is not allowed to be empty';
                        break;
                    default:
                        err.message = 'Please provide valid password';
                        break;
                }
            });
            return errors;
        }).label('Password'),
    user_id: Joi.string()
        .trim()
        .required()
        .label('User Id'),
});

const addAdminUserSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .label('Email'),
    password: Joi.string().trim().regex(regex.validatePassword).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Password is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid password';
                    break;
            }
        });
        return errors;
    }).label('Password'),
    role_name: Joi.string()
        .trim()
        .allow('super-admin', 'admin', 'store-manager', 'store-account', 'customer-services', 'finance')
        .required()
        .label('Role'),
    store_id: Joi.string()
        .trim()
        .allow('', null)
        .optional()
        .label('Store')    
});

const storeSchema = Joi.object({
    id: Joi.number()
        .optional()
        .allow('')
        .label('Truboly Id'),  
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    address: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Address'),
    city: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('City'),
    opening_time: Joi.string()
        .trim()
        .required()
        .label('Opening Time'),
    closing_time: Joi.string()
        .trim()
        .required()
        .label('Closing Time'),
    country: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Country'),  
    email: Joi.string()
        .trim()
        .email()
        .required()
        .label('Email'), 
    is_cafe: Joi.boolean()
        .required()
        .label('Cafe'),
    lat: Joi.string()
        .trim()
        .empty('')
        .default(null)
        .label('Latitude'),   
    long: Joi.string()
        .trim()
        .empty('')
        .default(null)
        .label('Logitude'),    
    phone: Joi.number()
        .required()
        .label('Phone'),
    province: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('province'),
    region: Joi.string()
        .trim()
        .optional()
        .allow('')
        .label('Region'),
    zipcode: Joi.number()
        .optional()
        .allow('')
        .label('Zipcode'),
});


const updateAdminUserSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('User Id'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .required()
        .label('Email'),
    password: Joi.string().trim().optional().allow('').regex(regex.validatePassword).error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Password is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid password';
                    break;
            }
        });
        return errors;
    }).label('Password'),
    old_password: Joi.string().trim().optional().allow('').regex(regex.validatePassword).error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Password is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid password';
                    break;
            }
        });
        return errors;
    }).label('Old Password'),
    role_name: Joi.string()
        .trim()
        .allow('super-admin', 'admin', 'store-manager', 'store-account', 'customer-services', 'finance')
        .required()
        .label('Role'),
    store_id: Joi.string()
        .trim()
        .allow('', null)
        .optional()
        .label('Store')  
});

const updateAdminUserStatusSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('User Id'),
    status: Joi.number()
        .required()
        .allow(1,2)
        .label('Status'),
    password: Joi.string().trim().regex(regex.validatePassword).required().error(errors => {
        errors.forEach(err => {
            switch (err.type) {
                case 'any.empty':
                    err.message = 'Password is not allowed to be empty';
                    break;
                default:
                    err.message = 'Please provide valid password';
                    break;
            }
        });
        return errors;
    }).label('Password')
});

const addEmployeeSchema = Joi.object({
    emp_ref_code: Joi.string()
        .trim()
        .required()
        .label('Employee id'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .optional()
        .allow('')
        .label('Email'),
    role_name: Joi.string()
        .trim()
        .allow('store-staff', 'optician', 'hto-staff')
        .required()
        .label('Role'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Store Id')
});

const updateEmployeeSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required()
        .label('Id'),
    emp_ref_code: Joi.string()
        .trim()
        .required()
        .label('Employee id'),
    name: Joi.string()
        .trim()
        .required()
        .label('Name'),
    email: Joi.string()
        .trim()
        .email()
        .optional()
        .allow('')
        .label('Email'),
    role_name: Joi.string()
        .trim()
        .allow('store-staff', 'optician', 'hto-staff')
        .required()
        .label('Role'),
    store_id: Joi.string()
        .trim()
        .optional()
        .allow('', null)
        .label('Store Id')
});

const getStoresSchema = Joi.object({
    page: Joi.number()
        .optional()
        .label('Page No'),
    search: Joi.string()
        .optional()
        .allow('', null)
        .label('Search'),
    type: Joi.string()
        .optional()
        .allow('', null)
        .valid('admin')
        .label('Search')

});

const frameSizeAvialabilitySchema = Joi.object({
    frame_code: Joi.string()
        .required()
        .label('Frame Code'),
    variant_code: Joi.string()
        .required()
        .label('Variant Code'),
});

const addFrameSkuSchema = Joi.object({
    frame_code: Joi.string()
        .required()
        .label('Frame Code'),
    variant_code: Joi.string()
        .required()
        .label('Variant Code'),
    retail_price: Joi.number()
        .required()
        .label('Retail Price'),
    is_sunwear: Joi.boolean()
        .optional()
        .allow(false, true)
        .label('Is Sunwear Lens'),
    size: Joi.array()
        .min(1)
        .required()
        .label('Frame Size'),
});

const redeemCoffeeSchema = Joi.object({
    order_no: Joi.string().required().trim().label('Order No'),
    store_id: Joi.number().required().label('Store id')
});

const updateFrameSkuSchema  = Joi.object({ 
    frame_code: Joi.string()
        .required()
        .label('Frame Code'),
    variant_code: Joi.string()
        .required()
        .label('Variant Code'),
    size_code: Joi.string()
        .required()
        .label('Size Code'),
    retail_price: Joi.number()
        .required()
        .label('Retail Price'),
    show_on_app: Joi.boolean()
        .optional()
        .allow(false, true)
        .label('Is Sunwear Lens'),
    is_sunwear: Joi.boolean()
        .optional()
        .allow(false, true)
        .label('Is Sunwear Lens'),
});

const setFrameImageschema = Joi.object({});


module.exports = {
    getOrders: validator.query(getOrdersSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    login: validator.body(loginSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addUser: validator.body(addUserSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateUser: validator.body(updateUserSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    searchUser: validator.query(searchUserSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    userData: validator.query(userDataSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    removeCart: validator.body(removeCartSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    draftOrder: validator.body(draftOrderSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    inStorePayment: validator.body(inStorePaymentSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateDiscount: validator.body(updateDiscountSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    cancelOrder: validator.body(cancelOrderSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    getUsers: validator.query(getUsersSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    dashboardData: validator.query(dashboardDataSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    customerDetail: validator.query(customerDetailSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    removeDiscount: validator.body(removeDiscountSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    processOrder: validator.body(processOrderSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateOrderStaffOptician: validator.body(updateOrderStaffOpticianSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    exportData: validator.query(exportDataSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    orderHtoDetail: validator.query(orderHtoDetailSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    htoAppointmentBook: validator.body(htoAppointmentBookSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateHtoDetail: validator.body(updateHtoDetailSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateStockStoreInOrder: validator.body(updateStockStoreInOrderSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    opticianCalendar: validator.query(opticianCalendarSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    changeLens: validator.body(changeLensSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    searchProduct: validator.query(textSearchSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    productSku: validator.query(productSkuSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addVoucher: validator.body(addVoucherSkuSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    getVoucher: validator.query(getVoucherSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    getVoucherDetail: validator.query(getVoucherDetailSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateVoucher: validator.body(updateVoucherSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    deleteRecord: validator.params(deleteSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    applyVoucher: validator.body(applyVoucherSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    elasticType: validator.body(elasticTypeSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    orderDelivery: validator.body(orderDeliverySchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    resetPassword: validator.body(resetPasswordSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    resetTimezone: validator.body(resetTimezoneSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    orderCheckout: validator.body(checkoutSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    password: validator.body(passwordSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addAdminUser: validator.body(addAdminUserSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateAdminUser: validator.body(updateAdminUserSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateAdminUserStatus: validator.body(updateAdminUserStatusSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addStore: validator.body(storeSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateStore: validator.body(storeSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateStoreActivity: validator.body(updateStoreActivitySchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addFrameName: validator.body(addFrameNameSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateFrameNameActivity: validator.body(updateFrameNameActivitySchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addFrameColor: validator.body(addFrameColorSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateFrameColorActivity: validator.body(updateFrameColorActivitySchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addEmployee: validator.body(addEmployeeSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateEmployee: validator.body(updateEmployeeSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    getStores: validator.query(getStoresSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    frameSizeAvialability: validator.query(frameSizeAvialabilitySchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    addFrameSku: validator.body(addFrameSkuSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    updateFrameSku: validator.body(updateFrameSkuSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    setFrameImages: validator.body(setFrameImageschema, {
        joi: { convert: true, allowUnknown: false }
    }),   
    redeemCoffee: validator.body(redeemCoffeeSchema, {
       joi : { convert: true, allowUnknown: false }
    })
};



