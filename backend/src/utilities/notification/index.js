/* -----------------------------------------------------------------------
   * @ description : Here defines all notification functions.
----------------------------------------------------------------------- */
const db = require('../database');
const config = require('config');
const moment = require('moment-timezone');
const { sendFCM, constants, utils: { getNumberFormat }, constant, errorHandler } = require('../../core');
const { appTitle } = config.get('fcm');
const whatsapp = require('../../services/whatsapp');
const Mail = require('../mail');
const PDF = require('../pdf-generator');
const Calender = require('../calendar');

const { getStoreAddress,
  getDeliveryAddress,
  getHtoSlot,
  getOrderDetail,
  getOrderItem,
  getOrderItemAddon,
  getPaymentDetails,
  getPrescriptionById,
  getProductDetail,
  getUserDetail,
  getAppointmentDetail,
  getReferralData
} = require('./orderData');
const { getMaxListeners } = require('bunyan-format');


/**************** Send multi users notification *************/
const sendMultiUserNotification = async payload => {
  const userData = await db.findByCondition({ id: payload.userIds, is_send_notifications: true }, 'User');
  const tokens = userData.reduce(async (token, object) => {
    /*********** Save notification **********/
    await db.saveData({ ...payload, user_id: object.id }, 'UserNotifications');
    /********* Get tokens accourding **********/
    let _tokens = await db.findByCondition({ user_id: object.id }, 'UserDevices', ['device_token']);
    _tokens = _tokens.reduce(
      (data, row) => {
        if (row.device_token && data.findIndex(token => token === row.device_token) === -1) {
          data.push(row.device_token);
        }
        return data;
      }, []);
    return token.concat(_tokens);
  }, []);

  sendFCM(tokens, payload.type, payload.message, {
    messageFrom: appTitle,
    type: payload.type
  });
};
/***************** Send single user notification *************/
const sendSingleUserNotification = async payload => {
  const userData = await db.findOneByCondition({ id: payload.user_id, is_send_notifications: true }, 'User', ['id']);
  if (userData) {
    /*********** Save notification **********/
    await db.saveData({ ...payload }, 'UserNotifications');
    /********* Get tokens accourding to platform **********/
    let tokens = await db.findByCondition({ user_id: payload.user_id }, 'UserDevices', ['device_token']);
    tokens = tokens.reduce(
      (data, row) => {
        if (row.device_token && data.findIndex(token => token === row.device_token) === -1) {
          data.push(row.device_token);
        }
        return data;
      }, []);
    // console.log('tokens====================>', tokens);
    sendFCM(tokens, payload.type, payload.message, {
      messageFrom: appTitle,
      type: payload.type
    });
  }
};

const purchaseNotification = async (orderId, emailsent = true, whatsappsent = true) => {

  let orderDetails = await getOrderDetail(orderId);
  let orderItem = await getOrderItem(orderId);
  let orderItemAddons = await getOrderItemAddon(orderId);
  let paymentDetails = await getPaymentDetails(orderId);

  let orderItems = [];
  let orderItemEmailAddons = [];
  let splitPaymentDetails = [];
  let productlist = '';
  let storeaddress = '';
  let useraddress = '';

  let currency_code = orderDetails[0].currency_code;

  let framePrescription = [];

  orderItem.forEach(async (item) => {
    let sizecode = item.sku.slice(6, 8);
    let size = constants.frame_sizes[`SZ${sizecode}`];

    let imagesku = `${item.sku}_S_0_U.webp`;
    if (item.product_category == 1) {
      imagesku = `${item.sku}_E_0_U.webp`;
    }


    let image = `${config.s3URL}frames/${item.sku}/${imagesku}`;
    productlist += `${item.frame_name} ${item.variant_name} ( ${size} ), `;

    let name = `${item.frame_name} ${item.variant_name}`;

    let orderItemSingle = {
      id: item.id,
      name: name,
      sku: item.sku,
      retail_price: getNumberFormat(item.retail_price, currency_code),
      quantity: item.quantity,
      size: size,
      image: image,
      category: item.product_category,
      is_warranty: item.is_warranty,
      warranty_upto: moment(orderDetails[0].created_at).add(1, 'Year').tz('Asia/Jakarta').format('dddd, Do MMMM YYYY'),
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      discount_type: item.discount_type,
      discount_note: item.discount_note,
      addon: item.addon
    };

    let prescriptionItem = {
      name: name,
      spheris_r: item.spheris_r,
      spheris_l: item.spheris_l,
      cylinder_r: item.cylinder_r,
      cylinder_l: item.cylinder_l,
      axis_r: item.axis_r,
      axis_l: item.axis_l,
      addition_r: item.addition_r,
      addition_l: item.addition_l,
      pupilary_distance: item.pupilary_distance
    };

    if (item.prescription_id != null) {
      framePrescription.push(prescriptionItem);
    }

    orderItems.push(orderItemSingle);
  });

  orderItemAddons.forEach((item) => {

    let image = `${config.s3URL}placeholder/group-7@2x.png`;
    let size = '';

    if (item.type == 'clipon') {
      if (item.sku != null) {
        let sizecode = item.sku.slice(6, 8);
        size = constants.frame_sizes[`SZ${sizecode}`];
      }
    }

    let lense_brands = constant.lense_brands;

    if (item.type == 'contactLens') {
      for (var key in lense_brands) {
        if (lense_brands.hasOwnProperty(key)) {
          if (lense_brands[key].name == item.contact_lense_brand) {
            image = lense_brands[key].image;
          }
        }
      }
    }


    productlist += `${item.type}, `;

    let singleItemPrice = item.retail_price;
    let totalPrice = (item.retail_price * item.quantity);
    let orderItemEmailAddon = {
      lense_type_name: item.lense_type_name,
      lense_type_amount: item.lense_type_amount ? getNumberFormat(item.lense_type_amount, currency_code) : 0,
      filter_type_name: item.filter_type_name,
      filter_type_amount: item.filter_type_amount ? getNumberFormat(item.filter_type_amount, currency_code) : 0,
      name: item.name,
      amount: item.amount ? getNumberFormat(item.amount, currency_code) : 0,
      accessories_name: item.accessories_name,
      accessories_amount: item.accessories_amount ? getNumberFormat(item.amount, currency_code) : 0,
      contact_lense_name: item.contact_lense_name,
      sku: item.sku,
      size: size,
      retail_price: totalPrice ? getNumberFormat(totalPrice, currency_code) : 0,
      singleItemPrice: singleItemPrice ? getNumberFormat(singleItemPrice, currency_code) : 0,
      order_item_id: item.order_item_id,
      discount_note: item.discount_note,
      discount_type: item.discount_type,
      quantity: item.quantity,
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      type: item.type,
      category_name: item.category_name,
      prescription_name: item.prescription_name,
      prescription_amount: item.prescription_amount,
      image: image,
      brand: item.brand,
      index_value: item.index_value
    };

    orderItemEmailAddons.push(orderItemEmailAddon);
  });

  orderItems.map(item => {
    let dataItem = orderItemEmailAddons.filter((index) => {
      return item.id === index.order_item_id;
    });
    item.addon = dataItem;
  });

  let name = orderDetails[0].name;
  let number = `${orderDetails[0].country_code}${orderDetails[0].mobile}`;
  let total = getNumberFormat(orderDetails[0].payment_amount, currency_code);
  let discountTotal = orderDetails[0].order_discount_amount && orderDetails[0].order_discount_amount != 0 ? getNumberFormat(orderDetails[0].order_discount_amount, currency_code) : 0;
  let orderTotal = getNumberFormat(orderDetails[0].order_amount, currency_code);
  let voucher = orderDetails[0].voucher_code;
  let date = moment(orderDetails[0].created_at).tz('Asia/Jakarta').format('dddd, Do MMMM YYYY h:mm a');
  let salesChannel = orderDetails[0].sales_channel;
  let referralAmountRedeemed = orderDetails[0].is_credit && orderDetails[0].user_credit_amount != 0 ? getNumberFormat(orderDetails[0].user_credit_amount, currency_code) : 0;
  let isReferralAmountRedeemed = orderDetails[0].is_credit;
  let eyewearPointsEarned = orderDetails[0].points || 0;
  let eyewearPointsAmountEarned = orderDetails[0].transaction_amount && orderDetails[0].transaction_amount != 0 ? getNumberFormat(orderDetails[0].transaction_amount, currency_code) : 0;
  let eyewearPointsAmountRedeemed = orderDetails[0].is_eyewear_points_credit && orderDetails[0].eyewear_points_credit != 0 ? getNumberFormat(orderDetails[0].eyewear_points_credit, currency_code) : 0;
  let isEyewearPointsRedeemed = orderDetails[0].is_eyewear_points_credit;

  let attachments = [];
  let s3OrderNo = orderId.replace(/\//g, '-');

  let template = 'delivery-purchasing';
  let template_id = constants.whtsapp_templates.purchase_delivery;

  useraddress = await getDeliveryAddress(orderDetails[0].address_id);
  let waAddress = useraddress != null ? useraddress.address_details || useraddress.address : '';


  if (orderDetails[0].store_id != '6598') {
    storeaddress = await getStoreAddress(orderDetails[0].store_id);
  } else {
    storeaddress = await getStoreAddress(6764);
  }

  let storeName = constant.store['placeholder'].name;

  if (orderDetails[0].fulfillment_type == 0) {
    template = 'pickup-purchasing';
    template_id = constants.whtsapp_templates.purchase_pickup;

    waAddress = storeaddress != null ? storeaddress.address : '';
    storeName = storeaddress != null ? storeaddress.name : '';
  }

  if (paymentDetails[0].payment_category == 1) {

    template_id = constants.whtsapp_templates.first_payment;

    if (orderDetails[0].fulfillment_type == 0) {
      template = 'first-payment-pickup-purchasing';
    }
    else {
      template = 'first-payment-delivery-purchasing';
    }
  }

  if (framePrescription.length > 0) {
    let filename = `Ereceipt_${s3OrderNo}.pdf`;
    let url = await PDF.generatePDF('prescription.ejs', { framePrescription, order_no: orderId, name, number, date, store: storeaddress.address }, filename, s3OrderNo);
    attachments.push({
      filename: filename,
      href: `${constants.bucket.product_url}${url.fileName}`, // URL of document save in the cloud.
      contentType: 'application/pdf'
    });
  }

  let body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'TIME',
      'value_text': date
    },
    {
      'key': '3',
      'value': 'FRAMES',
      'value_text': productlist.substring(0, productlist.length - 2)
    },
    {
      'key': '4',
      'value': 'PRICE',
      'value_text': total
    },
    {
      'key': '5',
      'value': 'ADDRESS',
      'value_text': waAddress
    },
  ];

  if (paymentDetails[0].payment_category == 2 || paymentDetails[0].payment_category == 1) {
    paymentDetails.forEach((item) => {
      let paymentMethod = item.payment_method;
      let paymentType = item.payment_type;
      let bankCode = item.bank_code;
      let accountNumber = item != undefined ? item.account_number : '';
      let paymentMode = '';

      if (paymentMethod === 'CASH') {
        paymentMode = paymentType && paymentType.toUpperCase();
      } else if (paymentMethod === 'CARD') {
        paymentMode = 'CARD';
      } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
        paymentMode = `VA ${bankCode && bankCode.toUpperCase()} ${accountNumber}`;
      } else if (paymentMethod === 'CARDLESS_PAYMENT') {
        paymentMode = 'KREDIVO';
      } else {
        paymentMode = paymentMethod;
      }


      let splitPaymentDetail = {
        paymentMode: paymentMode,
        paymentDate: moment(item.created_at).tz('Asia/Jakarta').format('ddd, Do MMMM YYYY h:mm a'),
        paymentAmount: item.amount ? getNumberFormat(item.amount, currency_code) : 0,
        maskedCardNumber: item.masked_card_number ? item.masked_card_number : '',
        cardType: item.card_type ? item.card_type : '',
        paymentCategory: item.payment_category,
        firstPaymentExpiry: item.payment_category == 1 ? moment(item.created_at).add(30, 'days').tz('Asia/Jakarta').format('ddd, Do MMMM YYYY') : '',
        amountRemaining: item.payment_category == 1 ? getNumberFormat((orderDetails[0].payment_amount - item.amount), currency_code) : 0
      };

      splitPaymentDetails.push(splitPaymentDetail);
    });

    if (paymentDetails[0].payment_category == 1) {
      body = [
        {
          'key': '1',
          'value': 'NAME',
          'value_text': name
        },
        {
          'key': '2',
          'value': 'FIRSTPAYMENTDATE',
          'value_text': splitPaymentDetails[0].paymentDate
        },
        {
          'key': '3',
          'value': 'FIRSTPAYMENTEXPIRY',
          'value_text': splitPaymentDetails[0].firstPaymentExpiry
        },
        {
          'key': '4',
          'value': 'TIME',
          'value_text': date
        },
        {
          'key': '5',
          'value': 'FRAMES',
          'value_text': productlist.substring(0, productlist.length - 2)
        },
        {
          'key': '6',
          'value': 'PRICE',
          'value_text': splitPaymentDetails[0].paymentAmount
        },
        {
          'key': '7',
          'value': 'PAYMENTMODE',
          'value_text': splitPaymentDetails[0].paymentMode
        },
        {
          'key': '8',
          'value': 'AMOUNTREMAINING',
          'value_text': splitPaymentDetails[0].amountRemaining
        },
      ];
    }
  }

  let paymentMethod = paymentDetails[0].payment_method;
  let paymentType = paymentDetails[0].payment_type;
  let bankCode = paymentDetails[0].bank_code;
  let accountNumber = paymentDetails[0] != undefined ? paymentDetails[0].account_number : '';
  let paymentCategory = paymentDetails[0].payment_category;
  let paymentMode = '';



  if (paymentMethod === 'CASH') {
    paymentMode = paymentType && paymentType.toUpperCase();
  } else if (paymentMethod === 'CARD') {
    paymentMode = 'CARD';
  } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
    paymentMode = `VA ${bankCode && bankCode.toUpperCase()} ${accountNumber}`;
  } else if (paymentMethod === 'CARDLESS_PAYMENT') {
    paymentMode = 'KREDIVO';
  } else {
    paymentMode = paymentMethod;
  }


  const userdata = {
    name: name,
    mobile: number,
    date: date,
    orderid: orderDetails[0].order_no,
    total: total,
    discountTotal: discountTotal,
    orderTotal: orderTotal,
    eyewearPointsAmountEarned,
    eyewearPointsEarned,
    isEyewearPointsRedeemed,
    eyewearPointsAmountRedeemed,
    isReferralAmountRedeemed,
    referralAmountRedeemed,
    voucher: voucher,
    orderItems: orderItems,
    orderItemEmailAddons: orderItemEmailAddons,
    address: useraddress != null ? useraddress.address_details || useraddress.address : '',
    store: storeaddress != null ? storeaddress.address : '',
    paymentMethod: paymentDetails[0] != undefined ? paymentDetails[0].payment_method : '',
    cardlessCreditType: paymentDetails[0] != undefined ? paymentDetails[0].cardless_credit_type : '',
    bankCode: paymentDetails[0] != undefined ? paymentDetails[0].bank_code : '',
    accountNumber: paymentDetails[0] != undefined ? paymentDetails[0].account_number : '',
    salesChannel: salesChannel,
    paymentMode: paymentMode,
    storeName: storeName,
    splitPaymentDetails: splitPaymentDetails,
    paymentCategory: paymentCategory
  };

  let orderfilename = `Order_${s3OrderNo}.pdf`;
  let orderurl = '';

  if (orderDetails[0].fulfillment_type == 0) {
    orderurl = await PDF.generatePDF('purchase_pickup.ejs', userdata, orderfilename, s3OrderNo);
  } else {
    orderurl = await PDF.generatePDF('purchase_delivery.ejs', userdata, orderfilename, s3OrderNo);
  }

  attachments.push({
    filename: orderfilename,
    href: `${constants.bucket.product_url}${orderurl.fileName}`, // URL of document save in the cloud.
    contentType: 'application/pdf'
  });
  let emailSubject = paymentCategory == 1 ? 'You\'re almost there! 🤓' : `Thanks for your order ${name}`;
  const emailData = {
    to: orderDetails[0].email,
    ...(salesChannel == 'app' && { cc: ['help@eyewear.com'] }),
    ...(salesChannel == 'app' && { bcc: ['rama@eyewear.com', 'andrew@eyewear.com'] }),
    subject: emailSubject,
    attachments: attachments
  };

  //  Send email notification for purchase
  if (emailsent) {
    sendEmailTemplate(userdata, template, emailData);
  }

  // Send WhtsApp Notification for purchase

  if (whatsappsent) {
    const auth = await whatsapp.whatsappAuth();
    await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
    if (salesChannel == 'app') {
      await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
    }
    await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_pm_no, name, template_id, body });
  } else {
    return attachments;
  }
};

const orderShippedNotification = async (orderId, emailsent = true, whatsappsent = true) => {
  let orderDetails = await getOrderDetail(orderId);
  let orderItem = await getOrderItem(orderId);
  let orderItemAddons = await getOrderItemAddon(orderId);
  let paymentDetails = await getPaymentDetails(orderId);

  let orderItems = [];
  let orderItemEmailAddons = [];
  let splitPaymentDetails = [];
  let productlist = '';
  let storeaddress = '';
  let useraddress = '';

  let currency_code = orderDetails[0].currency_code;

  let framePrescription = [];

  orderItem.forEach(async (item) => {
    let sizecode = item.sku.slice(6, 8);
    let size = constants.frame_sizes[`SZ${sizecode}`];

    let imagesku = `${item.sku}_S_0_U.webp`;
    if (item.product_category == 1) {
      imagesku = `${item.sku}_E_0_U.webp`;
    }


    let image = `${config.s3URL}frames/${item.sku}/${imagesku}`;
    productlist += `${item.frame_name} ${item.variant_name} ( ${size} ), `;

    let name = `${item.frame_name} ${item.variant_name}`;

    let orderItemSingle = {
      id: item.id,
      name: name,
      sku: item.sku,
      retail_price: getNumberFormat(item.retail_price, currency_code),
      quantity: item.quantity,
      size: size,
      image: image,
      category: item.product_category,
      is_warranty: item.is_warranty,
      warranty_upto: moment(orderDetails[0].created_at).add(1, 'Year').tz('Asia/Jakarta').format('dddd, Do MMMM YYYY'),
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      discount_type: item.discount_type,
      discount_note: item.discount_note,
      addon: item.addon
    };

    let prescriptionItem = {
      name: name,
      spheris_r: item.spheris_r,
      spheris_l: item.spheris_l,
      cylinder_r: item.cylinder_r,
      cylinder_l: item.cylinder_l,
      axis_r: item.axis_r,
      axis_l: item.axis_l,
      addition_r: item.addition_r,
      addition_l: item.addition_l,
      pupilary_distance: item.pupilary_distance
    };

    if (item.prescription_id != null) {
      framePrescription.push(prescriptionItem);
    }

    orderItems.push(orderItemSingle);
  });

  orderItemAddons.forEach((item) => {

    let image = `${config.s3URL}placeholder/group-7@2x.png`;
    let size = '';

    if (item.type == 'clipon') {
      if (item.sku != null) {
        let sizecode = item.sku.slice(6, 8);
        size = constants.frame_sizes[`SZ${sizecode}`];
      }
    }

    let lense_brands = constant.lense_brands;

    if (item.type == 'contactLens') {
      for (var key in lense_brands) {
        if (lense_brands.hasOwnProperty(key)) {
          if (lense_brands[key].name == item.contact_lense_brand) {
            image = lense_brands[key].image;
          }
        }
      }
    }

    let singleItemPrice = item.retail_price;
    let totalPrice = (item.retail_price * item.quantity);
    let orderItemEmailAddon = {
      lense_type_name: item.lense_type_name,
      lense_type_amount: item.lense_type_amount ? getNumberFormat(item.lense_type_amount, currency_code) : 0,
      filter_type_name: item.filter_type_name,
      filter_type_amount: item.filter_type_amount ? getNumberFormat(item.filter_type_amount, currency_code) : 0,
      name: item.name,
      amount: item.amount ? getNumberFormat(item.amount, currency_code) : 0,
      accessories_name: item.accessories_name,
      accessories_amount: item.accessories_amount ? getNumberFormat(item.amount, currency_code) : 0,
      contact_lense_name: item.contact_lense_name,
      sku: item.sku,
      size: size,
      retail_price: totalPrice ? getNumberFormat(totalPrice, currency_code) : 0,
      singleItemPrice: singleItemPrice ? getNumberFormat(singleItemPrice, currency_code) : 0,
      order_item_id: item.order_item_id,
      discount_note: item.discount_note,
      discount_type: item.discount_type,
      quantity: item.quantity,
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      type: item.type,
      category_name: item.category_name,
      prescription_name: item.prescription_name,
      prescription_amount: item.prescription_amount,
      image: image,
      brand: item.brand,
      index_value: item.index_value
    };

    orderItemEmailAddons.push(orderItemEmailAddon);
  });

  orderItems.map(item => {
    let dataItem = orderItemEmailAddons.filter((index) => {
      return item.id === index.order_item_id;
    });
    item.addon = dataItem;
  });
  //console.log('orderitemEmailAddon is ',orderItemEmailAddons)

  let name = orderDetails[0].name;
  let number = `${orderDetails[0].country_code}${orderDetails[0].mobile}`;
  let total = getNumberFormat(orderDetails[0].payment_amount, currency_code);
  let discountTotal = orderDetails[0].order_discount_amount && orderDetails[0].order_discount_amount != 0 ? getNumberFormat(orderDetails[0].order_discount_amount, currency_code) : 0;
  let orderTotal = getNumberFormat(orderDetails[0].order_amount, currency_code);
  let voucher = orderDetails[0].voucher_code;
  let date = moment(orderDetails[0].created_at).tz('Asia/Jakarta').format('dddd, Do MMMM YYYY h:mm a');
  let salesChannel = orderDetails[0].sales_channel;
  let referralAmountRedeemed = orderDetails[0].is_credit && orderDetails[0].user_credit_amount != 0 ? getNumberFormat(orderDetails[0].user_credit_amount, currency_code) : 0;
  let isReferralAmountRedeemed = orderDetails[0].is_credit;
  let eyewearPointsEarned = orderDetails[0].points || 0;
  let eyewearPointsAmountEarned = orderDetails[0].transaction_amount && orderDetails[0].transaction_amount != 0 ? getNumberFormat(orderDetails[0].transaction_amount, currency_code) : 0;
  let eyewearPointsAmountRedeemed = orderDetails[0].is_eyewear_points_credit && orderDetails[0].eyewear_points_credit != 0 ? getNumberFormat(orderDetails[0].eyewear_points_credit, currency_code) : 0;
  let isEyewearPointsRedeemed = orderDetails[0].is_eyewear_points_credit;
  let partnerName = orderDetails[0].delivery_partner;
  let partnerTrackingId = orderDetails[0].tracking_ref_no;

  let template = 'order-shipped';
  let template_id = constants.whtsapp_templates.order_shipped;
  useraddress = await getDeliveryAddress(orderDetails[0].address_id);


  let body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'TIME',
      'value_text': date
    },
    {
      'key': '3',
      'value': 'ORDERNO',
      'value_text': orderDetails[0].order_no
    },
    {
      'key': '4',
      'value': 'DELIVERYNO',
      'value_text': partnerTrackingId
    },
    {
      'key': '5',
      'value': 'PARTNER',
      'value_text': partnerName
    },
  ];

  if (paymentDetails[0].payment_category == 2) {
    paymentDetails.forEach((item) => {
      let paymentMethod = item.payment_method;
      let paymentType = item.payment_type;
      let bankCode = item.bank_code;
      let accountNumber = item != undefined ? item.account_number : '';

      let paymentMode = '';

      if (paymentMethod === 'CASH') {
        paymentMode = paymentType && paymentType.toUpperCase();
      } else if (paymentMethod === 'CARD') {
        paymentMode = 'CARD';
      } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
        paymentMode = `VA ${bankCode && bankCode.toUpperCase()} ${accountNumber}`;
      } else if (paymentMethod === 'CARDLESS_PAYMENT') {
        paymentMode = 'KREDIVO';
      } else {
        paymentMode = paymentMethod;
      }

      let splitPaymentDetail = {
        paymentMode: paymentMode,
        paymentDate: moment(item.created_at).tz('Asia/Jakarta').format('ddd, Do MMMM YYYY h:mm a'),
        paymentAmount: item.amount ? getNumberFormat(item.amount, currency_code) : 0,
        maskedCardNumber: item.masked_card_number ? item.masked_card_number : '',
        cardType: item.card_type ? item.card_type : '',
        paymentCategory: item.payment_category
      };

      splitPaymentDetails.push(splitPaymentDetail);
    });
  }

  let paymentMethod = paymentDetails[0].payment_method;
  let paymentType = paymentDetails[0].payment_type;
  let bankCode = paymentDetails[0].bank_code;
  let accountNumber = paymentDetails[0] != undefined ? paymentDetails[0].account_number : '';
  let paymentCategory = paymentDetails[0].payment_category;
  let paymentMode = '';


  if (paymentMethod === 'CASH') {
    paymentMode = paymentType && paymentType.toUpperCase();
  } else if (paymentMethod === 'CARD') {
    paymentMode = 'CARD';
  } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
    paymentMode = `VA ${bankCode && bankCode.toUpperCase()} ${accountNumber}`;
  } else if (paymentMethod === 'CARDLESS_PAYMENT') {
    paymentMode = 'KREDIVO';
  } else {
    paymentMode = paymentMethod;
  }


  const userdata = {
    name: name,
    mobile: number,
    date: date,
    orderid: orderDetails[0].order_no,
    total: total,
    discountTotal: discountTotal,
    orderTotal: orderTotal,
    eyewearPointsAmountEarned,
    eyewearPointsEarned,
    isEyewearPointsRedeemed,
    eyewearPointsAmountRedeemed,
    isReferralAmountRedeemed,
    referralAmountRedeemed,
    voucher: voucher,
    orderItems: orderItems,
    orderItemEmailAddons: orderItemEmailAddons,
    address: useraddress != null ? useraddress.address_details || useraddress.address : '',
    store: storeaddress != null ? storeaddress.address : '',
    paymentMethod: paymentDetails[0] != undefined ? paymentDetails[0].payment_method : '',
    cardlessCreditType: paymentDetails[0] != undefined ? paymentDetails[0].cardless_credit_type : '',
    bankCode: paymentDetails[0] != undefined ? paymentDetails[0].bank_code : '',
    accountNumber: paymentDetails[0] != undefined ? paymentDetails[0].account_number : '',
    salesChannel: salesChannel,
    paymentMode: paymentMode,
    partnerName: partnerName,
    partnerTrackingId: partnerTrackingId,
    splitPaymentDetails: splitPaymentDetails,
    paymentCategory: paymentCategory
  };



  const emailData = {
    to: orderDetails[0].email,
    ...(salesChannel == 'app' && { cc: ['help@eyewear.com'] }),
    ...(salesChannel == 'app' && { bcc: ['rama@eyewear.com', 'andrew@eyewear.com'] }),
    subject: `Hi ${name}, Your EYEWEAR order item has been shipped`,
  };

  //  Send email notification for purchase
  if (emailsent) {
    sendEmailTemplate(userdata, template, emailData);
  }

  // Send WhtsApp Notification for shipped

  if (whatsappsent) {
    const auth = await whatsapp.whatsappAuth();
    await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
    if (salesChannel == 'app') {
      await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
    }
    await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_pm_no, name, template_id, body });
  }
};

const orderReadyToPickupNotification = async (orderId, emailsent = true, whatsappsent = true) => {

  let orderDetails = await getOrderDetail(orderId);
  let orderItem = await getOrderItem(orderId);
  let orderItemAddons = await getOrderItemAddon(orderId);
  let paymentDetails = await getPaymentDetails(orderId);

  let orderItems = [];
  let orderItemEmailAddons = [];
  let splitPaymentDetails = [];
  let productlist = '';
  let storeaddress = '';
  let useraddress = '';

  let currency_code = orderDetails[0].currency_code;

  let framePrescription = [];

  orderItem.forEach(async (item) => {
    let sizecode = item.sku.slice(6, 8);
    let size = constants.frame_sizes[`SZ${sizecode}`];

    let imagesku = `${item.sku}_S_0_U.webp`;
    if (item.product_category == 1) {
      imagesku = `${item.sku}_E_0_U.webp`;
    }


    let image = `${config.s3URL}frames/${item.sku}/${imagesku}`;
    productlist += `${item.frame_name} ${item.variant_name} ( ${size} ), `;

    let name = `${item.frame_name} ${item.variant_name}`;

    let orderItemSingle = {
      id: item.id,
      name: name,
      sku: item.sku,
      retail_price: getNumberFormat(item.retail_price, currency_code),
      quantity: item.quantity,
      size: size,
      image: image,
      category: item.product_category,
      is_warranty: item.is_warranty,
      warranty_upto: moment(orderDetails[0].created_at).add(1, 'Year').tz('Asia/Jakarta').format('dddd, Do MMMM YYYY'),
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      discount_type: item.discount_type,
      discount_note: item.discount_note,
      addon: item.addon
    };

    let prescriptionItem = {
      name: name,
      spheris_r: item.spheris_r,
      spheris_l: item.spheris_l,
      cylinder_r: item.cylinder_r,
      cylinder_l: item.cylinder_l,
      axis_r: item.axis_r,
      axis_l: item.axis_l,
      addition_r: item.addition_r,
      addition_l: item.addition_l,
      pupilary_distance: item.pupilary_distance
    };

    if (item.prescription_id != null) {
      framePrescription.push(prescriptionItem);
    }

    orderItems.push(orderItemSingle);
  });


  useraddress = await getDeliveryAddress(orderDetails[0].address_id);

  if (orderDetails[0].fulfillment_type == 0) {
    storeaddress = await getStoreAddress(orderDetails[0].store_id);
  }


  let store = constant.store['placeholder'];
  if (constant.store[orderDetails[0].pick_up_store_id] !== undefined) {
    store = constant.store[orderDetails[0].pick_up_store_id];
  }


  orderItemAddons.forEach((item) => {

    let image = `${config.s3URL}placeholder/group-7@2x.png`;
    let size = '';

    if (item.type == 'clipon') {
      if (item.sku != null) {
        let sizecode = item.sku.slice(6, 8);
        size = constants.frame_sizes[`SZ${sizecode}`];
      }
    }

    let lense_brands = constant.lense_brands;

    if (item.type == 'contactLens') {
      for (var key in lense_brands) {
        if (lense_brands.hasOwnProperty(key)) {
          if (lense_brands[key].name == item.contact_lense_brand) {
            image = lense_brands[key].image;
          }
        }
      }
    }

    let singleItemPrice = item.retail_price;
    let totalPrice = (item.retail_price * item.quantity);
    let orderItemEmailAddon = {
      lense_type_name: item.lense_type_name,
      lense_type_amount: item.lense_type_amount ? getNumberFormat(item.lense_type_amount, currency_code) : 0,
      filter_type_name: item.filter_type_name,
      filter_type_amount: item.filter_type_amount ? getNumberFormat(item.filter_type_amount, currency_code) : 0,
      name: item.name,
      amount: item.amount ? getNumberFormat(item.amount, currency_code) : 0,
      accessories_name: item.accessories_name,
      accessories_amount: item.accessories_amount ? getNumberFormat(item.amount, currency_code) : 0,
      contact_lense_name: item.contact_lense_name,
      sku: item.sku,
      size: size,
      retail_price: totalPrice ? getNumberFormat(totalPrice, currency_code) : 0,
      singleItemPrice: singleItemPrice ? getNumberFormat(singleItemPrice, currency_code) : 0,
      order_item_id: item.order_item_id,
      discount_note: item.discount_note,
      discount_type: item.discount_type,
      quantity: item.quantity,
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      type: item.type,
      category_name: item.category_name,
      prescription_name: item.prescription_name,
      prescription_amount: item.prescription_amount,
      image: image,
      brand: item.brand,
      index_value: item.index_value
    };

    orderItemEmailAddons.push(orderItemEmailAddon);
  });

  orderItems.map(item => {
    let dataItem = orderItemEmailAddons.filter((index) => {
      return item.id === index.order_item_id;
    });
    item.addon = dataItem;
  });

  let name = orderDetails[0].name;
  let number = `${orderDetails[0].country_code}${orderDetails[0].mobile}`;
  let total = getNumberFormat(orderDetails[0].payment_amount, currency_code);
  let discountTotal = orderDetails[0].order_discount_amount && orderDetails[0].order_discount_amount != 0 ? getNumberFormat(orderDetails[0].order_discount_amount, currency_code) : 0;
  let orderTotal = getNumberFormat(orderDetails[0].order_amount, currency_code);
  let voucher = orderDetails[0].voucher_code;
  let date = moment(orderDetails[0].created_at).tz('Asia/Jakarta').format('dddd, Do MMMM YYYY h:mm a');
  let salesChannel = orderDetails[0].sales_channel;
  let referralAmountRedeemed = orderDetails[0].is_credit && orderDetails[0].user_credit_amount != 0 ? getNumberFormat(orderDetails[0].user_credit_amount, currency_code) : 0;
  let isReferralAmountRedeemed = orderDetails[0].is_credit;
  let eyewearPointsEarned = orderDetails[0].points || 0;
  let eyewearPointsAmountEarned = orderDetails[0].transaction_amount && orderDetails[0].transaction_amount != 0 ? getNumberFormat(orderDetails[0].transaction_amount, currency_code) : 0;
  let eyewearPointsAmountRedeemed = orderDetails[0].is_eyewear_points_credit && orderDetails[0].eyewear_points_credit != 0 ? getNumberFormat(orderDetails[0].eyewear_points_credit, currency_code) : 0;
  let isEyewearPointsRedeemed = orderDetails[0].is_eyewear_points_credit;


  let template = 'ready-to-pickup';
  let template_id = constants.whtsapp_templates.order_ready_for_pickup;



  let body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'TIME',
      'value_text': date
    },
    {
      'key': '3',
      'value': 'ORDERNO',
      'value_text': orderDetails[0].order_no
    },
    {
      'key': '4',
      'value': 'STORE',
      'value_text': storeaddress != null ? storeaddress.name : ''
    },
  ];

  if (paymentDetails[0].payment_category == 2) {
    paymentDetails.forEach((item) => {
      let paymentMethod = item.payment_method;
      let paymentType = item.payment_type;
      let bankCode = item.bank_code;
      let accountNumber = item != undefined ? item.account_number : '';

      let paymentMode = '';

      if (paymentMethod === 'CASH') {
        paymentMode = paymentType && paymentType.toUpperCase();
      } else if (paymentMethod === 'CARD') {
        paymentMode = 'CARD';
      } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
        paymentMode = `VA ${bankCode && bankCode.toUpperCase()} ${accountNumber}`;
      } else if (paymentMethod === 'CARDLESS_PAYMENT') {
        paymentMode = 'KREDIVO';
      } else {
        paymentMode = paymentMethod;
      }

      let splitPaymentDetail = {
        paymentMode: paymentMode,
        paymentDate: moment(item.created_at).tz('Asia/Jakarta').format('ddd, Do MMMM YYYY h:mm a'),
        paymentAmount: item.amount ? getNumberFormat(item.amount, currency_code) : 0,
        maskedCardNumber: item.masked_card_number ? item.masked_card_number : '',
        cardType: item.card_type ? item.card_type : '',
        paymentCategory: item.payment_category
      };

      splitPaymentDetails.push(splitPaymentDetail);
    });
  }

  let paymentMethod = paymentDetails[0].payment_method;
  let paymentType = paymentDetails[0].payment_type;
  let bankCode = paymentDetails[0].bank_code;
  let accountNumber = paymentDetails[0] != undefined ? paymentDetails[0].account_number : '';
  let paymentCategory = paymentDetails[0].payment_category;
  let paymentMode = '';


  if (paymentMethod === 'CASH') {
    paymentMode = paymentType && paymentType.toUpperCase();
  } else if (paymentMethod === 'CARD') {
    paymentMode = 'CARD';
  } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
    paymentMode = `VA ${bankCode && bankCode.toUpperCase()} ${accountNumber}`;
  } else if (paymentMethod === 'CARDLESS_PAYMENT') {
    paymentMode = 'KREDIVO';
  } else {
    paymentMode = paymentMethod;
  }


  const userdata = {
    name: name,
    mobile: number,
    date: date,
    orderid: orderDetails[0].order_no,
    total: total,
    discountTotal: discountTotal,
    orderTotal: orderTotal,
    eyewearPointsAmountEarned,
    eyewearPointsEarned,
    isEyewearPointsRedeemed,
    eyewearPointsAmountRedeemed,
    isReferralAmountRedeemed,
    referralAmountRedeemed,
    voucher: voucher,
    orderItems: orderItems,
    orderItemEmailAddons: orderItemEmailAddons,
    address: useraddress != null ? useraddress.address_details || useraddress.address : '',
    store: storeaddress != null ? storeaddress.address : '',
    paymentMethod: paymentDetails[0] != undefined ? paymentDetails[0].payment_method : '',
    cardlessCreditType: paymentDetails[0] != undefined ? paymentDetails[0].cardless_credit_type : '',
    bankCode: paymentDetails[0] != undefined ? paymentDetails[0].bank_code : '',
    accountNumber: paymentDetails[0] != undefined ? paymentDetails[0].account_number : '',
    salesChannel: salesChannel,
    paymentMode: paymentMode,
    banner: storeaddress != null ? config.s3URL + storeaddress.email_image_key : '',
    storeName: storeaddress != null ? storeaddress.name : '',
    splitPaymentDetails: splitPaymentDetails,
    paymentCategory: paymentCategory
  };



  const emailData = {
    to: orderDetails[0].email,
    ...(salesChannel == 'app' && { cc: ['help@eyewear.com'] }),
    ...(salesChannel == 'app' && { bcc: ['rama@eyewear.com', 'andrew@eyewear.com'] }),
    subject: `Hi ${name}, Your EYEWEAR order item is ready for pickup`,
  };

  //  Send email notification for purchase
  if (emailsent) {
    sendEmailTemplate(userdata, template, emailData);
  }

  // Send WhtsApp Notification for purchase



  if (whatsappsent) {
    const auth = await whatsapp.whatsappAuth();
    await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
    if (salesChannel == 'app') {
      await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
    }
    await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_pm_no, name, template_id, body });
  } else {
    return attachments;
  }
};

const paymetInstructionNotification = async (orderId, template) => {

  let orderDetails = await getOrderDetail(orderId);
  let orderItem = await getOrderItem(orderId);
  let orderItemAddons = await getOrderItemAddon(orderId);
  let paymentDetails = await getPaymentDetails(orderId);

  let orderItems = [];
  let orderItemEmailAddons = [];
  let productlist = '';
  let storeaddress = '';
  let useraddress = '';

  let currency_code = orderDetails[0].currency_code;


  let framePrescription = [];

  orderItem.forEach(async (item) => {
    let sizecode = item.sku.slice(6, 8);
    let size = constants.frame_sizes[`SZ${sizecode}`];

    let imagesku = `${item.sku}_S_0_U.webp`;
    if (item.product_category == 1) {
      imagesku = `${item.sku}_E_0_U.webp`;
    }


    let image = `${config.s3URL}frames/${item.sku}/${imagesku}`;
    productlist += `${item.frame_name} ${item.variant_name} ( ${size} ), `;

    let name = `${item.frame_name} ${item.variant_name}`;

    let orderItemSingle = {
      id: item.id,
      name: name,
      sku: item.sku,
      retail_price: getNumberFormat(item.retail_price, currency_code),
      quantity: item.quantity,
      size: size,
      image: image,
      category: item.product_category,
      is_warranty: item.is_warranty,
      warranty_upto: moment(orderDetails[0].created_at).add(1, 'Year').tz('Asia/Jakarta').format('dddd, Do MMMM YYYY'),
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      discount_type: item.discount_type,
      discount_note: item.discount_note,
      addon: item.addon
    };

    let prescriptionItem = {
      name: name,
      spheris_r: item.spheris_r,
      spheris_l: item.spheris_l,
      cylinder_r: item.cylinder_r,
      cylinder_l: item.cylinder_l,
      axis_r: item.axis_r,
      axis_l: item.axis_l,
      addition_r: item.addition_r,
      addition_l: item.addition_l,
      pupilary_distance: item.pupilary_distance
    };

    if (item.prescription_id != null) {
      framePrescription.push(prescriptionItem);
    }

    orderItems.push(orderItemSingle);
  });

  orderItemAddons.forEach((item) => {

    let image = `${config.s3URL}placeholder/group-7@2x.png`;
    let size = '';

    if (item.type == 'clipon') {
      if (item.sku != null) {
        let sizecode = item.sku.slice(6, 8);
        size = constants.frame_sizes[`SZ${sizecode}`];
      }
    }

    let lense_brands = constant.lense_brands;

    if (item.type == 'contactLens') {
      for (var key in lense_brands) {
        if (lense_brands.hasOwnProperty(key)) {
          if (lense_brands[key].name == item.contact_lense_brand) {
            image = lense_brands[key].image;
          }
        }
      }
    }

    let totalPrice = (item.retail_price * item.quantity);
    let orderItemEmailAddon = {
      lense_type_name: item.lense_type_name,
      lense_type_amount: item.lense_type_amount ? getNumberFormat(item.lense_type_amount, currency_code) : 0,
      filter_type_name: item.filter_type_name,
      filter_type_amount: item.filter_type_amount ? getNumberFormat(item.filter_type_amount, currency_code) : 0,
      name: item.name,
      amount: item.amount ? getNumberFormat(item.amount, currency_code) : 0,
      accessories_name: item.accessories_name,
      accessories_amount: item.accessories_amount ? getNumberFormat(item.amount, currency_code) : 0,
      contact_lense_name: item.contact_lense_name,
      sku: item.sku,
      size: size,
      retail_price: totalPrice ? getNumberFormat(totalPrice, currency_code) : 0,
      order_item_id: item.order_item_id,
      discount_note: item.discount_note,
      discount_type: item.discount_type,
      quantity: item.quantity,
      discount_amount: item.discount_amount ? getNumberFormat(item.discount_amount, currency_code) : 0,
      type: item.type,
      category_name: item.category_name,
      prescription_name: item.prescription_name,
      prescription_amount: item.prescription_amount,
      image: image,
      brand: item.brand,
      index_value: item.index_value
    };

    orderItemEmailAddons.push(orderItemEmailAddon);
  });

  orderItems.map(item => {
    let dataItem = orderItemEmailAddons.filter((index) => {
      return item.id === index.order_item_id;
    });
    item.addon = dataItem;
  });

  let name = orderDetails[0].name;
  let number = `${orderDetails[0].country_code}${orderDetails[0].mobile}`;
  let total = getNumberFormat(orderDetails[0].payment_amount, currency_code);
  let discountTotal = orderDetails[0].order_discount_amount && orderDetails[0].order_discount_amount != 0 ? getNumberFormat(orderDetails[0].order_discount_amount, currency_code) : 0;
  let orderTotal = getNumberFormat(orderDetails[0].order_amount, currency_code);
  let voucher = orderDetails[0].voucher_code;
  let date = moment(orderDetails[0].created_at).tz('Asia/Jakarta').format('dddd, Do MMMM YYYY h:mm a');
  let expiry = moment(orderDetails[0].created_at).add(24, 'hours').tz('Asia/Jakarta').format('dddd, Do MMMM YYYY h:mm a');
  let salesChannel = orderDetails[0].sales_channel;
  let referralAmountRedeemed = orderDetails[0].is_credit && orderDetails[0].user_credit_amount != 0 ? getNumberFormat(orderDetails[0].user_credit_amount, currency_code) : 0;
  let isReferralAmountRedeemed = orderDetails[0].is_credit;
  let eyewearPointsEarned = orderDetails[0].points || 0;
  let eyewearPointsAmountEarned = orderDetails[0].transaction_amount && orderDetails[0].transaction_amount != 0 ? getNumberFormat(orderDetails[0].transaction_amount, currency_code) : 0;
  let eyewearPointsAmountRedeemed = orderDetails[0].is_eyewear_points_credit && orderDetails[0].eyewear_points_credit != 0 ? getNumberFormat(orderDetails[0].eyewear_points_credit, currency_code) : 0;
  let isEyewearPointsRedeemed = orderDetails[0].is_eyewear_points_credit;

  useraddress = await getDeliveryAddress(orderDetails[0].address_id);
  let waAddress = useraddress != null ? useraddress.address_details || useraddress.address : '';

  if (orderDetails[0].fulfillment_type == 0) {
    storeaddress = await getStoreAddress(orderDetails[0].store_id);
    waAddress = storeaddress != null ? storeaddress.address : '';
  }

  let template_id = constants.whtsapp_templates.payment_pending;
  let accNumber = paymentDetails[0] != undefined ? paymentDetails[0].account_number : '';


  const userdata = {
    name: name,
    mobile: number,
    date: date,
    orderid: orderDetails[0].order_no,
    total: total,
    discountTotal: discountTotal,
    orderTotal: orderTotal,
    eyewearPointsAmountEarned,
    eyewearPointsEarned,
    isEyewearPointsRedeemed,
    eyewearPointsAmountRedeemed,
    isReferralAmountRedeemed,
    referralAmountRedeemed,
    voucher: voucher,
    orderItems: orderItems,
    orderItemEmailAddons: orderItemEmailAddons,
    address: useraddress != null ? useraddress.address_details || useraddress.address : '',
    store: storeaddress != null ? storeaddress.address : '',
    paymentMethod: paymentDetails[0] != undefined ? paymentDetails[0].payment_method : '',
    cardlessCreditType: paymentDetails[0] != undefined ? paymentDetails[0].cardless_credit_type : '',
    bankCode: paymentDetails[0] != undefined ? paymentDetails[0].bank_code : '',
    accountNumber: accNumber,
    salesChannel: salesChannel,
    expiry: expiry
  };


  let payment = '';
  let formattedPrice = `Rp ${total}`;


  if (template == 'bca-instruction') {
    payment = `BCA ( ${accNumber} )`;
  }
  else if (template == 'mandiri-instruction') {
    payment = `Mandiri ( ${accNumber} )`;
  }
  else {
    payment = `N/A ( ${accNumber} )`;
  }




  body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'AMOUNT',
      'value_text': formattedPrice
    },
    {
      'key': '3',
      'value': 'PAYMENT',
      'value_text': payment
    },
  ];

  // Send HTO confimation WhtsApp Notification

  const auth = await whatsapp.whatsappAuth();
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });

  const emailData = {
    to: orderDetails[0].email,
    subject: 'Please complete your payment',
  };

  //  Send email notification for instruction
  sendEmailTemplate(userdata, template, emailData);

};

function imageExists(url, callback) {
  var img = new Image();
  img.onload = function () { callback(true); };
  img.onerror = function () { callback(false); };
  img.src = url;
}

const htoNotification = async orderId => {


  let orderDetails = await getOrderDetail(orderId);
  let orderItem = await getOrderItem(orderId);

  let paymentDetails = await getPaymentDetails(orderId);

  let currency_code = orderDetails[0].currency_code;

  let orderItems = [];
  let productlist = '';

  let is_local_order = orderDetails[0].is_payment_required;
  let freeCoffee = orderDetails[0].is_offer;
  let scheduledDeliveryDate = orderDetails[0].scheduled_delivery_date;


  orderItem.forEach((item) => {
    let sizecode = item.sku.slice(6, 8);
    let size = constants.frame_sizes[`SZ${sizecode}`];

    let imagesku = `${item.sku}_S_0_U.webp`;
    if (item.product_category == 1) {
      imagesku = `${item.sku}_E_0_U.webp`;
    }

    let image = `${config.s3URL}frames/${item.sku}/${imagesku}`;
    productlist += `${item.frame_name} ${item.variant_name} ( ${size} ), `;


    let orderItem = {
      name: `${item.frame_name} ${item.variant_name}`,
      sku: item.sku,
      retail_price: getNumberFormat(orderDetails[0].retail_price, currency_code),
      quantity: item.quantity,
      size: size,
      image: image,
      category: item.product_category
    };
    orderItems.push(orderItem);
  });

  let useraddress = await getDeliveryAddress(orderDetails[0].address_id);


  let name = orderDetails[0].name;
  let number = `${orderDetails[0].country_code}${orderDetails[0].mobile}`;
  let email = orderDetails[0].email;
  let total = orderDetails[0].payment_amount != null ? getNumberFormat(orderDetails[0].payment_amount, currency_code) : '';

  let summary = `${name}, your home try-on appointment is confirmed!`;
  let template = 'outside-jakarta-hto-confirmation';

  let date = moment(scheduledDeliveryDate);
  let localdate = '';
  let dateend = '';

  let datetoshow = date.format('dddd, Do MMMM YYYY');
  let timetoshow = date.format('h:mm a');


  if (!is_local_order) {
    template = 'jakarta-hto-confirmation';
    let slottime = await getHtoSlot(orderDetails[0].slot_id);
    let appointment_date = orderDetails[0].appointment_date;
    appointment_date = moment(appointment_date).format('YYYY-MM-DD');
    appointment_date = appointment_date + ' ' + slottime.slot_start_time;

    date = moment.tz(appointment_date, 'YYYY-MM-DD h:mm A', 'Asia/Jakarta').utc();
    localdate = moment(appointment_date);

    datetoshow = moment(appointment_date).format('dddd, Do MMMM YYYY');
    timetoshow = slottime.slot_start_time;
  }

  let template_id = constants.whtsapp_templates.hto_outside_area;

  let body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'COUNT',
      'value_text': orderItems.length
    },
    {
      'key': '3',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '4',
      'value': 'ADDRESS',
      'value_text': useraddress.address_details || useraddress.address
    },
    {
      'key': '5',
      'value': 'DEPOSIT',
      'value_text': total
    },

  ];
  if (!is_local_order) {

    template_id = constants.whtsapp_templates.hto_outside_jakarta;
    if (freeCoffee) {
      template_id = constants.whtsapp_templates.hto_inside_jakarta;
    }
    body = [
      {
        'key': '1',
        'value': 'NAME',
        'value_text': name
      },
      {
        'key': '2',
        'value': 'COUNT',
        'value_text': orderItems.length
      },
      {
        'key': '3',
        'value': 'TIME',
        'value_text': localdate.format('dddd, Do MMMM YYYY h:mm a')
      },
      {
        'key': '4',
        'value': 'ADDRESS',
        'value_text': useraddress.address_details || useraddress.address
      },
    ];
  }

  // Send HTO confimation WhtsApp Notification

  const auth = await whatsapp.whatsappAuth();
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_pm_no, name, template_id, body });


  // Send HTO confimation email

  const emailData = {
    to: email,
    cc: ['hto@eyewear.com'],
    subject: summary,
    hto: true
  };

  const userdata = {
    name: name,
    mobile: number,
    orderid: orderDetails[0].order_no,
    datetoshow: datetoshow,
    timetoshow: timetoshow,
    total: getNumberFormat(orderDetails[0].total, currency_code),
    orderItems: orderItems,
    address: useraddress.address_details || useraddress.address,
    coffee: orderDetails[0].notes ? orderDetails[0].notes : '',
    paymentMethod: paymentDetails[0] != undefined ? paymentDetails[0].payment_method : '',
    cardlessCreditType: paymentDetails[0] != undefined ? paymentDetails[0].cardless_credit_type : '',
    bankCode: paymentDetails[0] != undefined ? paymentDetails[0].bank_code : '',
    accountNumber: paymentDetails[0] != undefined ? paymentDetails[0].account_number : ''
  };

  let calender = null;
  if (!is_local_order) {
    calender = Calender.getIcalObjectInstance(date, dateend, summary, '', email, name);
  }

  sendEmailTemplate(userdata, template, emailData, calender);
};

const appointmentNotification = async orderId => {

  let appointmentDetails = await getAppointmentDetail(orderId);

  let freeCoffee = appointmentDetails[0].is_offer;
  let useraddress = await getDeliveryAddress(appointmentDetails[0].address_id);


  let name = appointmentDetails[0].name;
  let number = `${appointmentDetails[0].country_code}${appointmentDetails[0].mobile}`;
  let email = appointmentDetails[0].email;

  let summary = `${name}, your home try-on appointment is confirmed!`;
  let template = 'jakarta-hto-confirmation';

  let localdate = '';
  let dateend = '';
  let datetoshow = '';
  let timetoshow = '';


  let slottime = await getHtoSlot(appointmentDetails[0].slot_id);
  let appointment_date = appointmentDetails[0].appointment_date;

  let salesChannel = appointmentDetails[0].sales_channel;

  appointment_date = moment(appointment_date).format('YYYY-MM-DD');
  appointment_date = appointment_date + ' ' + slottime.slot_start_time;

  date = moment.tz(appointment_date, 'YYYY-MM-DD h:mm A', 'Asia/Jakarta').utc();
  localdate = moment(appointment_date);

  datetoshow = moment(appointment_date).format('dddd, Do MMMM YYYY');
  timetoshow = slottime.slot_start_time;

  let template_id = constants.whtsapp_templates.hto_outside_jakarta;

  if (freeCoffee) {
    template_id = constants.whtsapp_templates.hto_inside_jakarta;
  }

  body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'COUNT',
      'value_text': '100'
    },
    {
      'key': '3',
      'value': 'TIME',
      'value_text': localdate.format('dddd, Do MMMM YYYY h:mm a')
    },
    {
      'key': '4',
      'value': 'ADDRESS',
      'value_text': useraddress.address_details || useraddress.address
    },
  ];

  // Send HTO confimation WhtsApp Notification

  const auth = await whatsapp.whatsappAuth();
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_pm_no, name, template_id, body });


  // Send HTO confimation email

  const emailData = {
    to: email,
    ...(salesChannel == 'app' && { cc: ['hto@eyewear.com'] }),
    bcc: ['rama@eyewear.com', 'andrew@eyewear.com'],
    subject: summary,
    hto: true
  };

  const userdata = {
    name: name,
    mobile: number,
    orderid: appointmentDetails[0].appointment_no,
    datetoshow: datetoshow,
    timetoshow: timetoshow,
    address: useraddress.address_details || useraddress.address,
    coffee: appointmentDetails[0].notes ? appointmentDetails[0].notes : '',
  };

  let calender = Calender.getIcalObjectInstance(date, dateend, summary, '', email, name);
  sendEmailTemplate(userdata, template, emailData, calender);
};

const welcomeNotification = async userId => {

  const user = await db.findOneByCondition({ id: userId }, 'User', ['email', 'name', 'mobile', 'country_code']);

  let name = user.name;
  let number = `${user.country_code}${user.mobile}`;

  const emailData = {
    to: user.email,
    cc: ['hello@eyewear.com'],
    subject: `Welcome to EYEWEAR, ${name}`,
  };

  const userdata = {
    name: name,
    email: user.email,
    phone: number,
  };

  let template_id = constants.whtsapp_templates.welcome_user;

  let body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    }
  ];

  // Send Welcome Email Notification
  sendEmailTemplate(userdata, 'welcome-user', emailData);

  // Send Welcome WhtsApp Notification
  const auth = await whatsapp.whatsappAuth();
  whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
};

const htoRescheduleNotification = async (orderId, olddatetoshow, oldtimetoshow) => {

  let orderDetails = await getOrderDetail(orderId);

  let name = orderDetails[0].name;
  let number = `${orderDetails[0].country_code}${orderDetails[0].mobile}`;
  let useraddress = await getDeliveryAddress(orderDetails[0].address_id);
  let slottime = await getHtoSlot(orderDetails[0].slot_id);

  let appointment_date = orderDetails[0].appointment_date;
  appointment_date = moment(appointment_date).format('YYYY-MM-DD');
  appointment_date = appointment_date + ' ' + slottime.slot_start_time;

  let date = moment.tz(appointment_date, 'YYYY-MM-DD h:mm A', 'Asia/Jakarta').utc();
  let localdate = moment(appointment_date);
  let dateend = '';

  let datetoshow = moment(appointment_date).format('dddd, Do MMMM YYYY');
  let timetoshow = slottime.slot_start_time;
  let summary = 'HTO Reschedule Confirmed';

  template_id = '3613ff99-e38c-4d2c-8539-344f67f95030';
  body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'OLDDATE',
      'value_text': `${olddatetoshow} ${oldtimetoshow}`
    },
    {
      'key': '3',
      'value': 'NEWDATE',
      'value_text': localdate.format('dddd, Do MMMM YYYY h:mm a')
    },
    {
      'key': '4',
      'value': 'ADDRESS',
      'value_text': useraddress.address_details
    },
    {
      'key': '5',
      'value': 'NEWDATE',
      'value_text': localdate.format('dddd, Do MMMM YYYY h:mm a')
    },
  ];


  const emailData = {
    to: orderDetails[0].email,
    subject: summary,
  };

  const userdata = {
    orderid: orderDetails[0].order_no,
    datetoshow: datetoshow,
    timetoshow: timetoshow,
    olddatetoshow: olddatetoshow,
    oldtimetoshow: oldtimetoshow,
    number: number,
    name: name,
    address: useraddress.address_details,
  };

  let calender = Calender.getIcalObjectInstance(date, dateend, summary, '');

  // Send Welcome Email Notification
  sendEmailTemplate(userdata, 'jakarta-hto-reschedule', emailData, calender);

  // Send HTO confimation WhtsApp Notification
  const auth = await whatsapp.whatsappAuth();
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
};

const appointmentRescheduleNotification = async (orderId, olddatetoshow, oldtimetoshow) => {

  let appointmentDetails = await getAppointmentDetail(orderId);

  let name = appointmentDetails[0].name;
  let number = `${appointmentDetails[0].country_code}${appointmentDetails[0].mobile}`;
  let email = appointmentDetails[0].email;
  let useraddress = await getDeliveryAddress(appointmentDetails[0].address_id);
  let slottime = await getHtoSlot(appointmentDetails[0].slot_id);

  let appointment_date = appointmentDetails[0].appointment_date;
  let salesChannel = appointmentDetails[0].sales_channel;

  appointment_date = moment(appointment_date).format('YYYY-MM-DD');
  appointment_date = appointment_date + ' ' + slottime.slot_start_time;

  let date = moment.tz(appointment_date, 'YYYY-MM-DD h:mm A', 'Asia/Jakarta').utc();
  let localdate = moment(appointment_date);
  let dateend = '';

  let datetoshow = moment(appointment_date).format('dddd, Do MMMM YYYY');
  let timetoshow = slottime.slot_start_time;
  let summary = `${name}, your home try-on appointment is rescheduled`;

  template_id = constants.whtsapp_templates.hto_reschedule;

  body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'NEWDATE',
      'value_text': localdate.format('dddd, Do MMMM YYYY h:mm a')
    },
    {
      'key': '3',
      'value': 'ADDRESS',
      'value_text': useraddress.address_details
    },
  ];


  const emailData = {
    to: email,
    ...(salesChannel == 'app' && { cc: ['hto@eyewear.com'] }),
    subject: summary,
  };

  const userdata = {
    orderid: appointmentDetails[0].appointment_no,
    datetoshow: datetoshow,
    timetoshow: timetoshow,
    olddatetoshow: olddatetoshow,
    oldtimetoshow: oldtimetoshow,
    number: number,
    name: name,
    address: useraddress.address_details,
  };

  let calender = Calender.getIcalObjectInstance(date, dateend, summary, '', email, name);

  // Send HTO reschedule Email Notification
  sendEmailTemplate(userdata, 'jakarta-hto-reschedule', emailData, calender);

  // Send HTO confimation WhtsApp Notification
  const auth = await whatsapp.whatsappAuth();
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_pm_no, name, template_id, body });
};

const htoReturn = async (orderId) => {

  let orderDetails = await getOrderDetail(orderId);
  let name = orderDetails[0].name;
  let number = `${orderDetails[0].country_code}${orderDetails[0].mobile}`;

  template_id = constants.whtsapp_templates.hto_return;

  body = [
    {
      'key': '1',
      'value': 'NAME',
      'value_text': name
    },
    {
      'key': '2',
      'value': 'PHONE',
      'value_text': number
    }
  ];

  // Send HTO confimation WhtsApp Notification
  const auth = await whatsapp.whatsappAuth();
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number, name, template_id, body });
  await whatsapp.sendWhtsAppMessage({ token: auth.access_token, number: constants.saturday_cs_no, name, template_id, body });
};

const wishlistNotification = async (skus, email, name) => {


  const newSkus = skus.map(item => {
    let sizecode = item.sku.slice(6, 8);
    let size = constants.frame_sizes[`SZ${sizecode}`];

    let imagesku = `${item.sku}_E_0_U.webp`;
    if (item.productcategory == 2) {
      imagesku = `${item.sku}_S_0_U.webp`;
    }
    let image = `${config.s3URL}frames/${item.sku}/${imagesku}`;

    return {
      ...item,
      retailprice: getNumberFormat(item.retailprice, item.currency_code),
      size,
      image
    };
  });

  const emailData = {
    to: email,
    subject: `Hi ${name}! Still busy with work?`
  };

  const userdata = {
    name: name,
    products: newSkus
  };

  // Send Wishlist Email Notification
  sendEmailTemplate(userdata, 'wishlist', emailData);
};

const referralCreditNotification = async (orderId) => {

  let referralData = await getReferralData(orderId);

  const { referrer_email, referrer_name, refree_name, credit_amount, closing_balance } = referralData[0];

  const emailData = {
    to: referrer_email,
    subject: ' You\'ve Just Got Referral Credit!  💰'
  };

  const userdata = {
    name: referrer_name,
    refree_name,
    credit_amount: getNumberFormat(credit_amount),
    closing_balance: getNumberFormat(closing_balance)
  };

  sendEmailTemplate(userdata, 'referral-credit', emailData);

};

const sendEmailTemplate = async (data, template, emailData, calendarObj = null) => {
  const result = await Mail.htmlFromatWithObject(
    {
      data,
    },
    template
  );
  emailData.html = result.html;
  Mail.sendMail(emailData, calendarObj, function (err, res) {
    if (err) console.log(err);
    else console.log(res);
  });
};

//purchaseNotification('STECOM/MRY2M0MIKSOL', emailsent = true, whatsappsent = true);

module.exports = {
  sendMultiUserNotification,
  sendSingleUserNotification,
  htoNotification,
  appointmentNotification,
  purchaseNotification,
  orderShippedNotification,
  orderReadyToPickupNotification,
  paymetInstructionNotification,
  welcomeNotification,
  htoRescheduleNotification,
  wishlistNotification,
  htoReturn,
  appointmentRescheduleNotification,
  referralCreditNotification
};
