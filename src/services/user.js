
const config = require('config');
const _ = require('lodash');
const moment = require('moment-timezone');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const db = require('../utilities/database');
const { messages, utils, constants, errorHandler, s3Upload, elasticsearch: { esClient } } = require('../core');
const turbolyUtility = require('../utilities/turboly');
const { authChecker, cache } = require('../middleware');
const whatsapp = require('./whatsapp');
const citcall = require('./citcall');
const sms = require('../core/awsSNS');
const ninjaExpress = require('./ninjaExpress');
const saturdayCredits = require('./saturdayPoints');
const { htoReturn, purchaseNotification, htoNotification, appointmentNotification, welcomeNotification, htoRescheduleNotification, appointmentRescheduleNotification } = require('../utilities/notification');
const { getOrderDetail, getHtoSlot } = require('../utilities/notification/orderData');
const { generateJwtToken } = authChecker;
const { elasticsearch } = require('../utilities');
const { addCustomerActivityLogs } = require('./admin/logs');

let staticImagesNew = () => {
    let images = [
        {
            'image_key': 'assets/image_unavail_E_0.jpg',
            'image_category': 'OPTICAL',
            'image_type': 'FRAME',
            'image_code': 'E_0_U'
        },
        {
            'image_key': 'assets/image_unavail_E_1.jpg',
            'image_category': 'OPTICAL',
            'image_type': 'FRAME',
            'image_code': 'E_1_U'
        },
        {
            'image_key': 'assets/image_unavail_E_2_E_4.jpg',
            'image_category': 'OPTICAL',
            'image_type': 'FRAME',
            'image_code': 'E_2_U'
        },
        {
            'image_key': 'assets/image_unavail_E_2_E_4.jpg',
            'image_category': 'OPTICAL',
            'image_type': 'FRAME',
            'image_code': 'E_3_U'
        },
        {
            'image_key': 'assets/image_unavail_E_2_E_4.jpg',
            'image_category': 'OPTICAL',
            'image_type': 'FRAME',
            'image_code': 'E_4_U'
        },
        {
            'image_key': 'assets/image_unavail_E_2_E_4.jpg',
            'image_category': 'OPTICAL',
            'image_type': 'FRAME',
            'image_code': 'E_6_U'
        }
    ];
    return images;
};

const getConfigDetails = async (payload) => {
    return ({
        frames: {
            fit: {
                narrow: {
                    label: 'NARROW',
                    lense_width: 1,
                    bridge: 1,
                    temple_length: 1
                },
                medium: {
                    label: 'MEDIUM',
                    lense_width: 1,
                    bridge: 1,
                    temple_length: 1
                },
                wide: {
                    label: 'WIDE',
                    lense_width: 1,
                    bridge: 1,
                    temple_length: 1
                },
                extrawide: {
                    label: 'EXTRA WIDE',
                    lense_width: 1,
                    bridge: 1,
                    temple_length: 1
                }
            },
            faceShape: {
                round: {
                    lable: 'ROUND',
                    faceImageURL: 'URL',
                },
                triangle: {
                    lable: 'TRIANGLE',
                    faceImageURL: 'URL',
                },
                square: {
                    lable: 'SQUARE',
                    faceImageURL: 'URL',
                },
                oval: {
                    lable: 'OVAL',
                    faceImageURL: 'URL',
                },
                heart: {
                    lable: 'HEART',
                    faceImageURL: 'URL',
                },
            },
            frameShape: {
                round: {
                    lable: 'ROUND',
                    frameImageURL: 'URL',
                },
                square: {
                    lable: 'SQUARE',
                    frameImageURL: 'URL',
                },
                aviator: {
                    lable: 'AVIATOR',
                    frameImageURL: 'URL',
                },
                cateye: {
                    lable: 'CAT-EYES',
                    frameImageURL: 'URL',
                }
            },
            material: {
                acetate: {
                    label: 'ACETATE',
                    iconURL: 'URL'
                },
                metal: {
                    label: 'METAL',
                    iconURL: 'URL'
                },
                mixed: {
                    label: 'MIXED',
                    iconURL: 'URL'
                },
                titanium: {
                    label: 'TITANIUM',
                    iconURL: 'URL'
                }
            },
            lenses: {
                label: 'SUPERIOR LENSES',
                title: 'Sample Text',
                description: 'Sample text'
            },
            warranty: {
                label: 'WARRANTY',
                title: 'Sample Text',
                description: 'Sample text'
            },
            return: {
                label: 'DELIVERY AND RETURNS',
                title: 'Sample Text',
                description: 'Sample text'
            }
        }
    });
};

// TODO: order status check
// NOTE: DO NOT Change: Amit Sangwan
const validateUserVoucher = async (userDetails, voucherCode, cartItems, cartItemAddons) => {
    let voucherDiscountAmount = 0;
    let current_date = new Date();
    let userId = userDetails.id;

    let voucherQuery = `select *
        from voucher_details vd
        where voucher_code = :voucher_code and is_expired = false and start_at < current_timestamp;`;

    let discountIneligibleSkuQuery  = 'select sku_code from voucher_exclusive_sku where status = 1';

    let discountIneligibleSkuMappingQuery  = `select ves.sku_code from voucher_excludes_sku ves
        inner join voucher_details vd on vd.id = ves.voucher_id
        where vd.voucher_code = :voucher_code and vd.status = 1 and ves.status = 1;`;

    let discountEligibleSkuMappingQuery  = `select vis.sku_code from voucher_includes_sku  vis
        inner join voucher_details vd on vd.id = vis.voucher_id
        where vd.voucher_code = :voucher_code and vd.status = 1 and vis.status = 1;`;

    let userOrderQuery = `select order_no, user_id, order_amount, voucher_code from order_details
        where user_id = :user_id and status = 1`;
    let voucherCountQuery = 'select count(order_no) as voucher_use_count from order_details where voucher_code = :voucher_code and status = 1';


    let replacements = {
        voucher_code: voucherCode,
        user_id: userId
    };

    let promiseArr = [];

    promiseArr.push(db.rawQuery(voucherQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(discountIneligibleSkuQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(discountIneligibleSkuMappingQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(discountEligibleSkuMappingQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(userOrderQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(voucherCountQuery, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);

    let vouchers = results[0];
    let discountIneligibleSkus = results[1];
    let discountIneligibleSkusMapping = results[2];
    let discountEligibleSkusMapping = results[3];
    let userOrderResult = results[4];
    let voucherCountResult = results[5];

    if (vouchers.length == 0) {
        throw new Error('Invalid voucher code.');
    }

    let voucherDetails = vouchers[0];

    if (!voucherDetails.avilabilty_type.includes(2)) {
        throw new Error('Invalid voucher code.');
    }

    let userVoucherResult = _.filter(userOrderResult, (res) => {
        return res.voucher_code == voucherCode;
    });

    // Referral voucher code additional check
    if (voucherDetails.voucher_category == constants.voucherCategory.REFERRAL) {
        if (userId == voucherDetails.user_id) {
            throw new Error('Invalid voucher code.');
        }

        if (userDetails.registration_referral_code !== '' && userDetails.registration_referral_code !== null) {
            if (userDetails.registration_referral_code !== voucherCode) {
                throw new Error('Invalid voucher code.');
            }
        }
    }

    // user specific voucher code additional check
    if (voucherDetails.voucher_category == constants.voucherCategory.USER) {
        if (userId !== voucherDetails.user_id) {
            throw new Error('Invalid voucher code.');
        }
    }

    // voucher max count check 
    if (voucherDetails.count_constraint == true && voucherDetails.max_count < voucherCountResult[0].voucher_use_count) {
        throw new Error('Voucher code usage has exceeded the quota limit.');
    }

    // per user max count check 
    if (voucherDetails.single_user_count_constraint == true && voucherDetails.single_user_max_count < userVoucherResult.length) {
        throw new Error('Voucher code is already redeemed.');
    }

    // cart item count check
    if (voucherDetails.max_cart_size < cartItems.length) {
        throw new Error(`${voucherDetails.max_cart_size} frame allowed per order for this voucher.`);
    }

    // first order check
    if (voucherDetails.first_order == true && userOrderResult.length > 0) {
        throw new Error('Promo code is only applicable on first order.');
    }

    // voucher start date check
    if (voucherDetails.start_at > current_date) {
        throw new Error('Invalid voucher code.');
    }

    // voucher expiry check
    if (voucherDetails.date_constraint == true && voucherDetails.expire_at < current_date) {
        throw new Error('Voucher code is expired.');
    }

    let ineligbleSkuList = [];
    let eligbleSkuList = [];

    if(voucherDetails.voucher_sku_mapping_type == 1) {
        for(sku of discountIneligibleSkus) {
            ineligbleSkuList.push(sku.sku_code);
        }
        for(sku of discountIneligibleSkusMapping) {
            ineligbleSkuList.push(sku.sku_code);
        }
    } else if (voucherDetails.voucher_sku_mapping_type == 2) {
        for (sku of discountIneligibleSkusMapping) {
            ineligbleSkuList.push(sku.sku_code);
        }
    } else if (voucherDetails.voucher_sku_mapping_type == 3) {
        for(sku of discountEligibleSkusMapping) {
            eligbleSkuList.push(sku.sku_code);
        }
    }

    let cartAmount = 0;
    for (cartItem of cartItems) {
        // ineligible frame list
        if( (voucherDetails.voucher_sku_mapping_type == 1 || voucherDetails.voucher_sku_mapping_type == 2)
                && ineligbleSkuList.includes(cartItem.sku_code)
            ) {
            throw new Error(`Voucher code is not applicable on ${cartItem.frame_name} - ${cartItem.variant_name}. Please remove from cart.`);
        } else if ( voucherDetails.voucher_sku_mapping_type == 3
                && !eligbleSkuList.includes(cartItem.sku_code)
            ) {
            throw new Error(`Voucher code is not applicable on ${cartItem.frame_name} - ${cartItem.variant_name}. Please remove from cart.`);
        }
        cartAmount += cartItem.retail_price * cartItem.item_count;
    }

    for (cartItemAddon of cartItemAddons) {
        // ineligible addon list
        if( (voucherDetails.voucher_sku_mapping_type == 1 || voucherDetails.voucher_sku_mapping_type == 2)
            && ineligbleSkuList.includes(cartItemAddon.sku)) {
            throw new Error(`Voucher code is not applicable on addon ${cartItemAddon.name}. Please remove from cart.`);
        } else if( voucherDetails.voucher_sku_mapping_type == 3
                && !eligbleSkuList.includes(cartItemAddon.sku)) {
            throw new Error(`Voucher code is not applicable on addon ${cartItemAddon.name}. Please remove from cart.`);
        }

        cartAmount += cartItemAddon.retail_price * cartItemAddon.addon_item_count;
    }

    // minimum cart value
    if (cartAmount < voucherDetails.minimum_cart_amount) {
        throw new Error(`Minimum order amount required ${voucherDetails.minimum_cart_amount} .`);
    }

    if (voucherDetails.voucher_type == constants.voucherType.percentage) {
        voucherDiscountAmount = Math.floor((cartAmount * voucherDetails.voucher_percentage) / 100);
        if (voucherDiscountAmount >= voucherDetails.voucher_max_amount) {
            voucherDiscountAmount = voucherDetails.voucher_max_amount;
        }
    } else if (voucherDetails.voucher_type == constants.voucherType.absolute) {
        voucherDiscountAmount = voucherDetails.voucher_amount;
    }

    let response = {
        is_active: true,
        cartAmount: cartAmount,
        voucherDiscountAmount: voucherDiscountAmount,
        discountedCartAmount: cartAmount - voucherDiscountAmount,
        voucherDetails: voucherDetails
    };

    return response;
};

// NOTE: DO NOT Change: Amit Sangwan
const validateUserCredits = async (userId, cartItems, cartItemAddons) => {
    let orderAmount = 0;
    for (cartItem of cartItems) {
        orderAmount += cartItem.retail_price * cartItem.item_count;
    }

    for (cartItemAddon of cartItemAddons) {
        orderAmount += cartItemAddon.retail_price * cartItemAddon.addon_item_count;
    }

    let userCreditQuery = `select opening_balance, closing_balance from user_credits
        where status = 1 and user_id = :user_id
        order by created_at desc limit 1`;

    let replacements = {
        user_id: userId
    };

    let userCreditsResults = await db.rawQuery(userCreditQuery, 'SELECT', replacements);

    let response = {
        orderAmount: orderAmount,
        totalCreditAmount: 0,
        orderCreditAmount: 0
    };

    if (userCreditsResults.length !== 0) {
        let closingBalance = userCreditsResults[0].closing_balance;
        response.totalCreditAmount = closingBalance;
        if (closingBalance > orderAmount) {
            response.orderCreditAmount = orderAmount;
        } else {
            response.orderCreditAmount = closingBalance;
        }
    }

    return response;
};

// NOTE: DO NOT Change: Amit Sangwan
const validateeyewearPointsCredit = async (userId, cartItems, cartItemAddons) => {
    let orderAmount = 0;
    for (cartItem of cartItems) {
        orderAmount += cartItem.retail_price * cartItem.item_count;
    }

    for (cartItemAddon of cartItemAddons) {
        orderAmount += cartItemAddon.retail_price * cartItemAddon.addon_item_count;
    }

    let userCreditQuery = `select opening_balance, closing_balance, opening_points, closing_points from eyewear_points_transactions
                            where status = 1 and user_id = :user_id
                            order by created_at desc limit 1`;

    let replacements = {
        user_id: userId
    };

    let stCreditsResults = await db.rawQuery(userCreditQuery, 'SELECT', replacements);

    let response = {
        orderAmount: orderAmount,
        totalCreditAmount: 0,
        totalCreditPoints: 0,
        orderCreditAmount: 0,
        orderCreditPoints: 0,
    };

    if (stCreditsResults.length !== 0) {
        let closingBalance = stCreditsResults[0].closing_balance;
        let closingPoints = stCreditsResults[0].closing_points;
        response.totalCreditAmount = closingBalance;
        response.totalCreditPoints = closingPoints;
        if (closingBalance > orderAmount) {
            response.orderCreditAmount = orderAmount;
            response.orderCreditPonits = orderAmount/1000;
        } else {
            response.orderCreditAmount = closingBalance;
            response.orderCreditPoints = closingPoints;
        }
    }
    return response;
};

const formatOrderDetails = async (order, isAdmin = false) => {
    let response = {};
    let { orderDetail, orderItems, orderItemAddons, orderPaymentDetail, orderHTOScheduleDetail, orderImages, clipons, orderChangedAddon } = order;

    response.order_no = orderDetail.order_no;
    response.email_id = orderDetail.email_id;
    response.voucher_code = orderDetail.voucher_code;
    response.is_hto = orderDetail.is_hto;
    response.payment_amount = orderDetail.payment_amount;
    response.order_amount = orderDetail.order_amount;
    response.order_discount_amount = orderDetail.order_discount_amount;
    response.user_credit_amount = orderDetail.user_credit_amount;
    response.eyewear_points_credit = orderDetail.eyewear_points_credit;
    response.is_eyewear_points_credit = orderDetail.is_eyewear_points_credit;
    response.currency = orderDetail.currency;
    response.country_code = orderDetail.country_code;
    response.currency_code = orderDetail.currency_code;
    response.scheduled_delivery_date = orderDetail.scheduled_delivery_date;
    response.actual_delivery_date = orderDetail.actual_delivery_date;
    response.order_status = orderDetail.order_status;
    response.is_payment_required = orderDetail.is_payment_required;
    response.is_local_order = orderDetail.is_local_order;
    response.fulfillment_type = orderDetail.fulfillment_type;
    response.created_at = orderDetail.created_at;
    response.updated_at = orderDetail.updated_at;
    response.is_return = orderDetail.is_return;
    response.sales_channel = orderDetail.sales_channel;
    response.created_by_staff = orderDetail.created_by_staff;
    response.optician = orderDetail.optician;
    response.base_url = config.s3URL;
    response.stock_store_id = orderDetail.stock_store_id || '';

    if (isAdmin) {
        const orderHistory = await db.findOneByCondition({ order_no: orderDetail.order_no, status: constants.order_status.PAYMENT_CONFIRMED }, 'OrdersHistory', ['created_at']);
        response.payment_date = orderHistory ? orderHistory.created_at : null;
        response.user = await db.findOneByCondition({ id: orderDetail.user_id }, 'User', ['id', 'name', 'mobile', 'dob', 'gender']);
    }

    if (orderDetail.store_id) {
        const store = await db.findOneByCondition({ id: orderDetail.store_id }, 'Store', ['id', 'name', 'address', 'store_code', 'phone', 'lat', 'long', 'store_image_key', 'store_timing']);
        response.store = store || null;
    }

    if (orderDetail.pick_up_store_id) {
        const store = await db.findOneByCondition({ id: orderDetail.pick_up_store_id }, 'Store', ['id', 'name', 'address', 'store_code', 'phone', 'lat', 'long', 'store_image_key', 'store_timing']);
        response.pick_up_store_id = store || null;
    }

    if (orderDetail.fulfillment_type == 1) {
        response.addressDetails = {
            receiver_name: orderDetail.receiver_name,
            label_address: orderDetail.label_address,
            address_phone_number: orderDetail.address_phone_number,
            note: orderDetail.note,
            zip_code: orderDetail.zip_code,
            address: orderDetail.address,
            address_details: orderDetail.address_details,
            position: orderDetail.position,
            lat: orderDetail.lat,
            long: orderDetail.long,
        };
    } else {
        response.addressDetails = {};
    }

    if (response.is_local_order) {
        response.payment_method = constants.payment_method['4'];
        response.paymentDetails = {};
        response.hTOScheduleDetails = orderHTOScheduleDetail;
    } else {
        response.payment_method = orderPaymentDetail ? orderPaymentDetail.payment_method : '';
        response.paymentDetails = orderPaymentDetail || {};
        response.hTOScheduleDetails = {};
    }

    let frames = orderItems.map(item => {
        let frame = {
            frame_name: item.frame_name,
            frame_code: item.frame_code,
            frame_size: item.size_label,
            size_code: item.size_code,
            variant_name: item.variant_name,
            variant_code: item.variant_code,
            image_url: item.image_url,
            sku_code: item.sku_code,
            retail_price: item.retail_price,
            currency_code: item.currency_code,
            country_code: orderDetail.country_code,
            discount_amount: item.discount_amount,
            user_credit: item.user_credit,
            tax_rate: item.tax_rate,
            quantity: item.quantity,
            total_price: item.order_item_total_price,
            product_category: item.product_category,
            prescription_label: item.label || '',
            prescription_spheris_l: item.spheris_l || 0,
            prescription_spheris_r: item.spheris_r || 0,
            prescription_cylinder_l: item.cylinder_l || 0,
            prescription_cylinder_r: item.cylinder_r || 0,
            prescription_axis_l: item.axis_l || 0,
            prescription_axis_r: item.axis_r || 0,
            prescription_addition_l: item.addition_l || 0,
            prescription_addition_r: item.addition_r || 0,
            prescription_pupilary_distance: item.pupilary_distance || 0,
            is_warranty: item.is_warranty,
            discount_note: item.discount_note,
            discount_type: item.discount_type,
            packages: item.packages,
            order_item_id: item.order_item_id || null
        };

        let image_category = 'OPTICAL';
        if (item.product_category == 1) {
            image_category = 'OPTICAL';
        } else if (item.product_category == 2) {
            image_category = 'SUNWEAR';
        }
        let images = orderImages.filter(image => {
            return image.sku_code == item.sku_code && image.image_category == image_category;
        });
        if (images.length == 0) {
            frame.images = staticImagesNew();
            let base_image = _.find(frame.images, (image) => {
                return _.includes(image.image_key, '_0_U');
            });
            if (typeof (base_image) == 'undefined') {
                frame.image_url = 'assets/image_unavail_E_0.jpg';
            } else {
                frame.image_url = base_image.image_key;
            }
        } else {
            frame.images = images;
            let base_image = _.find(frame.images, (image) => {
                return _.includes(image.image_key, '_0_U');
            });
            if (typeof (base_image) == 'undefined') {
                frame.image_url = 'assets/image_unavail_E_0.jpg';
            } else {
                frame.image_url = base_image.image_key;
            }
        }
        frame.base_url = config.s3URL;
        let addOns = orderItemAddons.filter(addon => addon.order_item_id && addon.order_item_id.toString() == item.order_item_id.toString());
        let changedAddOns = orderChangedAddon ? orderChangedAddon.filter(addon => addon.order_item_id && addon.order_item_id.toString() == item.order_item_id.toString()) : [];
        let frame_total_price = (item.retail_price * item.quantity) - item.discount_amount;
        if (item.is_warranty === 1) {
            frame_total_price += constants.warrantyPrice;
        }
        let lense_details = addOns.map(addon => {
            let lense_color_label = 'Clear';
            let lense_color = _.find(constants.lenseColors, (lenseColor) => {
                return lenseColor.lense_color_code == addon.lense_color_code;
            });
            if(lense_color) {
                lense_color_label = lense_color.lense_color_label;
            }
            let frameAddon = {
                category_name: addon.category_name,
                lense_type_name: addon.lense_type_name,
                lense_type_amount: addon.lense_type_amount,
                is_prescription: addon.is_prescription,
                prescription_name: addon.prescription_name,
                prescription_amount: addon.prescription_amount,
                is_filter: addon.is_filter,
                filter_name: addon.filter_type_name,
                filter_amount: addon.filter_type_amount,
                sku_code: addon.sku_code,
                lense_color_code: addon.lense_color_code,
                lense_color_label: lense_color_label,
                retail_price: addon.retail_price * addon.quantity,
                currency_code: addon.currency_code,
                country_code: orderDetail.country_code,
                quantity: addon.quantity,
                type: addon.type,
                is_sunwear: addon.is_sunwear,
                discount_amount: addon.discount_amount,
                user_credit: addon.user_credit,
                eyewear_points_credit: addon.eyewear_points_credit,
                discount_note: addon.discount_note,
                discount_type: addon.discount_type,
                name: addon.name || '',
                index_value: addon.index_value || null,
                is_lens_change: addon.is_lens_change || false
            };
            frame_total_price += (addon.retail_price * addon.quantity) - addon.discount_amount;
            return frameAddon;
        });
        let changed_lense_details = changedAddOns.map(addon => {
            let frameAddon = {
                category_name: addon.category_name,
                lense_type_name: addon.lense_type_name,
                lense_type_amount: addon.lense_type_amount,
                is_prescription: addon.is_prescription,
                prescription_name: addon.prescription_name,
                prescription_amount: addon.prescription_amount,
                is_filter: addon.is_filter,
                filter_name: addon.filter_type_name,
                filter_amount: addon.filter_type_amount,
                sku_code: addon.sku_code,
                retail_price: addon.retail_price * addon.quantity,
                quantity: addon.quantity,
                type: addon.type,
                is_sunwear: addon.is_sunwear,
                discount_amount: addon.discount_amount,
                user_credit: addon.user_credit,
                discount_note: addon.discount_note,
                discount_type: addon.discount_type,
                name: addon.name || '',
                index_value: addon.index_value || null,
                currency_code: 'IDR',
                country_code: 'ID',
            };
            //frame_total_price += (addon.retail_price*addon.quantity) - addon.discount_amount;
            return frameAddon;
        });

        frame.frame_total_price = frame_total_price;
        frame.lense_details = lense_details;
        frame.changed_lense_details = changed_lense_details;

        return frame;
    });

    response.frames = frames;

    let addOnsOnly = orderItemAddons.filter(addon => !addon.order_item_id);

    addOnsOnly = addOnsOnly.map(addon => {
        return ({
            category_name: addon.category_name,
            lense_type_name: addon.lense_type_name,
            lense_type_amount: addon.lense_type_amount,
            is_prescription: addon.is_prescription,
            prescription_name: addon.prescription_name,
            prescription_amount: addon.prescription_amount,
            is_filter: addon.is_filter,
            filter_name: addon.filter_type_name,
            filter_amount: addon.filter_type_amount,
            sku_code: addon.sku_code,
            retail_price: addon.retail_price * addon.quantity,
            quantity: addon.quantity,
            prescription_label: addon.label || '',
            prescription_spheris_l: addon.spheris_l || 0,
            prescription_spheris_r: addon.spheris_r || 0,
            prescription_cylinder_l: addon.cylinder_l || 0,
            prescription_cylinder_r: addon.cylinder_r || 0,
            prescription_axis_l: addon.axis_l || 0,
            prescription_axis_r: addon.axis_r || 0,
            prescription_addition_l: addon.addition_l || 0,
            prescription_addition_r: addon.addition_r || 0,
            prescription_pupilary_distance: addon.pupilary_distance || 0,
            type: addon.type,
            is_sunwear: addon.is_sunwear,
            discount_amount: addon.discount_amount,
            user_credit: addon.user_credit,
            discount_note: addon.discount_note,
            discount_type: addon.discount_type,
            name: addon.name || '',
            index_value: addon.index_value || null,
            packages: addon.packages,
            currency_code: 'IDR',
            country_code: 'ID'
        });
    });

    response.addOnsOnly = addOnsOnly;
    response.clipons = clipons;

    return response;
};

const _assignOptician = async (appointment_date, slot_id) => {
    // logic for selecting optician
    // 1. First check for any optician is free for that time slot
    // 2. Secondaly check that the avialable opticain is fullfilling how many slot for that day and assign to that optician who have lowest slot for that day

    let optician_id = '';

    let opticianQuery = 'select * from optician order by id';
    let appointmentQuery = `select * from appointment ap
        inner join appointment_time_details atd on
            atd.appointment_id = ap.id
        where atd.slot_id = :slot_id and Date(atd.appointment_date) = :appointment_date and atd.status = 1 and ap.status = 1`;
    let opticianAppointments = `select atd.optician_id, count(atd.id)
            from appointment ap
            inner join appointment_time_details atd on
                atd.appointment_id = ap.id
            where Date(atd.appointment_date) = :appointment_date and atd.status = 1 and ap.status = 1
            group by atd.optician_id order by count(atd.id)`;

    let replacements = {
        appointment_date: moment(appointment_date).format('YYYY-MM-DD'),
        slot_id,
    };

    let promiseArr = [];

    promiseArr.push(db.rawQuery(opticianQuery, 'SELECT', {}));
    promiseArr.push(db.rawQuery(appointmentQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(opticianAppointments, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);

    let opticians = results[0];
    let bookedAppointments = results[1];
    let bookedAppointmentCount = results[2];

    if (bookedAppointments.length !== 0) {
        let availableOpticians = opticians.filter((optician) => {
            return !bookedAppointments.some((appointment) => {
                return optician.id == appointment.optician_id;
            });
        });

        if (availableOpticians.length !== 0) {
            let availOpticians = availableOpticians.filter((optician) => {
                return !bookedAppointmentCount.some((appointment) => {
                    return optician.id == appointment.optician_id;
                });
            });

            if (availOpticians.length !== 0) {
                optician_id = availOpticians[0].id;
            } else {
                optician_id = availableOpticians[0].id;
            }


        } else {
            throw new Error('Please select another time slot.');
        }

    } else {
        if (bookedAppointmentCount.length < opticians.length) {
            let availableOpticians = opticians.filter((optician) => {
                return !bookedAppointmentCount.some((appointment) => {
                    return optician.id == appointment.optician_id;
                });
            });

            if (availableOpticians.length !== 0) {
                optician_id = availableOpticians[0].id;
            } else {
                optician_id = bookedAppointmentCount[0].optician_id;
            }
        } else {
            optician_id = bookedAppointmentCount[0].optician_id;
        }
    }

    return optician_id;
};

// NOTE: DO NOT CHANGE: Amit Sangwan
const register = async (payload) => {
    const isUser = await db.findOneByCondition({ mobile: payload.mobile }, 'User');

    if (isUser) throw errorHandler.customError(messages.mobileAlreadyExists);

    if (payload.is_referral_code) {
        const referralUser = await db.findOneByCondition({
            referral_code: payload.referral_code,
            status: 1,
        }, 'UserReferral');

        if (!referralUser) {
            throw errorHandler.customError(messages.invalidReferralCode);
        }
    } else {
        payload.referral_code = '';
    }

    let transaction = await db.dbTransaction();

    try {
        let promiseArr = [];

        let user_id = uuidv4();
        let password = utils.encryptpassword('satirdays@123');
        let date = new Date();

        // TODO: first name and last name length check
        let name = payload.name;
        let nameArr = name.split(' ');
        if (nameArr.length < 2) {
            throw new Error('First name and last name is required');
        }

        let first_name = nameArr[0];
        let last_name = nameArr[1];

        let referral_code =
            `${first_name.substring(0, 2).toUpperCase()}${last_name.substring(0, 2).toUpperCase()}${utils.generateRandom(4, false)}`;

        // let voucher_code = `${name.substring(0, 4).toUpperCase()}${utils.generateRandom(8, false)}`;
        let voucher_code = referral_code;

        const voucher_expiry_date = new Date();
        voucher_expiry_date.setDate(voucher_expiry_date.getDate() + 2);

        // TODO: update if use in admin service
        let created_by = user_id;
        let channel = payload.channel ? payload.channel : constants.sale_channel.APP;

        let userObj = {
            id: user_id,
            name: payload.name,
            country_code: payload.country_code,
            mobile: payload.mobile,
            gender: payload.gender,
            email: payload.email,
            dob: payload.dob,
            registration_referral_code: payload.referral_code,
            password: password,
            created_at: date,
            created_by: created_by,
            updated_at: date,
            updated_by: created_by,
            channel: channel
        };

        let userLocationObj = {
            user_id,
            language: constants.location.language,
            country_code: constants.location.country_code,
            currency_code: constants.location.currency_code,
            timezone: constants.location.timezone,
            created_by
        };

        let referralObj = {
            user_id: user_id,
            referral_code: referral_code,
            referral_amount: constants.referralDetails.referralAmount,
            created_at: date,
            created_by: created_by,
            updated_at: date,
            updated_by: created_by,
        };

        let voucherObj = {
            voucher_code: voucher_code,
            voucher_type: constants.voucherType.absolute,
            voucher_category: constants.voucherCategory.REFERRAL,
            voucher_amount: constants.referralDetails.voucherAmount,
            voucher_max_amount: constants.referralDetails.voucherAmount,
            minimum_cart_amount: constants.referralDetails.minimumCartAmount,
            voucher_title: constants.referralDetails.voucherTitle,
            voucher_image_key: constants.referralDetails.voucherImageKey,
            user_id: user_id,
            date_constraint: false,
            expire_at: date,
            count_constraint: false,
            max_cart_size: 10,
            start_at: date,
            created_at: date,
            created_by: created_by,
            updated_at: date,
            updated_by: created_by
        };

        promiseArr.push(db.saveData(userObj, 'User', transaction));
        promiseArr.push(db.saveData(userLocationObj, 'UserLocation', transaction));
        promiseArr.push(db.saveData(referralObj, 'UserReferral', transaction));
        promiseArr.push(db.saveData(voucherObj, 'VoucherDetails', transaction));

        if (payload.is_referral_code) {
            let user_voucher_code = `${name.substring(0, 4).toUpperCase()}${utils.generateRandom(4, false)}`;
            let userVoucherObj = {
                voucher_code: user_voucher_code,
                voucher_type: constants.voucherType.absolute,
                voucher_category: constants.voucherCategory.USER,
                voucher_amount: constants.referralDetails.voucherAmount,
                voucher_max_amount: constants.referralDetails.voucherAmount,
                minimum_cart_amount: constants.referralDetails.minimumCartAmount,
                voucher_title: constants.referralDetails.voucherTitle,
                voucher_image_key: constants.referralDetails.voucherImageKey,
                is_single_user: true,
                user_id: user_id,
                date_constraint: true,
                expire_at: voucher_expiry_date,
                start_at: date,
                max_cart_size: 10,
                created_at: date,
                created_by: created_by,
                updated_at: date,
                updated_by: created_by
            };
            promiseArr.push(db.saveData(userVoucherObj, 'VoucherDetails', transaction));
        }

        let results = await Promise.all(promiseArr);

        await transaction.commit();

        let userData = results[0];
        let userLocationData = results[1];
        userData = userData.toJSON();
        userLocationData = userLocationData.toJSON();

        const token = generateJwtToken(userData);
        let data = {
            login_token: token,
            user_id: userData.id
        };

        if (payload['device_token']) {
            data = {
                ...data,
                device_token: payload.device_token,
                device_type: payload.device_type
            };
        }

        await db.saveData(data, 'UserDevices');

        // TODO: change this to utitilty code
        await esClient.index({
            index: 'users',
            type: '_doc',
            body: {
                id: userData.id,
                name: userData.name,
                mobile: userData.mobile,
                email: userData.email,
                dob: userData.dob,
                gender: userData.gender,
                country_code: payload.country_code
            }
        });

        welcomeNotification(userData.id);

        let response = {
            token,
            id: userData.id,
            // country_code: userData.country_code,
            country_calling_code: userData.country_code,
            mobile: userData.mobile,
            name: userData.name,
            email: userData.email,
            gender: userData.gender,
            dob: userData.dob,
            is_send_notifications: userData.is_send_notifications,
            is_send_email: userData.is_send_email,
            // currency: userData.currency,
            // language: userData.language,
            is_send_newsletter: userData.is_send_newsletter,
            profile_image_base_url: config.aws.s3URL,
            profile_image: userData.profile_image,
            referral_code: referralObj.referral_code,
            referral_amount: referralObj.referral_amount,
            is_first_order: userData.is_first_order,
            language: userLocationData.language,
            country_code: userLocationData.country_code,
            currency_code: userLocationData.currency_code,
            timezone: userLocationData.timezone
        };

        await addCustomerActivityLogs({
            user_id: userData.id,
            action: constants.logs_action.signup
        });
        return response;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw errorHandler.customError(messages.systemError);
    }
};

const login = async (payload) => {
    const user = await db.findOneByCondition({ mobile: payload.mobile, role: 2 }, 'User');
    const otp = await db.findOneByCondition({ otp: payload.otp, is_verified: false }, 'UserOtp', ['id']);

    if (!user) throw errorHandler.customError(messages.invalidCredentials);
    if (!otp) throw errorHandler.customError(messages.invalidOTP);
    await db.updateOneByCondition({ is_verified: true }, { id: otp.id }, 'UserOtp');

    const userReferralObj = await db.findOneByCondition({
        user_id: user.id,
        status: 1,
    }, 'UserReferral');

    const userLocationObj = await db.findOneByCondition({
        user_id: user.id,
        status: 1,
    }, 'UserLocation');

    const token = generateJwtToken(user);
    let data = {
        login_token: token,
        user_id: user.id
    };
    if (payload['device_token']) {
        data = {
            ...data,
            device_token: payload.device_token,
            device_type: payload.device_type
        };
    }
    await db.saveData(data, 'UserDevices');
    let userObj = {
        token,
        id: user.id,
        // country_code: user.country_code,
        country_calling_code: user.country_code,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        is_send_notifications: user.is_send_notifications,
        is_send_email: user.is_send_email,
        // currency: user.currency,
        // language: user.language,
        is_send_newsletter: user.is_send_newsletter,
        profile_image_base_url: config.aws.s3URL,
        profile_image: user.profile_image,
        cart_count: {
            purchased: await db.count({ user_id: user.id, type: 1 }, 'CartItems'),
            hto: await db.count({ user_id: user.id, type: 2 }, 'CartItems')
        },
        wishlist_count: await db.count({ user_id: user.id }, 'UserWishlist'),
        isUserAddress: await db.count({ user_id: user.id, status: true }, 'UserAddress') > 0,
        is_first_order: user.is_first_order,
        referral_code: '',
        referral_amount: 0,
        language: constants.location.language,
        country_code: constants.location.country_code,
        currency_code: constants.location.currency_code,
        timezone: constants.location.timezone
    };

    if (userReferralObj) {
        userObj.referral_code = userReferralObj.referral_code;
        userObj.referral_amount = userReferralObj.referral_amount;
    }

    if (userLocationObj) {
        userObj.language = userLocationObj.language;
        userObj.country_code = userLocationObj.country_code;
        userObj.currency_code = userLocationObj.currency_code;
        userObj.timezone = userLocationObj.timezone;
    }

    return userObj;

};

const logout = async (payload) => {
    return await db.deleteRecord({ login_token: payload[1] }, 'UserDevices');
};

const getStores = async (payload) => {
    let replacements = {
        status: 1,
    };

    let query = 'select * from stores where status = 1 and active = true';
    let condition = '';

    if (!_.isUndefined(payload.id)) {
        condition = ' and id = :id';
        replacements.id = payload.id;
    }

    query = query + condition;

    const data = await db.rawQuery(query, 'SELECT', replacements);

    let stores = data.map(row => {
        let data = {
            id: row.id,
            name: row.name,
            address: row.address,
            store_code: row.store_code,
            store_region: row.store_region,
            phone: row.phone,
            fax: row.fax,
            email: row.email,
            sales_tax: row.sales_tax,
            ecommerce: row.ecommerce,
            can_access_other_store_stocks: row.can_access_other_store_stocks,
            active: row.active,
            zipcode: row.zipcode,
            city: row.city,
            province: row.province,
            lat: row.lat,
            long: row.long,
            store_image_key: row.store_image_key,
            map_image_key: row.map_image_key,
            store_timing: row.store_timing,
            is_cafe: row.is_cafe,
            base_url: config.s3URL
        };
        if (!_.isUndefined(payload.lat) && !_.isUndefined(payload.long)) {
            data.distance = utils.calDistanceBtwTwoLatLngs(payload.lat, payload.long, data.lat, data.long);
        } else {
            data.distance = -1;
        }
        return data;
    });
    stores.sort((a, b) => {
        return b.is_cafe - a.is_cafe || a.distance - b.distance;
    });
    return stores;
};

const getWishlist = async (payload) => {
    let wishlist_query = `
        select 
            w.id, w.product_category, p.id as product_id, p.sku, 
            p.name, pip.retail_price, pip.currency_code, pip.country_code,
            w.user_id, w.created_at, 
            f.frame_code, f.frame_name, f.variant_name, f.variant_code,
            f.fit, f.icon_image_key, f.material, f.top_pick
        from user_wishlists as w 
        inner join products as p
            on w.sku_code = p.sku
        inner join product_international_prices pip
            on pip.sku_code = p.sku
        inner join frame_master as f 
            on f.sku_code = p.sku
        where w.user_id = :user_id and pip.country_code = :country_code`;

    let replacements = {
        user_id: payload.user_id,
        country_code: payload.country_code || constants.location.country_code
    };

    const data = await db.rawQuery(wishlist_query, 'SELECT', replacements);
    const list = data.map(async row => ({
        id: row.id,
        product_id: row.product_id,
        name: row.name,
        sku_code: row.sku,
        retail_price: row.retail_price,
        currency_code: row.currency_code,
        country_code: row.country_code,
        company_supply_price: row.company_supply_price,
        product_tags: row.product_tags,
        user_id: row.user_id,
        frame_code: row.frame_code,
        frame_name: row.frame_name,
        variant_name: row.variant_name,
        variant_code: row.variant_code,
        icon_image_key: row.icon_image_key,
        fit: row.fit,
        material: row.material,
        top_pick: row.top_pick,
        materialDetails: constants['material'][row.material],
        product_category: row.product_category,
        base_url: config.s3URL,
        sizeVariants: await db.rawQuery(
            `select 
                p.id as turboly_id, fm.frame_code, fm.variant_code, fm.sku_code, 
                fm.eyewear_vto as is_vto, fm.eyewear_vto, fm.sunwear_vto, fm.size_label, fm.size_key
            from frame_master fm
            inner join products p
                on p.sku = fm.sku_code
            where fm.frame_code = :frame_code and fm.variant_code = :variant_code`,
            'SELECT', {
                frame_code: row.frame_code,
                variant_code: row.variant_code,
            }
        ),
        images: await db.rawQuery(
            `select fi.image_key, fi.image_type
                from frame_images fi
                inner join frame_master fm on
                fm.frame_code = fi.frame_code and fm.variant_code = fi.variant_code
                where fm.sku_code='${row.sku}' and fi.image_category='${constants.product_category[row.product_category]}' order by fi.image_key`,
            'SELECT'
        ),
        isAvailableForHT: false,
        isWishlisted: true,
        created_at: row.created_at
    }));
    const result = await Promise.all(list);
    // const cacheData = cache.getCacheById(payload.user_id);
    // cache.setUserData(payload.user_id, {...cacheData, 'wishlist': result});
    return result;
};

const addWishlist = async (data) => {
    if (await db.findOneByCondition({ user_id: data.user_id, sku_code: data.sku_code, product_category: data.product_category || 1 }, 'UserWishlist', ['id'])) throw errorHandler.customError(messages.alreadyAddedInWishlist);
    await db.saveData(data, 'UserWishlist');
    return await getWishlist({ 
        user_id: data.user_id,
        country_code: data.country_code
    });
};

const removeWishlist = async (data) => {
    const result = data.product_id.reduce((ids, row) => {
        ids.product_sku.push(row.sku_code);
        ids.category.push(row.product_category);
        return ids;
    }, { product_sku: [], category: [] });

    data.sku_code = result.product_sku;
    data.product_category = result.category;
    
    let country_code = data.country_code;
    delete data.product_id;
    delete data.country_code;
    delete data.currency_code;

    await db.deleteRecord(data, 'UserWishlist');
    return await getWishlist({ 
        user_id: data.user_id,
        country_code
     });
};

const addCart = async (payload) => {
    if (payload['type'] === 2) {
        throw new Error('HTO is discontinued from here!!');
    }

    let query = `select p.sku, p.active, ps.quantity, ps.reserved from products p
        inner join product_stocks ps on ps.sku = p.sku
        where p.sku = :sku_code and ps.store_id = :store_id`;

    let replacements = {
        sku_code: payload.sku_code,
        item_count: payload.item_count,
        store_id: config.turbolyEcomOrder.storeID
    };

    let product_stocks = await db.rawQuery(query, 'SELECT', replacements);

    if (product_stocks.length !== 1) {
        throw new Error('Item does not exists.');
    }

    if (product_stocks[0].active !== true) {
        throw new Error('Item discontinued.');
    }

    if (product_stocks[0].quantity - product_stocks[0].reserved < payload.item_count) {
        throw new Error('Item is out of stock');
    }

    const data = await db.saveData(payload, 'CartItems');
    await addCustomerActivityLogs({
        user_id: payload.user_id,
        action: constants.logs_action.add_cart_items,
        created_by: payload.created_by
    });
    return data.id;
};

const getCart = async (payload) => {
    let cart_query = `select p.name, p.id as product_id, pip.retail_price, pip.country_code, pip.currency_code,
        fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code,
        fm.frame_name, fm.variant_name,
        ci.id, ci.product_category, ci.prescription_id, ci.created_at,
        ci.user_id, ci.item_count, ci.type
        from cart_items as ci
        inner join frame_master as fm on fm.sku_code = ci.sku_code
        inner join products as p on p.sku = fm.sku_code
        inner join product_international_prices pip on pip.sku_code = fm.sku_code
        where ci.user_id = :user_id 
        and ci.status = true
        and pip.country_code = :country_code
        ORDER BY ci.created_at asc`;

    let addon_item_query = `select cai.id, cai.cart_id, cai.addon_product_sku, cai.addon_item_count, cai.prescription_id, cai.lense_color_code,
        p.id as addon_product_id, p.sku, p.name, pip.retail_price, pip.country_code, pip.currency_code,
        ls.lense_type_name, ls.lense_type_amount, ls.is_prescription, ls.prescription_name, ls.prescription_amount,
        ls.filter_type_name, ls.filter_type_amount
        from cart_addon_items as cai
        inner join lense_international_mapping ls on ls.sku_code = cai.addon_product_sku
        inner join products as p on p.sku = cai.addon_product_sku
        inner join product_international_prices pip on pip.sku_code = cai.addon_product_sku
        where cai.user_id = :user_id  and cai.status = true
        and  pip.country_code = :country_code and ls.country_code = :country_code`;

    let user_prescription_query = `SELECT up.id, label, spheris_l, spheris_r, cylinder_l, cylinder_r, axis_l, axis_r
        addition_l, addition_r, pupilary_distance
        FROM user_prescription up
        inner join cart_items ci on ci.prescription_id = up.id
        where ci.user_id = :user_id and ci.status = true and up.status = true;`;

    let image_query = `select fi.image_key, fi.image_type, fi.image_category, ci.id, fm.sku_code
        from frame_images fi
        inner join frame_master fm on fm.frame_code = fi.frame_code and fm.variant_code = fi.variant_code
        inner join cart_items ci on ci.sku_code = fm.sku_code
        where ci.user_id = :user_id and ci.status = true and fi.image_code in ('E_0_U', 'S_0_U')`;

    let frame_size_query = ` select ci.id as cart_id, p.id as turboly_id, sz.size_label, fm2.sku_code, fm2.frame_name, fm2.variant_name
        from cart_items ci 
        inner join frame_master fm on fm.sku_code = ci.sku_code
        inner join frame_master fm2 on fm2.frame_code = fm.frame_code and fm2.variant_code = fm.variant_code
        inner join products p on p.sku = fm2.sku_code
        inner join product_stocks ps on ps.product_id = p.id
        inner join sizes sz on sz.size_code = fm2.size_code
        where ci.user_id = :user_id
        and ci.status = true and  ps.quantity > 0 and ps.store_id = :store_id
        order by ci.id, fm2.size_code`;

    let replacements = {
        user_id: payload.user_id,
        country_code: payload.country_code,
        store_id: config.turbolyEcomOrder.storeID
    };

    const cartItems = await db.rawQuery(cart_query, 'SELECT', replacements);
    const cartItemAddons = await db.rawQuery(addon_item_query, 'SELECT', replacements);
    const userPrescriptions = await db.rawQuery(user_prescription_query, 'SELECT', replacements);
    const cartImages = await db.rawQuery(image_query, 'SELECT', replacements);
    const frameSizes = await db.rawQuery(frame_size_query, 'SELECT', replacements);

    let cartList = [];
    let grand_total = {
        hto: 0,
        purchase: 0,
        country_code: payload.country_code,
        currency_code: payload.currency_code
    };

    for (dbCartItem of cartItems) {
        let addon_items = _.filter(cartItemAddons, (cartItemAddon) => {
            return cartItemAddon.cart_id == dbCartItem.id;
        });

        let prescription_details = _.find(userPrescriptions, (userPrescription) => {
            return userPrescription.id == dbCartItem.prescription_id;
        });

        let images = _.filter(cartImages, (image) => {
            return (dbCartItem.sku_code == image.sku_code && constants.product_category[dbCartItem.product_category] == image.image_category);
        });

        let product_total_price = dbCartItem.retail_price * dbCartItem.item_count;
        addon_items.forEach(item => {
            let lense_color_label = 'Clear';
            let lense_color = _.find(constants.lenseColors, (lenseColor) => {
                return lenseColor.lense_color_code == item.lense_color_code;
            });
            if(lense_color) {
                lense_color_label = lense_color.lense_color_label;
            }
            item.lense_color_label = lense_color_label;
            product_total_price += item.retail_price * item.addon_item_count;
        });

        let frame_sizes = _.filter(frameSizes, (frameSize) => {
            return frameSize.cart_id == dbCartItem.id;
        });

        let cartItem = {
            id: dbCartItem.id,
            user_id: dbCartItem.user_id,
            name: dbCartItem.name,
            product_id: dbCartItem.product_id,
            sku_code: dbCartItem.sku_code,
            frame_code: dbCartItem.frame_code,
            frame_name: dbCartItem.frame_name,
            variant_code: dbCartItem.variant_code,
            variant_name: dbCartItem.variant_name,
            retail_price: dbCartItem.retail_price,
            country_code: dbCartItem.country_code,
            currency_code: dbCartItem.currency_code,
            frame_size: constants.frame_sizes[dbCartItem.size_code],
            base_url: config.s3URL,
            images: images.length > 0 ? images : staticImagesNew(),
            item_count: dbCartItem.item_count,
            type: dbCartItem.type,
            product_category: dbCartItem.product_category,
            created_at: dbCartItem.created_at,
            frame_sizes: frame_sizes,
            addon_items,
            prescription_details: prescription_details || {},
            product_total_price,
        };

        grand_total.purchase += product_total_price;
        cartList.push(cartItem);
    }

    return {
        list: cartList,
        grand_total
    };
};

const updateCart = async (payload) => {
    let query = `select p.sku, p.active, ps.quantity, ps.reserved 
        from cart_items ci 
        inner join products p on p.sku = ci.sku_code
        inner join product_stocks ps on ps.sku = p.sku
        where ci.id = :cart_id and ci.status = true and ps.store_id = :store_id`;

    let replacements = {
        cart_id: payload.id,
        item_count: payload.item_count,
        store_id: config.turbolyEcomOrder.storeID
    };

    let product_stocks = await db.rawQuery(query, 'SELECT', replacements);

    if (product_stocks.length !== 1) {
        throw new Error('Item does not exists.');
    }

    if (product_stocks[0].active !== true) {
        throw new Error('Item discontinued.');
    }

    if (product_stocks[0].quantity - product_stocks[0].reserved < payload.item_count) {
        throw new Error('Item is out of stock');
    }

    await Promise.all([
        db.updateOneByCondition(
        { ...payload },
        { id: payload.id },
        'CartItems'
        ),
        addCustomerActivityLogs({
        user_id: payload.id,
        action: constants.logs_action.update_cart_items,
        created_by: payload.updated_by
        })
    ]); 
    return {
        id: payload.id
    };
};

const deleteCart = async (payload) => {
    await db.deleteRecord({ user_id: payload.user_id, id: payload.id }, 'CartItems');
    await db.deleteRecord({ user_id: payload.user_id, cart_id: payload.id }, 'CartAddonItems');
    return payload;
};

const clearCart = async (payload) => {
    await db.deleteRecord({ user_id: payload.user_id }, 'CartItems');
    await db.deleteRecord({ user_id: payload.user_id }, 'CartAddonItems');
    return payload;
};

const addCartAddon = async (payload) => {
    let query = `select p.sku, p.active, ps.quantity, ps.reserved from products p
        inner join product_stocks ps on ps.sku = p.sku
        where p.sku = :sku_code and ps.store_id = :store_id`;

    let replacements = {
        sku_code: payload.addon_product_sku,
        item_count: payload.item_count,
        store_id: config.turbolyEcomOrder.storeID
    };

    let product_stocks = await db.rawQuery(query, 'SELECT', replacements);
    const dbCart = await db.findOneByCondition(
        {
            cart_id: payload.cart_id,
            addon_product_sku: payload.addon_product_sku
        },
        'CartAddonItems',
        ['id', 'addon_item_count']
    );

    if (product_stocks.length !== 1) {
        throw new Error('Item does not exists.');
    }

    if (dbCart) {
        throw new Error('Item already added');
    }

    if (product_stocks[0].active !== true) {
        throw new Error('Item discontinued.');
    }

    if (product_stocks[0].quantity - product_stocks[0].reserved < payload.item_count) {
        throw new Error('Item is out of stock');
    }

    await db.saveData(payload, 'CartAddonItems');
    return payload;
};

const updateCartAddon = async (payload) => {
    const current_addon_product_sku = payload.current_addon_product_sku;

    const condition = {
        user_id: payload.user_id,
        addon_product_sku: current_addon_product_sku,
        cart_id: payload.cart_id
    };

    await db.updateOneByCondition(payload, condition, 'CartAddonItems');
    return await getCart(payload);
};

const deleteCartAddon = async (payload) => {
    return await db.deleteRecord(payload, 'CartAddonItems');
};

const userOtp = async (payload) => {
    const user = await db.findOneByCondition({ mobile: payload.number }, 'User', ['id', 'name']);

    let otp = '123456';
    let gateway = 3;
    let token = '';

    if (payload.number !== '1234567890' && payload.number !== '9123456789') {
        otp = utils.generateRandom(6, false);
    }

    if (payload.country_code == '+62' && !(payload.number !== '1234567890' || payload.number !== '9123456789')) {
        gateway = 2;
    }

    const name = user ? user.name : 'New user';
    const number = `${payload.country_code.replace('+', '')}${payload.number}`;

    if (payload.number !== '1234567890' && payload.number !== '9123456789') {
        if (payload.type == constants.CITCALL) {
            let citcalldData = await citcall.sendOtpMiscall({ number, gateway });
            otp = citcalldData.token;
            token = citcalldData.token.substr(0, citcalldData.token.length - 4);
        } else if (payload.type == constants.SMS) {
            await sms.sendSMS({ otp, number });
        } else {
            const auth = await whatsapp.whatsappAuth();
            await whatsapp.sendMessage({ token: auth.access_token, otp, name, number });
        }
    }
    await db.updateOneByCondition({ is_verified: true }, { phone_number: `${payload.country_code}${payload.number}` }, 'UserOtp');
    await db.saveData({
        otp,
        phone_number: `${payload.country_code}${payload.number}`,
        created_at: new Date(),
        updated_at: new Date()
    }, 'UserOtp');
    return ({
        isUserExist: !!user,
        token: token
    });
};

const userOtpVerify = async (payload) => {
    const otp = await db.findOneByCondition({ otp: payload.otp, is_verified: false }, 'UserOtp', ['id']);
    if (!otp) throw errorHandler.customError(messages.invalidOTP);
    await db.updateOneByCondition({ is_verified: true }, { id: otp.id }, 'UserOtp');
    return otp;
};
//Note: checkout function moved to admin.js

const htoCheckout = async (payload, userData) => {
    let payment_req_id = uuidv4();

    let { is_payment_required, appointment_date, timeslot_id } = payload;

    let orderItems = [];
    let orderItemAddons = [];
    let optician_id = '';

    let prefix = 'HTOSTO';
    if (!is_payment_required) {
        optician_id = await _assignOptician(appointment_date, timeslot_id);
        prefix = 'HTOSTL';
    }
    let order_no = `${prefix}/${utils.generateRandom(12, true).toUpperCase()}`;

    let cartQuery = `select ci.user_id, ci."type", ci.product_category, 1 as item_count,  p."name", p.retail_price , p.sku, ps.quantity, ps.reserved from cart_items ci
        inner join products p on p.id = ci.product_id
        inner join products p2 on p2.sku = concat('HTO', p.sku)
        inner join product_stocks ps on ps.product_id = p2.id
        where ci.user_id = :user_id and ci.type = '2' and ci.status = '1' and ps.store_id = :store_id`;

    let replacementes = {
        user_id: userData.id,
        store_id: payload.store_id
    };

    let dbProducts = await db.rawQuery(cartQuery, 'SELECT', replacementes);

    if (dbProducts.length == 0) {
        throw new Error('Cart is empty, Please add products to cart');
    } else if (dbProducts.length > 10) {
        throw new Error('Max 10 products are allowded for HTO');
    }

    for (dbProduct of dbProducts) {
        if (dbProduct.quantity - dbProduct.reserved <= 0) {
            throw new Error(`Cart product with Name: ${dbProduct.name}  is not available for HTO, please remove it from cart`);
        }

        let order_item_id = uuidv4();
        let sizecode = dbProduct.sku.slice(6, 8);
        let size = constants.frame_sizes[`SZ${sizecode}`];


        let imagesku = `${dbProduct.sku}_S_0_U.jpg`;
        if (dbProduct.product_category == 1) {
            imagesku = `${dbProduct.sku}_E_0_U.jpg`;
        }

        let image = `${config.s3URL}frames/${dbProduct.sku}/${imagesku}`;

        let orderItem = {
            id: order_item_id,
            name: dbProduct.name,
            order_no: order_no,
            order_item_id,
            sku: dbProduct.sku,
            retail_price: dbProduct.retail_price,
            discount_amount: 0,
            tax_rate: 0,
            quantity: 1,
            order_item_total_price: 0,
            product_category: dbProduct.product_category,
            size: size,
            image: image,
            created_at: new Date()
        };

        orderItems.push(orderItem);
        let orderItemAddon = {};
        if (dbProduct.product_category === 2) {
            orderItemAddon = {
                order_no: order_no,
                order_item_id,
                sku: 'HTOSAT030401',
                retail_price: 0,
                quantity: 1,
                created_at: new Date()
            };
        } else {
            orderItemAddon = {
                order_no: order_no,
                order_item_id,
                sku: 'HTOSAT010101',
                retail_price: 0,
                quantity: 1,
                created_at: new Date()
            };
        }
        orderItemAddons.push(orderItemAddon);
    }

    let transaction = await db.dbTransaction();

    try {
        let scheduledDeliveryDate = new Date();
        scheduledDeliveryDate.setDate(scheduledDeliveryDate.getDate() + 10);

        let order_amount = 0;
        let order_status = constants.order_status.PAYMENT_INITIATED;
        let is_local_order = false;

        if (!payload.is_payment_required) {
            is_local_order = true;
        }

        let orderJSON = {
            order_no: order_no,
            user_id: userData.id,
            email_id: userData.email,
            payment_req_id: payment_req_id,
            address_id: payload.address_id,
            voucher_code: 'NA',
            is_hto: true,
            is_payment_required: payload.is_payment_required,
            is_local_order,
            order_discount_amount: 0,
            scheduled_delivery_date: scheduledDeliveryDate,
            created_at: new Date(),
            created_by: userData.id,
            updated_at: new Date(),
            updated_by: userData.id,
            fulfillment_type: 1,
            store_id: config.turbolyEcomOrder.storeID,
            register_id: config.turbolyEcomOrder.registerID,
            order_status: order_status,
            notes: payload.notes || 'NA',

        };

        let orderPromiseArray = [];

        if (payload.is_payment_required) {
            orderJSON.status = 0;
            orderJSON.order_amount = payload.amount;
            orderJSON.payment_amount = payload.amount;
            order_amount = payload.amount;
        } else {
            orderJSON.status = 1;
            orderJSON.order_amount = 0;
            orderJSON.payment_amount = 0;
            orderJSON.order_status = constants.order_status.PAYMENT_CONFIRMED;
            order_status = constants.order_status.PAYMENT_CONFIRMED;

            orderPromiseArray.push(db.deleteRecord({
                user_id: userData.id,
                type: 2,
            }, 'CartItems', transaction));

            let appointmentJSON = {
                order_no,
                optician_id: optician_id,
                slot_id: payload.timeslot_id,
                appointment_date: payload.appointment_date,
                created_by: userData.id,
            };

            orderPromiseArray.push(db.saveData(appointmentJSON, 'HtoAppointment', transaction));
        }

        let updateReplacements = {
            payment_req_id: payment_req_id,
            order_status: constants.order_status.PAYMENT_INITIATED,
        };

        orderPromiseArray.push(db.saveData(orderJSON, 'OrderDetail', transaction));
        orderPromiseArray.push(db.saveMany(orderItems, 'OrderItem', transaction));
        orderPromiseArray.push(db.saveMany(orderItemAddons, 'OrderItemAddon', transaction));


        await Promise.all(orderPromiseArray);
        await transaction.commit();

        if (!payload.is_payment_required) {
            htoNotification(order_no);
        }

        let orderItemUpdateQuery = `update product_stocks set
            reserved = product_stocks.reserved + oi.quantity
            from order_details od (nolock)
            inner join order_items oi (nolock) on od.order_no = oi.order_no
            where od.payment_req_id = :payment_req_id and od.order_status = :order_status and product_stocks.sku = oi.sku`;

        let orderItemAddOnUpdateQuery = `update product_stocks set
            reserved = product_stocks.reserved + oi.quantity
            from order_details od (nolock)
            inner join order_item_addons oi (nolock) on od.order_no = oi.order_no
            where od.payment_req_id = :payment_req_id and od.order_status = :order_status and product_stocks.sku = oi.sku`;

        await db.rawQuery(orderItemUpdateQuery, 'SELECT', updateReplacements);
        await db.rawQuery(orderItemAddOnUpdateQuery, 'SELECT', updateReplacements);

        return {
            order_no,
            payment_req_id,
            payment_amount: order_amount,
            order_status,
            is_payment_required: payload.is_payment_required
        };
    } catch (error) {
        transaction.rollback();
        throw new Error(error.message);
    }
};

const createOrder = async (payload) => {
    const otp = await db.findOneByCondition({ otp: payload.otp, is_verified: false }, 'UserOtp', ['id']);
    if (!otp) throw errorHandler.customError(messages.invalidOTP);
    await db.updateOneByCondition({ is_verified: true }, { id: otp.id }, 'UserOtp');
    return otp;
};

const userAddress = async (payload) => {
    if (payload['is_primary']) {
        await db.updateOneByCondition({ is_primary: false }, { user_id: payload.user_id, is_primary: true }, 'UserAddress');
    }
    if (payload['long'] && payload['lat']) {
        payload.position = {
            type: 'Point',
            coordinates: [payload.long, payload.lat],
            crs: { type: 'name', properties: { name: 'EPSG:4326' } }
        };
    }
    let result = await Promise.all([
        db.saveData(payload, 'UserAddress'),
        addCustomerActivityLogs({
            user_id: payload.user_id,
            action: constants.logs_action.add_address,
            created_by: payload.created_by
        })
    ]);
    return result[0];
};

const userAddressUpdate = async (payload) => {
    if (payload['is_primary']) {
        await db.updateOneByCondition({ is_primary: false }, { user_id: payload.user_id, is_primary: true }, 'UserAddress');
    }
    if (payload['long'] && payload['lat']) {
        payload.position = {
            type: 'Point',
            coordinates: [payload.long, payload.lat],
            crs: { type: 'name', properties: { name: 'EPSG:4326' } }
        };
    }
    let result = await Promise.all([
        db.updateOneByCondition(payload, { id: payload.id }, 'UserAddress'),
        addCustomerActivityLogs({
            user_id: payload.user_id,
            action: constants.logs_action.update_address,
            created_by: payload.updated_by
        })
    ]);
    return result[0];
};

const getUserAddress = async (user_id) => {
    return await db.findByCondition({ user_id, status: true }, 'UserAddress');
};

const getUserOrderList = async (payload) => {
    const offset = (payload.page - 1) * constants.limit;

    let query = `select od.order_no, od.order_amount, od.payment_amount, od.order_discount_amount, od.user_credit_amount,
        od.order_status, od.actual_delivery_date,
        od.created_at, od.is_hto, od.is_payment_required, od.is_local_order, od.country_code, od.currency_code
        from order_details od
        where od.status = 1 and od.is_hto = :is_hto and od.user_id = :user_id
        order by od.created_at desc
        limit :limit offset :offset`;

    let orderCountQuery = 'select count(od.order_no) as total_orders from order_details od where od.status = 1 and od.is_hto = :is_hto and od.created_by = :user_id';

    let imageQuery = `select fi.sku_code, fi.image_key, fi.image_category, fi.image_type from
        order_items oi inner join frame_images fi on fi.sku_code = oi.sku
        where order_no in (:order_nos)
        order by fi.image_key`;

    let orderItemQuery = `select fm.frame_name, fm.frame_code, fm.variant_name, fm.variant_code, oi.order_no,
        oi.sku, oi.product_category, oi.currency_code
        from order_items oi
        inner join frame_master fm on fm.sku_code = oi.sku
        where oi.order_no in (:order_nos)
        and oi.status = 1 order by oi.retail_price`;

    let addOnQuery = `select oia.order_no, oia.sku, p."name" as product_name,
        (case
            when oia.type != 'clipon' then 'LENSE'
            when oia.type = 'clipon'  then 'CLIPON'
            else 'LENSE' end) as category,
        ld.brand, ld.category_name as lense_category_name, ld.prescription_name, ld.lense_type_name, ld.filter_type_name,
        cl.name as clipon_name, cl.color as clipon_color, cl.size as clipon_size,
        oia.currency_code
        from order_item_addons oia
        inner join products p on p.sku = oia.sku
        left join lenses_detail ld on ld.sku_code = oia.sku
        left join clipon cl on cl.sku = oia.sku
        where oia.status = 1 and oia.order_item_id is null and order_no in (:order_nos);`;

    let htoQuery = `select ha.order_no, ha.slot_id, ha.appointment_date, hs.slot_start_time, hs.slot_end_time
        from order_details od
        inner join hto_appointment ha on od.order_no = ha.order_no
        inner join hto_slot hs on hs.id = ha.slot_id
        where ha.order_no in (:order_nos)
        and ha.status = 1`;

    let replacements = {
        user_id: payload.user_id,
        is_hto: payload.is_hto,
        offset,
        limit: constants.limit
    };

    let orders = await db.rawQuery(query, 'SELECT', replacements);

    let response = {};

    if (orders.length == 0) {
        response = {
            pages: 0,
            orders: []
        };
    } else {
        let order_nos = [];
        for (order of orders) {
            order_nos.push(order.order_no);
        }
        replacements.order_nos = order_nos;
        let promiseArr = [];
        promiseArr.push(db.rawQuery(orderCountQuery, 'SELECT', replacements));
        promiseArr.push(db.rawQuery(imageQuery, 'SELECT', replacements));
        promiseArr.push(db.rawQuery(orderItemQuery, 'SELECT', replacements));
        promiseArr.push(db.rawQuery(addOnQuery, 'SELECT', replacements));
        promiseArr.push(db.rawQuery(htoQuery, 'SELECT', replacements));

        let results = await Promise.all(promiseArr);
        let orderCount = results[0];
        let orderImages = results[1];
        let orderItems = results[2];
        let addOnItems = results[3];
        let htoAppointmentResults = results[4];

        for (let order of orders) {
            let order_items = orderItems.filter(item => {
                return item.order_no == order.order_no;
            });

            let addon_items = addOnItems.filter(item => {
                return item.order_no == order.order_no;
            });

            if (order_items.length > 0) {
                let order_item = order_items[0];
                order.frame_name = order_item.frame_name;
                order.frame_code = order_item.frame_code;
                order.variant_name = order_item.variant_name;
                order.variant_code = order_item.variant_code;
                order.product_category = order_item.product_category;
                order.sku = order_item.sku;
                order.category = 'FRAME';
                order.total_frames = order_items.length;

                order.name = `${order_item.frame_name} - ${order_item.variant_name}`;

                if (order.is_hto == true && order.is_local_order == true) {
                    let htoAppointments = htoAppointmentResults.filter(item => {
                        return item.order_no == order.order_no;
                    });
                    order.slot_id = htoAppointments[0].slot_id;
                    order.appointment_date = htoAppointments[0].appointment_date;
                    order.slot_start_time = htoAppointments[0].slot_start_time;
                    order.slot_end_time = htoAppointments[0].slot_end_time;
                }


                let image_category = 'OPTICAL';
                if (order_item.product_category == 1) {
                    image_category = 'OPTICAL';
                } else if (order_item.product_category == 2) {
                    image_category = 'SUNWEAR';
                }

                let images = orderImages.filter(image => {
                    return image.sku_code == order_item.sku && image.image_category == image_category;
                });
                if (images.length == 0) {
                    order.images = staticImagesNew();
                    let base_image = _.find(order.images, (image) => {
                        return _.includes(image.image_key, '_0_U');
                    });
                    if (typeof (base_image) == 'undefined') {
                        order.image_url = 'assets/image_unavail_E_0.jpg';
                    } else {
                        order.image_url = base_image.image_key;
                    }
                } else {
                    order.images = images;
                    let base_image = _.find(order.images, (image) => {
                        return _.includes(image.image_key, '_0_U');
                    });
                    if (typeof (base_image) == 'undefined') {
                        order.image_url = 'assets/image_unavail_E_0.jpg';
                    } else {
                        order.image_url = base_image.image_key;
                    }
                }
            } else if (addon_items.length > 0) {
                let addon_item = addon_items[0];

                order.sku = addon_item.sku;
                order.category = addon_item.category;
                order.brand = addon_item.brand;
                order.lense_category_name = addon_item.lense_category_name;
                order.prescription_name = addon_item.prescription_name;
                order.lense_type_name = addon_item.lense_type_name;
                order.filter_type_name = addon_item.filter_type_name;
                order.clipon_name = addon_item.clipon_name;
                order.clipon_color = addon_item.clipon_color;
                order.clipon_size = addon_item.clipon_size;

                order.total_frames = 0;
                order.name = addon_item.product_name;
                order.image_url = 'assets/image_unavail_E_0.jpg';

                if (addon_item.category == 'LENSE') {
                    order.image_url = 'assets/lenses.jpg';
                } else if (addon_item.category == 'CLIPON') {
                    order.image_url = 'clipon/CO002502001/CO002501001_S_0_U.jpg';
                }

                order.images = staticImagesNew();
            }


            order.base_url = config.s3URL;
        }

        const pages = Math.ceil(orderCount[0].total_orders / constants.limit);
        response = {
            pages,
            orders,
        };
    }

    return response;
};

const getOrderDetails = async (payload) => {
    let orderDetailQuery = `select od.order_no, od.email_id, od.voucher_code, od.is_hto, od.payment_amount, od.order_amount,
        od.order_discount_amount, od.user_credit_amount, od.store_id, od.sales_channel, od.currency, od.scheduled_delivery_date,
        od.actual_delivery_date, od.order_status, od.created_at, od.updated_at, od.is_payment_required,
        od.is_local_order, od.fulfillment_type, od.is_return, od.country_code, od.currency_code,
        od.is_eyewear_points_credit, od.eyewear_points_credit,
        ua.receiver_name, ua.label_address, ua.phone_number as address_phone_number, ua.note, ua.zip_code, ua.address,
        ua.address_details, ua."position", ua.lat, ua.long
        from order_details od
        left join user_address ua on ua.id = od.address_id
        where od.status = 1 and od.user_id = :user_id and od.order_no = :order_no`;

    let orderItemsQuery = `select oi.order_no, oi.id as order_item_id, oi.sku, oi.retail_price, oi.discount_amount,
        oi.user_credit, oi.discount_note, oi.discount_type, oi.quantity, oi.status, oi.order_item_total_price, oi.product_category,
        oi.currency_code, oi.eyewear_points_credit,
        fm.sku_code, fm.frame_name, fm.frame_code, fm.variant_name, fm.variant_code, fm.size_label, fm.size_code,
        up.label, up.spheris_l, up.spheris_r, up.cylinder_l, up.cylinder_r, up.axis_l, up.axis_r,
        up.addition_l, up.addition_r, up.pupilary_distance
        from order_items oi
        inner join frame_master fm on fm.sku_code = oi.sku
        left join user_prescription up on up.id = oi.prescription_id
        where oi.status = 1 and oi.order_no = :order_no`;

    let orderItemAddonQuery = `select p.name, oia.order_no, oia.order_item_id, oia.sku as sku_code, oia.retail_price,
        oia.quantity, oia.is_sunwear, oia.discount_amount, oia.user_credit, oia.discount_note, oia.discount_type,
        oia.currency_code, oia.eyewear_points_credit, oia.lense_color_code,
        ls.category_name, ls.lense_type_name, ls.lense_type_amount, ls.is_prescription, ls.prescription_name,
        ls.prescription_amount, ls.index_value, ls.is_filter, ls.filter_type_name, ls.filter_type_amount,
        up.label, up.spheris_l, up.spheris_r, up.cylinder_l, up.cylinder_r, up.axis_l, up.axis_r,
        up.addition_l, up.addition_r, up.pupilary_distance from order_item_addons oia
        inner join lenses_detail ls on oia.sku = ls.sku_code
        inner join products p on p.sku = oia.sku
        left join user_prescription up on up.id = oia.prescription_id where
        oia.order_no = :order_no and (oia.type!='clipon' OR oia.type ISNULL)`;

    let orderCliponQuery = `select oia.order_no, oia.sku as sku_code, oia.retail_price, oia.quantity,
        oia.discount_amount, oia.user_credit, oia.discount_note, oia.discount_type, cp.name, cp.color, cp.size,
        p.retail_price, 'ID' as country_code, 'IDR' as currency_code
        from order_item_addons as oia inner join products as p on p.sku = oia.sku
        inner join clipon cp on p.sku = cp.sku
        where oia.order_no = :order_no and oia.type='clipon'`;

    let orderPaymentQuery = `select od.order_no, od.payment_req_id,
        (case
            when req.payment_method = 0  then 'CASH'
            when req.payment_method = 2  then 'VIRTUAL_ACCOUNT'
            when req.payment_method = 3  then 'CARDLESS_PAYMENT'
            when req.payment_method = 4  then 'NO_PAYMENT'
            when req.payment_method = 5  then 'EDC'
            when req.payment_method = 6  then 'BANK_TRANSFER'
            when req.payment_method = 7  then 'INSURANCE'
            when req.payment_method = 8  then 'ATOME'
            when req.payment_method = 9  then 'MEKARI'
            when req.payment_method = 10 then 'DANA'
            when req.payment_method = 11 then 'OVO'
            when req.payment_method = 12 then 'GO_PAY'
            when req.payment_method = 13 then 'LINK_AJA'
            when req.payment_method = 14 then 'SHOPEE_PAY'
            when req.payment_method = 15 then 'PAYPAL'
            when req.payment_method = 16 then 'Dept Store'
            when req.payment_method = 17 then 'XENDIT CARD'
            when req.payment_method = 18 then 'Corporate Try On'
            when req.payment_method = 19 then 'Endorsement'
            when req.payment_method = 20 then 'Employee Claim'
            when req.payment_method = 21 then 'Warranty'
            when req.payment_method = 22 then 'Xendit Invoice'
            else 'CARD' end) as payment_method,
        req.amount, auth.bank_code, auth.name, auth.account_number,
        auth.expiration_date, auth.authorized_amount,
        (case
            when auth.masked_card_number is null then uc.card_number
            else auth.masked_card_number end) as masked_card_number,
        (case
            when auth.card_brand is null then uc.card_brand
            else auth.card_brand end) as card_brand,
        (case
            when auth.card_type is null then 'UNKNOWN'
            else auth.card_type end) as card_type
        from order_details od
        inner join payment_request req on od.payment_req_id = req.external_id
        left join payment_auth_response auth on  auth.external_id = req.external_id
        left join user_cards uc on uc.token_id = req.token_id
        where od.order_no = :order_no`;

    let orderHTOScheduleQuery = `select ha.slot_id, ha.order_no, ha.appointment_date, slot.slot_start_time, slot.slot_end_time,
        op."name" as optician_name, op.country_code, op.mobile, op.email from hto_appointment ha
        inner join hto_slot slot on slot.id = ha.slot_id
        inner join optician op on op.id = ha.optician_id
        where ha.status = 1 and ha.order_no = :order_no`;

    let orderImagesQuery = `select fi.sku_code, fi.image_key, fi.image_category, fi.image_type
        from order_details od
        inner join order_items oi on od.order_no = oi.order_no
        inner join frame_images fi on fi.sku_code = oi.sku
        where od.order_no = :order_no order by fi.image_key`;

    let orderPromiseArray = [];

    let replacements = {
        user_id: payload.user_id,
        order_no: payload.id
    };

    orderPromiseArray.push(db.rawQuery(orderDetailQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderItemsQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderItemAddonQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderPaymentQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderHTOScheduleQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderImagesQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderCliponQuery, 'SELECT', replacements));

    let orderResults = await Promise.all(orderPromiseArray);

    let orderDetails = orderResults[0];
    let orderItems = orderResults[1];
    let orderItemAddons = orderResults[2];
    let orderPaymentDetails = orderResults[3];
    let orderHTOScheduleDetails = orderResults[4];
    let orderImages = orderResults[5];
    let clipons = orderResults[6];

    if (orderDetails.length == 0) {
        throw new Error('Invalid order no');
    }

    let formattedResponse = formatOrderDetails({
        orderDetail: orderDetails[0],
        orderItems,
        orderItemAddons,
        orderPaymentDetail: orderPaymentDetails[0],
        orderHTOScheduleDetail: orderHTOScheduleDetails[0],
        orderImages,
        clipons
    });

    return formattedResponse;
};

const getNotifications = async (payload) => {
    const offset = (payload.page - 1) * constants.limit;
    return await db.findAndCountAll({ user_id: payload.user_id }, 'UserNotifications', offset, constants.limit);
};

const getUserData = async (payload) => {
    const user = await db.findOneByCondition({ id: payload.user_id }, 'User');

    if (!user) throw errorHandler.customError(messages.invalidCredentials);

    const userReferralObj = await db.findOneByCondition({
        user_id: user.id,
        status: 1,
    }, 'UserReferral');



    let tier = await db.findOneByCondition({ user_id: payload.user_id }, 'UserTier');
    let tiers = constants.tiers;


    let replacements = {
        user_id: payload.user_id
    };


    let stPointsQuery = `select  opening_balance, closing_balance, opening_points, closing_points from eyewear_points_transactions
    where status = 1 and user_id = :user_id
    order by created_at desc limit 1`;

    let stPointsResults = await db.rawQuery(stPointsQuery, 'SELECT', replacements);

    const userLocationObj = await db.findOneByCondition({
        user_id: user.id,
        status: 1,
    }, 'UserLocation');

    let userObj = {
        id: user.id,
        // country_code: user.country_code,
        country_calling_code: user.country_code,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        is_send_notifications: user.is_send_notifications,
        is_send_email: user.is_send_email,
        // currency: user.currency,
        // language: user.language,
        is_send_newsletter: user.is_send_newsletter,
        profile_image_base_url: config.aws.s3URL,
        profile_image: user.profile_image,
        cart_count: {
            purchased: await db.count({ user_id: user.id, type: 1 }, 'CartItems'),
            hto: await db.count({ user_id: user.id, type: 2 }, 'CartItems')
        },
        wishlist_count: await db.count({ user_id: user.id }, 'UserWishlist'),
        isUserAddress: await db.count({ user_id: user.id, status: true }, 'UserAddress') > 0,
        registration_referral_code: user.registration_referral_code,
        is_first_order: user.is_first_order,
        referral_code: '',
        referral_amount: 0,
        language: constants.location.language,
        country_code: constants.location.country_code,
        currency_code: constants.location.currency_code,
        timezone: constants.location.timezone
    };

    userObj.points = stPointsResults[0]? stPointsResults[0] : {};
    userObj.tier = tier;
    userObj.tiers = tiers;

    if (userReferralObj) {
        userObj.referral_code = userReferralObj.referral_code;
        userObj.referral_amount = userReferralObj.referral_amount;
    }

    if (userLocationObj) {
        userObj.language = userLocationObj.language;
        userObj.country_code = userLocationObj.country_code;
        userObj.currency_code = userLocationObj.currency_code;
        userObj.timezone = userLocationObj.timezone;
    }

    return userObj;
};

const updateUserData = async (payload) => {
    const dbUser = await db.findOneByCondition({ id: payload.user_id }, 'User');

    if (!dbUser) throw errorHandler.customError(messages.invalidCredentials);

    await db.updateOneByCondition(payload, { user_id: payload.user_id }, 'UserLocation');

    delete payload['country_code'];
    payload.updated_at = new Date();
    let old_val = {
        name: dbUser.name,
        email: dbUser.email,
        dob: dbUser.dob,
        gender: dbUser.gender
    };
    let new_val = {
        name: payload.name,
        email: payload.email,
        dob: payload.dob,
        gender: payload.gender
    };
    let result = await Promise.all([
        db.updateOneByCondition(payload, { id: payload.user_id }, 'User'),
        addCustomerActivityLogs({
            user_id: payload.user_id,
            action: constants.logs_action.update_profile,
            created_by: payload.updated_by,
            old_val,
            new_val
        })
    ]);
    return result[0];
};

const removeAddress = async (payload) => {
    if (await db.findOneByCondition({ id: payload.id, is_primary: true }, 'UserAddress', ['id'])) {
        throw errorHandler.customError(messages.primaryAddress);
    }

    return await db.updateOneByCondition({ status: false, updated_by: payload.user_id }, { id: payload.id }, 'UserAddress');
};

const rescheduleHTOOrder = async (payload) => {
    let transaction = await db.dbTransaction();
    try {

        let orderDetails = await getOrderDetail(payload.order_no);
        let slottime = await getHtoSlot(orderDetails[0].slot_id);
        let appointment_date = orderDetails[0].appointment_date;
        appointment_date = moment(appointment_date).format('YYYY-MM-DD');
        appointment_date = appointment_date + ' ' + slottime.slot_start_time;

        let olddatetoshow = moment(appointment_date).format('dddd, Do MMMM YYYY');
        let oldtimetoshow = slottime.slot_start_time;

        let optician_id = await _assignOptician(payload.appointment_date, payload.timeslot_id);

        let appointmentJSON = {
            order_no: payload.order_no,
            optician_id: optician_id,
            slot_id: payload.timeslot_id,
            appointment_date: payload.appointment_date,
            created_by: payload.user_id,
        };

        await db.updateOneByCondition({
            status: 0,
            updated_at: new Date(),
            updated_by: payload.user_id
        }, {
            order_no: payload.order_no,
            created_by: payload.user_id,
            status: 1
        }, 'HtoAppointment', transaction);

        await db.saveData(appointmentJSON, 'HtoAppointment', transaction);
        await transaction.commit();

        htoRescheduleNotification(payload.order_no, olddatetoshow, oldtimetoshow);

        return {
            message: messages.orderRescheduled
        };
    } catch (error) {
        transaction.rollback();
        throw errorHandler.customError(messages.htorRescheduleError);
    }
};

const cancelOrder = async (payload) => {
    if (!payload.is_hto) {
        const orderDetails = await db.findOneByCondition({
            order_no: payload.order_no,
            user_id: payload.user_id
        }, 'OrderDetail', ['order_no', 'payment_req_id', 'created_at', 'order_status']);

        if (orderDetails == null) {
            throw errorHandler.customError(messages.invalidOrder);
        }

        const currentDate = new Date();
        const orderDate = new Date(orderDetails.created_at);

        let difference_In_Time = currentDate.getTime() - orderDate.getTime();
        let difference_In_Days = Math.ceil(difference_In_Time / (1000 * 60 * 60 * 24));

        if (orderDetails.order_status == constants.order_status.ORDER_CANCEL) {
            throw errorHandler.customError(messages.orderAlreadyCancelled);
        } else if (difference_In_Days > 10) {
            throw errorHandler.customError(messages.orderCancelTimeExpired);
        }

        await db.updateOneByCondition({
            order_status: constants.order_status.ORDER_CANCEL,
            updated_at: new Date(),
            updated_by: payload.user_id
        }, {
            order_no: payload.order_no,
            user_id: payload.user_id
        }, 'OrderDetail');

        return {
            message: messages.orderCancelled
        };
    } else {
        let appointmentQuery = `select ap.id as appointment_id, ap.appointment_no
            from appointment ap
            where ap.appointment_no = (:order_no) and ap.user_id = :user_id and ap.status = 1`;

        let replacements = {
            order_no: payload.order_no,
            user_id: payload.user_id
        };

        let appointmentResults = await db.rawQuery(appointmentQuery, 'SELECT', replacements);

        if (appointmentResults.length == 0) {
            throw new Error('Invalid appointment no');
        }

        let appointmentDetails = appointmentResults[0];

        let appointmentHistoryObj = {
            appointment_id: appointmentDetails.appointment_id,
            created_at: new Date(),
            appointment_status: constants.appointment_status.APPOINTMENT_CANCELLED
        };

        await db.saveData(appointmentHistoryObj, 'AppointmentHistory');

        await db.updateOneByCondition({
            status: 0,
            appointment_status: constants.appointment_status.APPOINTMENT_CANCELLED,
            updated_at: new Date(),
            updated_by: payload.user_id
        }, {
            id: appointmentDetails.appointment_id
        }, 'Appointment');

        await db.updateOneByCondition({
            status: 0,
            updated_at: new Date(),
            updated_by: payload.user_id
        }, {
            appointment_id: appointmentDetails.appointment_id,
            status: 1
        }, 'AppointmentTimeDetails');

        // TODO: change HTO cancel notification

        return {
            message: messages.htoOrderCancel
        };
    }
};

const fileUpload = async (payload) => {
    //return payload;
    const data = {
        body: payload,
        public: true
    };
    try {
        return await s3Upload.handleFileUpload(data);
    } catch (error) {
        throw new Error(error.message);
    }

};

const getSavedCard = async (user_id) => {
    return await db.findByCondition({ user_id }, 'UserCards');
};

const savedCardData = async (payload) => {
    if (await db.findOneByCondition({ card_number: payload.card_number, user_id: payload.user_id }, 'UserCards', ['id'])) {
        throw errorHandler.customError(messages.cardExist);
    }
    if (payload['is_primary']) {
        await db.updateOneByCondition({ is_primary: false }, { user_id: payload.user_id, is_primary: true }, 'UserCards');
    }
    return await db.saveData({ ...payload }, 'UserCards');
};

const updateSavedCard = async (payload) => {
    if (payload['is_primary']) {
        await db.updateOneByCondition({ is_primary: false }, { user_id: payload.user_id, is_primary: true }, 'UserCards');
    }
    await db.updateOneByCondition({
        ...payload,
        updated_at: new Date()
    }, {
        id: payload.id,
        user_id: payload.user_id
    }, 'UserCards');
};

const deleteSavedCard = async (payload) => {
    return await db.deleteRecord(payload, 'UserCards');
};

const returnOrder = async (payload) => {
    const row = await db.findOneByCondition(payload, 'OrderDetail');
    if (!row) throw errorHandler.customError(messages.invalidOrder);
    const holidays = await db.findOneByCondition({ year: new Date().getFullYear().toString() }, 'Holidays', ['dates']);

    const today = new Date();
    let nextDate = new Date(today.setDate(today.getDate() + 1));
    let yyyy = nextDate.getFullYear();
    let dd = nextDate.getDate();
    let mm = nextDate.getMonth() + 1;

    // If Today is saturday
    if (today.getDay() === 6) {
        nextDate = new Date(today.setDate(today.getDate() + 2));
        dd = nextDate.getDate();
        mm = nextDate.getMonth() + 1;
        if (holidays.dates.includes(yyyy + '-' + mm + '-' + dd)) {
            nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
            dd = nextDate.getDate();
            mm = nextDate.getMonth() + 1;
        }
    }
    if (holidays.dates.includes(yyyy + '-' + mm + '-' + dd)) {
        nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
        dd = nextDate.getDate();
        mm = nextDate.getMonth() + 1;
    }
    // if next day is Sunday
    if (nextDate.getDay() === 0) {
        nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
        dd = nextDate.getDate();
        mm = nextDate.getMonth() + 1;
    }

    const date = yyyy + '-' + mm + '-' + dd;
    const userAddress = await db.findOneByCondition({ id: row.address_id }, 'UserAddress');
    const { storeAddress } = config.ninjaExpress;
    const requested_tracking_number = utils.generateRandom(10, false); // row.payment_req_id;
    const merchant_order_number = row.order_no;
    try {
        await ninjaExpress.generateOrder({
            countryCode: 'ID',
            data: {
                'service_type': 'Return',
                'service_level': 'Standard',
                'requested_tracking_number': requested_tracking_number,
                'reference': {
                    'merchant_order_number': merchant_order_number
                },
                'from': {
                    'name': userAddress.receiver_name,
                    'phone_number': userAddress.phone_number,
                    'email': userAddress.email,
                    'address': {
                        'address1': userAddress.address,
                        'city': userAddress.city,
                        'state': userAddress.province,
                        'address_type': 'home',
                        'country': userAddress.country,
                        'postcode': userAddress.zip_code
                    }
                },
                'to': {
                    'name': storeAddress.name,
                    'phone_number': storeAddress.phone,
                    'email': storeAddress.email,
                    'address': {
                        'address1': storeAddress.address,
                        'city': storeAddress.city,
                        'province': storeAddress.store_region,
                        'country': storeAddress.country,
                        'postcode': storeAddress.zipcode
                    }
                },
                'parcel_job': {
                    'is_pickup_required': true,
                    'pickup_service_type': 'Scheduled',
                    'pickup_service_level': 'Standard',
                    'pickup_date': date,
                    'pickup_timeslot': {
                        'start_time': '09:00',
                        'end_time': '12:00',
                        'timezone': 'Asia/Jakarta'
                    },
                    'pickup_instructions': 'Pickup with care!',
                    'delivery_instructions': 'If recipient is not around, leave parcel in power riser.',
                    'delivery_start_date': date,
                    'delivery_timeslot': {
                        'start_time': '09:00',
                        'end_time': '22:00',
                        'timezone': 'Asia/Jakarta'
                    },
                    'dimensions': {
                        'size': 'S',
                        'weight': 0.48,
                        'length': 17.50,
                        'width': 7.50,
                        'height': 7.50
                    }
                }
            }
        });
        await db.saveData({ order_no: row.order_no, status: constants.order_status.ORDER_RETURN, source: 'app', created_at: new Date() }, 'OrdersHistory');
        htoReturn(row.order_no);

        return await db.updateOneByCondition({
            is_return: true,
            updated_at: new Date()
        }, {
            order_no: row.order_no
        }, 'OrderDetail');
    } catch (error) {
        const ninjaPayload = {
            shipper_id: 0,
            status: constants.ninja_order_status.ORDER_RETURN_UNCONFIRMED,
            shipper_ref_no: 'null',
            tracking_ref_no: requested_tracking_number,
            shipper_order_ref_no: merchant_order_number,
            timestamp: new Date(),
            previous_status: '-',
            tracking_id: 'null'
        };
        await db.saveData({ order_no: merchant_order_number, status: constants.order_status.ORDER_RETURN_UNCONFIRMED, source: 'app', created_at: new Date() }, 'OrdersHistory');
        return await db.saveData(ninjaPayload, 'NinjaExpress');
    }
};

const orderHistory = async (payload) => {
    return await db.rawQuery(
        `select oh.id , oh.status, oh.source, oh.created_at, case when u.name is null then 'admin' else u.name end
          from orders_history as oh left join users as u on u.id = oh.created_by
          where oh.order_no = :order_no order by created_at DESC`,
        'SELECT', { order_no: payload.order_no }
      );
    // return await db.rawQuery(
    //     `select oh.id , oh.status, oh.source, oh.created_at, u.name
    //       from orders_history as oh join order_details as o on oh.order_no = o.order_no
    //       left join users u on u.id = o.updated_by
    //       where o.order_no = :order_no order by created_at ASC`,
    //     'SELECT', { order_no: payload.order_no }
    //   );
};

const getUser = async () => {
    const users = await db.findByCondition({ role: 2, status: 1 }, 'User', ['id', 'mobile', 'name', 'email', 'dob', 'gender', 'country_code']);
    //Adding data in elastic
    await esClient.indices.delete({
        index: 'users',
        ignore: [404]
    });
    await esClient.indices.create({ index: 'users' });
    const body = users.flatMap(user => [{ index: { _index: 'users' } }, user]);
    await esClient.bulk({
        refresh: true,
        body
    });
    return users;
};

const addUserByAdmin = async (payload) => {
    const isUser = await db.findOneByCondition({ mobile: payload.mobile }, 'User', ['id']);
    if (isUser) throw errorHandler.customError(messages.mobileAlreadyExists);
    const isEmail = await db.findOneByCondition({ email: payload.email, role: 2 }, 'User', ['id']);
    if (isEmail) throw errorHandler.customError(messages.emailAlreadyExists);
    payload.password = utils.encryptpassword('satirdays@123');
    payload.country_code = payload.country_code || '+62';
    payload.dob = payload.dob || null;
    payload.channel = constants.sale_channel.STORE;
    let transaction = await db.dbTransaction();
    try {
        let promiseArr = [];
        let user_id = uuidv4();
        // TODO: first name and last name length check
        let name = payload.name;
        let nameArr = name.split(' ');
        if (nameArr.length < 2) {
            throw errorHandler.customError(messages.nameRequired);
        }

        let first_name = nameArr[0];
        let last_name = nameArr[1];

        let referral_code = `${first_name.substring(0, 2).toUpperCase()}${last_name.substring(0, 2).toUpperCase()}${utils.generateRandom(4, false)}`;

        let voucher_code = referral_code;
        const date = new Date();
        const voucher_expiry_date = new Date();
        voucher_expiry_date.setDate(voucher_expiry_date.getDate() + 2);

        let userObj = {
            id: user_id,
            name: payload.name,
            country_code: payload.country_code,
            mobile: payload.mobile,
            gender: payload.gender,
            email: payload.email,
            registration_referral_code: '',
            password: payload.password,
            created_at: date,
            created_by: payload.created_by,
            updated_at: date,
            updated_by: payload.created_by,
            channel: payload.channel,
            dob: payload.dob
        };

        let referralObj = {
            user_id: user_id,
            referral_code: referral_code,
            referral_amount: constants.referralDetails.referralAmount,
            created_at: date,
            created_by: payload.created_by,
            updated_at: date,
            updated_by: payload.created_by,
        };

        let voucherObj = {
            voucher_code: voucher_code,
            voucher_type: constants.voucherType.absolute,
            voucher_amount: constants.referralDetails.voucherAmount,
            voucher_max_amount: constants.referralDetails.voucherAmount,
            minimum_cart_amount: constants.referralDetails.minimumCartAmount,
            voucher_title: constants.referralDetails.voucherTitle,
            voucher_image_key: constants.referralDetails.voucherImageKey,
            max_count: 100,
            is_single_user: false,
            user_id: user_id,
            is_expired: false,
            expire_at: voucher_expiry_date,
            start_at: date,
            voucher_category: constants.voucherCategory.REFERRAL,
            created_at: date,
            created_by: payload.created_by,
            updated_at: date,
            updated_by: payload.created_by
        };

        promiseArr.push(db.saveData(userObj, 'User', transaction));
        promiseArr.push(db.saveData(referralObj, 'UserReferral', transaction));
        promiseArr.push(db.saveData(voucherObj, 'VoucherDetails', transaction));
        let results = await Promise.all(promiseArr);
        await transaction.commit();
        let userData = results[0];
        userData = userData.toJSON();
        //welcomeNotification(userData.id);
        await esClient.index({
            index: 'users',
            type: '_doc',
            body: {
                id: userData.id,
                name: userData.name,
                mobile: userData.mobile,
                email: userData.email,
                dob: userData.dob,
                gender: userData.gender,
                country_code: userData.country_code
            }
        });
        await addCustomerActivityLogs({
            user_id: userData.id,
            action: constants.logs_action.signup,
            created_by: payload.created_by
        });
        return ({ id: userData.id, ...payload });

    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw errorHandler.customError(error.message || messages.systemError);
    }

};

const updateUserByAdmin = async (payload) => {
    const isUser = await db.findOneByCondition({ mobile: payload.mobile, id: { [Op.ne]: payload.id } }, 'User', ['id']);
    if (isUser) throw errorHandler.customError(messages.mobileAlreadyExists);
    const isEmail = await db.findOneByCondition({ email: payload.email, role: 2, id: { [Op.ne]: payload.id } }, 'User', ['id']);
    if (isEmail) throw errorHandler.customError(messages.emailAlreadyExists);
    payload.dob = payload.dob || null;
    try {
        await db.updateOneByCondition({
            ...payload
        }, {
            id: payload.id
        }, 'User');

        await esClient.deleteByQuery({
            index: 'users',
            type: '_doc',
            body: {
               query: {
                   match: { id: payload.id }
               }
            }
        });

        await esClient.index({
            index: 'users',
            type: '_doc',
            body: {
                id: payload.id,
                name: payload.name,
                mobile: payload.mobile,
                email: payload.email,
                dob: payload.dob,
                gender: payload.gender,
                country_code: payload.country_code
            }
        });
        await addCustomerActivityLogs({
            user_id: payload.id,
            action: constants.logs_action.update_profile,
            created_by: payload.updated_by
        });
        return payload;

    } catch (error) {
        throw errorHandler.customError(messages.systemError);
    }

};

const searchUser = async (payload) => {
    try {
        let query = {
            query_string: {
                query: `*${payload.text}*`,
                fields: [
                    'name',
                    'email',
                    'mobile'
                ],
            },
        };

        const data = await elasticsearch.searchInIndex(
            'users',
            query,
            0,
            20,
            [
                'id',
                'mobile',
                'name',
                'email',
                'dob',
                'gender',
                'country_code'
            ],
            []
        );

        return data.hits.hits.map(row => row._source);
    } catch (e) {
        console.log('elastic error =>', e.message);
        return [];
    }

};

const getPrescriptions = async (user_id) => {
    return await db.findByCondition({ user_id: user_id, status: true }, 'UserPrescription', ['id', 'label', 'spheris_l', 'spheris_r', 'cylinder_l', 'cylinder_r', 'axis_l', 'axis_r', 'addition_l', 'addition_r', 'pupilary_distance', 'created_at', 'updated_at', 'status', 'is_primary']);
};

const updatePrescription = async (payload) => {

    if (await db.findOneByCondition({ label: payload.label, user_id: payload.user_id, id: { [Op.ne]: payload.id } }, 'UserPrescription', ['id'])) {
        throw errorHandler.customError(messages.prescriptionExist);
    }

    if (payload['is_primary']) {
        await db.updateOneByCondition({ is_primary: false }, { user_id: payload.user_id, is_primary: true }, 'UserPrescription');
    }

    let result = await Promise.all([
        db.updateOneByCondition({
            ...payload,
            updated_at: new Date()
        }, {
            id: payload.id,
        }, 'UserPrescription'),
        addCustomerActivityLogs({
            user_id: payload.user_id,
        action: constants.logs_action.update_prescription
        })
    ]);
    return result[0];
};

const addPrescription = async (payload) => {

    if (await db.findOneByCondition({ label: payload.label, user_id: payload.user_id }, 'UserPrescription', ['id'])) {
        throw errorHandler.customError(messages.prescriptionExist);
    }

    if (payload['is_primary']) {
        await db.updateOneByCondition({ is_primary: false }, { user_id: payload.user_id, is_primary: true }, 'UserPrescription');
    }
    let result = await Promise.all([
        db.saveData({ ...payload }, 'UserPrescription'),
        addCustomerActivityLogs({
            user_id: payload.user_id,
            action: constants.logs_action.add_prescription
        })
    ]);
    return result[0];
};

const sendNotification = async (payload) => {
    if (payload.is_hto) {
        await htoNotification(payload.order_no);
    } else {
        await purchaseNotification(payload.order_no);
    }
    return true;
};

const addPrescriptionToCart = async (payload, userId) => {
    if (payload.type === 'addon') {
        return await db.updateOneByCondition({
            prescription_id: payload.id,
            updated_at: new Date(),
            updated_by: userId
        }, {
            id: payload.cart_id,
        }, 'CartAddonItems');
    } else {
        return await db.updateOneByCondition({
            prescription_id: payload.id,
            updated_at: new Date(),
            updated_by: userId
        }, {
            id: payload.cart_id,
        }, 'CartItems');
    }
};

const getUserInfo = async (id) => {
    return await db.findOneByCondition({ id }, 'User');
};

const getVoucherDetails = async (payload, user) => {
    let cartItemQuery = `select p.retail_price, fm.frame_name, fm.variant_name, fm.sku_code,
        ci.item_count
        from cart_items ci
        inner join frame_master fm on fm.sku_code = ci.sku_code
        inner join products p on p.sku = ci.sku_code
        where ci.user_id = :user_id and ci.type = 1 and ci.status = true`;
    let cartAddonQuery = `select cai.cart_id, cai.addon_item_count, p."name", p.sku, p.retail_price, p.tax_rate
        from cart_addon_items cai
        inner join cart_items ci on ci.id = cai.cart_id
        inner join products p on p.id = cai.addon_product_id
        where ci.user_id = :user_id and ci.type = 1 and ci.status = true and cai.status = true`;

    let replacements = {
        user_id: payload.user_id
    };

    let promiseArr = [];

    promiseArr.push(db.rawQuery(cartItemQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(cartAddonQuery, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);

    let cartItems = results[0];
    let cartItemAddons = results[1];

    payload.voucherCode = payload.voucherCode.toUpperCase();
    let validateVoucherResponse = await validateUserVoucher(user, payload.voucherCode, cartItems, cartItemAddons);

    return validateVoucherResponse;
};

const deletePrescription = async (payload) => {
    return await db.updateOneByCondition({ status: false }, { id: payload.id }, 'UserPrescription');
};

const htoBook = async (payload) => {
    let transaction = await db.dbTransaction();

    try {
        // let optician_id = await _assignOptician(payload.appointment_date, payload.timeslot_id);
        let appointment_no = `HTOSTL/${utils.generateRandom(12, true).toUpperCase()}`;
        let appointment_id = uuidv4();

        let appointmentObj = {
            id: appointment_id,
            appointment_no,
            address_id: payload.address_id,
            store_id: payload.store_id,
            user_id: payload.user_id,
            created_at: new Date(),
            created_by: payload.user_id,
            updated_at: new Date(),
            updated_by: payload.user_id,
            notes: payload.notes,
            sales_channel: payload.sales_channel ? payload.sales_channel : 'app',
            appointment_status: constants.appointment_status.APPOINTMENT_CONFIRMED
        };

        let appointmentTimingDetailsObj = {
            appointment_id,
            // optician_id,
            slot_id: payload.timeslot_id,
            appointment_date: payload.appointment_date,
            created_at: new Date(),
            created_by: payload.user_id,
            updated_at: new Date(),
            updated_by: payload.user_id
        };

        let appointmentHistoryObj = {
            appointment_id,
            created_at: new Date(),
            appointment_status: constants.appointment_status.APPOINTMENT_CONFIRMED
        };

        let promiseArr = [];
        promiseArr.push(db.saveData(appointmentObj, 'Appointment', transaction));
        promiseArr.push(db.saveData(appointmentTimingDetailsObj, 'AppointmentTimeDetails', transaction));
        promiseArr.push(db.saveData(appointmentHistoryObj, 'AppointmentHistory', transaction));

        let results = await Promise.all(promiseArr);

        await transaction.commit();

        let appointmentDetails = results[0];

        appointmentNotification(appointment_id);

        return appointmentDetails;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const htoReschedule = async (payload) => {
    let transaction = await db.dbTransaction();
    try {
        let appointmentQuery = `select ap.id as appointment_id, ap.appointment_no,
            ap.address_id, ap.store_id, ap.notes, atd.appointment_date, hs.slot_start_time
            from appointment ap
            inner join appointment_time_details atd on atd.appointment_id = ap.id
            inner join hto_slot hs on hs.id = atd.slot_id
            where ap.id = (:appointment_id) and ap.user_id = :user_id and ap.status = 1 and atd.status = 1`;

        let replacements = {
            appointment_id: payload.appointment_id,
            user_id: payload.user_id
        };

        let appointmentResults = await db.rawQuery(appointmentQuery, 'SELECT', replacements);

        if (appointmentResults.length != 1) {
            throw new Error('Invalid appointment no');
        }

        let appointmentDetails = appointmentResults[0];
        let olddatetoshow = moment(appointmentDetails.appointment_date).format('dddd, Do MMMM YYYY');
        let oldtimetoshow = appointmentDetails.slot_start_time;

        // let optician_id = await _assignOptician(payload.appointment_date, payload.timeslot_id);

        let appointmentTimingDetailsObj = {
            appointment_id: appointmentDetails.appointment_id,
            // optician_id,
            slot_id: payload.timeslot_id,
            appointment_date: payload.appointment_date,
            created_at: new Date(),
            created_by: payload.user_id,
            updated_at: new Date(),
            updated_by: payload.user_id,
            status: 1
        };

        let appointmentHistoryObj = {
            appointment_id: appointmentDetails.appointment_id,
            created_at: new Date(),
            appointment_status: constants.appointment_status.APPOINTMENT_RESCHEDULED
        };

        await db.updateOneByCondition({
            appointment_status: constants.appointment_status.APPOINTMENT_CONFIRMED,
            updated_at: new Date(),
            updated_by: payload.user_id
        }, {
            id: appointmentDetails.appointment_id,
            status: 1
        }, 'Appointment', transaction);

        await db.updateOneByCondition({
            status: -1,
            updated_at: new Date(),
            updated_by: payload.user_id
        }, {
            appointment_id: appointmentDetails.appointment_id,
            status: 1
        }, 'AppointmentTimeDetails', transaction);

        let promiseArr = [];
        promiseArr.push(db.saveData(appointmentTimingDetailsObj, 'AppointmentTimeDetails', transaction));
        promiseArr.push(db.saveData(appointmentHistoryObj, 'AppointmentHistory', transaction));

        await Promise.all(promiseArr);

        await transaction.commit();

        // TODO: change HTO notification
        appointmentRescheduleNotification(payload.appointment_id, olddatetoshow, oldtimetoshow);

        return {
            message: messages.orderRescheduled
        };
    } catch (error) {
        console.log(error);
        transaction.rollback();
        throw errorHandler.customError(messages.htorRescheduleError);
    }
};

const htoCancel = async (payload) => {
    let transaction = await db.dbTransaction();
    try {
        let appointmentQuery = `select ap.id as appointment_id, ap.appointment_no, ap.status
            from appointment ap
            where ap.id = (:appointment_id) and ap.user_id = :user_id and ap.status = 1`;

        let replacements = {
            appointment_id: payload.appointment_id,
            user_id: payload.user_id
        };

        let appointmentResults = await db.rawQuery(appointmentQuery, 'SELECT', replacements);
        if (appointmentResults.length == 0) {
            throw new Error('Invalid appointment ID');
        }

        let appointmentDetails = appointmentResults[0];
        let appointmentHistoryObj = {
            appointment_id: appointmentDetails.appointment_id,
            created_at: new Date(),
            appointment_status: constants.appointment_status.APPOINTMENT_CANCELLED
        };

        let updateAppointment = db.updateOneByCondition({
            status: 0,
            appointment_status: constants.appointment_status.APPOINTMENT_CANCELLED,
            updated_at: new Date(),
            updated_by: payload.user_id,
            comment: payload.comment || ''
        }, {
            id: payload.appointment_id
        }, 'Appointment', transaction);

        let updateAppointmentTimeDetails = db.updateOneByCondition({
            status: 0,
            updated_at: new Date(),
            updated_by: payload.user_id
        }, {
            appointment_id: payload.appointment_id,
            status: 1
        }, 'AppointmentTimeDetails', transaction);

        let promiseArr = [];
        promiseArr.push(db.saveData(appointmentHistoryObj, 'AppointmentHistory', transaction));
        promiseArr.push(updateAppointment);
        promiseArr.push(updateAppointmentTimeDetails);

        await Promise.all(promiseArr);

        await transaction.commit();

        // TODO: change HTO cancel notification

        return {
            message: messages.htoOrderCancel
        };
    } catch (error) {
        console.log(error);
        transaction.rollback();
        throw errorHandler.customError(messages.htorRescheduleError);
    }
};

const htoAppointmentList = async (payload) => {
    const offset = (payload.page - 1) * constants.limit;

    let appointmentQuery = `select ap.id as appointment_id, ap.appointment_no,
        ap.address_id, ap.status, ap.created_at, atd.appointment_date, hs.slot_start_time, hs.slot_end_time
        from appointment ap
        inner join appointment_time_details atd on atd.appointment_id = ap.id
        inner join hto_slot hs on hs.id = atd.slot_id
        where ap.status in (0, 1) and ap.user_id = :user_id and atd.status in (0,1)
        order by ap.created_at desc
        limit :limit offset :offset`;

    let appointmentCountQuery = 'select count(ap.id) as total_appointments from appointment ap where status in (0, 1) and user_id = :user_id';

    let replacements = {
        user_id: payload.user_id,
        offset,
        limit: constants.limit
    };

    let promiseArr = [];
    promiseArr.push(db.rawQuery(appointmentQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(appointmentCountQuery, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);
    let appointmentResults = results[0];
    let appointmentCount = results[1];

    let response = {
        pages: 0,
        orders: []
    };

    const pages = Math.ceil(appointmentCount[0].total_appointments / constants.limit);
    response = {
        pages,
        appointmentResults,
    };
    return response;
};

const appointmentDetail = async (payload) => {
    let appointmentQuery = `select ap.id as appointment_id, ap.appointment_no, atd.appointment_date, ap.address_id, ap.status, ap.notes, ap.created_at,
        ua.receiver_name, ua.label_address, ua.phone_number as address_phone_number, ua.note as address_note, ua.zip_code, ua.address,
        ua.address_details, ua."position", ua.lat, ua.long,
        hs.slot_start_time, hs.slot_end_time
        from appointment ap
        inner join appointment_time_details atd on atd.appointment_id = ap.id
        inner join hto_slot hs on hs.id = atd.slot_id
        inner join user_address ua on ua.id = ap.address_id
        where ap.id = (:appointment_id) and ap.user_id = :user_id and ap.status in (0, 1) and atd.status in (0,1)`;

    let replacements = {
        user_id: payload.user_id,
        appointment_id: payload.appointment_id
    };

    let appointmentResults = await db.rawQuery(appointmentQuery, 'SELECT', replacements);

    if (appointmentResults.length == 0) {
        throw new Error('Invalid appointment ID');
    }

    let appointmentDetails = appointmentResults[0];

    let response = {
        appointment_id: appointmentDetails.appointment_id,
        appointment_no: appointmentDetails.appointment_no,
        appointment_date: appointmentDetails.appointment_date,
        status: appointmentDetails.status,
        created_at: appointmentDetails.created_at,
        slot_start_time: appointmentDetails.slot_start_time,
        slot_end_time: appointmentDetails.slot_end_time,
        notes: appointmentDetails.notes,
    };
    response.addressDetails = {
        receiver_name: appointmentDetails.receiver_name,
        label_address: appointmentDetails.label_address,
        address_phone_number: appointmentDetails.address_phone_number,
        note: appointmentDetails.address_note,
        zip_code: appointmentDetails.zip_code,
        address: appointmentDetails.address,
        address_details: appointmentDetails.address_details,
        position: appointmentDetails.position,
        lat: appointmentDetails.lat,
        long: appointmentDetails.long,
    };

    return response;
};

const submitReferralCode = async (payload, user) => {
    if (user.registration_referral_code != null && user.registration_referral_code != '') {
        throw new Error('Referral code already submitted');
    }

    if (user.is_first_order == 1) {
        throw new Error('User already created a order.');
    }

    let referralUser = await db.findOneByCondition({
        referral_code: payload.referral_code,
        status: 1,
    }, 'UserReferral');

    if (!referralUser) {
        throw errorHandler.customError(messages.invalidReferralCode);
    }

    referralUser = referralUser.toJSON();

    if (user.id == referralUser.user_id) {
        throw errorHandler.customError(messages.invalidReferralCode);
    }

    let name = user.name;
    name = name.replace(/\s/g, '');

    let user_voucher_code = `${name.substring(0, 4).toUpperCase()}${utils.generateRandom(4, false)}`;

    let user_id = user.id;
    let date = new Date();
    const voucher_expiry_date = new Date();
    voucher_expiry_date.setDate(voucher_expiry_date.getDate() + 2);

    let userVoucherObj = {
        voucher_code: user_voucher_code,
        voucher_type: constants.voucherType.absolute,
        voucher_category: constants.voucherCategory.USER,
        voucher_amount: constants.referralDetails.voucherAmount,
        voucher_max_amount: constants.referralDetails.voucherAmount,
        minimum_cart_amount: constants.referralDetails.minimumCartAmount,
        voucher_title: constants.referralDetails.voucherTitle,
        voucher_image_key: constants.referralDetails.voucherImageKey,
        is_single_user: true,
        user_id: user_id,
        date_constraint: true,
        expire_at: voucher_expiry_date,
        max_cart_size: 10,
        start_at: date,
        created_at: date,
        created_by: user_id,
        updated_at: date,
        updated_by: user_id
    };

    await db.saveData(userVoucherObj, 'VoucherDetails');

    await db.updateOneByCondition({
        registration_referral_code: payload.referral_code
    }, { id: user.id }, 'User');

    return {
        message: 'User updated successfully'
    };
};

const referralList = async (payload) => {
    let pendingReferralListQuery = `select ur.referral_code, ur.referral_amount as credit_amount, us."name", us.id as customer_id,
        us.created_at, us.is_first_order, 'PENDING' as "transaction_type"
        from user_referral ur
        inner join users us on us.registration_referral_code = ur.referral_code
        where ur.user_id = :user_id and ur.status = 1 and us.is_first_order = 0
        order by us.created_at desc`;

    let creditHistoryQuery = `select uc.activity_type, uc.transaction_type, uc.credit_amount, uc.opening_balance, uc.closing_balance,
        uc.created_at, uc.activity_reference_id, od.order_no, us.name, us.id as customer_id
        from user_credits uc
        left join order_details od on od.id = uc.activity_reference_id
        left join users us on us.id = uc.created_by
        where uc.user_id = :user_id and uc.status = 1
        order by uc.created_at desc`;

    let creditQuery = `select opening_balance, closing_balance from user_credits
        where status = 1 and user_id = :user_id
        order by created_at desc limit 1`;

    let replacements = {
        user_id: payload.user_id
    };

    let promiseArr = [];
    promiseArr.push(db.rawQuery(pendingReferralListQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(creditHistoryQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(creditQuery, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);

    let referralListResults = results[0];
    let creditHistoryResults = results[1];
    let creditResults = results[2];

    let credits = 0;

    if (creditResults.length > 0) {
        credits = creditResults[0].closing_balance;
    }

    let creditList = _.filter(creditHistoryResults, (result) => {
        return result.transaction_type == 'CREDIT';
    });

    let expiration_date = new Date();

    if (creditList.length > 0) {
        let latest_credit = creditList[0];
        expiration_date = new Date(latest_credit.created_at);
        expiration_date.setDate(expiration_date.getDate() + 90);
    }

    creditHistoryResults = creditHistoryResults.concat(referralListResults);

    _.sortBy(creditHistoryResults, ['created_at'], ['desc']);

    let response = {
        credits,
        creditHistory: creditHistoryResults,
        expiration_date
    };

    return response;
};

const voucherList = async (payload) => {
    let voucherListQuery = `select * from voucher_details vd where 
        is_expired = false and status = 1 and hide = false and start_at < current_timestamp and 
        (
            (voucher_category = 'user' and user_id = :user_id)
            or (voucher_category = 'generic' and date_constraint = true and expire_at > current_timestamp)
            or ((voucher_category = 'generic' and date_constraint = false))
        ) order by created_at desc`;

    let userVoucherQuery = `select vd.* from voucher_details vd
        inner join voucher_user_mapping mp on
        mp.voucher_code = vd.voucher_code
        where mp.status = 1 and vd.expire_at > current_timestamp
        and start_at < current_timestamp
        and cast(mp.user_id as uuid) = :user_id`;

    let replacements = {
        user_id: payload.user_id
    };

    let voucherListResults = await db.rawQuery(voucherListQuery, 'SELECT', replacements);
    let userVoucherResults = await db.rawQuery(userVoucherQuery, 'SELECT', replacements);

    voucherListResults.push(...userVoucherResults);

    voucherListResults = voucherListResults.map(row => {
        row.base_url = config.s3URL;
        return row;
    });

    return voucherListResults;
};

const userVoucherList = async (payload) => {
    let voucherListQuery = `select * from voucher_details vd where 
        is_expired = false and status = 1 and hide = false and start_at < current_timestamp and 
        voucher_category = 'user' and user_id = :user_id
        order by created_at desc`;

    let userVoucherQuery = `select vd.* from voucher_details vd
        inner join voucher_user_mapping mp on
        mp.voucher_code = vd.voucher_code
        where mp.status = 1 and vd.expire_at > current_timestamp
        and start_at < current_timestamp 
        and cast(mp.user_id as uuid) = :user_id`;

    let replacements = {
        user_id: payload.user_id
    };

    let voucherListResults = await db.rawQuery(voucherListQuery, 'SELECT', replacements);
    let userVoucherResults = await db.rawQuery(userVoucherQuery, 'SELECT', replacements);

    voucherListResults.push(...userVoucherResults);

    voucherListResults = voucherListResults.map(row => {
        row.base_url = config.s3URL;
        return row;
    });

    return voucherListResults;
};

// NOTE: DO NOT Change: Amit Sangwan
const userCheckout = async (payload, user = {}) => {
    if (payload.fulfillment_type == 0) {
        if (_.isUndefined(payload.store_id)) {
            throw errorHandler.customError(messages.storeRequired);
        }
    } else if (payload.fulfillment_type == 1) {
        if (_.isUndefined(payload.address_id)) {
            throw errorHandler.customError(messages.addressRequired);
        }
    }

    if (payload.country_code != 'ID') {
        payload.is_referral_credit = false;
        payload.is_voucher_code = false;
    }

    if (payload.is_referral_credit && payload.is_voucher_code) {
        throw new Error('User can either user referral credit or voucher code at a time.');
    }

    let user_id = user.id;

    let cartItemQuery = `select p.name, p.sku, pip.retail_price, pip.country_code, pip.currency_code,
        (case
            when ps.quantity is null then 0
            else ps.quantity end) as quantity,
        (case
            when ps.reserved is null then 0
            else ps.reserved end) as reserved,
        ci.user_id, ci.id as cart_id, ci.product_type, ci.product_category, ci.item_count, ci.is_warranty,
        ci.prescription_id, ci.discount_amount, ci.discount_type, ci.discount_note, ci.packages
        from cart_items ci
        inner join products p on p.sku = ci.sku_code
        left join product_stocks ps on ps.sku = p.sku and ps.store_id = :store_id
        inner join product_international_prices pip on pip.sku_code = p.sku
        where ci.user_id = :user_id and ci.status = true
        and pip.country_code = :country_code`;

    let cartAddonQuery = `select cai.cart_id, cai.addon_item_count, cai.discount_amount, cai.type,
        cai.discount_amount, cai.discount_type, cai.discount_note, cai.is_sunwear, cai.lense_color_code,
        p."name", p.sku, pip.retail_price, pip.country_code, pip.currency_code,
        (case
            when ps.quantity is null then 0
            else ps.quantity end) as quantity,
        (case
            when ps.reserved is null then 0
            else ps.reserved end) as reserved
        from cart_addon_items cai
        inner join cart_items ci on ci.id = cai.cart_id
        inner join products p on p.sku = cai.addon_product_sku
        inner join product_stocks ps on ps.sku = p.sku and ps.store_id = :store_id
        inner join product_international_prices pip on pip.sku_code = p.sku
        where ci.user_id = :user_id and ci.status = true and cai.status = true
        and pip.country_code = :country_code`;


    let replacements = {
        user_id: user_id,
        store_id: payload.store_id,
        country_code: payload.country_code
    };

    let dbProducts = await db.rawQuery(cartItemQuery, 'SELECT', replacements);
    let dbAddOns = await db.rawQuery(cartAddonQuery, 'SELECT', replacements);

    if (dbProducts.length === 0) {
        throw new Error('Cart is empty');
    }

    let order_amount = 0;
    let order_discount_amount = 0;
    let pending_discount_mount = 0;

    let order_credit_amount = 0;
    let pending_credit_amount = 0;
    let user_total_credit_amount = 0;

    let order_eyewear_points_credit_amount = 0;
    let pending_eyewear_points_credit = 0;
    let user_total_eyewear_points_credit = 0;

    let order_eyewear_points_credit_points = 0;
    let user_total_eyewear_points = 0;

    let total_order_amount = 1; // For deviding voucher/user credit amount amount only

    let orderItems = [];
    let orderItemAddons = [];

    // else {
    //     payload.voucher_code = '';
    // } 

    if (payload.is_voucher_code) {
        payload.voucher_code = payload.voucher_code.toUpperCase();
        let voucherDetails = await validateUserVoucher(user, payload.voucher_code, dbProducts, dbAddOns);
        order_discount_amount = voucherDetails.voucherDiscountAmount;
        pending_discount_mount = voucherDetails.voucherDiscountAmount;
        total_order_amount = voucherDetails.cartAmount;
    } else if (payload.is_referral_credit) {
        let userCreditDetails = await validateUserCredits(user_id, dbProducts, dbAddOns);

        order_credit_amount = userCreditDetails.orderCreditAmount;
        pending_credit_amount = userCreditDetails.orderCreditAmount;
        total_order_amount = userCreditDetails.orderAmount;
        user_total_credit_amount = userCreditDetails.totalCreditAmount;

        if (order_credit_amount == 0) {
            payload.is_referral_credit = false;
        }
        payload.voucher_code = '';
    } else if (payload.is_eyewear_points_credit) {
        let eyewearPointsCreditDetails = await validateeyewearPointsCredit(user_id, dbProducts, dbAddOns);

        order_eyewear_points_credit_amount = eyewearPointsCreditDetails.orderCreditAmount;
        pending_eyewear_points_credit = eyewearPointsCreditDetails.orderCreditAmount;
        total_order_amount = eyewearPointsCreditDetails.orderAmount;
        user_total_eyewear_points_credit = eyewearPointsCreditDetails.totalCreditAmount;

        order_eyewear_points_credit_points = eyewearPointsCreditDetails.orderCreditPoints;
        user_total_eyewear_points = eyewearPointsCreditDetails.totalCreditPoints;

        if (order_eyewear_points_credit_amount == 0) {
            payload.is_eyewear_point_credit = false;
        }
        payload.voucher_code = '';
    }

    let order_no = `STECOM/${utils.generateRandom(12, true).toUpperCase()}`;
    let order_id = uuidv4();
    let payment_req_id = uuidv4();
    let current_date = new Date();

    for (let dbProduct of dbProducts) {
        if (dbProduct.quantity - dbProduct.reserved < dbProduct.item_count) {
            throw new Error(`Product with Name: ${dbProduct.name} is not available, Please remove it from cart`);
        }

        let addOns = dbAddOns.filter(dbAddOn => dbAddOn.cart_id === dbProduct.cart_id);

        if (dbProduct.product_type !== constants.product_type.FRAME) {
            if (addOns.length == 0) {
                throw new Error(`Please add addons for frame: ${dbProduct.name}`);
            }
        }

        let cart_item_amount = dbProduct.retail_price * dbProduct.item_count;
        order_amount += cart_item_amount;

        let item_discount_amount = 0;
        let item_credit_amount = 0;
        let eyewear_points_credit = 0;

        if (payload.is_voucher_code) {
            item_discount_amount = order_discount_amount * (cart_item_amount / total_order_amount);
            item_discount_amount = Math.round(item_discount_amount);
            pending_discount_mount = pending_discount_mount - item_discount_amount;
        }

        if (payload.is_referral_credit) {
            item_credit_amount = order_credit_amount * (cart_item_amount / total_order_amount);
            item_credit_amount = Math.round(item_credit_amount);
            pending_credit_amount = pending_credit_amount - item_credit_amount;
        }

        if (payload.is_eyewear_points_credit) {
            eyewear_points_credit = order_eyewear_points_credit_amount * (cart_item_amount / total_order_amount);
            eyewear_points_credit = Math.round(eyewear_points_credit);
            pending_eyewear_points_credit = pending_eyewear_points_credit - eyewear_points_credit;
        }

        let order_item_id = uuidv4();

        let orderItem = {
            id: order_item_id,
            name: dbProduct.name,
            order_id: order_id,
            order_no: order_no,
            order_item_id,
            sku: dbProduct.sku,
            retail_price: dbProduct.retail_price,
            prescription_id: dbProduct.prescription_id,
            discount_amount: item_discount_amount,
            user_credit: item_credit_amount,
            eyewear_points_credit: eyewear_points_credit,
            tax_rate: dbProduct.tax_rate,
            quantity: dbProduct.item_count,
            product_category: dbProduct.product_category,
            product_type: dbProduct.product_type,
            order_item_total_price: cart_item_amount,
            created_at: current_date,
            is_warranty: 2,
            packages: constants.defaultPackages,
            country_code: dbProduct.country_code,
            currency_code: dbProduct.currency_code,
        };

        for (addOn of addOns) {
            if (addOn.quantity - addOn.reserved < addOn.addon_item_count) {
                throw new Error(`Addon: ${addOn.name} of product with Name: ${dbProduct.name} is not available, Please remove it from cart`);
            }

            let addon_amount = addOn.retail_price * addOn.addon_item_count;
            order_amount += addon_amount;
            orderItem.order_item_total_price += addon_amount;

            let addon_discount_amount = 0;
            let addon_credit_amount = 0;
            let addon_eyewear_points_credit = 0;

            if (payload.is_voucher_code) {
                addon_discount_amount = order_discount_amount * (addon_amount / total_order_amount);
                addon_discount_amount = Math.round(addon_discount_amount);
                pending_discount_mount = pending_discount_mount - addon_discount_amount;
            }

            if (payload.is_referral_credit) {
                addon_credit_amount = order_credit_amount * (addon_amount / total_order_amount);
                addon_credit_amount = Math.round(addon_credit_amount);
                pending_credit_amount = pending_credit_amount - addon_credit_amount;
            }

            if (payload.is_eyewear_points_credit) {
                addon_eyewear_points_credit = order_eyewear_points_credit_amount * (addon_amount / total_order_amount);
                addon_eyewear_points_credit = Math.round(addon_eyewear_points_credit);
                pending_eyewear_points_credit = pending_eyewear_points_credit - addon_eyewear_points_credit;
            }

            let orderItemAddon = {
                order_no: order_no,
                order_id: order_id,
                order_item_id,
                sku: addOn.sku,
                lense_color_code: addOn.lense_color_code,
                retail_price: addOn.retail_price,
                discount_amount: addon_discount_amount,
                user_credit: addon_credit_amount,
                eyewear_points_credit: addon_eyewear_points_credit,
                quantity: addOn.addon_item_count,
                created_at: current_date,
                country_code: dbProduct.country_code,
                currency_code: dbProduct.currency_code,
            };

            orderItemAddons.push(orderItemAddon);
        }
        orderItems.push(orderItem);
    }

    if (payload.is_voucher_code) {
        if (pending_discount_mount !== 0) {
            orderItems[0].discount_amount = orderItems[0].discount_amount + pending_discount_mount;
        }
    }

    if (payload.is_referral_credit) {
        if (pending_credit_amount !== 0) {
            orderItems[0].user_credit = orderItems[0].user_credit + pending_credit_amount;
        }
    }

    if (payload.is_eyewear_points_credit) {
        if (pending_eyewear_points_credit !== 0) {
            orderItems[0].eyewear_points_credit = orderItems[0].eyewear_points_credit + pending_eyewear_points_credit;
        }
    }

    let payment_amount = order_amount - order_discount_amount - order_credit_amount - order_eyewear_points_credit_amount;
    if (payment_amount <= 0) { payment_amount = 0; }

    let transaction = await db.dbTransaction();

    try {
        const scheduled_delivery_date = new Date();
        scheduled_delivery_date.setDate(scheduled_delivery_date.getDate() + 10);

        let order_status = constants.order_status.PAYMENT_INITIATED;

        let orderJSON = {
            id: order_id,
            order_no: order_no,
            user_id: user_id,
            email_id: user.email,
            payment_req_id: payment_req_id,
            address_id: payload.address_id,
            voucher_code: payload.voucher_code || 'NA',
            order_amount: order_amount,
            order_discount_amount: order_discount_amount,
            user_credit_amount: order_credit_amount,
            eyewear_points_credit: order_eyewear_points_credit_amount,
            payment_amount: payment_amount,
            scheduled_delivery_date: scheduled_delivery_date,
            order_status: order_status,
            created_at: current_date,
            created_by: user_id,
            updated_at: current_date,
            updated_by: user_id,
            notes: payload.notes || 'NA',
            status: 0,
            is_payment_required: true,
            is_local_order: false,
            fulfillment_type: payload.fulfillment_type,
            sales_channel: constants.sale_channel.APP,
            store_id: payload.store_id,
            pick_up_store_id: payload.store_id,
            register_id: 0,
            country_code: payload.country_code,
            currency_code: payload.currency_code,
            currency: payload.currency_code,
        };

        let promiseArr = [];

        if (payment_amount == 0) {
            order_status = constants.order_status.PAYMENT_CONFIRMED;
            orderJSON.order_status = order_status;
            orderJSON.status = 1;

            let deleteCartItems = db.deleteRecord({
                user_id: user_id
            }, 'CartItems', transaction);

            let deleteAddonItems = db.deleteRecord({
                user_id: user_id
            }, 'CartAddonItems', transaction);

            promiseArr.push(deleteCartItems);
            promiseArr.push(deleteAddonItems);
        }

        if (payload.is_referral_credit) {
            orderJSON.is_credit = true;

            let credit_amount = order_credit_amount;
            let opening_balance = user_total_credit_amount;
            let closing_balance = user_total_credit_amount - credit_amount;

            let userCreditObj = {
                user_id: user_id,
                credit_amount: credit_amount,
                opening_balance: opening_balance,
                closing_balance: closing_balance,
                activity_type: 'ORDER',
                activity_reference_id: order_id,
                transaction_type: 'DEBIT',
                created_at: current_date,
                created_by: user_id,
                updated_at: current_date,
                updated_by: user_id,
                status: 1
            };

            promiseArr.push(db.saveData(userCreditObj, 'UserCredits', transaction));
        }

        if (payload.is_eyewear_points_credit) {
            orderJSON.is_eyewear_points_credit = true;

            let credit_amount = order_eyewear_points_credit_amount;
            let credit_points = order_eyewear_points_credit_points;

            let opening_balance = user_total_eyewear_points_credit;
            let closing_balance = user_total_eyewear_points_credit - order_eyewear_points_credit_amount;

            let opening_points = user_total_eyewear_points;
            let closing_points = user_total_eyewear_points - order_eyewear_points_credit_points;

            let userCreditObj = {
                order_no : order_no,
                user_id: user_id,
                points : credit_points,
                transaction_amount: credit_amount,
                status: 1,
                created_at: current_date,
                created_by: user_id,
                updated_at: current_date,
                updated_by: user_id,
                type: 2,
                opening_balance: opening_balance,
                closing_balance: closing_balance,
                opening_points: opening_points,
                closing_points: closing_points,
            };

            promiseArr.push(db.saveData(userCreditObj, 'SaturdayPointsTransactions', transaction));
        }

        promiseArr.push(db.saveData(orderJSON, 'OrderDetail', transaction));
        promiseArr.push(db.saveMany(orderItems, 'OrderItem', transaction));
        promiseArr.push(db.saveMany(orderItemAddons, 'OrderItemAddon', transaction));

        await Promise.all(promiseArr);

        await transaction.commit();

        return {
            order_id,
            order_no,
            payment_req_id,
            payment_amount,
            order_status,
            created_at: current_date,
            country_code: payload.country_code,
            currency_code: payload.currency_code
        };
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const creditEyewearPoints = async (order) => {
    try{
        let level = 1;
        
        let replacements = {
            user_id : order.user_id
        }; 

        let levelInfo = await db.findOneByCondition({ user_id: order.user_id }, 'UserTier');
        if(levelInfo){
            level  = levelInfo.tier;
        }

        let stPointsResult = saturdayCredits.calculateRewardsAngainstOrder(order, level);

        let stPointsQuery  = `select opening_balance, closing_balance, opening_points, closing_points
                                from eyewear_points_transactions
                                where status = 1 and user_id = :user_id
                                order by created_at desc limit 1`;

        let userCreditResults = await db.rawQuery(stPointsQuery, 'SELECT', replacements);

        let credit_reward = stPointsResult.reward;
        let credit_discount = stPointsResult.discount;
        let credit_points = stPointsResult.points;

        let opening_balance = 0;
        let opening_points = 0;
        if(userCreditResults.length !== 0) {
            opening_balance = userCreditResults[0].closing_balance;
            opening_points = userCreditResults[0].closing_points;
        }

        let closing_balance = opening_balance + credit_discount;
        let closing_points = opening_points + credit_points;


        let stTxnObj = {
            order_no: order.order_no,
            user_id: order.user_id,
            rewards : credit_reward || 0,
            points : credit_points || 0,
            transaction_amount: credit_discount,
            status: 1,
            expire_at : moment(order.created_at).add(2, 'years'),
            created_at:  new Date(),
            created_by: order.user_id,
            updated_at:  new Date(),
            updated_by: order.user_id,
            type: 1,
            opening_balance: opening_balance || 0,
            closing_balance: closing_balance || 0,
            opening_points: opening_points || 0,
            closing_points: closing_points || 0,
            percentage: stPointsResult.percentage
        };

        await db.saveData(stTxnObj, 'SaturdayPointsTransactions');


    } catch (error) {
        console.log('Error:', error);
        throw new Error(error.message);
    }
};

const saturdayPoints = async (userId) => {

    let replacements = {
        user_id: userId
    };

    let stPointsQueryHistoryQuery = `select type, transaction_amount, points, opening_balance, closing_balance, percentage,
                                created_at, order_no, opening_points, closing_points
                                from eyewear_points_transactions 
                                where user_id = :user_id and status = 1
                                order by created_at desc`;

    let stPointsQuery = `select transaction_amount, opening_balance, closing_balance from eyewear_points_transactions
                        where status = 1 and user_id = :user_id
                        order by created_at desc limit 1`;


    let promiseArr = [];

    promiseArr.push(db.rawQuery(stPointsQueryHistoryQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(stPointsQuery, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);

    let stPointsHistoryResults = results[0];
    let stPointsResults = results[1];

    let credits = 0;
    let ptCredits = 0;

    if (stPointsResults.length > 0) {
        credits = stPointsResults[0].closing_balance;
        ptCredits = stPointsResults[0].points;
    }

    let stPointsList = _.filter(stPointsHistoryResults, (result) => {
        return result.type == 1;
    });

    let expiration_date = new Date();

    if (stPointsList.length > 0) {
        let latest_credit = stPointsList[0];
        expiration_date = new Date(latest_credit.created_at);
        expiration_date.setDate(expiration_date.getDate() + 90);
    }

    _.sortBy(stPointsHistoryResults, ['created_at'], ['desc']);

    let response = {
        credits,
        ptCredits,
        stHistory: stPointsHistoryResults,
    };

    return response;

};

const tierInfo = async (userId) => {
    let tier = await db.findOneByCondition({ user_id: userId }, 'UserTier');
    let tiers = constants.tiers;
    return { tiers, tier };
};

const saturdayPointsRewards = async () => {
    return {
        casual: [
            { title: 'Get 5% cashback EyewearPoint', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/badge%402x.png' },
            { title: 'Get Birthday surprises', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/ticket%402x.png' }
        ],
        loyal: [
            { title: 'Get 10% cashback EyewearPoint', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/badge%402x.png' },
            { title: 'Get Birthday surprises', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/ticket%402x.png' },
            { title: 'Get 5 vouchers of 40% OFF', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/voucher2x.png' }
        ],
        dieHard: [
            { title: 'Get 15% cashback EyewearPoint', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/badge%402x.png' },
            { title: 'Get Birthday surprises', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/gift%402x.png' },
            { title: 'Get 10 vouchers of 40% OFF', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/voucher2x.png' },
            { title: 'Early access to new products', icon: 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/FAQ/icons/ticket%402x.png' }
        ],
    };

};


module.exports = {
    getConfigDetails,
    register,
    login,
    logout,
    getStores,
    addWishlist,
    removeWishlist,
    getWishlist,
    addCart,
    getCart,
    updateCart,
    deleteCart,
    clearCart,
    addCartAddon,
    updateCartAddon,
    deleteCartAddon,
    userOtp,
    userOtpVerify,
    htoCheckout,
    createOrder,
    userAddress,
    userAddressUpdate,
    getUserAddress,
    getNotifications,
    getUserOrderList,
    getOrderDetails,
    getUserData,
    updateUserData,
    removeAddress,
    rescheduleHTOOrder,
    cancelOrder,
    fileUpload,
    savedCardData,
    getSavedCard,
    deleteSavedCard,
    updateSavedCard,
    returnOrder,
    orderHistory,
    addUserByAdmin,
    getUser,
    updateUserByAdmin,
    searchUser,
    getPrescriptions,
    updatePrescription,
    addPrescription,
    sendNotification,
    addPrescriptionToCart,
    getUserInfo,
    formatOrderDetails,
    getVoucherDetails,
    deletePrescription,
    htoBook,
    htoReschedule,
    htoCancel,
    htoAppointmentList,
    appointmentDetail,
    submitReferralCode,
    referralList,
    _assignOptician,
    voucherList,
    userVoucherList,
    userCheckout,
    saturdayPoints,
    saturdayPointsRewards,
    creditEyewearPoints,
    tierInfo
};
