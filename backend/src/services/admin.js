const config = require('config');
const fs = require('fs');
const _ = require('lodash');
const db = require('../utilities/database');
const elasticsearch = require('../utilities/elasticsearch');
const turbolyUtility = require('../utilities/turboly');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const { authChecker } = require('../middleware');
const { messages, constants, errorHandler, utils, s3Upload } = require('../core');
const { generateJwtToken } = authChecker;
const { getWishlist, getPrescriptions, getUserAddress, getStores, htoCancel, referralList, creditEyewearPoints} = require('./user');
const { purchaseNotification, htoNotification, sendSingleUserNotification, appointmentNotification, appointmentRescheduleNotification, orderReadyToPickupNotification, orderShippedNotification, orderStatusNotification } = require('../utilities/notification');
const voucher = require('./admin/voucher');
const contactLens = require('./admin/contactLens');
const catalogue = require('./admin/catalogue');
const elasticData = require('./admin/elasticData');
const userManagement = require('./admin/userManagement');
const account = require('./admin/account');
const store = require('./admin/store');
const products = require('./admin/products');
const logs = require('./admin/logs');

const login = async(payload) => {
    const password = utils.encryptpassword(payload.password);
    const user = await db.findOneByCondition({ email: payload.email,  password, role: payload.role, status: 1}, 'User');
    if (!user) throw errorHandler.customError(messages.invalidCredentials);
    const userRoles =  await db.findOneByCondition({ user_id: user.id, status: true}, 'UserRoles', ['role']);
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
    return ({
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        language: user.language,
        store_id: user.store_id,
        time_zone: user.time_zone,
        accessRole: userRoles.role,
        permissions: await db.findByCondition({ role: userRoles.role, status: true}, 'RoleAccess', ['module_name', 'is_get', 'is_add', 'is_update', 'is_delete'])
    });
};

const addDraftOrder = async (payload, adminId) => {
    if(await db.findOneByCondition({ user_id: payload.user_id }, 'DraftOrders')){
        payload.updated_by = adminId;
        return await db.updateOneByCondition(payload, { user_id: payload.user_id }, 'DraftOrders');
    } else {
        payload.order_no = `STECOM/${utils.generateRandom(12, true).toUpperCase()}`;
        payload.created_by = adminId;
        payload.updated_by = adminId;
        return await db.saveData(payload, 'DraftOrders');
    }
};

const getOrders = async (payload) => {
    const is_hto = !!payload.is_hto;
    const {limit, order_status} = constants;
    const offset = (payload.page - 1) * limit;
    let condition = `is_hto = ${is_hto} and (pr.status=true OR pr.status IS NULL)`;
    let table = 'order_details';
    let fields = 'Distinct On (o.order_no) o.order_no, o.id, o.created_at, ad.name as admin_name, o.order_status, o.payment_status, o.order_amount, o.payment_amount, o.payment_category, o.currency_code, o.payment_req_id, o.order_discount_amount, o.sales_channel, o.store_id, s.name as store_name, o.stock_store_id, u.name, pr.amount, pr.payment_type, pr.payment_method, pr.bank_code';
    
    if(payload.admin_store_id){
        condition = condition + ` and (o.store_id='${payload.admin_store_id}' or stock_store_id='${payload.admin_store_id}' or pick_up_store_id='${payload.admin_store_id}')`;
    } else if(payload.store_id){
        condition = condition + ` and o.store_id='${payload.store_id}'`;
    }  
    if(payload.order_status === 'unprocessed'){
        condition = condition + ' and o.order_status = \'payment_confirmed\' and o.status=1';
    } else if(payload.order_status === 'unpaid'){
        condition = condition + ' and o.order_status = \'payment_pending\' and o.status=1';
    } else if(payload.order_status && payload.order_status !== 'all' && payload.order_status !== 'unprocessed' && payload.order_status !== 'unpaid' && payload.order_status !== 'draft' && payload.order_status !== 'payment_initiated'){
        if(payload.order_status === order_status.PAYMENT_CONFIRMED){
            condition+=` and o.status=1 and o.order_status not in ('${order_status.PAYMENT_INITIATED}', '${order_status.PAYMENT_PENDING}', '${order_status.PAYMENT_FAILED}', '${order_status.PAYMENT_CANCELLED}')`;
        } else {
            condition = condition + ` and o.order_status = '${payload.order_status}' and o.status=1`;
        }
    } else if(payload.order_status === 'payment_initiated'){
        condition = condition + ' and o.order_status = \'payment_initiated\'';
    } else {
        condition = condition + ' and (o.status=1 or o.order_status = \'payment_initiated\')';
    }
    if(payload.payment_status){
        condition = condition + ` and o.payment_status='${payload.payment_status}'`;
    }
    if(payload.search){
        condition = condition + ` and (o.order_no ilike '%${payload.search}%' or u.name ilike '%${payload.search}%')`;
    }
    if(payload.sales_channel){
        condition = condition + ` and o.sales_channel='${payload.sales_channel.toLowerCase()}'`;
    }
    if(payload.sales_person){
        condition = condition + ` and o.created_by_staff='${payload.sales_person}'`;
    }
    if(payload.optician){
        condition = condition + ` and o.optician='${payload.optician}'`;
    }
    if(payload.payment_method || payload.payment_method === 0){
        condition = condition + ` and pr.payment_method=${payload.payment_method}`;
    }
    if(payload.order_status === 'draft'){
        condition  = payload.store_id ? `o.store_id='${payload.store_id}'` : '';
        table = 'draft_orders';
        fields = 'o.id, o.order_no, o.created_at, ad.name as admin_name, o.address_id, o.store_id, o.order_amount, o.sales_channel, o.user_id, u.name, u.mobile, u.email';
        if(payload.search){
            condition = condition ? `${condition} and (o.order_no ilike '%${payload.search}%' or u.name ilike '%${payload.search}%')` : `o.order_no ilike '%${payload.search}%' or u.name ilike '%${payload.search}%'`;
        }
    }
    //console.log('condition', condition);

    if(payload.start_date && payload.end_date){
        condition = condition ? condition + ` and o.created_at >= '${utils.getDateFormat(payload.start_date)}' and o.created_at <= '${utils.getDateFormat(payload.end_date,24)}'` : '';
    }


    const orders = await await db.rawQuery(
        `SELECT COUNT(distinct o.order_no) ::int from ${table} o
        inner join users u on o.user_id = u.id
        left join payment_request pr on o.order_no = pr.order_no 
        left join stores s on o.stock_store_id = cast(s.id as varchar) ${condition ? 'WHERE '+condition : ''}`, 'SELECT');
    const list = await db.rawQuery(
        `SELECT * from (SELECT ${fields} from ${table} o
        inner join users u on o.user_id = u.id
        left join users ad on o.created_by = ad.id
        left join payment_request pr on o.order_no = pr.order_no
        left join stores s on o.stock_store_id = cast(s.id as varchar)
        ${condition ? 'WHERE '+condition : ''} ORDER BY o.order_no, pr.created_at DESC) o ORDER BY o.created_at ${payload.date_search && payload.date_search === 'createdby' ? 'ASC' : 'DESC'} LIMIT ${limit} OFFSET ${offset}`,
        'SELECT'
    );
    return ({list, total_rows: orders[0].count});
};

const getLenses = async () => {
    return await db.rawQuery(
        `select p.id, p.name, p.retail_price, ls.sku_code, ls.lense_type_name, ls.prescription_name, ls.filter_type_name, ls.index_value
        from lenses_detail ls join products as p on p.sku = ls.sku_code where p.active=true`,
        'SELECT'
      );
};

const addCartAddon = async (payload, isUpdate = false) => {
    let sku = `('${payload.addon_product_sku[0]}')`;
    if(payload.addon_product_sku.length > 1){
        sku = `('${payload.addon_product_sku[0]}','${payload.addon_product_sku[1]}')`;
    }
    const product_stock = await db.rawQuery(
      `select ps.quantity
        from products as p join product_stocks as ps on p.sku = ps.sku
        where p.sku in ${sku} and active=true and ps.quantity >= ${Number(payload.addon_item_count)}`,
      'SELECT'
    );
    if(product_stock && product_stock.length === 0) throw new errorHandler.customError(messages.itemOutOfStock);
    const newPayload = payload.addon_product_id.map((id, index) => ({
        ...payload,
        addon_product_id: id,
        addon_product_sku: payload.addon_product_sku[index],
        type: payload.type[index],
        cart_id: [2,3,4].includes(payload.category) ? null : payload.cart_id
    }));
    if(isUpdate){
        const addon_product_sku = payload.current_addon_product_sku;
        delete payload.current_addon_product_sku;
        await db.deleteRecord({ addon_product_sku, user_id: payload.user_id }, 'CartAddonItems');
    }
    await db.saveMany(newPayload, 'CartAddonItems');
    return await catalogue.getCart(payload.user_id);
};

const deleteDraftOrder = async (payload) => {
    return await db.deleteRecord(payload, 'DraftOrders');
};

const inStorePayment = async (payload) => {
    const {
        external_id,
        auth_id,
        amount,
        created_by,
        payment_type,
        bank_code,
        name,
        expiration_time,
        card_type,
        payment_method,
        payment_category,
        notes
    } = payload;
    const orderDetails = await db.findOneByCondition({ payment_req_id: external_id}, 'OrderDetail');
    if(!orderDetails) {
        throw new Error('Invalid payment request');
    }
    let transaction = await db.dbTransaction();
    try{
        let paymentRequestData = {
            user_id: orderDetails.user_id,
            order_no: orderDetails.order_no,
            external_id,
            token_id: 'in-store-payment',
            amount,
            created_by,
            payment_method,
            bank_code,
            name,
            payment_type,
            notes: notes || auth_id,
            created_at: new Date()
        };
    
        let type = 1;
        if(orderDetails.is_hto) {
            type = 2;
        }
    
        let deleteCartItems =  db.deleteRecord({
            user_id: orderDetails.user_id,
            type,
        }, 'CartItems', transaction);
    
        let deleteAddOn =  db.deleteRecord({
            user_id: orderDetails.user_id
        }, 'CartAddonItems', transaction);

        let promiseArr = [];
        promiseArr.push(deleteCartItems);
        promiseArr.push(deleteAddOn);
        if(payment_category === 0 || payment_category === 3){
            const paymentRequest = db.updateOneByCondition({status: false, updated_at: new Date()}, {
                order_no: orderDetails.order_no
            }, 'PaymentRequest', transaction);
            promiseArr.push(paymentRequest);
        }
        await Promise.all(promiseArr);
    
        let savePaymentReq = await db.saveData(paymentRequestData, 'PaymentRequest', transaction);
    
        await db.saveData({
            id: savePaymentReq.id,
            transaction_id: auth_id,
            order_id: orderDetails.id,
            amount,
            currency: 'IDR',
            payment_id: savePaymentReq.id,
            bank_code,
            masked_card_number: expiration_time,
            merchant_reference_code: auth_id,
            external_id,
            card_type,
            status: 'CAPTURED'
        }, 'PaymentAuthResponse', transaction); // 3
    
        const orderDetail = db.saveData({
            order_no: orderDetails.order_no, 
            status: payment_category === 1 || payment_category === 2 ? payment_category === 1 ? constants.payment_status.PARTIAL_PAID : constants.payment_status.REMAINING_PAID : constants.payment_status.PAYMENT_CONFIRMED, 
            source: 'store', 
            created_at: new Date(), 
            created_by 
        }, 'OrdersHistory', transaction);
        const orderPayload = {
            order_status: payment_category === 1 ? constants.order_status.PAYMENT_PENDING : constants.order_status.PAYMENT_CONFIRMED,
            payment_status: payment_category === 1 || payment_category === 2 ? payment_category === 1 ? constants.payment_status.PARTIAL_PAID : constants.payment_status.REMAINING_PAID : constants.payment_status.PAYMENT_CONFIRMED,
            updated_at: new Date(),
            status: 1,
            payment_category
        };
        if(payload.created_by_staff) {
            orderPayload.created_by_staff = payload.created_by_staff;
        }
        if(payload.optician) {
            orderPayload.optician = payload.optician;
        }
        const order = db.updateOneByCondition(orderPayload, {
            payment_req_id: external_id
        }, 'OrderDetail', transaction);
    
        await Promise.all([order,orderDetail]);
        await transaction.commit();
        if(orderDetails.is_hto) {
            htoNotification(orderDetails.order_no);
        } else {
            purchaseNotification(orderDetails.order_no);
            await creditEyewearPoints(orderDetails);
        }
        await logs.addCustomerActivityLogs({
            user_id: orderDetails.user_id,
            action: constants.logs_action.payment_confirmed + ' via ' + constants.payment_method[payment_method],
            created_by: payload.created_by
        });
        return orderDetails.order_no;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw errorHandler.customError(messages.systemError);
    }
    
};

const orderDetails = async (payload) => {
    let orderDetailQuery = `select od.order_no, od.user_id, od.email_id, od.voucher_code, od.is_hto, od.payment_amount, od.currency_code, od.order_amount, od.order_discount_amount, od.stock_store_id, od.payment_category, od.payment_status, od.created_at,
    od.currency, od.scheduled_delivery_date, od.actual_delivery_date, od.order_status, od.created_at, od.updated_at, od.is_payment_required, od.is_local_order, od.fulfillment_type, od.is_return, od.eyewear_points_credit, od.user_credit_amount,
    ua.receiver_name, ua.label_address, ua.phone_number as address_phone_number, ua.note, ua.zip_code, ua.address,
    ua.address_details, ua."position", ua.lat, ua.long, od.sales_channel, od.store_id, staff.name as created_by_staff, op.name as optician,
    od.pick_up_store_id, dp.tracking_ref_no as airway_bill_no, dp.delivery_partner
    from order_details od
    left join user_address ua on ua.id = od.address_id
    left join users staff on staff.id = od.created_by_staff
    left join users op on op.id = od.optician
    left join delivery_partners dp on dp.order_no = od.order_no
    where od.order_no = :order_no`;

    let orderItemsQuery = `select oi.order_no, oi.id as order_item_id, oi.sku, oi.retail_price, oi.item_discount_amount as discount_amount, oi.eyewear_points_credit, oi.discount_note, oi.discount_type, oi.quantity, oi.status, oi.order_item_total_price, oi.product_category, oi.is_warranty, oi.packages,
        fm.sku_code, fm.frame_name, fm.frame_code, fm.variant_name, fm.variant_code, fm.size_label, fm.size_code, up.label, up.spheris_l, up.spheris_r, up.cylinder_l, up.cylinder_r, up.axis_l, up.axis_r, up.addition_l, up.addition_r, up.pupilary_distance
        from order_items oi
        inner join frame_master fm on fm.sku_code = oi.sku
        left join user_prescription up on up.id = oi.prescription_id
        where oi.status = 1 and oi.order_no = :order_no`;

    let orderItemAddonQuery = `select p.name, oia.order_no, oia.order_item_id, oia.sku as sku_code, oia.retail_price, oia.quantity, oia.type, oia.is_sunwear, oia.item_discount_amount as discount_amount, oia.eyewear_points_credit, oia.discount_note, oia.discount_type, oia.packages, oia.is_lens_change, oia.lense_color_code,
        ls.category_name, ls.lense_type_name, ls.lense_type_amount, ls.is_prescription, ls.prescription_name, ls.prescription_amount, ls.index_value,
        ls.is_filter, ls.filter_type_name, ls.filter_type_amount, up.label, up.spheris_l, up.spheris_r, up.cylinder_l, up.cylinder_r, up.axis_l, up.axis_r, up.addition_l, up.addition_r, up.pupilary_distance from order_item_addons oia
        inner join lenses_detail ls on oia.sku = ls.sku_code
        inner join products p on p.sku = oia.sku
        left join user_prescription up on up.id = oia.prescription_id where
        oia.order_no = :order_no and category = 1`;

    let orderCliponQuery =  `select oia.order_no, oia.sku as sku_code, oia.retail_price, oia.quantity, oia.item_discount_amount as discount_amount, oia.discount_note, oia.discount_type, oia.packages, cp.name, cp.color, cp.size, p.retail_price
        from order_item_addons as oia inner join products as p on p.sku = oia.sku
        inner join clipon cp on p.sku = cp.sku
        where oia.order_no = :order_no and category = 2`;

    let orderChangedAddonQuery =  `select p.name, oia.order_no, oia.order_item_id, oia.sku as sku_code, oia.retail_price, oia.quantity, oia.type, oia.is_sunwear, oia.item_discount_amount as discount_amount, oia.discount_note, oia.discount_type, oia.packages,
        ls.category_name, ls.lense_type_name, ls.lense_type_amount, ls.is_prescription, ls.prescription_name, ls.prescription_amount, ls.index_value,
        ls.is_filter, ls.filter_type_name, ls.filter_type_amount, up.label, up.spheris_l, up.spheris_r, up.cylinder_l, up.cylinder_r, up.axis_l, up.axis_r, up.addition_l, up.addition_r, up.pupilary_distance from order_item_changed_addons oia
        inner join lenses_detail ls on oia.sku = ls.sku_code
        inner join products p on p.sku = oia.sku
        left join user_prescription up on up.id = oia.prescription_id where
        oia.order_no = :order_no`;

    let orderItemContactLensQuery = `select cl.name, oia.order_no, oia.order_item_id, oia.sku as sku_code, oia.retail_price, oia.quantity, oia.type, oia.is_sunwear, oia.item_discount_amount as discount_amount, oia.discount_note, oia.discount_type, oia.packages, oia.is_lens_change,
        up.label, up.spheris_l, up.spheris_r, up.cylinder_l, up.cylinder_r, up.axis_l, up.axis_r, up.addition_l, up.addition_r, up.pupilary_distance from order_item_addons oia
        inner join contact_lens cl on oia.sku = cl.sku
        inner join products p on p.sku = oia.sku
        left join user_prescription up on up.id = oia.prescription_id where
        oia.order_no = :order_no and category = 3`;

    let orderItemOthersQuery = `select op.name, oia.order_no, oia.order_item_id, oia.sku as sku_code, oia.retail_price, oia.quantity, oia.type, oia.is_sunwear, oia.item_discount_amount as discount_amount, oia.discount_note, oia.discount_type, oia.packages, oia.is_lens_change from order_item_addons oia
        inner join others_product op on oia.sku = op.sku
        inner join products p on p.sku = oia.sku
        where oia.order_no = :order_no and category = 4`;            

    let orderPaymentQuery = `select distinct on(req.payment_method) req.payment_method, req.amount, req.created_at, req.notes, auth.bank_code, auth.name, auth.account_number,
        (case
            when req.payment_method = 0  then 'CASH'
            when req.payment_method = 2  then 'VA'
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
            when req.payment_method = 15 then 'Paypal Payment'
            when req.payment_method = 16 then 'Dept Store'
            when req.payment_method = 17 then 'XENDIT CARD'
            when req.payment_method = 18 then 'Corporate Try On'
            when req.payment_method = 19 then 'Endorsement'
            when req.payment_method = 20 then 'Employee Claim'
            when req.payment_method = 21 then 'Warranty'
            when req.payment_method = 22 then 'Xendit Invoice'
            else 'CARD' end) as payment_method,
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
        from payment_request req
        inner join payment_auth_response auth on  auth.external_id = req.external_id
        left join user_cards uc on uc.token_id = req.token_id
        where req.order_no = :order_no and req.status=true and auth.status in ('AUTHORIZED', 'PENDING', 'CAPTURED') order by req.payment_method`;


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
        order_no: payload.id
    };

    orderPromiseArray.push(db.rawQuery(orderDetailQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderItemsQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderItemAddonQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderPaymentQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderHTOScheduleQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderImagesQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderCliponQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderChangedAddonQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderItemContactLensQuery, 'SELECT', replacements));
    orderPromiseArray.push(db.rawQuery(orderItemOthersQuery, 'SELECT', replacements));
    let orderResults = await Promise.all(orderPromiseArray);

    let orderDetails = orderResults[0];
    let orderItems = orderResults[1];
    let orderItemAddons = orderResults[2];
    let orderPaymentDetails = orderResults[3];
    let orderHTOScheduleDetails = orderResults[4];
    let orderImages = orderResults[5];
    let clipons = orderResults[6];
    let orderChangedAddon = orderResults[7];
    let orderItemContactLens = orderResults[8];
    let orderItemOthers = orderResults[9];

    if (orderDetails.length == 0) {
        throw new Error('Invalid order no');
    }
    let formattedResponse = await catalogue.formatOrderDetails({
        orderDetail: orderDetails[0],
        orderItems,
        orderItemAddons,
        orderPaymentDetail: orderPaymentDetails,
        orderHTOScheduleDetail: orderHTOScheduleDetails[0],
        orderImages,
        clipons,
        orderChangedAddon,
        orderItemContactLens,
        orderItemOthers
    });
    formattedResponse.isDeleteOrder = !!constants.emailsForDeleteOrder.includes(payload.adminEmail);
    return formattedResponse;
};

const downloadPDF = async (payload) => {
    return await purchaseNotification(payload.order_no, false, false);
};


const applyVoucher = async (payload) => {
    let dbTable = 'CartItems';
    if(payload.type === 'addon'){
        dbTable = 'CartAddonItems';
    }
    const cart = await db.findOneByCondition({ id: payload.id }, dbTable);

    if(cart) {
        await db.updateOneByCondition({
            item_discount_amount : payload.discount_amount,
            discount_type:  payload.discount_type,
            discount_note:  payload.discount_note || ''
        }, { id: payload.id }, dbTable);
        return await catalogue.getCart(cart.user_id);
    } else {
        throw new Error('Invalid item id');
    }
};

const addOrderHistory = async (payload) => {
    return await db.saveData({
        ...payload,
        created_at: new Date()
    }, 'OrdersHistory');
};

const cancelOrder = async (payload) => {
    const orderDetail = db.updateOneByCondition({
        updated_by: payload.user_id,
        updated_at: new Date(),
        order_status: constants.order_status.PAYMENT_CANCELLED
    }, { order_no: payload.order_no, order_status: [constants.order_status.PAYMENT_PENDING, constants.order_status.PAYMENT_INITIATED]}, 'OrderDetail');
    const orderHistory = db.saveData({
        order_no: payload.order_no,
        status: constants.order_status.PAYMENT_CANCELLED,
        source: 'app',
        created_at: new Date(),
        created_by: payload.user_id
    }, 'OrdersHistory');
    await Promise.all([orderDetail, orderHistory]);
    return constants.order_status.PAYMENT_CANCELLED;
};

const dashboardData = async (payload) => {
    const {times, days, dates, months, order_status} = constants;
    const duration = Number(payload['duration']) || 0;
    let query = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setHours(0,0,0), null, true)}};
    let query1 = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date().getDate() - 1), null, true), [Op.lte]: utils.getDateFormat(new Date().setDate(new Date().getDate()), 24)}};
    let condition = `od.created_at >= '${utils.getDateFormat(new Date().setHours(0,0,0), null, true)}'`;
    let condition2 = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date().getDate() - 1), null, true)}' and od.created_at < '${utils.getDateFormat(new Date().setDate(new Date().getDate()), null, true)}'`;
    if(payload.start_date && payload.end_date){
        query = {created_at: {[Op.gte]: utils.getDateFormat(payload.start_date, null, true), [Op.lte]: utils.getDateFormat(payload.end_date, 24)}};
        condition = `od.created_at >= '${utils.getDateFormat(payload.start_date, null, true)}' and od.created_at <= '${utils.getDateFormat(payload.end_date, 24)}'`;
    } else if(duration === 1){
        query = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date().getDate() - duration), null, true), [Op.lt]: utils.getDateFormat(new Date(), null, true)}};
        query1 = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date().getDate() - 2 ), null, true), [Op.lte]: utils.getDateFormat(new Date().setDate(new Date().getDate() - 1 ), 24)}};
        condition = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date().getDate() - duration), null, true)}' and od.created_at < '${utils.getDateFormat(new Date(), null, true)}'`;
        condition2 = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date().getDate() - 2 ), null, true)}' and od.created_at < '${utils.getDateFormat(new Date().setDate(new Date().getDate() - 1 ), null, true)}'`;
    } else if(duration === 7){
        query = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - (new Date().getDay() === 0 ? 7 : new Date().getDay())), null, true)}};
        query1 = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - (7+new Date().getDay())), null, true), [Op.lte]: utils.getDateFormat(new Date().setDate(new Date().getDate() - new Date().getDay()), 24)}};
        condition = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - (new Date().getDay() === 0 ? 7 : new Date().getDay())), null, true)}'`;
        condition2 = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - (7+(new Date().getDay()))), null, true)}' and od.created_at <= '${utils.getDateFormat(new Date().setDate(new Date().getDate() - new Date().getDay()), null, true)}'`;
    } else if(duration === 30){
        query = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - new Date().getDate()), null, true)}};
        query1 = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - (30+new Date().getDate())), null, true), [Op.lte]: utils.getDateFormat(new Date().setDate(new Date().getDate() - new Date().getDate() ), 24)}};
        condition = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - new Date().getDate()), null, true)}'`;
        condition2 = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date().getDate()+1 - (30+new Date().getDate())), null, true)}' and od.created_at < '${utils.getDateFormat(new Date().setDate(new Date().getDate() - new Date().getDate() ), null, true)}'`;
    } else if(duration > 30){
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        query = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date(). getDate() - day), null, true)}};
        query1 = {created_at: {[Op.gte]: utils.getDateFormat(new Date().setDate(new Date(). getDate() - (day+365)), null, true), [Op.lte]: utils.getDateFormat(new Date().setDate(new Date(). getDate() - day ), 24)}};
        condition = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date(). getDate() - day), null, true)}'`;
        condition2 = `od.created_at >= '${utils.getDateFormat(new Date().setDate(new Date(). getDate() - (day+365)), null, true)}' and od.created_at < '${utils.getDateFormat(new Date().setDate(new Date(). getDate() - day ), null, true)}'`;
    }
    
    if(payload['store_id']){
        query = {...query, store_id: payload['store_id']};
        query1 = {...query1, store_id: payload['store_id']};
        condition+=` and od.store_id = '${payload['store_id']}'`;
    }
    query = {...query, is_hto: false, status: 1};
    query1 = {...query1, is_hto: false, status: 1};
    condition+=' and od.is_hto = false and od.status=1 and od.payment_category != 0';
    condition2+=' and od.is_hto = false and od.status=1 and od.payment_category != 0';
    //const orderStatus = [order_status.PAYMENT_CONFIRMED, order_status.ORDER_PENDING, order_status.ORDER_CONFIRMED, order_status.ORDER_READY_FOR_COLLECT, order_status.ORDER_READY_FOR_DELIVERY, order_status.ORDER_IN_TRANSIT , order_status.ORDER_DELIVERED, order_status.ORDER_COMPLETED];
    const result = await Promise.all([
        db.rawQuery(`select sum(cast(amount as DECIMAL)) as payment_amount from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true`, 'SELECT'),
        db.count(query, 'OrderDetail'),
        db.rawQuery(`select sum(cast(pr.amount as DECIMAL)) as payment_amount, od.created_at from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true group by od.created_at`, 'SELECT'),
        db.findByCondition(query, 'OrderDetail', ['created_at'], ['created_at', 'ASC']),
        db.rawQuery(`select sum(cast(amount as DECIMAL)) as payment_amount from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true and od.sales_channel='app'`, 'SELECT'),
        db.rawQuery(`select sum(cast(amount as DECIMAL)) as payment_amount from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true and od.sales_channel='whatsapp'`, 'SELECT'),
        db.rawQuery(`select sum(cast(amount as DECIMAL)) as payment_amount from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true and od.sales_channel='store'`, 'SELECT'),
        db.rawQuery(`select count(Distinct od.user_id) as total_sales
            from order_details od
            left join users u on od.user_id = u.id
            where ${condition} and u.role=2 and gender=1`, 'SELECT'),
        db.rawQuery(`select count(Distinct od.user_id) as total_sales
            from order_details od
            left join users u on od.user_id = u.id
            where ${condition} and u.role=2 and gender=2`, 'SELECT'),
        db.rawQuery(`select count(*) as total_count from users u where u.role=2 and id in(select user_id from order_details od where ${condition} group by user_id having count(user_id) = 1)`, 'SELECT'),
        db.rawQuery(`select count(*) as total_count from users u where u.role=2 and id in(select user_id from order_details od where ${condition} group by user_id having count(user_id) > 1)`, 'SELECT'),
        db.rawQuery(`select count(Distinct od.user_id) as total_sales
            from order_details od
            left join users u on od.user_id = u.id
            where ${condition} and u.role=2`, 'SELECT'),
        db.rawQuery(`select sum(cast(pr.amount as DECIMAL)) as payment_amount, od.created_at from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition2} and pr.status = true group by od.created_at`, 'SELECT'),
        db.rawQuery(`select max(fm.frame_name) as name, count(fm.frame_code) as total_count
            from order_details od
            inner join order_items oi
            on oi.order_no = od.order_no
            inner join frame_master fm
            on fm.sku_code = oi.sku
            where ${condition} group by fm.frame_code order by total_count DESC limit 5`, 'SELECT'),
        db.rawQuery(`select max(fm.variant_name) as name , count(fm.variant_code) as total_count
            from order_details od
            inner join order_items oi
            on oi.order_no = od.order_no
            inner join frame_master fm
            on fm.sku_code = oi.sku
            where ${condition} group by fm.variant_code order by total_count DESC limit 5`, 'SELECT'),
        db.rawQuery(`select max(fm.size_label) as name, count(fm.size_code) as total_count
            from order_details od
            inner join order_items oi
            on oi.order_no = od.order_no
            inner join frame_master fm
            on fm.sku_code = oi.sku
            where ${condition} group by fm.size_code order by total_count DESC limit 5`, 'SELECT'),
        db.rawQuery(`select max(p.name) as name, count(p.sku) as total_count
            from order_details od
            inner join order_items oi
            on oi.order_no = od.order_no
            inner join products p
            on p.sku = oi.sku
            where ${condition} group by p.sku order by total_count DESC limit 5`, 'SELECT'),
        db.rawQuery(`select sum(cast(amount as DECIMAL)) as payment_amount from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true and od.sales_channel='website'`, 'SELECT'),
        db.rawQuery(`select sum(cast(amount as DECIMAL)) as payment_amount from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true and od.sales_channel='hto'`, 'SELECT'),
        db.rawQuery(`select Distinct od.user_id, u.dob from order_details od
            left join users u on od.user_id = u.id
            where ${condition} and u.role=2`, 'SELECT'),
        db.rawQuery(`select Distinct od.user_id, u.dob from order_details od
            left join users u on od.user_id = u.id
            where ${condition} and u.role=2 and u.gender = 1`, 'SELECT'),
        db.rawQuery(`select Distinct od.user_id, u.dob from order_details od
            left join users u on od.user_id = u.id
            where ${condition} and u.role=2 and u.gender = 2`, 'SELECT')    
    ]);
    let storesList = await db.findByCondition({status: 1}, 'Store', ['id', 'name'], ['created_at', 'ASC']);
    const stores = await Promise.all(
        storesList.map(async (row) => {
            const order = await db.rawQuery(`select sum(cast(amount as DECIMAL)) as payment_amount from order_details od left join payment_request pr on od.order_no = pr.order_no where ${condition} and pr.status = true and od.sales_channel='store' and store_id='${row.id.toString()}'`, 'SELECT');
            return ({
                id: row.id,
                name: row.name,
                amount: order[0].payment_amount
            });
        })
    );
    let amount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], durationTime = times, totalOrders = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if(duration === 7){
        amount=[0,0,0,0,0,0,0];
        totalOrders = [0,0,0,0,0,0,0];
        durationTime=days;
    } else if (duration === 30){
        amount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        totalOrders = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        durationTime=utils.getDatesName(dates, months);
    } else if (duration > 30){
        amount=[0,0,0,0,0,0,0,0,0,0,0,0];
        totalOrders = [0,0,0,0,0,0,0,0,0,0,0,0];
        durationTime=months;
    } else if(payload.start_date && payload.end_date){
        amount = [];
        durationTime = [];
        totalOrders = [];
    }
    return ({
        salesToday: result[0][0].payment_amount,
        ordersToday: result[1],
        sales: result[2].reduce((accum, row) => {
            const day = new Date(utils.getDateFormat(row.created_at));
            if(payload.start_date && payload.end_date){
                const date = day.toLocaleDateString();
                const index = accum.duration.findIndex(val => val === date);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                } else {
                    accum.duration.push(date);
                    accum.amount.push(Number(row.payment_amount));
                }
            } else if(duration === 0 || duration === 1){
                const time = day.getHours() > 12 ? day.getHours()%12+' PM' : day.getHours() < 12 ? day.getHours()+' AM' : day.getHours()+' PM';
                const index = accum.duration.findIndex(val => val === time);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            } else if(duration === 7){
                const index = days.findIndex(val => val === days[day.getDay() === 0 ? 6 : (day.getDay()-1)]);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            } else if(duration === 30){
                const date = day.getDate()+' '+ months[day.getMonth()];
                const index = accum.duration.findIndex(val => val === date);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            } else if(duration > 30){
                const index = accum.duration.findIndex(val => val === months[day.getMonth()]);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            }
            return accum;
        },{amount: [...amount], duration: [...durationTime]}),
        orders: result[3].reduce((accum, row) => {
            const day = new Date(utils.getDateFormat(row.created_at));
            if(payload.start_date && payload.end_date){
                const date = day.toLocaleDateString();
                const index = accum.duration.findIndex(val => val === date);
                if(index > -1) {
                    accum.totalOrders[index] = (accum.totalOrders[index] || 0) + 1;
                } else {
                    accum.duration.push(date);
                    accum.totalOrders.push(1);
                }
            } else if(duration === 0 || duration === 1){
                const time = day.getHours() > 12 ? day.getHours()%12+' PM' : day.getHours() < 12 ? day.getHours()+' AM' : day.getHours()+' PM';
                const index = accum.duration.findIndex(val => val === time);
                if(index > -1){
                    accum.totalOrders[index] = (accum.totalOrders[index] || 0) + 1;
                }
            } else if(duration === 7){
                const index = days.findIndex(val => val === days[day.getDay() === 0 ? 6 : (day.getDay()-1)]);
                if(index > -1){
                    accum.totalOrders[index] = (accum.totalOrders[index] || 0) + 1;
                }
            } else if(duration === 30){
                const date = day.getDate()+' '+ months[day.getMonth()];
                const index = accum.duration.findIndex(val => val === date);
                if(index > -1){
                    accum.totalOrders[index] = (accum.totalOrders[index] || 0) + 1;
                }
            } else if(duration > 30){
                const index = accum.duration.findIndex(val => val === months[day.getMonth()]);
                if(index > -1){
                    accum.totalOrders[index] = (accum.totalOrders[index] || 0) + 1;
                }
            }
            return accum;
        },{duration: [...durationTime], totalOrders }),
        appSale: result[4][0].payment_amount,
        whatsappSale: result[5][0].payment_amount,
        storeApp: result[6][0].payment_amount,
        user: {
            male: result[7],
            female: result[8],
            firstTimeLogin: result[9],
            returning: result[10],
            total: result[11]
        },
        stores,
        salesComparizon: result[12].reduce((accum, row) => {
            const day = new Date(utils.getDateFormat(row.created_at));
            if(duration === 0 || duration === 1){
                const time = day.getHours() > 12 ? day.getHours()%12+' PM' : day.getHours() < 12 ? day.getHours()+' AM' : day.getHours()+' PM';
                const index = accum.duration.findIndex(val => val === time);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            } else if(duration === 7){
                const index = days.findIndex(val => val === days[day.getDay() === 0 ? 6 : (day.getDay()-1)]);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            } else if(duration === 30){
                const date = day.getDate()+' '+ months[day.getMonth()];
                const index = accum.duration.findIndex(val => val === date);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            } else if(duration > 30){
                const index = accum.duration.findIndex(val => val === months[day.getMonth()]);
                if(index > -1){
                    accum.amount[index] = (accum.amount[index] || 0) + Number(row.payment_amount);
                }
            }
            return accum;
        },{amount: [...amount], duration: duration === 30 ? utils.getDatesName(dates, months, 1) : [...durationTime]}),
        bestFramesSales: result[13],
        bestVariantsSales: result[14],
        bestSizeLabelSales: result[15],
        bestProductSales: result[16],
        websiteSale: result[17][0].payment_amount,
        htoSale: result[18][0].payment_amount,
        ageAll: result[19].reduce((accum, row) => {
            if(row.dob && utils.calculateAge(row.dob) <= 17){
                accum.firstRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 17 && utils.calculateAge(row.dob) <= 24){
                accum.secondRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 24 && utils.calculateAge(row.dob) <= 34){
                accum.thirdRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 34 && utils.calculateAge(row.dob) <= 44){
                accum.forthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 44 && utils.calculateAge(row.dob) <= 54){
                accum.fifthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 54 && utils.calculateAge(row.dob) <= 64){
                accum.sixthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 64){
                accum.aboveRange+=1;
            } else {
                accum.unknown+=1;
            }
            return accum;
        },{firstRange: 0, secondRange: 0, thirdRange: 0, forthRange: 0, fifthRange: 0, sixthRange: 0, aboveRange: 0, unknown: 0}),
        ageMale: result[20].reduce((accum, row) => {
            if(row.dob && utils.calculateAge(row.dob) <= 17){
                accum.firstRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 17 && utils.calculateAge(row.dob) <= 24){
                accum.secondRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 24 && utils.calculateAge(row.dob) <= 34){
                accum.thirdRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 34 && utils.calculateAge(row.dob) <= 44){
                accum.forthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 44 && utils.calculateAge(row.dob) <= 54){
                accum.fifthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 54 && utils.calculateAge(row.dob) <= 64){
                accum.sixthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 64){
                accum.aboveRange+=1;
            } else {
                accum.unknown+=1;
            }
            return accum;
        },{firstRange: 0, secondRange: 0, thirdRange: 0, forthRange: 0, fifthRange: 0, sixthRange: 0, aboveRange: 0, unknown: 0}),
        ageFemale: result[21].reduce((accum, row) => {
            if(row.dob && utils.calculateAge(row.dob) <= 17){
                accum.firstRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 17 && utils.calculateAge(row.dob) <= 24){
                accum.secondRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 24 && utils.calculateAge(row.dob) <= 34){
                accum.thirdRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 34 && utils.calculateAge(row.dob) <= 44){
                accum.forthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 44 && utils.calculateAge(row.dob) <= 54){
                accum.fifthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 54 && utils.calculateAge(row.dob) <= 64){
                accum.sixthRange+=1;
            } else if(row.dob && utils.calculateAge(row.dob) > 64){
                accum.aboveRange+=1;
            } else {
                accum.unknown+=1;
            }
            return accum;
        },{firstRange: 0, secondRange: 0, thirdRange: 0, forthRange: 0, fifthRange: 0, sixthRange: 0, aboveRange: 0, unknown: 0})
    });
};

const getUsers = async (payload) => {
    const {limit, order_status} = constants;
    const offset = (payload.page - 1) * limit;
    let condition = 'u.role=2 and u.status = 1';
    let query = {role: 2, status: 1};
    let fields = 'u.id, u.name, u.email, u.country_code, u.mobile, a.address_details, a.address, u.dob, u.channel, u.created_at';
    if(payload.search){
        condition+= ` and (u.name ilike '%${payload.search}%' or u.email ilike '%${payload.search}%' or u.mobile like '%${payload.search}%')`;
        query = {...query, [Op.or]: [{name: { [Op.like]: `%${payload.search}%`}}, {email: { [Op.like]: `%${payload.search}%`}}, {mobile: { [Op.like]: `%${payload.search}%`}}]};
    }
    if(payload.channel){
        condition+= ` and channel='${payload.channel}'`;
        query = {...query, channel: payload.channel};
    }
    if(payload.created_at){
        condition+=` and u.created_at >= '${utils.getDateFormat(payload.created_at, null, true)}' and u.created_at <= '${utils.getDateFormat(payload.created_at,24)}'`;
        query = {...query, created_at: {[Op.gte]: utils.getDateFormat(payload.created_at, null, true), [Op.lte]: utils.getDateFormat(payload.created_at, 24)}};
    }
    if(payload.dob){
        condition+=` and u.dob >= '${utils.getDateFormat(payload.dob, null, true)}' and u.dob <= '${utils.getDateFormat(payload.dob,24)}'`;
        query = {...query, dob: {[Op.gte]: utils.getDateFormat(payload.dob, null, true), [Op.lte]: utils.getDateFormat(payload.dob, 24)}};
    }
    const total_rows = await db.count(query, 'User');
    const list = await db.rawQuery(
        `SELECT ${fields} from users u
        left join (select distinct on (user_id) * from user_address) as a on u.id = a.user_id ${condition ? 'WHERE '+condition : ''} ORDER BY u.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        'SELECT'
    ); 
    const orderStatus = [order_status.PAYMENT_CONFIRMED, order_status.ORDER_CONFIRMED, order_status.ORDER_READY_FOR_COLLECT, order_status.ORDER_DELIVERED, order_status.ORDER_COMPLETED];
    const result = await Promise.all(
        list.map(async row => {
            const query = payload.store_id ? {user_id: row.id, store_id: payload.store_id} : {user_id: row.id};
            const orderCondition = payload.store_id ? `user_id='${row.id}' and store_id='${payload.store_id}'` : `user_id='${row.id}'`;
            const  orders =  await db.rawQuery(`SELECT distinct order_no FROM order_details WHERE ${orderCondition}`, 'SELECT');
            row.totalOrders = await db.count(query, 'OrderDetail');
            row.totalFrames = await db.count({order_no: orders.map(order => order.order_no)}, 'OrderItem');
            row.totalPayment = await db.getSumByCondition({...query, order_status:  {[Op.in]: orderStatus}}, 'OrderDetail', 'payment_amount');
            return row;
        })
    );
    return ({list: result, total_rows});
};


const customerDetail = async (payload) => {
let profileSummary = {}, orderHistory = [], htoAppointment = {}, wishlist = [], cart = {}, lensesOnly = {}, clipons = {}, referral = {};
const user = await db.findOneByCondition({id: payload.id}, 'User', ['name', 'email', 'country_code', 'mobile', 'dob', 'gender', 'channel']);
const condition = payload.store_id ? `o.user_id = '${payload.id}' and o.store_id='${payload.store_id}' and (pr.status=true OR pr.status IS NULL)` : `o.user_id = '${payload.id}' and (pr.status=true OR pr.status IS NULL)`;
const orders = await db.rawQuery(
        `SELECT o.id, o.order_no, o.created_at, ad.name as admin_name, o.order_status, o.order_amount, o.payment_amount, o.currency_code, o.order_discount_amount, o.sales_channel, o.fulfillment_type, u.name from order_details o
        left join users u on o.user_id = u.id
        left join users ad on o.created_by = ad.id
        left join payment_request pr on o.order_no = pr.order_no
        WHERE ${condition} ORDER BY o.created_at DESC`,
        'SELECT'
    );
    profileSummary.user = user;
    const count = {
        orders: orders.length,
        wishlist: await db.count({user_id: payload.id}, 'UserWishlist'),
        cart: await db.count({user_id: payload.id, type: 1}, 'CartItems')
    };
    if(payload.type === 'summary'){
        const result = await Promise.all([
            getUserAddress(payload.id),
            getPrescriptions(payload.id),
            logs.getCustomerActivityLogs(payload.id)
        ]);
        profileSummary = {
            ...profileSummary,
            address: result[0],
            prescriptions: result[1],
            activity: result[2]
        };
    } else if(payload.type === 'history'){
        orderHistory = orders;
    } else if(payload.type === 'wishlist'){
        wishlist = await getWishlist({user_id: payload.id});
    } else if(payload.type === 'cart'){
        const result = await catalogue.getCart(payload.id);
        cart = {list: result.list, grand_total: result.grand_total};
        lensesOnly = result.lensesOnly;
        clipons = result.clipons;
    } else if(payload.type === 'referral'){
        referral = await referralList({user_id: payload.id});
        referral.referralCode = await db.findOneByCondition({user_id: payload.id}, 'UserReferral', ['referral_code']);
    } else if (payload.type === 'hto_appointment'){
        htoAppointment = await getHtoOrders({ page: 1, user_id: payload.id });
    }
    return ({profileSummary, orderHistory, wishlist, cart, lensesOnly, clipons, count, referral, htoAppointment});
};

const removeDiscount = async (payload) => {
    let dbTable = 'CartItems';
    if(payload.type === 'addon'){
        dbTable = 'CartAddonItems';
    }
    const cart = await db.findOneByCondition({ id: payload.id }, dbTable);

    if(cart) {
        await db.updateOneByCondition({
            item_discount_amount : 0,
            discount_type:  null,
            discount_note:  null
        }, { id: payload.id }, dbTable);

        return await catalogue.getCart(cart.user_id);
    } else {
        throw new Error('Invalid item id');
    }
};

const processOrder = async (payload) => {
    try {
        if(payload.order_status === constants.order_status.ORDER_PENDING){
            await db.updateOneByCondition({
                order_status: constants.order_status.ORDER_CONFIRMED,
                updated_at: new Date(),
                updated_by: payload.user_id
            }, {
                order_no: payload.order_no
            }, 'OrderDetail');
            let orderHistoryObj = {
                order_no: payload.order_no,
                status: constants.order_status.ORDER_CONFIRMED,
                source: 'store',
                created_at: new Date(),
                created_by: payload.user_id
            };
            db.saveData(orderHistoryObj, 'OrdersHistory');
            return ({order_status: constants.order_status.ORDER_CONFIRMED});
        }
        const order = await db.findOneByCondition({ order_no: payload.order_no, order_status: constants.order_status.PAYMENT_CONFIRMED, status: 1, is_hto: false }, 'OrderDetail');
        if(!order) throw errorHandler.customError(messages.invalidOrder);
        const user = await db.findOneByCondition({ id: order.user_id}, 'User');
			let orderItemsQuery = `select oi.order_no, oi.discount_amount, oi.item_discount_amount, oi.quantity, oi.is_warranty, oi.packages, oi.user_credit, oi.eyewear_points_credit,
				oi.retail_price, p.sku, p.tax_rate
				from order_items oi inner join products p on p.sku =oi.sku
                where oi.order_no = :order_no and oi.status = 1`;

			let orderItemAddOnQuery = `select oia.quantity, p.sku, oia.retail_price, oia.discount_amount, oia.item_discount_amount, oia.packages, p.tax_rate, oia.user_credit, oia.eyewear_points_credit
				from order_item_addons oia inner join products p on p.sku = oia.sku
                where oia.order_no = :order_no and oia.status = 1 and is_lens_change = false;`;

            let changedOrderItemAddOnQuery = `select oia.quantity, p.sku, oia.retail_price, oia.discount_amount, oia.item_discount_amount, oia.packages, p.tax_rate, oia.user_credit, oia.eyewear_points_credit
				from order_item_changed_addons oia inner join products p on p.sku = oia.sku
				where oia.order_no = :order_no and oia.status = 1;`;

			let orderItemReplacements = {
				order_no: order.order_no
			};

			let orderItems = await db.rawQuery(orderItemsQuery, 'SELECT', orderItemReplacements); // 2
            let orderItemAddOns = await db.rawQuery(orderItemAddOnQuery, 'SELECT', orderItemReplacements); // 3
            let changedOrderItemAddOns = await db.rawQuery(changedOrderItemAddOnQuery, 'SELECT', orderItemReplacements); // 4

			if(orderItems.length == 0 && orderItemAddOns.length == 0) {
				throw new Error('db_failure');
			}

			let order_no = order.order_no;
			let invoice_no = `${order_no}/${utils.generateRandom(4, true).toUpperCase()}`;
            let notes = order.sales_channel;

            const store_id = order.stock_store_id ? parseInt(order.stock_store_id) : parseInt(order.store_id);
            let storeRegisterResult = await turbolyUtility.storeRegisters();
            let register = storeRegisterResult.data.registers.filter(register => register.store_id == store_id && register.active == true);
            if (register.length == 0) {
                throw errorHandler.customError(messages.storeNotOperating);

            }
            const register_id = register[0].id;
            //console.log("store_id=>>>>>>>", store_id, register_id);
			let turbolyOrderObj = {
                sales_type: '1',
				register_id: register_id  ? parseInt(register_id) : config.turbolyEcomOrder.registerID,
				store_id,
				fulfillment_type: order.fulfillment_type,
				customer: {
					name: user.name,
					email: user.email,
					phone: user.mobile,
					address: 'NA'
				}
			};

			if(order.fulfillment_type == 1) {
				let orderAddressQuery = `select receiver_name, phone_number, email, address from user_address ua where id = '${order.address_id}'`;
				let addressDetails = await db.rawQuery(orderAddressQuery, 'SELECT', {});
				if(addressDetails.length != 0) {
					turbolyOrderObj.customer.address = addressDetails[0].address || 'NA';
				}
			}

            let saleLines = [];
            let warrantyObj = {
                sku: constants.warrantySKU,
                quantity: 1,
                unit_price_ex_tax_before_discount: constants.warrantyPrice,
                tax_rate: 0,
                unit_discount_amount: 0
            };
			for (orderItem of orderItems) {
				const saleObj = {
					sku: orderItem.sku,
					quantity: orderItem.quantity,
					unit_price_ex_tax_before_discount: orderItem.retail_price,
					tax_rate: orderItem.tax_rate,
					unit_discount_amount: orderItem.discount_amount+orderItem.item_discount_amount+orderItem.user_credit+orderItem.eyewear_points_credit
                };
                saleLines.push(saleObj);
                if(orderItem.is_warranty === 1){
                    saleLines.push(warrantyObj);
                } else if(orderItem.is_warranty === 2){
                    warrantyObj.unit_discount_amount=constants.warrantyPrice;
                    saleLines.push(warrantyObj);
                }
                if(orderItem.packages){
                    const packages = orderItem.packages.split(',');
                    for (packageSku of packages) {
                        const index = saleLines.findIndex(pkg  => pkg.sku === packageSku);
                        if(index > -1) {
                            saleLines[index].quantity=saleLines[index].quantity+1;
                        } else {
                            const packagesObj = {
                                sku: packageSku,
                                quantity: 1,
                                unit_price_ex_tax_before_discount: 0,
                                tax_rate: 0,
                                unit_discount_amount: 0
                            };
                            saleLines.push(packagesObj);
                        }
                    }
                }
			}

			for (orderItemAddOn of orderItemAddOns) {
				const saleObj = {
					sku: orderItemAddOn.sku,
					quantity: orderItemAddOn.quantity,
					unit_price_ex_tax_before_discount: orderItemAddOn.retail_price,
					tax_rate: orderItemAddOn.tax_rate || 0,
					unit_discount_amount: (orderItemAddOn.discount_amount+orderItemAddOn.item_discount_amount+orderItemAddOn.user_credit+orderItemAddOn.eyewear_points_credit)/orderItemAddOn.quantity
				};
                saleLines.push(saleObj);
                if(orderItemAddOn.packages){
                    const packages = orderItemAddOn.packages.split(',');
                    for (packageSku of packages) {
                        const index = saleLines.findIndex(pkg  => pkg.sku === packageSku);
                        if(index > -1) {
                            saleLines[index].quantity=saleLines[index].quantity+1;
                        } else {
                            const packagesObj = {
                                sku: packageSku,
                                quantity: 1,
                                unit_price_ex_tax_before_discount: 0,
                                tax_rate: 0,
                                unit_discount_amount: 0
                            };
                            saleLines.push(packagesObj);
                        }
                    }
                }
            }

            for (orderItemAddOn of changedOrderItemAddOns) {
				const saleObj = {
					sku: orderItemAddOn.sku,
					quantity: orderItemAddOn.quantity,
					unit_price_ex_tax_before_discount: orderItemAddOn.retail_price,
					tax_rate: orderItemAddOn.tax_rate || 0,
					unit_discount_amount: (orderItemAddOn.discount_amount+orderItemAddOn.item_discount_amount+orderItemAddOn.user_credit+orderItemAddOn.eyewear_points_credit)/orderItemAddOn.quantity
				};
                saleLines.push(saleObj);
                if(orderItemAddOn.packages){
                    const packages = orderItemAddOn.packages.split(',');
                    for (packageSku of packages) {
                        const index = saleLines.findIndex(pkg  => pkg.sku === packageSku);
                        if(index > -1) {
                            saleLines[index].quantity=saleLines[index].quantity+1;
                        } else {
                            const packagesObj = {
                                sku: packageSku,
                                quantity: 1,
                                unit_price_ex_tax_before_discount: 0,
                                tax_rate: 0,
                                unit_discount_amount: 0
                            };
                            saleLines.push(packagesObj);
                        }
                    }
                }
            }

			turbolyOrderObj.sale_lines = saleLines;
			turbolyOrderObj.invoice_no = invoice_no;
			// turbolyOrderObj.invoice_no = order_no;
			turbolyOrderObj.notes = notes;
			turbolyOrderObj.payment_lines = [{
				payment_type_name: config.turbolyEcomOrder.paymentTypeName,
				payment_amount: order.payment_amount
			}];
            console.log('turbolyOrderObj========>', turbolyOrderObj);
			let options = {
				url: config.turboly.baseUrl + 'sales',
				headers: {
					'X-AUTH-EMAIL': config.turboly.authEmail,
					'X-AUTH-TOKEN': config.turboly.authToken
				},
				method: 'POST',
				params: {},
				data: {
					sale: turbolyOrderObj
				},
			};

			const result = await utils.axiosClient(options);
            //console.log(JSON.stringify(result), 'result========>', result);
			let promiseArray = [];
			let saveResponse = db.saveData(result.data.sale, 'TurbolySaleDetails');
			let updateOrder =  db.updateOneByCondition({
				order_status: constants.order_status.ORDER_CONFIRMED,
				updated_at: new Date(),
				updated_by: order.user_id
			}, {
				payment_req_id: order.payment_req_id
			}, 'OrderDetail');

			promiseArray.push(db.saveData({order_no, status: constants.order_status.ORDER_CONFIRMED, source: 'turboly', created_at: new Date(), created_by: order.user_id}, 'OrdersHistory'));

			let orderMappingJSON = {
				order_no: order_no,
				turboly_invoice_id: invoice_no,
				created_by: order.user_id,
			};

			let saveTurbolyMapping = db.saveData(orderMappingJSON, 'TurbolyOrderMapping');

			// let orderItemUpdateQuery = `update product_stocks set
			// 	quantity = product_stocks.quantity - oi.quantity
			// 	from order_details od (nolock)
			// 	inner join order_items oi (nolock) on od.order_no = oi.order_no
			// 	where od.payment_req_id = :payment_req_id and product_stocks.sku = oi.sku`;

			// let orderItemAddOnUpdateQuery = `update product_stocks set
			// 	quantity = product_stocks.quantity - oi.quantity
			// 	from order_details od (nolock)
			// 	inner join order_item_addons oi (nolock) on od.order_no = oi.order_no
			// 	where od.payment_req_id = :payment_req_id and product_stocks.sku = oi.sku`;

			promiseArray.push(saveResponse);
			promiseArray.push(updateOrder);
			promiseArray.push(saveTurbolyMapping);
			// promiseArray.push(db.rawQuery(orderItemUpdateQuery, 'SELECT', replacementes));
			// promiseArray.push(db.rawQuery(orderItemAddOnUpdateQuery, 'SELECT', replacementes));

			await Promise.all(promiseArray);

			// TODO: message is an Object
			sendSingleUserNotification({
				user_id: order.user_id,
				message: messages.orderCompleted['en'],
				type: constants.notificationType.orderCompleted
			});

		return ({order_status: constants.order_status.ORDER_CONFIRMED});
	} catch (error) {
		if (error.response && error.response.data) {
            console.log(error.response.data, 'Process order error');
            if(error.response.data.errors && error.response.data.errors.findIndex(e => e.message && (e.message.toLowerCase().includes('no stock') || e.message.toLowerCase().includes('not enough stock') || e.message.toLowerCase().includes('not active'))) > -1){ 
                 await db.updateOneByCondition({
                	order_status: constants.order_status.ORDER_PENDING,
                	updated_at: new Date(),
                	updated_by: payload.user_id
                }, {
                	order_no: payload.order_no
                }, 'OrderDetail');
                let orderHistoryObj = {
                    order_no: payload.order_no,
                    status: constants.order_status.ORDER_PENDING,
                    source: 'store',
                    created_at: new Date(),
                    created_by: payload.user_id
                };
                db.saveData(orderHistoryObj, 'OrdersHistory');
                return ({order_status: constants.order_status.ORDER_PENDING});
            } else {
                throw new Error(error.response.data);
            }
		} else {
            console.log(error, 'error.response', error.response);
			throw new Error(error.message);
		}
	}
};

const  updateOrderStaffOptician = async (payload) => {
    return await db.updateOneByCondition({
        updated_by: payload.user_id,
        updated_at: new Date(),
        created_by_staff: payload.created_by_staff ? payload.created_by_staff : null,
        optician: payload.optician ? payload.optician : null,
        payment_category: payload.payment_category,
    }, { payment_req_id: payload.external_id }, 'OrderDetail');
};

const exportUsers = async (payload) => {
    let condition = 'u.role=2 and u.status = 1';
    let fields = 'u.id, u.name, u.email, u.country_code, u.mobile, a.address_details, a.address, u.created_at, u.dob, u.channel';
    if(payload.search){
        condition+= ` and (u.name ilike '%${payload.search}%' or u.email ilike '%${payload.search}%' or u.mobile like '%${payload.search}%')`;
    }
    if(payload.sales_channel){
        condition+= ` and u.channel='${payload.sales_channel}'`;
    }
    if(payload.start_date){
        condition+=` and u.created_at >= '${utils.getDateFormat(payload.start_date, null, true)}' and u.created_at <= '${utils.getDateFormat(payload.start_date,24)}'`;
    }
    if(payload.dob){
        condition+=` and u.dob >= '${utils.getDateFormat(payload.dob, null, true)}' and u.dob <= '${utils.getDateFormat(payload.dob,24)}'`;
    }
    const list = await db.rawQuery(
        `SELECT ${fields} from users u
        left join (select distinct on (user_id) * from user_address) as a on u.id = a.user_id
        ${condition ? 'WHERE '+condition : ''} ORDER BY u.created_at DESC`,
        'SELECT'
    );

    // const result = await Promise.all(
    //     list.map(async row => {
    //         const  orders =  await db.rawQuery(`SELECT distinct order_no FROM order_details WHERE user_id='${row.id}'`, 'SELECT');
    //         row.totalOrders = await db.count({user_id: row.id}, 'OrderDetail');
    //         row.totalFrames = await db.count({order_no: orders.map(order => order.order_no)}, 'OrderItem');
    //         row.totalPayment = await db.getSumByCondition({user_id: row.id}, 'OrderDetail', 'payment_amount');
    //         return row;
    //     })
    // );

    const data = list.reduce((list, row) => {
        list+=utils.titleCase(row.name || '')+'\t'+row.email+'\t'+(row.country_code+row.mobile)+'\t'+(utils.replaceSpecialChar(row.address_details || '') || utils.replaceSpecialChar(row.address || '') || '--')+'\t'+utils.getLocalDateString(row.dob)+'\t'+utils.titleCase(row.channel)+'\t'+utils.getLocalDateString(row.created_at)+'\n';
        return list;
    }, 'Name\tEmail\tPhone No\tAddress\tDOB\tChannel\tCreated Date\n');
    return new Promise((resolve, reject) => {
        fs.appendFile('customers.xls', data, async (err) => {
            if (err) reject(err);
            const buffer = fs.readFileSync('customers.xls');
            const file = await s3Upload.pdfFileUpload('customers.xls', 'admin', buffer, 'application/vnd.ms-excel');
            fs.unlink('customers.xls',(err) => console.log('Customers export Error: ', err));
            resolve(constants.bucket.product_url+file.fileName);
         });
    });
};

const exportOrders = async (payload) => {
    const limit = 30000;
    const Addon_limit = 50000;
    const {order_status} = constants;
    const is_hto = !!payload.is_hto;
    let condition = `o.is_hto = ${is_hto} and (pr.status=true OR pr.status IS NULL)`;
    if(payload.admin_store_id){
        condition = condition + ` and (o.store_id='${payload.admin_store_id}' or o.stock_store_id='${payload.admin_store_id}' or o.pick_up_store_id='${payload.admin_store_id}')`;
    } else if(payload.store_id){
        condition = condition + ` and o.store_id='${payload.store_id}'`;
    }
    if(payload.order_status === 'unprocessed'){
        condition = condition + ' and o.order_status = \'payment_confirmed\' and o.status=1';
    } else if(payload.order_status === 'unpaid'){
        condition = condition + ' and o.order_status = \'payment_pending\' and o.status=1';
    } else if(payload.order_status && payload.order_status !== 'all' && payload.order_status !== 'unprocessed' && payload.order_status !== 'unpaid' && payload.order_status !== 'draft' && payload.order_status !== 'payment_initiated'){
        if(payload.order_status === order_status.PAYMENT_CONFIRMED){
            condition+=` and o.status=1 and o.order_status not in ('${order_status.PAYMENT_INITIATED}', '${order_status.PAYMENT_PENDING}', '${order_status.PAYMENT_FAILED}', '${order_status.PAYMENT_CANCELLED}')`;
        } else {
            condition+=` and o.order_status = '${payload.order_status}' and o.status=1`;
        }
    } else if(payload.order_status === 'payment_initiated'){
        condition = condition + ' and o.order_status = \'payment_initiated\'';
    } else {
        condition = condition + ' and (o.status=1 or o.order_status = \'payment_initiated\')';
    }
    if(payload.payment_status){
        condition = condition + ` and o.payment_status='${payload.payment_status}'`;
    }

    if(payload.payment_status){
        condition = condition + ` and o.payment_status='${payload.payment_status}'`;
    }

    if(payload.search){
        condition = condition + ` and (o.order_no ilike '%${payload.search}%' or u.name ilike '%${payload.search}%')`;
    }
    if(payload.sales_channel){
        condition = condition + ` and o.sales_channel='${payload.sales_channel.toLowerCase()}'`;
    }
    if(payload.sales_person){
        condition = condition + ` and o.created_by_staff='${payload.sales_person}'`;
    }
    if(payload.optician){
        condition = condition + ` and o.optician='${payload.optician}'`;
    }
    if(payload.payment_method || payload.payment_method === 0){
        condition = condition + ` and pr.payment_method=${payload.payment_method}`;
    }
    let table = 'order_details';
    let fields = `Distinct on(o.order_no) o.order_no, o.id, o.created_at, o.order_status, o.payment_amount, o.sales_channel, o.currency_code, o.payment_category, o.payment_status,
        u.name, u.dob, u.email, u.mobile, 
        (case 
            when o.fulfillment_type = 0 then 'Pickup at store'
            when o.fulfillment_type = 1 then 'Delivery'
        end) as fulfillment_type, dp.delivery_partner, dp.tracking_ref_no, s.name as store_name, sic.name as store_incharge_name, u.name as uname, u.dob, u.email, u.country_code, u.mobile,
        ad.address, ad.address_details, ad.zip_code, staff.name as staff_name, op.name as optician_name,
        vd.voucher_title, vd.discount_category, vd.discount_sub_category, vd.voucher_amount
       `;

    if(payload.start_date && payload.end_date){
        condition = condition ? condition + ` and o.created_at >= '${utils.getDateFormat(payload.start_date)}' and o.created_at <= '${utils.getDateFormat(payload.end_date,24)}'` : '';
    }
    let paymentFields = `o.order_no, (case
        when pr.payment_method = 0  then 'CASH'
        when pr.payment_method = 2  then 'VIRTUAL_ACCOUNT'
        when pr.payment_method = 3  then 'KREDIVO'
        when pr.payment_method = 4  then 'NO_PAYMENT'
        when pr.payment_method = 5  then 'EDC'
        when pr.payment_method = 6  then 'BANK_TRANSFER'
        when pr.payment_method = 7  then 'INSURANCE'
        when pr.payment_method = 8  then 'ATOME'
        when pr.payment_method = 9  then 'MEKARI'
        when pr.payment_method = 10 then 'DANA'
        when pr.payment_method = 11 then 'OVO'
        when pr.payment_method = 12 then 'GO_PAY'
        when pr.payment_method = 13 then 'LINK_AJA'
        when pr.payment_method = 14 then 'SHOPEE_PAY'
        when pr.payment_method = 15 then 'Paypal Payment'
        when pr.payment_method = 16 then 'Dept Store'
        when pr.payment_method = 17 then 'XENDIT CARD'
        when pr.payment_method = 18 then 'Corporate Try On'
        when pr.payment_method = 19 then 'Endorsement'
        when pr.payment_method = 20 then 'Employee Claim'
        when pr.payment_method = 21 then 'Warranty'
        when pr.payment_method = 22 then 'Xendit Invoice'
        else 'CARD' end) as payment_method, pr.amount, pr.payment_type, pr.notes`;
    // Frames list
    let paymentData = await db.rawQuery(
        `SELECT ${paymentFields} from ${table} o
        left join users u on o.user_id = u.id
        left join payment_request pr on o.order_no = pr.order_no
        WHERE ${condition} ORDER BY pr.created_at LIMIT ${limit}`,
        'SELECT'
    );
    
    paymentData = paymentData.reduce((accum, row) => {
        if(accum[row.order_no]){
            accum[row.order_no].push({amount: row.amount, payment_method: row.payment_method, payment_type: row.payment_type, notes: row.notes});
        } else {
            accum[row.order_no] = [{amount: row.amount, payment_method: row.payment_method, payment_type: row.payment_type, notes: row.notes}];
        }
        return accum;
    },{});

    let orderItemsFields = 'o.order_no, fm.frame_name as name, fm.variant_name, oi.sku, oi.retail_price, oi.discount_amount, oi.item_discount_amount, oi.is_warranty';
    // Frames list
    let orderItems = await db.rawQuery(
        `SELECT ${orderItemsFields} from ${table} o
        left join users u on o.user_id = u.id
        left join order_items oi on o.order_no = oi.order_no
        left join frame_master fm on fm.sku_code = oi.sku
        left join payment_request pr on o.order_no = pr.order_no
        WHERE ${condition} ORDER BY o.created_at DESC LIMIT ${Addon_limit}`,
        'SELECT'
    );
    orderItems = orderItems.reduce((accum, row) => {
        if(accum[row.order_no]){
            accum[row.order_no].push({name: row.name, variant_name: row.variant_name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount), is_warranty: row.is_warranty});
        } else {
            accum[row.order_no] = [{name: row.name, variant_name: row.variant_name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount), is_warranty: row.is_warranty}];
        }
        accum[row.order_no+'-FramesPrice']=(accum[row.order_no+'-FramesPrice'] || 0)+Number(row.retail_price);
        return accum;
    },{});
    
    let orderItemAddonsFields = 'o.order_no, p.name, oia.sku, oia.retail_price, oia.quantity, oia.discount_amount, oia.item_discount_amount, oia.type';
    // Clipon list
    let orderItemClipon = await db.rawQuery(
        `SELECT ${orderItemAddonsFields} from ${table} o
        left join users u on o.user_id = u.id
        left join order_item_addons oia on o.order_no = oia.order_no
        left join products p on p.sku = oia.sku
        left join payment_request pr on o.order_no = pr.order_no
        WHERE oia.category = 2 and ${condition} ORDER BY o.created_at DESC LIMIT ${Addon_limit}`,
        'SELECT'
    );
    orderItemClipon = orderItemClipon.reduce((accum, row) => {
        if(accum[row.order_no]){
            accum[row.order_no].push({name: row.name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount)});
        } else {
            accum[row.order_no] = [{name: row.name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount)}];
        }
        accum[row.order_no+'-CliponPrice']=(accum[row.order_no+'-CliponPrice'] || 0)+(Number(row.retail_price)*row.quantity);
        return accum;
    },{});
    // Lens list
    let orderItemLens = await db.rawQuery(
        `SELECT ${orderItemAddonsFields} from ${table} o
        left join users u on o.user_id = u.id
        left join order_item_addons oia on o.order_no = oia.order_no
        left join products p on p.sku = oia.sku
        left join payment_request pr on o.order_no = pr.order_no
        WHERE oia.category = 1 and is_lens_change = false and ${condition} ORDER BY o.created_at DESC LIMIT ${Addon_limit}`,
        'SELECT'
    );

    let orderItemChangedLens = await db.rawQuery(
        `SELECT ${orderItemAddonsFields} from ${table} o
        left join users u on o.user_id = u.id
        left join order_item_changed_addons oia on o.order_no = oia.order_no
        left join products p on p.sku = oia.sku
        left join payment_request pr on o.order_no = pr.order_no
        WHERE ${condition} ORDER BY o.created_at DESC LIMIT ${Addon_limit}`,
        'SELECT'
    );
    orderItemLens = orderItemLens.concat(orderItemChangedLens);
    orderItemLens = orderItemLens.reduce((accum, row) => {
        const lensArray = row.type === 'both' || !row.type ? ['left', 'right'] : [1];
        const item_discount_amount = row.type === 'both' || !row.type ? row.item_discount_amount/2 : row.item_discount_amount;
        const retail_price = !row.type ? row.retail_price/2 : row.retail_price;
        lensArray.reduce((acc, r) => {
            if(accum[row.order_no]){
                accum[row.order_no].push({name: row.name, sku: row.sku, retail_price, discount_amount: (row.discount_amount+item_discount_amount), type: row.type === 'both' || !row.type ? r : row.type});
            } else {
                accum[row.order_no] = [{name: row.name, sku: row.sku, retail_price, discount_amount: (row.discount_amount+item_discount_amount), type: row.type === 'both' || !row.type ? r : row.type}];
            }
            accum[row.order_no+'-LensPrice']=(accum[row.order_no+'-LensPrice'] || 0)+(Number(retail_price));
            return acc;
        },lensArray);
        return accum;
    },{});
     // Contact Lens
     let orderItemContactLens = await db.rawQuery(
        `SELECT ${orderItemAddonsFields} from ${table} o
        left join users u on o.user_id = u.id
        left join order_item_addons oia on o.order_no = oia.order_no
        left join products p on p.sku = oia.sku
        left join payment_request pr on o.order_no = pr.order_no
        WHERE oia.category = 3 and ${condition} ORDER BY o.created_at DESC LIMIT ${Addon_limit}`,
        'SELECT'
    );
    orderItemContactLens = orderItemContactLens.reduce((accum, row) => {
        if(accum[row.order_no]){
            accum[row.order_no].push({name: row.name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount)});
        } else {
            accum[row.order_no] = [{name: row.name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount)}];
        }
        accum[row.order_no+'-ContactLens']=(accum[row.order_no+'-ContactLens'] || 0)+(Number(row.retail_price)*row.quantity);
        return accum;
    },{});
    // other products list
    let orderItemOthers = await db.rawQuery(
        `SELECT ${orderItemAddonsFields} from ${table} o
        left join users u on o.user_id = u.id
        left join order_item_addons oia on o.order_no = oia.order_no
        left join products p on p.sku = oia.sku
        left join payment_request pr on o.order_no = pr.order_no
        WHERE oia.category = 4 and ${condition} ORDER BY o.created_at DESC LIMIT ${Addon_limit}`,
        'SELECT'
    );
    orderItemOthers = orderItemOthers.reduce((accum, row) => {
        if(accum[row.order_no]){
            accum[row.order_no].push({name: row.name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount)});
        } else {
            accum[row.order_no] = [{name: row.name, sku: row.sku, retail_price: row.retail_price, discount_amount: (row.discount_amount+row.item_discount_amount)}];
        }
        accum[row.order_no+'-OthersPrice']=(accum[row.order_no+'-OthersPrice'] || 0)+(Number(row.retail_price)*row.quantity);
        return accum;
    },{});
    const list = await db.rawQuery(
        `SELECT * from (SELECT ${fields} from ${table} o
        left join users u on o.user_id = u.id
        left join users staff on staff.id = o.created_by_staff
        left join users op on op.id = o.optician
        left join stores s on o.store_id::int = s.id
        left join stores sic on o.stock_store_id::int = sic.id
        left join user_address ad on o.address_id = ad.id
        left join voucher_details vd on o.voucher_code = vd.voucher_code
        left join delivery_partners dp on dp.order_no = o.order_no
        left join payment_request pr on o.order_no = pr.order_no
        WHERE ${condition} ORDER BY o.order_no) od ORDER BY od.created_at DESC LIMIT ${limit}`,
        'SELECT'
    );
    let excelColumns = 'Transaction No\tCreated Date\tDelivery Type\tDelivery Service\tAirway Bill Number\tSales Channel\tBranch Channel\tStore In Charge\tStatus\tName\tBirthday\tEmail\tPhone Number\tAddress\tZIP Code\tVoucher Name\tVoucher Category\tVoucher Sub-Category\tVoucher Amount\tAmount Paid\tCurrency\tOptician\'s Name\tStaff\'s Name\tPayment Status\tAmount Paid 1\tPayment Type 1\tPayment Category 1\tPayment Notes 1\tAmount Paid 2\tPayment Type 2\tPayment Category 2\tPayment Notes 2\tFrame name-1\tFrame color-1\tSKU Frame-1\tFrame Price-1\tFrame Discount-1\tAVRIST-1\tFrame name-2\tFrame color-2\tSKU Frame-2\tFrame Price-2\tFrame Discount-2\tAVRIST-2\tFrame name-3\tFrame color-3\tSKU Frame-3\tFrame Price-3\tFrame Discount-3\tAVRIST-3\tFrame name-4\tFrame color-4\tSKU Frame-4\tFrame Price-4\tFrame Discount-4\tAVRIST-4\tFrame name-5\tFrame color-5\tSKU Frame-5\tFrame Price-5\tFrame Discount-5\tAVRIST-5\tClipon name-1\tSKU Clipon-1\tClipon Price-1\tClipon Discount-1\tClipon name-2\tSKU Clipon-2\tClipon Price-2\tClipon Discount-2\tClipon name-3\tSKU Clipon-3\tClipon Price-3\tClipon Discount-3\tClipon name-4\tSKU Clipon-4\tClipon Price-4\tClipon Discount-5\tClipon name-5\tSKU Clipon-5\tClipon Price-5\tClipon Discount-5\tLens name-1\tSKU Lens-1\tLens Price-1\tLens Discount-1\tLens Type-1\tLens name-2\tSKU Lens-2\tLens Price-2\tLens Discount-2\tLens Type-2\tLens name-3\tSKU Lens-3\tLens Price-3\tLens Discount-3\tLens Type-3\tLens name-4\tSKU Lens-4\tLens Price-4\tLens Discount-4\tLens Type-4\tLens name-5\tSKU Lens-5\tLens Price-5\tLens Discount-5\tLens Type-5\tLens name-6\tSKU Lens-6\tLens Price-6\tLens Discount-6\tLens Type-6\tLens name-7\tSKU Lens-7\tLens Price-7\tLens Discount-7\tLens Type-7\tLens name-8\tSKU Lens-8\tLens Price-8\tLens Discount-8\tLens Type-8\tLens name-9\tSKU Lens-9\tLens Price-9\tLens Discount-9\tLens Type-9\tLens name-10\tSKU Lens-10\tLens Price-10\tLens Discount-10\tLens Type-10\tContact Lens name-1\tSKU Contact Lens-1\tContact Lens Price-1\tContact Lens Discount-1\tContact Lens Type-1\tContact Lens name-2\tSKU Contact Lens-2\tContact Lens Price-2\tContact Lens Discount-2\tContact Lens Type-2\tContact Lens name-3\tSKU Contact Lens-3\tContact Lens Price-3\tContact Lens Discount-3\tContact Lens Type-3\tContact Lens name-4\tSKU Contact Lens-4\tContact Lens Price-4\tContact Lens Discount-4\tContact Lens Type-4\tContact Lens name-5\tSKU Contact Lens-5\tContact Lens Price-5\tContact Lens Discount-5\tContact Lens Type-5\tOther Product name-1\tSKU Other-1\tOther Product Price-1\tOther Product Discount-1\tOther Product name-2\tSKU Other-2\tOther Product Price-2\tOther Product Discount-2\tOther Product-3\tSKU Other-3\tOther Product Price-3\tOther Product Discount-3\tOther Product-4\tSKU Other-4\tOther Product Price-4\tOther Product Discount-4\tOther Product-5\tSKU Other-5\tOther Product Price-5\tOther Product Discount-5\t';
   
    const data = list.reduce((list, row) => {
            list.rowData+=row.order_no+'\t'+utils.getLocalDateString(row.created_at)+'\t'+row.fulfillment_type+'\t'+utils.titleCase(row.delivery_partner || '-')+'\t'+(row.tracking_ref_no || '-')+'\t'+row.sales_channel+'\t'+(row.store_name || '-')+'\t'+(row.store_incharge_name || '-')+'\t'+utils.replaceGlobal(row.order_status)+'\t'+utils.titleCase(row.uname)+'\t'+(utils.getLocalDateString(row.dob) || '-')+'\t'+row.email+'\t'+row.country_code+row.mobile+'\t'+(row.address ? utils.replaceSpecialChar(row.address.trim()) : '-')+'\t'+(row.zip_code || '-')+'\t'+(row.voucher_title || '')+'\t'+(row.discount_category || 'NA')+'\t'+(row.discount_sub_category || 'NA')+'\t'+(row.voucher_amount || 0)+'\t'+(row.payment_amount || 0)+'\t'+(row.currency_code)+'\t'+(row.optician_name || '-')+'\t'+(row.staff_name || '-')+'\t'+(row.payment_status || '-')+'\t'; 
            let fi = 5, ci = 5, li = 10, cli = 5, oi = 5, p = 2;
            //Payments payment_method, pr.payment_type, pr.notes
            paymentData[row.order_no].slice(0,p).reduce((total, item) => {
                list.rowData+=item.amount+'\t'+item.payment_method+'\t'+item.payment_type+'\t'+item.notes+'\t';
                return total;
            }, 0);
            while((paymentData[row.order_no] ? paymentData[row.order_no].length : 0) < p){
                list.rowData+=('-')+'\t'+('-')+'\t'+('-')+'\t'+('-')+'\t';
                p--;
            }
            //Frames   
            const itemsTotal = orderItems[row.order_no] ? orderItems[row.order_no].slice(0,fi).reduce((total, item) => {
                list.rowData+=item.name+'\t'+item.variant_name+'\t'+item.sku+'\t'+(item.retail_price || 0)+'\t'+(item.discount_amount || 0)+'\t'+(item.is_warranty ? 'Y' : 'N')+'\t';
                total=(orderItems[row.order_no+'-FramesPrice'] || 0);
                return total;
            }, 0) : 0;
            while((orderItems[row.order_no] ? orderItems[row.order_no].length : 0) < fi){
                list.rowData+=('-')+'\t'+('-')+'\t'+('-')+'\t'+0+'\t'+0+'\t'+('-')+'\t';
                fi--;
            }
            // Clipon's
            const cliponTotal = orderItemClipon[row.order_no] ? orderItemClipon[row.order_no].slice(0,ci).reduce((total, item) => {
                list.rowData+=item.name+'\t'+item.sku+'\t'+(item.retail_price || 0)+'\t'+(item.discount_amount || 0)+'\t';
                total=(orderItemClipon[row.order_no+'-CliponPrice'] || 0);
                return total;
            }, 0) : 0;
            while((orderItemClipon[row.order_no] ? orderItemClipon[row.order_no].length : 0) < ci){
                list.rowData+=('-')+'\t'+('-')+'\t'+0+'\t'+0+'\t';
                ci--;
            }
            // Lens
            const lensTotal = orderItemLens[row.order_no] ? orderItemLens[row.order_no].slice(0,li).reduce((total, item) => {
                list.rowData+=item.name+'\t'+item.sku+'\t'+(item.retail_price || 0)+'\t'+(item.discount_amount || 0)+'\t'+(!item.type || item.type === 'both' ? 'both' : item.type)+'\t';
                total=(orderItemLens[row.order_no+'-LensPrice'] || 0);
                return total;
            }, 0) : 0; 
            while((orderItemLens[row.order_no] ? orderItemLens[row.order_no].length : 0) < li){
                list.rowData+=('-')+'\t'+('-')+'\t'+0+'\t'+0+'\t'+('-')+'\t';
                li--;
            }
            // Contact Lens 
            const contactLensTotal = orderItemContactLens[row.order_no] ? orderItemContactLens[row.order_no].slice(0,cli).reduce((total, item) => {
                list.rowData+=item.name+'\t'+item.sku+'\t'+(item.retail_price || 0)+'\t'+(item.discount_amount || 0)+'\t'+(!item.type || item.type === 'both' ? 'both' : item.type)+'\t';
                total=(orderItemContactLens[row.order_no+'-ContactLens'] || 0);
                return total;
            }, 0) : 0; 
            while((orderItemContactLens[row.order_no] ? orderItemContactLens[row.order_no].length : 0) < cli){
                list.rowData+=('-')+'\t'+('-')+'\t'+0+'\t'+0+'\t'+('-')+'\t';
                cli--;
            }
            // Others's
            const othersTotal = orderItemOthers[row.order_no] ? orderItemOthers[row.order_no].slice(0,oi).reduce((total, item) => {
                list.rowData+=item.name+'\t'+item.sku+'\t'+(item.retail_price || 0)+'\t'+(item.discount_amount || 0)+'\t';
                total=(orderItemOthers[row.order_no+'-OthersPrice'] || 0);
                return total;
            }, 0) : 0;
            while((orderItemOthers[row.order_no] ? orderItemOthers[row.order_no].length : 0) < oi){
                list.rowData+=('-')+'\t'+('-')+'\t'+0+'\t'+0+'\t';
                oi--;
            }
            list.rowData+=itemsTotal+'\t'+cliponTotal+'\t'+lensTotal+'\t'+contactLensTotal+'\t'+othersTotal+'\t'+(itemsTotal+cliponTotal+lensTotal+contactLensTotal+othersTotal)+'\n';
            return list;
    }, {rowData: ''});
    const finalData = excelColumns+'Gross Frame\tGross Clip On\tGross Lens\tGross Contact Lens\tGross Others Product\tGMV\n'+data.rowData;
    const fileName = 'orders.xls';
    return new Promise((resolve, reject) => {
        fs.appendFile(fileName, finalData, async (err) => {
            if (err) reject(err);
            const buffer = fs.readFileSync(fileName);
            const file = await s3Upload.pdfFileUpload(fileName, 'admin', buffer, 'application/vnd.ms-excel');
            fs.unlink(fileName,(err) => console.log('Orders export Error: ', err));
            resolve(constants.bucket.product_url+file.fileName);
         });
    });
};

const getHtoOrders = async (payload) => {
    const limit = constants.limit;
    const offset = (payload.page - 1) * limit;
    let condition = 'o.status in (0, 1) and apd.status in (0,1)';

    let table = 'appointment';
    let fields = 'o.id, o.appointment_no, o.address_id, o.created_at, o.status, o.sales_channel, o.appointment_status, u.id as user_id, u.name, u.email, u.mobile, ad.address, ad.address_details, ad.city, ad.province, ad.country, ad.lat, ad.long, ad.zip_code, opt.name as opt_name, apd.appointment_date, o.notes, hs.slot_start_time';
    if(payload.order_status && payload.order_status !== 'all'){
        condition = `o.appointment_status='${payload.order_status}'`;
    }
    if(payload.search){
        condition = condition + ` and (o.appointment_no ilike '%${payload.search}%' or u.name ilike '%${payload.search}%')`;
    }
    if(payload.sales_channel){
        condition = condition + ` and o.sales_channel='${payload.sales_channel.toLowerCase()}'`;
    }
    if(payload.optician){
        condition = condition + ` and apd.optician_id='${payload.optician}'`;
    }
    if(payload.start_date && payload.end_date){
        if(payload.date_search  === 'createdby'){
            condition = condition + ` and o.created_at >= '${utils.getDateFormat(payload.start_date)}' and o.created_at <= '${utils.getDateFormat(payload.end_date,24)}'`;
        } else {
            condition = condition + ` and apd.appointment_date >= '${utils.getDateFormat(payload.start_date)}' and apd.appointment_date <= '${utils.getDateFormat(payload.end_date,24)}'`;
        }
    }
    if(payload.user_id){
        condition = condition + ` and o.user_id='${payload.user_id}'`;
    }

    const orders = await await db.rawQuery(
        `SELECT COUNT(o.id)::int from ${table} o
        inner join users u on o.user_id = u.id
        left join appointment_time_details apd on o.id = apd.appointment_id ${condition ? 'WHERE '+condition : ''}`, 'SELECT');
    const list = await db.rawQuery(
        `SELECT ${fields} from ${table} o
        inner join users u on o.user_id = u.id
        left join user_address ad on o.address_id = ad.id
        left join appointment_time_details apd on o.id = apd.appointment_id
        left join optician opt on apd.optician_id = opt.id
        left join hto_slot hs on hs.id = apd.slot_id
        ${condition ? 'WHERE '+condition : ''}  ORDER BY ${payload.order_status === 2 || payload.date_search  === 'createdby' ? 'o.created_at' : 'apd.appointment_date'} DESC LIMIT ${limit} OFFSET ${offset}`,
        'SELECT'
    );
    return ({list, total_rows: orders[0].count});
};

const exportHtoOrders = async (payload) => {
    const limit = 50000;
    let condition = 'o.status in (0, 1) and apd.status in (0,1)';

    let table = 'appointment';
    let fields = 'o.id, o.appointment_no, o.address_id, o.created_at, o.status, o.sales_channel, o.appointment_status, o.comment, u.id as user_id, u.name, u.email, u.mobile, ad.address, ad.address_details, ad.city, ad.province, ad.country, ad.lat, ad.long, ad.zip_code, opt.name as opt_name, apd.appointment_date, o.notes, hs.slot_start_time';
    if(payload.order_status && payload.order_status !== 'all'){
        condition = `o.appointment_status='${payload.order_status}'`;
    }
    if(payload.search){
        condition = condition + ` and (o.appointment_no ilike '%${payload.search}%' or u.name ilike '%${payload.search}%')`;
    }
    if(payload.sales_channel){
        condition = condition + ` and o.sales_channel='${payload.sales_channel.toLowerCase()}'`;
    }
    if(payload.optician){
        condition = condition + ` and apd.optician_id='${payload.optician}'`;
    }
    if(payload.start_date && payload.end_date){
        if(payload.date_search  === 'createdby'){
            condition = condition + ` and o.created_at >= '${utils.getDateFormat(payload.start_date)}' and o.created_at <= '${utils.getDateFormat(payload.end_date,24)}'`;
        } else {
            condition = condition + ` and apd.appointment_date >= '${utils.getDateFormat(payload.start_date)}' and apd.appointment_date <= '${utils.getDateFormat(payload.end_date,24)}'`;
        }
    }
    if(payload.user_id){
        condition = condition + ` and o.user_id='${payload.user_id}'`;
    }

    const list = await db.rawQuery(
        `SELECT ${fields} from ${table} o
        inner join users u on o.user_id = u.id
        left join user_address ad on o.address_id = ad.id
        left join appointment_time_details apd on o.id = apd.appointment_id
        left join optician opt on apd.optician_id = opt.id
        left join hto_slot hs on hs.id = apd.slot_id
        ${condition ? 'WHERE '+condition : ''}  ORDER BY ${payload.order_status === 2 || payload.date_search  === 'createdby' ? 'o.created_at' : 'apd.appointment_date'} DESC LIMIT ${limit}`,
        'SELECT'
    );

    const data = list.reduce((list, row) => {
        list+=row.appointment_no+'\t'+utils.titleCase(row.name || '')+'\t'+(utils.getLocalDateString(row.appointment_date)+' '+row.slot_start_time)+'\t'+utils.titleCase(row.opt_name || '')+'\t'+utils.getLocalDateString(row.created_at)+'\t'+(row.address ? utils.replaceSpecialChar(row.address.trim()) : '-')+'\t'+utils.titleCase(row.sales_channel)+'\t'+utils.titleCase(row.appointment_status)+'\t'+(row.comment || '-')+'\n';
        return list;
    }, 'Order No\tName\tHTO Date Time\tOptician\tCreated Date\tLocation\tBooking Channel\tStatus\tComment\n');
    return new Promise((resolve, reject) => {
        fs.appendFile('hto.xls', data, async (err) => {
            if (err) reject(err);
            const buffer = fs.readFileSync('hto.xls');
            const file = await s3Upload.pdfFileUpload('hto.xls', 'admin', buffer, 'application/vnd.ms-excel');
            fs.unlink('hto.xls',(err) => console.log('hto export Error: ', err));
            resolve(constants.bucket.product_url+file.fileName);
         });
    });
};

const getOrderHtoDetail = async (payload) => {
    let table = 'appointment';
    let fields = 'o.id, o.appointment_no, o.created_at, o.status, o.sales_channel, o.notes, o.comment, o.appointment_status, by.name as created_by_name, u.id as user_id, u.name, u.email, u.mobile, u.dob, u.gender, ad.address, ad.address_details, ad.lat, ad.long, opt.name as opt_name, apd.optician_id, apd.appointment_date, hs.slot_start_time';
    const detail = await db.rawQuery(
        `SELECT ${fields} from ${table} o
        inner join users u on o.user_id = u.id
        left join user_address ad on o.address_id = ad.id
        left join appointment_time_details apd on o.id = apd.appointment_id
        left join optician opt on apd.optician_id = opt.id
        left join users by on o.created_by = by.id
        left join hto_slot hs on hs.id = apd.slot_id
        WHERE o.id = '${payload.id}' and o.status in (0, 1) and apd.status in (0,1) limit 1`,
        'SELECT'
    );
    if(detail && detail.length === 0) throw errorHandler.customError(messages.invalidOrder);
    const stores = await getStores({lat: detail[0].lat, long: detail[0].long});
    return ({
        data: detail[0],
        history: await db.findByCondition({ appointment_id: payload.id }, 'AppointmentHistory', ['id','appointment_status','status','created_at'], ['created_at', 'DESC']),
        stores: stores.slice(0,3)
    });
};

const htoAppointmentBook = async (payload) => {
    let transaction = await db.dbTransaction();
    try {
       // let optician_id = await _assignOptician(payload.appointment_date, payload.timeslot_id);
        let appointment_no = payload.appointment_no ? payload.appointment_no : `HTOSTL/${utils.generateRandom(12, true).toUpperCase()}`;
        let appointment_id = uuidv4();
        const draftHto = await db.findOneByCondition({appointment_no, status : 2 }, 'Appointment', ['appointment_no']);
        let appointmentObj = {
            id: appointment_id,
            appointment_no,
            address_id: payload.address_id,
            slot_id: payload.timeslot_id,
            appointment_date: payload.appointment_date,
            store_id: payload.store_id || null,
            user_id: payload.user_id,
            created_by: payload.created_by,
            created_at: new Date(),
            updated_by: payload.created_by,
            updated_at: new Date(),
            notes: payload.notes,
            appointment_status: payload.status === 1 ? constants.appointment_status.APPOINTMENT_CONFIRMED : constants.appointment_status.APPOINTMENT_DRAFT,
            status: payload.status,
            sales_channel: payload.sales_channel || 'store'
        };

        let appointmentTimingDetailsObj = {
            appointment_id,
            //optician_id,
            slot_id: payload.timeslot_id,
            appointment_date: payload.appointment_date,
            created_by: payload.created_by,
            created_at: new Date(),
            updated_by: payload.created_by,
            updated_at: new Date()
        };

        let appointmentHistoryObj = {
            appointment_id,
            created_at: new Date(),
            appointment_status: constants.appointment_status.APPOINTMENT_CONFIRMED
        };

        let promiseArr = [];
        if(draftHto){
            promiseArr.push(db.updateOneByCondition({
                ...appointmentObj
            }, { appointment_no: payload.appointment_no }, 'Appointment', transaction));
        } else {
            promiseArr.push(db.saveData(appointmentObj, 'Appointment', transaction));
        }
        if(payload.status === 1){
            promiseArr.push(db.saveData(appointmentTimingDetailsObj, 'AppointmentTimeDetails', transaction));
            promiseArr.push(db.saveData(appointmentHistoryObj, 'AppointmentHistory', transaction));
        }

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

const getOptician = async () => {
    return await db.findByCondition({status : 1}, 'Optician', ['id', 'name', 'country_code', 'mobile']);
    // return await db.rawQuery(
    //     `select u.id, u.name, u.country_code, u.mobile
    //       from users as u left join user_roles as ur on u.id = ur.user_id
    //       where u.status = 1 and ur.role = 'optician' ORDER BY u.created_at DESC`,
    //     'SELECT'
    // );
};

const updateHtoDetail = async (payload) => {
    let transaction = await db.dbTransaction();
    try{
        let appointmentQuery = `select ap.id as appointment_id, ap.appointment_no, ap.user_id,
            atd.optician_id, atd.appointment_date, hs.slot_start_time
            from appointment ap
            inner join appointment_time_details atd on atd.appointment_id = ap.id
            inner join hto_slot hs on hs.id = atd.slot_id
            where ap.id = (:appointment_id) and ap.status = 1 and atd.status = 1`;
        let replacements = {
            appointment_id: payload.appointment_id
        };

        let appointmentResults = await db.rawQuery(appointmentQuery, 'SELECT', replacements);
        if(appointmentResults.length != 1) {
            throw new Error('Invalid appointment no');
        }
        const appointment = appointmentResults[0];
        let olddatetoshow = moment(appointment.appointment_date).format('dddd, Do MMMM YYYY');
        let oldtimetoshow = appointment.slot_start_time;

        if(payload.status){
            if(payload.status === constants.appointment_status.APPOINTMENT_CANCELLED){
                return await htoCancel({...payload, user_id: appointment.user_id});
            } else {
                let promiseArr = [];
                let appointmentHistoryObj = {
                    appointment_id: payload.appointment_id,
                    created_at: new Date(),
                    appointment_status: payload.status
                };
                promiseArr.push(db.updateOneByCondition({
                    appointment_status: payload.status,
                    updated_at: new Date()
                }, {
                    id: payload.appointment_id,
                    status: 1
                }, 'Appointment', transaction));
                promiseArr.push(db.saveData(appointmentHistoryObj, 'AppointmentHistory', transaction));
                await Promise.all(promiseArr);
                await transaction.commit();
                return payload.status;
            }
        } else if(payload.appointment_date && payload.slot_id){
            let appointmentHistoryObj = {
                appointment_id: payload.appointment_id,
                created_at: new Date(),
                appointment_status: constants.appointment_status.APPOINTMENT_RESCHEDULED
            };
            let updateAppointment = db.updateOneByCondition({
                status: -1,
                updated_at: new Date(),
                updated_by: appointment.user_id
            }, {
                appointment_id: payload.appointment_id,
                status: 1
            }, 'AppointmentTimeDetails', transaction);

            let appointmentTimingDetailsObj = {
                appointment_id: payload.appointment_id,
                optician_id: appointment.optician_id,
                slot_id: payload.slot_id,
                appointment_date: payload.appointment_date,
                created_by: payload.updated_by,
                created_at: new Date(),
                updated_by: payload.updated_by,
                updated_at: new Date()
            };
            let promiseArr = [];
            promiseArr.push(db.saveData(appointmentTimingDetailsObj, 'AppointmentTimeDetails', transaction));
            promiseArr.push(db.saveData(appointmentHistoryObj, 'AppointmentHistory', transaction));
            promiseArr.push(updateAppointment);
            await Promise.all(promiseArr);
            await transaction.commit();

            appointmentRescheduleNotification(payload.appointment_id, olddatetoshow, oldtimetoshow);

        } else{
            let promiseArr = [];
            let appointmentHistoryObj = {
                appointment_id: payload.appointment_id,
                created_at: new Date(),
                appointment_status: constants.appointment_status.OPTICIAN_UPDATED
            };
            promiseArr.push(db.updateOneByCondition({
                ...payload,
                updated_at: new Date()
                }, {
                    appointment_id: payload.appointment_id,
                    status: 1
                }, 'AppointmentTimeDetails', transaction),
                db.saveData(appointmentHistoryObj, 'AppointmentHistory', transaction)
            );

            await Promise.all(promiseArr);
            await transaction.commit();
        }
    } catch (error) {
        console.log(error);
        transaction.rollback();
        throw errorHandler.customError(messages.systemError);
    }

};

const getStaff = async () => {
    return await db.findByCondition({role: 3, status: 1}, 'User', ['id', 'name'], ['name', 'ASC']);
};

const updateStockStoreInOrder = async (payload) => {
    return await db.updateOneByCondition({
        updated_by: payload.updated_by,
        updated_at: new Date(),
        stock_store_id: payload.stock_store_id
    }, { order_no: payload.order_no }, 'OrderDetail');
};

const getOpticianCalendar = async (payload) => {
    let condition = 'ap.status = 1 and atd.status = 1';
    if(payload.month){
        condition+= ` and atd.appointment_date >= '${utils.addSubtractDate(payload.month > 0 ? 'add' : 'subtract' , Number(payload.month), 'months')}'`;
    } else {
        condition+= ` and atd.appointment_date >= '${utils.addSubtractDate('subtract', 0, 'months')}'`;
    }
    let query = `select ap.id as appointment_id, ap.appointment_no, u.name as username, u.mobile, ud.address, ud.address_details,
            atd.optician_id, atd.appointment_date, hs.slot_start_time, hs.slot_end_time,  up.name
            from appointment ap
            inner join appointment_time_details atd on atd.appointment_id = ap.id
            left join hto_slot hs on hs.id = atd.slot_id
            left join optician up on up.id = atd.optician_id
            left join users u on u.id = ap.user_id
            left join user_address ud on ud.id = ap.address_id
            where ${condition}`;

    const list = await db.rawQuery(query, 'SELECT');
    return list.map(row => ({
        title: row.name || 'No Optician',
        start: moment(row.appointment_date.toISOString().split('T')[0] + ' ' + row.slot_start_time, 'YYYY-MM-DD HH:mm:ss').format(),
        end: moment(row.appointment_date.toISOString().split('T')[0] + ' ' + row.slot_end_time, 'YYYY-MM-DD HH:mm:ss').format(),
        allDay: false,
        color: 'green',
        appointmentNo: row.appointment_no,
        opticianId: row.optician_id,
        username: row.username,
        id: row.appointment_id,
        mobile: row.mobile,
        address:row.address,
        address_details: row.address_details,
        slot_start_time: row.slot_start_time,
        slot_end_time: row.slot_end_time
    }));
};

const changeLens = async (payload) => {
    let transaction = await db.dbTransaction();
    try{
        if(payload.is_update){
            await db.deleteRecord({ order_no: payload.order_no, order_item_id: payload.order_item_id }, 'orderItemChangedAddon', transaction);
        }
        let sku = `('${payload.new_lens_sku[0]}')`;
        if(payload.new_lens_sku.length > 1){
            sku = `('${payload.new_lens_sku[0]}','${payload.new_lens_sku[1]}')`;
        }
        const product_stock = await db.rawQuery(
          `select ps.quantity
            from products as p join product_stocks as ps on p.sku = ps.sku
            where p.sku in ${sku} and active=true and ps.quantity >= ${Number(payload.addon_item_count)}`,
          'SELECT'
        );
        if(product_stock && product_stock.length === 0) throw new errorHandler.customError(messages.itemOutOfStock);
        await db.updateOneByCondition({
            is_lens_change: true,
            updated_at: new Date()
        }, {order_no: payload.order_no, sku: payload.old_lens_sku, order_item_id: payload.order_item_id}, 'OrderItemAddon', transaction);
        const lens = await db.findOneByCondition({order_no: payload.order_no, sku: payload.old_lens_sku, order_item_id: payload.order_item_id}, 'OrderItemAddon');
        const newPayload = await Promise.all(payload.new_lens_sku.map(async (sku, index) => {
            const lensDetail = await db.findOneByCondition({sku}, 'Products', ['retail_price']);
            const quantity = Number(payload.addon_item_count);
            let discountAmount = 0;
            if(lensDetail.retail_price*2 > lens.retail_price){
                discountAmount = quantity === 1 ? lensDetail.retail_price - (lens.retail_price/2) : (lensDetail.retail_price*quantity) - lens.retail_price;
            }
            return ({
                    order_no: payload.order_no,
                    order_item_id: payload.order_item_id,
                    sku,
                    type: payload.type[index],
                    retail_price: lensDetail.retail_price,
                    quantity,
                    prescription_id: lens.prescription_id,
                    is_sunwear: payload.is_sunwear,
                    discount_type: lens.discount_type,
                    discount_amount: (lens.discount_amount/2)*quantity,
                    item_discount_amount: lens.retail_price === 0 ? lensDetail.retail_price*quantity : discountAmount,
                    packages: lens.packages,
                    user_credit: (lens.user_credit/2)*quantity,
                    eyewear_points_credit: (lens.eyewear_points_credit/2)*quantity,
                    created_by: payload.updated_by,
                    updated_by: payload.updated_by,
                    lense_color_code: lens.lense_color_code || ''
                });
            }
        ));
        await db.saveMany(newPayload, 'orderItemChangedAddon', transaction);
        await transaction.commit();
        return true;
    } catch(error){
        console.log('Error:', error);
        transaction.rollback();
        throw errorHandler.customError(messages.systemError);
    }
};

const getMembersPerformance = async (payload) => {

    let dateFilter = '';
    let condition = '';
    let wherecondition = '';

    if(payload.start_date && payload.end_date){
        dateFilter =` and od.created_at >= '${utils.getDateFormat(payload.start_date)}' and od.created_at <= '${utils.getDateFormat(payload.end_date,24)}'`;
    }

    if(payload.search){
        condition = ` AND name ilike '%${payload.search}%' or emp_ref_code ilike '%${payload.search}%'`;
        wherecondition = `where name ilike '%${payload.search}%' or emp_ref_code ilike '%${payload.search}%'`;
    }

    let limit =   payload.limit != undefined ? payload.limit :  10;
    let offset =  payload.page != undefined ? (payload.page - 1) * limit  : 0;
    let revenueQuery = '';
    let totalStaffCount = '';


    totalStaffCount = `SELECT COUNT(id)::int FROM users WHERE users.role = 3 AND users.status = 1 ${condition}`;

    revenueQuery = `select 
                        id, max(name) as name,  max(emp_ref_code) as emp_ref_code ,
                        sum(total_sales_as_staff) as total_sales_as_staff,
                        sum(total_sales_items_as_staff) as total_sales_items_as_staff,
                        sum(total_sales_as_optician) as total_sales_as_optician,
                        sum(total_sales_items_as_optician) as total_sales_items_as_optician
                    from
                    (
                        select * from 
                        (
                            select
                                u.id, max(u.name) as name, max(u.emp_ref_code) as emp_ref_code,
                                sum(od.payment_amount) as total_sales_as_staff,
                                count(od.id) as total_sales_items_as_staff,
                                0 as total_sales_as_optician,
                                0 as total_sales_items_as_optician
                            from users u
                            left join order_details od on od.created_by_staff = u.id
                            where u.role = 3 and u.status = 1 and od.order_status NOT IN ('payment_initiated','payment_pending','payment_failed','payment_cancelled','order_cancelled') ${dateFilter}
                            group by u.id
                        ) as store_table
                        union
                        select * from
                        (
                            select 
                                u.id, max(u.name) as name,max(u.emp_ref_code) as emp_ref_code,
                                0 as total_sales_as_staff,
                                0 as total_sales_items_as_staff,
                                sum(od.payment_amount) as total_sales_as_optician,
                                count(od.id) as total_sales_items_as_optician
                            from users u
                            left join order_details od on od.optician = u.id
                            where u.role = 3 and u.status = 1 and od.order_status NOT IN ('payment_initiated','payment_pending','payment_failed','payment_cancelled','order_cancelled') ${dateFilter}
                            group by u.id
                        ) as optician_table
                    ) as merge_table
                    ${wherecondition}
                    group by id
                    ORDER BY total_sales_as_staff DESC, total_sales_items_as_staff desc LIMIT ${limit} OFFSET ${offset}`;

    let list =  await db.rawQuery(revenueQuery, 'SELECT');
    let members =   await db.rawQuery(totalStaffCount, 'SELECT');
    return ({list, total_rows: members[0].count});

};


const getMemberOrders = async (payload) => {

    let replacements = {
        userId: payload.userId
    };

    let dateFilter = '';
    if(payload.start_date && payload.end_date){
        dateFilter =` and od.created_at >= '${utils.getDateFormat(payload.start_date)}' and od.created_at <= '${utils.getDateFormat(payload.end_date,24)}'`;
    }
    let limit =   payload.limit != undefined ? payload.limit :  10;
    let offset =  payload.page != undefined ? (payload.page - 1) * limit  : 0;
    let revenueQuery = '';
    let totalStaffCount = '';
    let limitdata = '';
    let order = ' asc';


    if(payload.type == 'optician_hto_sales' || payload.type == 'optician_store_sales' ||  payload.type == 'staff_store_sales'){
        limitdata =  ` LIMIT ${limit} OFFSET ${offset}`;
        order = ' desc';
    }


    if(payload.type == 'optician_hto_sales' || payload.type == 'htosales' || payload.type == 'htosalesitems'){

        totalStaffCount = `select  count(*)::int
                                from order_details od
                                where od.optician = :userId and od.order_status IN ('order_confirmed', 'payment_confirmed') and od.sales_channel = 'hto' and od.status = 1 ${dateFilter}`;

        revenueQuery = `select  u.name, od.order_no , od.created_at, od.payment_amount, od.order_status, pr.payment_type, pr.payment_method, pr.bank_code
                                from order_details od
                                left join users o on o.id = od.optician
                                left join users u on u.id = od.user_id
                                left join payment_request pr on od.order_no = pr.order_no
                                where od.optician = :userId and od.order_status IN ('order_confirmed', 'payment_confirmed') and od.sales_channel = 'hto' and od.status = 1 ${dateFilter}
                                order by od.created_at ${order} ${limitdata}`;

    }
    else if (payload.type == 'optician_store_sales' || payload.type == 'opticiansales' || payload.type == 'opticiansaleitems'){

        totalStaffCount = `select  count(*)::int
                                from order_details od
                                where od.optician = :userId and od.order_status IN ('order_confirmed', 'payment_confirmed') and od.sales_channel != 'hto' and od.status = 1 ${dateFilter}`;

        revenueQuery = `select  u.name, od.order_no, od.created_at, od.payment_amount, od.order_status, pr.payment_type, pr.payment_method, pr.bank_code
                                from order_details od
                                left join users o on o.id = od.optician
                                left join users u on u.id = od.user_id
                                left join payment_request pr on od.order_no = pr.order_no
                                where od.optician = :userId and od.order_status IN ('order_confirmed', 'payment_confirmed') and od.sales_channel != 'hto' and od.status = 1 ${dateFilter}
                                order by od.created_at ${order} ${limitdata}`;
    }
    else if (payload.type == 'staff_store_sales' || payload.type == 'staffsales' || payload.type == 'staffsaleitems'){

        totalStaffCount = `select  count(*)::int
                            from order_details od
                            where od.created_by_staff = :userId and od.order_status IN ('order_confirmed', 'payment_confirmed') and od.status = 1  ${dateFilter}`;

        revenueQuery = `select  u.name, od.order_no, od.created_at, od.payment_amount, od.order_status, pr.payment_type, pr.payment_method, pr.bank_code
                            from order_details od
                            left join users u on  u.id = od.user_id
                            left join payment_request pr on od.order_no = pr.order_no
                            where od.created_by_staff = :userId and od.order_status IN ('order_confirmed', 'payment_confirmed') and od.status = 1   ${dateFilter}
                            order by od.created_at ${order} ${limitdata}`;
    }


    let list =  await db.rawQuery(revenueQuery, 'SELECT', replacements);
    let members =   await db.rawQuery(totalStaffCount, 'SELECT', replacements);
    return ({list, total_rows: members && members[0].count});

};


const getMemberSummary = async (payload) => {


    let replacements = {
        userId: payload.userId
    };

    let limit =   payload.limit != undefined ? payload.limit :  10;
    let offset =  payload.page != undefined ? (payload.page - 1) * limit  : 0;
    let dateFilter = '';
    let dateFilterAppt = '';
    let totalAppointmentCount = '';
    let memberQuery = '';
    let revenueHTOQuery = '';
    let revenueQuery = '';
    
    if(payload.start_date && payload.end_date){
        dateFilter =` and od.created_at >= '${utils.getDateFormat(payload.start_date)}' and od.created_at <= '${utils.getDateFormat(payload.end_date,24)}'`;
        dateFilterAppt =` and atd.created_at >= '${utils.getDateFormat(payload.start_date)}' and atd.created_at <= '${utils.getDateFormat(payload.end_date,24)}'`;
    }


    if(payload.member == 'optician'){

        totalAppointmentCount = `select  count(*)::int
                                    from appointment_time_details atd 
                                    where atd.optician_id = :userId  and atd.status = 1 ${dateFilterAppt}`;



        memberQuery = ' select o.id, o.name, o.created_at, o.optician_emp_ref_code as emp_ref_code from optician o where o.id = :userId';
   

        revenueHTOQuery = `select  SUM(order_amount) as total_sale, count(optician) as total_sale_items
                            from order_details od
                            left join users u on o.id = od.optician
                            where od.order_status IN ('order_confirmed', 'payment_confirmed') and od.status = 1 and u.status = 1 and u.id = :userId and od.sales_channel = 'hto' ${dateFilter}
                            group  BY od.optician`;
        
        revenueQuery = `select  SUM(order_amount) as total_sale, count(optician) as total_sale_items
                            from order_details od
                            left join users u on u.id = od.optician
                            where od.order_status IN ('order_confirmed', 'payment_confirmed') and od.status = 1 and u.status = 1 and u.id = :userId and od.sales_channel != 'hto' ${dateFilter}
                            group  BY od.optician`;
    }
    else{

        memberQuery = ' select u.id, u.name,  u.created_at, u.emp_ref_code from users u where u.id = :userId';

        revenueQuery = `select  SUM(order_amount) as total_sale, count(created_by_staff) as total_sale_items
                            from users u
                            left join order_details od on  u.id = od.created_by_staff
                            where  od.order_status IN ('order_confirmed', 'payment_confirmed') and od.status = 1 and u.status = 1  and u.id = :userId ${dateFilter}
                            group  BY od.created_by_staff`;
    }




    let appointments =  await db.rawQuery(totalAppointmentCount, 'SELECT', replacements);
    let member =  await db.rawQuery(memberQuery, 'SELECT', replacements);
    let revenueHTO =  await db.rawQuery(revenueHTOQuery, 'SELECT', replacements);
    let revenueStore =  await db.rawQuery(revenueQuery, 'SELECT', replacements);

    return ({
            appointments : appointments[0] ? appointments[0] : { count : 0 }, 
            revenueStore : revenueStore[0] ? revenueStore[0] : {total_sale: 0 , total_sale_items: 0}, 
            revenueHTO : revenueHTO[0] ? revenueHTO[0] : {total_sale: 0 , total_sale_items: 0}, 
            member : member[0] 
        });

};




const getOpticianAppointment = async (payload) => {

    let replacements = {
        userId: payload.userId
    };

    let dateFilter = '';
    if(payload.start_date && payload.end_date){
        dateFilter =` and atd.created_at >= '${utils.getDateFormat(payload.start_date)}' and atd.created_at <= '${utils.getDateFormat(payload.end_date,24)}'`;
    }

    
    let limit =   payload.limit != undefined ? payload.limit :  10;
    let offset =  payload.page != undefined ? (payload.page - 1) * limit  : 0;


    let limitdata = '';
    let order =  ' asc';


    if(payload.type == 'optician_hto_sales' || payload.type == 'optician_store_sales' ||  payload.type == 'staff_store_sales'){
        limitdata =  ` LIMIT ${limit} OFFSET ${offset}`;
        order = ' desc';
    }


    let totalAppointmentCount = `select  count(*)::int
                            from appointment_time_details atd 
                            where atd.optician_id = :userId  and atd.status = 1 ${dateFilter}`;

    let appointmentList = `select  u1.name, a.id, a.appointment_no , a.appointment_status, a.created_at, a.notes, atd.appointment_date, hs.slot_start_time,  hs.slot_end_time, ua.address
                            from appointment a
                            left join appointment_time_details atd on atd.appointment_id = a.id
                            left join users u1 on u1.id = atd.optician_id
                            left join hto_slot hs on  hs.id = atd.slot_id 
                            left join user_address ua on ua.id = a.address_id
                            left join users u on u.id = a.user_id 
                            where atd.optician_id = :userId and atd.status = 1 ${dateFilter}
                            order by a.created_at ${order} ${limitdata}`;



    let list =  await db.rawQuery(appointmentList, 'SELECT', replacements);
    let members =   await db.rawQuery(totalAppointmentCount, 'SELECT', replacements);
    return ({list, total_rows: members && members[0].count});

};

const esTextSearch = async (payload, user = {}) => {
    let storeQuery = {
      query_string: {
        query: `*${payload.text}*`,
        fields: ['name', 'store_code', 'store_region'],
      },
    };

    let productsQuery = {
      query_string: {
        query: `*${payload.text}*`,
        fields: [
          'frame_name',
          'frame_code',
          'variant_name',
          'variant_code',
          'sku_code',
          'fit',
          'material',
          'face_shape',
          'frame_shape',
          'gender',
          'product_type',
          'product_brand',
          'product_tags',
        ],
      },
    };

    let productSortArray = [{'frame_rank': { 'order': 'desc' }}];

    let store_product_index = 'store_products';

    const productdata = await elasticsearch.searchInIndex(
      store_product_index,
      productsQuery,
      0,
      20,
      [
        'turboly_id',
        'sku_code',
        'frame_name',
        'frame_code',
        'variant_name',
        'variant_code',
        'product_brand',
        'image_key_sunglass',
        'image_key_eyeglass',
        'retail_price'
      ],
      productSortArray
    );
    const storeData = await elasticsearch.searchInIndex(
      'stores',
      storeQuery,
      0,
      20,
      []
    );

    let productResults = productdata.hits.hits;
    let storeResults = storeData.hits.hits;

    let response = {
      product: {
        count: 0,
        data: [],
      },
      store: {
        count: 0,
        data: [],
      },
    };

    response.product.count = productResults.length;
    response.store.count = storeResults.length;

    storeResults.forEach((data) => {
      let store = data._source;
      store.base_url = config.s3URL;
      response.store.data.push(store);
    });

    productResults.forEach((data) => {
      let product = data._source;
      product.baseUrl = config.s3URL;
      response.product.data.push(product);
    });

    return response;
};

const updateOrderStatus = async (payload) => {
    if (!payload.order_status) throw errorHandler.customError(messages.requiredField('Status'));
    const order = await db.findOneByCondition({ order_no: payload.order_no }, 'OrderDetail', ['user_id', 'fulfillment_type']);
    if (!order) throw errorHandler.customError(messages.invalidOrder);
    const updatedPayload = {
        updated_by: payload.updated_by,
        updated_at: new Date(),
        order_status: payload.order_status
    };
    if(payload.order_status === constants.order_status.ORDER_DELIVERED){
        updatedPayload.actual_delivery_date = new Date();
    }
    const data = await db.updateOneByCondition(updatedPayload, { order_no: payload.order_no }, 'OrderDetail');
    await db.saveData({order_no: payload.order_no, status: payload.order_status, source: 'app', created_at: new Date(), created_by: payload.updated_by}, 'OrdersHistory');
    if(payload.order_status === constants.order_status.ORDER_READY_FOR_COLLECT){
        await orderReadyToPickupNotification(payload.order_no);
    } 
    else if(payload.order_status === constants.order_status.ORDER_READY_FOR_DELIVERY){
        await logs.addCustomerActivityLogs({
            user_id: order.user_id,
            action: constants.logs_action.ready_to_delivery,
            created_by: payload.updated_by
        });
    }
    await orderStatusNotification(payload.order_no, false, false);
    return data;
};

const getProductSku = async (payload) => {
    if(payload.type === 'frames'){
        return await db.findDistinctRecords('sku_code', 'FrameMaster');
    } else if(payload.type === 'lens'){
        return await db.findDistinctRecords('sku_code', 'LensesDetail');
    } else {
        return await db.findDistinctRecords('sku', 'ClipOn');
    }
};

const checkout = async (payload, userData, adminId) => {
    if (payload.fulfillment_type == 0) {
        if (_.isUndefined(payload.store_id)) {
            throw errorHandler.customError(messages.storeRequired);
        }
    } else if (payload.fulfillment_type == 1) {
        if (_.isUndefined(payload.address_id)) {
            throw errorHandler.customError(messages.addressRequired);
        }
    }

    let cartItemQuery = `select ci.user_id, ci.id as cart_id, ci.product_category, ci.item_count, ci.is_warranty, p."name", p.sku, p.retail_price, p.tax_rate, ci.prescription_id, ci.discount_amount, ci.item_discount_amount, ci.discount_type, ci.discount_note, ci.packages from cart_items ci
        inner join products p on p.sku = ci.sku_code
        where ci.user_id = :user_id and ci.type = 1 and ci.status = true`;

    let cartAddonQuery = `select cai.cart_id, cai.addon_item_count, cai.discount_amount, cai.item_discount_amount, cai.type, cai.discount_type, cai.discount_note, cai.is_sunwear, cai.category, p."name", p.sku, p.retail_price, p.tax_rate
        from cart_addon_items cai
        inner join cart_items ci on ci.id = cai.cart_id
        inner join products p on p.sku = cai.addon_product_sku
        where ci.user_id = :user_id and ci.type = 1 and ci.status = true and cai.status = true`;

    let addonOnlyQuery = `select cai.cart_id, cai.addon_item_count, cai.discount_amount, cai.item_discount_amount, cai.discount_type, cai.discount_note, cai.is_sunwear, cai.category, p."name", p.sku, p.retail_price, p.tax_rate, cai.prescription_id, cai.type, cai.packages
        from cart_addon_items cai
        inner join products p on p.sku = cai.addon_product_sku
        where cai.user_id = :user_id and cai.cart_id ISNULL and cai.status = true`;

    let replacements = {
        user_id: userData.id
    };

    let dbProducts = await db.rawQuery(cartItemQuery, 'SELECT', replacements);
    let dbAddOns = await db.rawQuery(cartAddonQuery, 'SELECT', replacements);
    let dbAddOnsOnly = await db.rawQuery(addonOnlyQuery, 'SELECT', replacements);

    if (dbProducts.length === 0 && dbAddOnsOnly.length === 0 ) {
        throw new Error('Cart is empty');
    }
    let voucherDetails = {
        is_active: true,
        cartAmount: 1,
        voucherDiscountAmount: 0,
        discountedCartAmount: 1,
        isForFrames: false,
        isForLens: false,
        isForClipons: false
    };

    payload.voucher_code = payload.voucher_code.toUpperCase();
    if(payload.voucher_code !== 'NA' && payload.voucher_id) {
        voucherDetails = await voucher.validateAdminVoucher(userData.id, payload.voucher_id, dbProducts, [...dbAddOns, ...dbAddOnsOnly]);
    }
    let order_no = `STECOM/${utils.generateRandom(12, true).toUpperCase()}`;
    let payment_req_id = uuidv4();
    let order_amount = 0;

    let order_discount_amount = voucherDetails.voucherDiscountAmount;
    let pendingDiscountAmount = order_discount_amount;
    let custome_order_discount_amount = 0;
    let orderItems = [];
    let orderItemAddons = [];

    for (let dbProduct of dbProducts) {
        let product = payload.products ? payload.products.find(payloadProduct => payloadProduct.sku_code === dbProduct.sku) : null;

        if (typeof product == 'undefined') {
            throw new Error('Invalid product in request, Please clear cart');
        }
        if (product && dbProduct.retail_price != product.retail_price) {
            throw new Error(`Product with Name: ${dbProduct.name} prices are updated, please refresh cart`);
        }

        let addOns = dbAddOns.filter(dbAddOn => dbAddOn.cart_id === dbProduct.cart_id);

        let order_item_id = uuidv4();

        let cart_item_amount = (dbProduct.retail_price * dbProduct.item_count);
        order_amount += cart_item_amount;

        if(dbProduct.is_warranty === 1){
            order_amount += constants.warrantyPrice;
        }

        let sizecode = dbProduct.sku.slice(6, 8);
        let size = constants.frame_sizes[`SZ${sizecode}`];

        let item_discount_amount = 0;
        if(order_discount_amount !== 0 && voucherDetails.isForFrames) {
            item_discount_amount =  order_discount_amount * ((cart_item_amount - dbProduct.item_discount_amount)/voucherDetails.cartAmount);

            item_discount_amount = Math.round(item_discount_amount);
            pendingDiscountAmount = pendingDiscountAmount - item_discount_amount;
        }

        if(dbProduct.item_discount_amount){
            custome_order_discount_amount += dbProduct.item_discount_amount;
        }

        let orderItem = {
            id: order_item_id,
            name: dbProduct.name,
            order_no: order_no,
            order_item_id,
            sku: dbProduct.sku,
            retail_price: dbProduct.retail_price,
            prescription_id: dbProduct.prescription_id,
            discount_amount: item_discount_amount,
            item_discount_amount: dbProduct.item_discount_amount,
            tax_rate: dbProduct.tax_rate,
            quantity: dbProduct.item_count,
            product_category: dbProduct.product_category,
            order_item_total_price: dbProduct.retail_price * dbProduct.item_count,
            size: size,
            created_at: new Date(),
            is_warranty: dbProduct.is_warranty,
            discount_type: dbProduct.discount_type,
            discount_note: dbProduct.discount_note
        };

        for (addOn of addOns) {
            let cart_addon_amount = (addOn.retail_price * addOn.addon_item_count);
            order_amount += cart_addon_amount;
            let addon_discount_amount = 0;
            if(order_discount_amount !== 0 && voucherDetails.isForLens) {
                addon_discount_amount =  order_discount_amount * ((cart_addon_amount - addOn.item_discount_amount)/voucherDetails.cartAmount);
                addon_discount_amount = Math.round(addon_discount_amount);
                pendingDiscountAmount = pendingDiscountAmount - addon_discount_amount;
            }

            if(addOn.item_discount_amount){
                custome_order_discount_amount += addOn.item_discount_amount;
            }

            let orderItemAddon = {
                order_no: order_no,
                order_item_id,
                sku: addOn.sku,
                retail_price: addOn.retail_price,
                discount_amount: addon_discount_amount,
                item_discount_amount: addOn.item_discount_amount,
                quantity: addOn.addon_item_count,
                created_at: new Date(),
                is_sunwear: addOn.is_sunwear,
                type: addOn.type,
                discount_type: addOn.discount_type,
                discount_note: addOn.discount_note
            };

            orderItem.order_item_total_price += cart_addon_amount;

            orderItemAddons.push(orderItemAddon);
        }
        orderItem.packages = dbProduct.packages;
        orderItems.push(orderItem);
    }

    for (addOn of dbAddOnsOnly) {
        let cart_addon_amount = addOn.retail_price * addOn.addon_item_count;
        order_amount += cart_addon_amount;
        let addon_discount_amount = 0;
        if(order_discount_amount !== 0 && ((addOn.type !== 'clipon' && voucherDetails.isForLens) || (addOn.type === 'clipon' && voucherDetails.isForClipons))) {
            addon_discount_amount =  order_discount_amount * ((cart_addon_amount - addOn.item_discount_amount)/voucherDetails.cartAmount);
            addon_discount_amount = Math.round(addon_discount_amount);
            pendingDiscountAmount = pendingDiscountAmount - addon_discount_amount;
        }
        if(addOn.item_discount_amount){
            custome_order_discount_amount += addOn.item_discount_amount;
        }

        let orderItemAddon = {
            order_no: order_no,
            sku: addOn.sku,
            retail_price: addOn.retail_price,
            discount_amount: addon_discount_amount,
            item_discount_amount: addOn.item_discount_amount,
            quantity: addOn.addon_item_count,
            prescription_id: addOn.prescription_id,
            type: addOn.type,
            is_sunwear: addOn.is_sunwear,
            discount_type: addOn.discount_type,
            discount_note: addOn.discount_note,
            created_at: new Date(),
            packages: addOn.packages,
            category: addOn.category
        };

        orderItemAddons.push(orderItemAddon);
    }

    if(orderItems.length > 0 && pendingDiscountAmount !== 0) {
        orderItems[0].discount_amount = orderItems[0].discount_amount + pendingDiscountAmount;
    } else if(orderItemAddons.length > 0 && pendingDiscountAmount !== 0) {
        orderItemAddons[0].discount_amount = orderItemAddons[0].discount_amount + pendingDiscountAmount;
    }

    let payment_amount = order_amount - (order_discount_amount + custome_order_discount_amount);
    if (payment_amount < 0) { payment_amount = 0; }

    let transaction = await db.dbTransaction();

    try {
        const scheduled_delivery_date = new Date();
        scheduled_delivery_date.setDate(scheduled_delivery_date.getDate() + 10);

        let orderJSON = {
            order_no: order_no,
            user_id: userData.id,
            email_id: userData.email,
            payment_req_id: payment_req_id,
            address_id: payload.address_id,
            voucher_code: payload.voucher_code || 'NA',
            order_amount: order_amount,
            order_discount_amount: (order_discount_amount + custome_order_discount_amount),
            payment_amount: payment_amount,
            scheduled_delivery_date: scheduled_delivery_date,
            order_status: constants.order_status.PAYMENT_INITIATED,
            created_at: new Date(),
            created_by: adminId,
            updated_at: new Date(),
            updated_by: adminId,
            notes: payload.notes || 'NA',
            status: 0,
            is_payment_required: true,
            is_local_order: false,
            fulfillment_type: payload.fulfillment_type,
            hto_appointment_no : payload.hto_appointment_no || null
        };

        if (payload.store_id) {
            orderJSON.store_id = payload.store_id;
            let storeRegisterResult = await turbolyUtility.storeRegisters();
            let register = storeRegisterResult.data.registers.filter(register => register.store_id == payload.store_id && register.active == true);
            if (register.length == 0) {
                throw errorHandler.customError(messages.storeNotOperating);

            }
            orderJSON.register_id = register[0].id;
            orderJSON.pick_up_store_id = payload.store_id.toString() !== '6598' ? payload.store_id : null;
            orderJSON.stock_store_id = payload.store_id.toString() !== '6598' ? payload.store_id : null;

        } else {
            orderJSON.store_id = config.turbolyEcomOrder.storeID;
            orderJSON.register_id = config.turbolyEcomOrder.registerID;
        }

        if(payload['sales_channel']){
            orderJSON.sales_channel = payload['sales_channel'];
        }

        if(payload['pick_up_store_id']){
            orderJSON.pick_up_store_id = payload['pick_up_store_id'];
            orderJSON.stock_store_id = payload['pick_up_store_id'];
        }

        await db.saveData(orderJSON, 'OrderDetail', transaction);
        await db.saveMany(orderItems, 'OrderItem', transaction);
        await db.saveMany(orderItemAddons, 'OrderItemAddon', transaction);

        await transaction.commit();

        if (payload.fulfillment_type == 1) {
            let updateReplacements = {
                payment_req_id: payment_req_id,
                order_status: constants.order_status.PAYMENT_INITIATED,
            };
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
        }

        return {
            order_no,
            payment_req_id,
            payment_amount,
            payment_category: 0
        };
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

module.exports = {
    login,
    addDraftOrder,
    getOrders,
    getLenses,
    addCartAddon,
    deleteDraftOrder,
    inStorePayment,
    orderDetails,
    downloadPDF,
    applyVoucher,
    addOrderHistory,
    cancelOrder,
    dashboardData,
    getUsers,
    customerDetail,
    removeDiscount,
    processOrder,
    updateOrderStaffOptician,
    exportUsers,
    exportOrders,
    getHtoOrders,
    exportHtoOrders,
    getOrderHtoDetail,
    htoAppointmentBook,
    getOptician,
    updateHtoDetail,
    getStaff,
    updateStockStoreInOrder,
    getOpticianCalendar,
    changeLens,
    getMembersPerformance,
    getMemberOrders,
    getMemberSummary,
    getOpticianAppointment,
    esTextSearch,
    updateOrderStatus,
    getProductSku,
    checkout,
    ...voucher,
    ...contactLens,
    ...catalogue,
    ...elasticData,
    ...userManagement,
    ...account,
    ...store,
    ...products,
    ...logs
};
