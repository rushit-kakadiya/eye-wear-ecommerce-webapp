const config = require('config');
const { v4: uuidv4 } = require('uuid');
const db = require('../utilities/database');
const { messages, utils, errorHandler, constants } = require('../core');
const { orderShippedNotification } = require('../utilities/notification');

// const {url, pickup_url, api_key, auth_key, storeAddress} = config.sicepatExpress;
const { url, pickup_url, pickupUrl, api_key, auth_key, storeAddress } = config.sicepatExpress;


const sicepatAvialiblityCheck = async (payload) => {
    let query = `select * from sicepat_destination sd
        inner join sicapet_master_data smd
            on smd.sicapat_code = sd.destination_code
        where smd.postal_code = :zip_code and sd.status = true`;

    let replacements = {
        zip_code: payload.zip_code
    };

    let results = await db.rawQuery(query, 'SELECT', replacements);
    if(results.length == 0) {
        throw errorHandler.customError(messages.sicepatServiceUnavialable);
    }
    return results[0];
};

const getCustomerOrigin = async() => {
    try {
        let options = {
            url: `${url}/customer/origin`,
            method: 'GET',
            headers: {
                'api-key': api_key
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const generateOrder = async(payload, user) => {
    try {
        let orderAddressQuery = `
            select 
                ua.receiver_name, ua.phone_number, ua.email, ua.note,
                ua.zip_code, ua.address, ua.long, ua.lat,
                sd.subdistrict, sd.city, sd.province, sd.destination_code,
                smd.district_name,
                od.scheduled_delivery_date
            from user_address ua
            inner join order_details od
                on od.address_id = ua.id
            inner join sicapet_master_data smd
                on smd.postal_code = ua.zip_code 
            inner join sicepat_destination sd
                on sd.destination_code = smd.sicapat_code
            where od.order_no = :order_no and od.status = 1;`;

        let storeAddressQuery = `
            select 
                so.origin_code, so.origin_name, s.store_code, s.name, s.address, smd.province_name,
                smd.city_name, smd.district_name, s.zipcode, s.phone, s.long, s.lat
            from stores s
            inner join sicapet_master_data smd 
                on smd.postal_code = s.zipcode
            inner join sicepat_origin so 
                on so.origin_code = left(smd.sicapat_code, 3)
            inner join order_details od
                on od.stock_store_id = cast(s.id as varchar)
            where od.order_no = :order_no and od.status = 1;`;

        let replacements = {
            order_no: payload.order_no
        };

        let orderAddressResults = await db.rawQuery(orderAddressQuery, 'SELECT', replacements);
        let storeAddressResults = await db.rawQuery(storeAddressQuery, 'SELECT', replacements);

        if(orderAddressResults.length == 0) {
            throw errorHandler.customError(messages.invalidOrder);
        }

        if(storeAddressResults.length == 0) {
            throw errorHandler.customError(messages.invalidOrder);
        }

        let orderAddressDetails = orderAddressResults[0];
        let storeAddressDetails = storeAddressResults[0];

        let recipientDetails = {
            recipient_title: 'Mr.',
            recipient_name: orderAddressDetails.receiver_name,
            recipient_address: orderAddressDetails.address,
            recipient_province: orderAddressDetails.province,
            recipient_city: orderAddressDetails.city,
            recipient_district: orderAddressDetails.city,
            recipient_zip: orderAddressDetails.zip_code,
            recipient_phone: orderAddressDetails.phone_number,
            recipient_email: orderAddressDetails.email,
            recipient_longitude: orderAddressDetails.long,
            recipient_latitude: orderAddressDetails.lat,
            destination_code: orderAddressDetails.destination_code,
            notes: orderAddressDetails.note
        };

        let shipperDetails = {
            'origin_code': storeAddressDetails.origin_code,
            'shipper_code': storeAddressDetails.store_code,
            'shipper_name': storeAddressDetails.name,
            'shipper_address': storeAddressDetails.address,
            'shipper_province': storeAddressDetails.province_name,
            'shipper_city': storeAddressDetails.city_name,
            'shipper_district': storeAddressDetails.district_name,
            'shipper_zip': storeAddressDetails.zipcode,
            'shipper_phone': storeAddressDetails.phone,
            'shipper_longitude': storeAddressDetails.long,
            'shipper_latitude': storeAddressDetails.lat
        };

        let secondsTimestamp  = Math.round(new Date().getTime() / 1000);
        let receiptNumber = `SR${secondsTimestamp}`;
        let parcelDetails = {
            'receipt_number': receiptNumber,
            'delivery_type': 'REG',
            'parcel_category': 'Fragile',
            'parcel_content': 'Glasses',
            'parcel_qty': 1,
            'parcel_uom': 'Pcs',
            'parcel_value': 0,
            'cod_value': 0,
            'insurance_value': 0,
            'total_weight': 0.6,
            'parcel_length': 0,
            'parcel_width': 0,
            'parcel_height': 0,
        };

        let reference_number = uuidv4();
        
        let pickup_request_date = new Date();
        pickup_request_date.setDate(pickup_request_date.getDate() + 1);
        pickup_request_date.setHours(12);
        pickup_request_date.setMinutes(0);

        let data = {
            auth_key: auth_key,
            reference_number,
            pickup_request_date,
            pickup_merchant_code: '',
            pickup_merchant_name: storeAddress.name,
            sicepat_account_code:'00012787',
            pickup_address: storeAddress.address,
            pickup_city: storeAddress.city,
            pickup_merchant_phone: storeAddress.phone,
            pickup_method: 'PICKUP',
            pickup_merchant_email: storeAddress.email,
            notes: '',
            PackageList: [{
                ...recipientDetails,
                ...shipperDetails,
                ...parcelDetails
            }]
        };

        let date = new Date();      

        let resquestResponseObj = {
            user_id: user.id,
            order_no : payload.order_no,
            receipt_number: receiptNumber,
            reference_number :  reference_number,
            payload :  data,
            created_at: date,
            created_by: user.id,
            updated_at: date,
            updated_by: user.id,
        };

        await db.saveData(resquestResponseObj, 'SicepatRequestResponse');

        let options = {
            url: pickup_url,
            method: 'POST',
            headers: {
                'api-key': api_key
            },
            data
        };
        const result = await utils.axiosClient(options);

        await Promise.all([
            db.updateOneByCondition(
                { response : result.data, request_number : result.data.request_number },
                { receipt_number: receiptNumber },
                'SicepatRequestResponse'
            ),
            db.updateOneByCondition(
              {scheduled_delivery_date: orderAddressDetails.scheduled_delivery_date, updated_by: user.id, updated_at: new Date() }, 
              {order_no: payload.order_no}, 
            'OrderDetail'),
            db.saveData({order_no: payload.order_no, status: 'Delivery initiated via SICEPAT', source: 'app'}, 'OrdersHistory'),
            db.saveData({
              order_no: payload.order_no, 
              delivery_partner: 'SICEPAT',
              status: constants.delivery_status.INITIATED,
              tracking_ref_no: receiptNumber
            }, 'DeliveryPartners')
        ]);

        await orderShippedNotification(payload.order_no);

        return {
            scheduled_delivery_date: orderAddressDetails.scheduled_delivery_date,
            tracking_ref_no: receiptNumber,
            delivery_partner: 'SICEPAT',
        };
    } catch (error) {        
        console.log('Error: ', error);
        throw new Error(error.message);
    }
};

const trackOrder = async(track_no) => {
    try {
        let options = {
            url: `${url}/customer/waybill?waybill=${track_no}`,
            method: 'GET',
            headers: {
                'api-key': api_key
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const cancelOrderPickup = async(payload) => {
    try {
        let options = {
            url: 'http://pickup.sicepat.com:8087/api/partner/cancelpickup',
            method: 'POST',
            data: {
                auth_key: '02933CB5207948CDAA77E667E42FB24C',
                request_number: payload.track_no
            }
        };
        const result = await utils.axiosClient(options);
        return result.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    sicepatAvialiblityCheck,
    getCustomerOrigin,
    generateOrder,
    trackOrder,
    cancelOrderPickup
};