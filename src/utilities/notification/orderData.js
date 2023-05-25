const db = require('../database');

const getStoreAddress = async storeId => {
    return storeaddress = await db.findOneByCondition({ id: storeId }, 'Store', ['address', 'name', 'email_image_key']);
};

const getDeliveryAddress = async addressId => {
    return useraddress = await db.findOneByCondition({ id: addressId }, 'UserAddress', ['address_details', 'address']);
};

const getHtoSlot = async timeslotId => {
    return await db.findOneByCondition({ id: timeslotId }, 'HtoSlot', ['slot_start_time', 'slot_end_time']);
};


const getOrderDetail = async orderId => {

    let query = `select od.order_no, od.notes, od.address_id, od.store_id, od.pick_up_store_id ,od.order_amount, od.sales_channel,
                  od.order_discount_amount, od.payment_amount, od.currency, od.payment_req_id, us.mobile, 
                  us.name, us.email, us.country_code, ua.address, ua.address_details, od.fulfillment_type, od.currency_code,  
                  od.is_payment_required, od.scheduled_delivery_date, od.voucher_code,od.created_at, od.eyewear_points_credit,
                  od.is_eyewear_points_credit, od.user_credit_amount, od.is_credit,
                  spt.transaction_amount , spt.points,
                  ha.appointment_date, ha.slot_id, zc.is_offer, dp.delivery_partner, dp.tracking_ref_no
                from order_details od 
                inner join users us on us.id = od.user_id 
                left join user_address ua on ua.id = od.address_id 
                left join hto_zip_code zc on zc.zipcode = ua.zip_code 
                left join hto_appointment ha on ha.order_no = od.order_no AND ha.status = 1
                left join eyewear_points_transactions spt on spt.order_no = od.order_no AND spt.status = 1 AND spt.type = 1
                left join delivery_partners dp on dp.order_no = od.order_no 
                where od.order_no = :orderId`;

    let replacements = {
        orderId: orderId,
    };

    return await db.rawQuery(query, 'SELECT', replacements);

};



const getReferralData = async order_id => {

    let query = `select uc.credit_amount, uc.closing_balance, uc.created_at, uc.transaction_type,
                    us1.name as refree_name, us2.name as referrer_name, us2.email as referrer_email
                    from order_details od
                    inner join user_credits uc on uc.activity_reference_id = od.id
                    inner join users us1 on us1.id = od.user_id
                    inner join users us2 on us2.id = uc.user_id
                    where uc.activity_reference_id = :order_id and uc.transaction_type = 'CREDIT'`;

    let replacements = {
        order_id: order_id,
    };

    return await db.rawQuery(query, 'SELECT', replacements);

};

const getAppointmentDetail = async id => {

    let query = `select a.appointment_no, a.notes, a.address_id, a.store_id, a.sales_channel, us.mobile, 
                  us.name, us.email, us.country_code, ua.address, ua.address_details, a.created_at,
                  atd.appointment_date, atd.slot_id, zc.is_offer
                from appointment a
                left join appointment_time_details atd on atd.appointment_id = a.id AND atd.status = 1
                inner join users us on us.id = a.user_id 
                left join user_address ua on ua.id = a.address_id 
                left join hto_zip_code zc on zc.zipcode = ua.zip_code 
                where a.id = :id`;

    let replacements = {
        id: id,
    };

    return await db.rawQuery(query, 'SELECT', replacements);

};

const getOrderItem = async orderId => {

    let query = `select f.frame_name, v.variant_name, fm.size_code, oi.is_warranty, oi.quantity, oi.retail_price, oi.sku, oi.product_category,oi.prescription_id, oi.id,
                oi.discount_amount, oi.discount_type, oi.discount_note,
                up.label, up.spheris_r, up.spheris_l, up.cylinder_r, up.cylinder_l, up.axis_r, up.axis_l, up.addition_r, up.addition_l, up.pupilary_distance 
                from order_items oi
                inner join frame_master fm on fm.sku_code = oi.sku 
                inner join frame f on f.frame_code = fm.frame_code 
                inner join variants v on v.variant_code = fm.variant_code 
                left join user_prescription up on up.id = oi.prescription_id
                where order_no = :orderId`;

    let replacements = {
        orderId: orderId,
    };

    return await db.rawQuery(query, 'SELECT', replacements);
};

const getOrderItemAddon = async orderId => {
    let query = `select oia.retail_price, oia.order_item_id, oia.discount_note, oia.discount_type, oia.discount_amount, oia.type, oia.quantity,
    ld.category_name, ld.prescription_name, ld.prescription_amount, ld.lense_type_name, ld.lense_type_amount, ld.filter_type_name, ld.filter_type_amount,
    ld.brand, ld.index_value,
    co.name, co.amount, co.sku,
    cl.name as contact_lense_name, cl.brand as contact_lense_brand,
    op.name as accessories_name, op.amount as accessories_amount
    from order_item_addons oia
    left join lenses_detail ld on ld.sku_code = oia.sku
    left join clipon co on co.sku = oia.sku
    left join others_product op on op.sku = oia.sku
    left join contact_lens cl on cl.sku = oia.sku
    where order_no = :orderId`;

    let replacements = {
        orderId: orderId,
    };

    return await db.rawQuery(query, 'SELECT', replacements);
};

const getPaymentDetails = async orderId => {

    let query = `select Distinct on(req.payment_method, req.created_at) req.created_at ,od.order_no, od.payment_req_id,od.payment_category,
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
        when req.payment_method = 10  then 'DANA'
        when req.payment_method = 11  then 'OVO'
        when req.payment_method = 12  then 'GO_PAY'
        when req.payment_method = 13  then 'LINK_AJA'
        when req.payment_method = 14  then 'SHOPEE_PAY'
        when req.payment_method = 15  then 'PAYPAL'
        when req.payment_method = 16  then 'DEPT STORE'
        when req.payment_method = 17  then 'XENDIT CARD'
        else 'CARD' end) as payment_method,
    req.amount, auth.bank_code, auth.name, auth.account_number, req.cardless_credit_type,req.bank_code, req.payment_type,
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
    left join payment_auth_response auth on auth.external_id = req.external_id
    left join user_cards uc on uc.token_id = req.token_id
    where od.order_no = :orderId and req.status=true and auth.status in ('AUTHORIZED', 'PENDING', 'CAPTURED') 
    ORDER BY req.created_at, req.payment_method  ASC`;

    let replacements = {
        orderId: orderId,
    };

    return await db.rawQuery(query, 'SELECT', replacements);
};

const getPrescriptionById = async prescriptionId => {
    return await db.findByCondition({ id: prescriptionId }, 'UserPrescription', ['id', 'label', 'spheris_l', 'spheris_r', 'cylinder_l', 'cylinder_r', 'axis_l', 'axis_r', 'addition_l', 'addition_r', 'pupilary_distance', 'created_at', 'updated_at', 'status']);
};

const getProductDetail = async sku => {
    return product = await db.findOneByCondition({ sku: sku }, 'Products', ['name', 'retail_price']);
};

const getUserDetail = async id => {
    return user = await db.findOneByCondition({ id: id }, 'User', ['name', 'email']);
};

// const getTodayBirthdayVoucherUser = async()=>{

//     let query = `select u.email, u.id as user_id, u.name, u.dob, vd.voucher_percentage, vd.voucher_code, vd.expire_at 
//                 from users u
//                 inner join voucher_details vd 
//                    on vd.user_id = u.id and vd.voucher_tag = 'birthday'
//                 where
//                    vd.is_expired = false and
//                 EXTRACT(month from u.dob) = EXTRACT(month from current_date) and
//                 EXTRACT(day from u.dob) = EXTRACT(day from current_date)
//                 order by u.id;`;

//             return await db.rawQuery(query, 'SELECT');           
// };


module.exports = {
    getStoreAddress,
    getDeliveryAddress,
    getHtoSlot,
    getOrderDetail,
    getReferralData,
    getAppointmentDetail,
    getOrderItem,
    getOrderItemAddon,
    getPrescriptionById,
    getPaymentDetails,
    getProductDetail,
    getUserDetail,
    //getTodayBirthdayVoucherUser
};
