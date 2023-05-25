const config = require('config');
const moment = require('moment');
const _ = require('lodash');
const db = require('../../utilities/database');
const { messages, utils, constants, errorHandler } = require('../../core');
const {getCartContactLens} = require('./contactLens');
const { orderShippedNotification } = require('../../utilities/notification');
const { addCustomerActivityLogs } = require('./logs');

let staticImagesNew = () => {
  let images =  [
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

const getOtherProducts = async (payload) => {
    const list = await db.rawQuery(
        `select c.id , c.addon_product_id, c.addon_product_sku, c.addon_item_count, p.sku, op.name, p.retail_price, c.type, c.item_discount_amount as discount_amount, c.discount_type, c.discount_note, c.created_at
          from cart_addon_items as c join products as p on p.sku = c.addon_product_sku
          inner join others_product op on p.sku = op.sku
          where c.user_id='${payload.user_id}' and category = 4 ORDER BY c.created_at ASC`,
        'SELECT'
      );
    // const result = await Promise.all(list.map(async row => {
    //     row.prescription_details = await db.findOneByCondition({ id: row.prescription_id }, 'UserPrescription',['id', 'label', 'spheris_l', 'spheris_r', 'cylinder_l', 'cylinder_r', 'axis_l', 'axis_r', 'addition_l', 'addition_r', 'pupilary_distance'  ]);
    //     return row;
    // }));
    const grand_total = list.reduce( (product_total_price, item) => {
    product_total_price += ((item.retail_price*item.addon_item_count) - item.discount_amount);
    return product_total_price;
    }, 0);
  
    return ({list, grand_total});
};

const getCart = async (user_id) => {
    const data = await db.rawQuery(
      `select c.product_id, c.is_warranty, c.packages, p.sku, p.name, p.retail_price, p.company_supply_price, p.product_tags, p.image_url_1,
      p.image_url_2, p.image_url_3, p.image_url_4, f.frame_code, f.variant_code, f.size_code, f.frame_name, f.variant_name, c.user_id, c.item_count,
      c.type, c.id, c.product_category,c.prescription_id, c.item_discount_amount as discount_amount, c.discount_type, c.discount_note, c.created_at
      from cart_items as c join products as p on p.sku = c.sku_code
      join frame_master as f on f.sku_code = p.sku
      where c.user_id='${user_id}' ORDER BY c.created_at ASC`,
      'SELECT'
    );
    const cartList = data.map(async (row) => {
      const addon_items = await db.rawQuery(
        `select c.id , c.addon_product_id, c.addon_product_sku, c.addon_item_count, c.is_sunwear, p.sku, p.name, p.retail_price,
          ls.lense_type_name, ls.lense_type_amount, ls.is_prescription, ls.prescription_name, ls.prescription_amount,
          ls.filter_type_name, ls.filter_type_amount, ls.index_value, c.type, c.item_discount_amount as discount_amount, c.discount_type, c.discount_note, c.is_sunwear
          from cart_addon_items as c join products as p on p.sku = c.addon_product_sku
          inner join lenses_detail ls on p.sku = ls.sku_code
          where c.cart_id='${row.id}'`,
        'SELECT'
      );
  
      // TODO: Store update
      const frame_sizes = await db.rawQuery(
        `select p.id as turboly_id, s.size_label, fm.sku_code, fm.frame_name from frame_master fm
        inner join products p on p.sku = fm.sku_code
        inner join product_stocks ps on ps.sku = p.sku
        inner join sizes s on s.size_code = fm.size_code
        where fm.frame_code='${row.frame_code}' and fm.variant_code='${row.variant_code}'
        and ps.quantity > 0 and ps.store_id = 6598;`,
        'SELECT'
      );
  
      const prescription_details = await db.findOneByCondition({ id: row.prescription_id }, 'UserPrescription',['id', 'label', 'spheris_l', 'spheris_r', 'cylinder_l', 'cylinder_r', 'axis_l', 'axis_r', 'addition_l', 'addition_r', 'pupilary_distance'  ]);
  
      let product_total_price = (row.retail_price*row.item_count) - row.discount_amount;
      addon_items.forEach( item => {
        product_total_price += ((item.retail_price*item.addon_item_count) - item.discount_amount);
      });
  
      if(row.is_warranty === 1){
        product_total_price += constants.warrantyPrice;
      }
      const images = await db.rawQuery (
        `select fi.image_key, fi.image_type
          from frame_images fi
          inner join frame_master fm on
            fm.frame_code = fi.frame_code and fm.variant_code = fi.variant_code
          where fm.sku_code='${row.sku}' and fi.image_category='${constants.product_category[row.product_category]}' order by fi.image_key`,
        'SELECT'
      );
      return {
        id: row.id,
        product_id: row.product_id,
        is_warranty: row.is_warranty,
        packages: row.packages,
        discount_amount: row.discount_amount,
        discount_type: row.discount_type,
        discount_note: row.discount_note,
        name: row.name,
        sku_code: row.sku,
        retail_price: row.retail_price,
        product_total_price,
        company_supply_price: row.company_supply_price,
        product_tags: row.product_tags,
        user_id: row.user_id,
        frame_code: row.frame_code,
        frame_name: row.frame_name,
        frame_size: constants.frame_sizes[row.size_code],
        frame_sizes: frame_sizes,
        variant_name: row.variant_name,
        base_url: config.s3URL,
        images: images.length > 0 ? images : staticImagesNew(),
        item_count: row.item_count,
        type: row.type,
        product_category: row.product_category,
        addon_items,
        prescription_details,
        created_at: row.created_at
      };
    });
  
    let result = await Promise.all(cartList);
    result = {
        data: {
          list: result, 
          grand_total: result.reduce((total, row) => {
              if(row.type === 1){
                  total.purchase+=row.product_total_price;
              } else {
                  total.hto+=row.product_total_price;
              }
              return total;
          },{hto: 0, purchase: 0})
        },
        clipons: await getClipOns({user_id}),   
        lensesOnly: await getLenseOnly({user_id}),
        contactLens: await getCartContactLens({user_id}),
        othersProduct: await getOtherProducts({user_id})   
    };
    return result;
};

const addCart = async (payload) => {
    let query = '';
    if(payload['type'] === 2) {
      query = `select p2.sku, p2.id as turboly_id, ps.quantity, ps.reserved from products p
        inner join products p2 on p2.sku = concat('HTO', p.sku)
        inner join product_stocks ps on p2.sku = ps.sku
        where p.sku = :sku_code and p2.active = true and ps.quantity - ps.reserved >= :item_count and ps.store_id != 6598`;
    } else {
        query = `select ps.quantity, ps.reserved
          from products as p join product_stocks as ps on p.sku = ps.sku
          where p.sku = :sku_code and active=true and ps.quantity - ps.reserved >= :item_count and ps.store_id != 6598`;
    }
    const product_stock = await db.rawQuery(
      query,
      'SELECT',
      {
        sku_code: payload.sku_code,
        item_count: Number(payload.item_count)
      }
    );
    if(product_stock && product_stock.length === 0) throw new errorHandler.customError(messages.itemOutOfStock);
    const product = await db.rawQuery(
      `select count(*) from  cart_items where user_id='${payload.user_id}' and type=${payload['type'] || 1}`,
      'SELECT'
    );
    if(payload['type'] === 2 && product[0].count >= 10) throw new errorHandler.customError(messages.cartItemExceed);
    const cart = await db.findOneByCondition(
      { product_id: payload.product_id, user_id: payload.user_id, type: payload['type'] || 1, product_category: payload['product_category'] || 1 },
      'CartItems',
      ['id', 'item_count', 'type']
    );
    if(cart && cart.type === 2) throw new errorHandler.customError(messages.alreadyInCart);
    await db.saveData(payload, 'CartItems');
    await addCustomerActivityLogs({
      user_id: payload.user_id,
      action: constants.logs_action.add_cart_items,
      created_by: payload.created_by
    });
    return await getCart(payload.user_id);
};

const getClipOns  = async (payload) => {
  const list = await db.rawQuery(
      `select c.id , c.addon_product_id, c.addon_product_sku, c.addon_item_count, c.packages, p.sku, cp.name, cp.color, cp.size, p.retail_price,
       c.type, c.item_discount_amount as discount_amount, c.discount_type, c.discount_note, c.created_at
        from cart_addon_items as c join products as p on p.sku = c.addon_product_sku
        inner join clipon cp on p.sku = cp.sku
        where c.user_id='${payload.user_id}' and category = 2 ORDER BY c.created_at ASC`,
      'SELECT'
    );

  const grand_total = list.reduce( (product_total_price, item) => {
  product_total_price += ((item.retail_price*item.addon_item_count) - item.discount_amount);
  return product_total_price;
  }, 0);

  return ({list, grand_total});
};

const getLenseOnly  = async (payload) => {
  const list = await db.rawQuery(
      `select c.id , c.addon_product_id, c.addon_product_sku, c.addon_item_count, c.is_sunwear, c.packages, p.sku, p.name, p.retail_price,
        ls.lense_type_name, ls.is_prescription, ls.prescription_name, ls.prescription_amount, c.prescription_id,
        ls.filter_type_name, ls.index_value, c.type, c.item_discount_amount as discount_amount, c.discount_type, c.discount_note, c.created_at
        from cart_addon_items as c join products as p on p.sku = c.addon_product_sku
        inner join lenses_detail ls on p.sku = ls.sku_code
        where c.cart_id ISNULL and c.user_id='${payload.user_id}' and category = 1 ORDER BY c.created_at ASC`,
      'SELECT'
    );
  const result = await Promise.all(list.map(async row => {
      row.prescription_details = await db.findOneByCondition({ id: row.prescription_id }, 'UserPrescription',['id', 'label', 'spheris_l', 'spheris_r', 'cylinder_l', 'cylinder_r', 'axis_l', 'axis_r', 'addition_l', 'addition_r', 'pupilary_distance'  ]);
      return row;
  }));
  const grand_total = result.reduce( (product_total_price, item) => {
  product_total_price += ((item.retail_price*item.addon_item_count) - item.discount_amount);
  return product_total_price;
  }, 0);

  return ({list: result, grand_total});
};

const deleteCart = async (payload) => {
  await Promise.all([
    db.deleteRecord(payload, 'CartItems'),
    db.deleteRecord({cart_id: payload.id, user_id: payload.user_id}, 'CartAddonItems')
  ]);
  return await getCart(payload.user_id);
};

const deleteCartAddon = async (payload) => {
  await db.deleteRecord(payload, 'CartAddonItems');
  return await getCart(payload.user_id);
};

const itemWarranty = async (payload) => {
  const cart = await db.findOneByCondition({id: payload.id}, 'CartItems');
  if(cart){
    await db.updateOneByCondition({ is_warranty: payload.is_warranty }, {id: payload.id}, 'CartItems');
    return await getCart(cart.user_id);
  } else {
    throw new Error('Invalid cart id');
  }
};

const formatOrderDetails = async (order) => {
  let { orderDetail, orderItems, orderItemAddons, orderPaymentDetail, orderHTOScheduleDetail, orderImages, clipons, orderChangedAddon, orderItemContactLens, orderItemOthers } = order;
  let response = {...orderDetail};
  response.base_url = config.s3URL;
  response.stock_store_id = orderDetail.stock_store_id || '';
  const orderHistory = await db.findOneByCondition({ order_no: orderDetail.order_no, status: constants.order_status.PAYMENT_CONFIRMED}, 'OrdersHistory', ['created_at']);
  response.payment_date = orderHistory ? orderHistory.created_at : null;
  response.user = await db.findOneByCondition({ id: orderDetail.user_id }, 'User', ['id', 'name', 'mobile', 'dob', 'gender']);
  response.airway_bill_no = orderDetail.airway_bill_no;
  response.delivery_partner = orderDetail.delivery_partner;

  if(orderDetail.store_id){
      const store = await db.findOneByCondition({ id: orderDetail.store_id }, 'Store', ['id','name', 'address', 'store_code', 'phone', 'lat', 'long', 'store_image_key', 'store_timing', 'is_cafe']);
      response.store = store || null;
  }

  if(orderDetail.pick_up_store_id){
      const store = await db.findOneByCondition({ id: orderDetail.pick_up_store_id }, 'Store', ['id','name', 'address', 'store_code', 'phone', 'lat', 'long', 'store_image_key', 'store_timing', 'is_cafe']);
      response.pick_up_store_id = store || null;
  }
  const replacements ={
    order_no: orderDetail.order_no
  };
  const redeemCoffee = await db.rawQuery('select rc.created_at, s.name from redeem_coffee_logs rc left join stores s on rc.store_id=s.id where (order_no = :order_no) limit 1', 'SELECT', replacements);
  if(redeemCoffee && redeemCoffee.length > 0){
    response.redeemedCoffee = {
      created_at: redeemCoffee[0].created_at,
      name: redeemCoffee[0].name
    };
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
      let frame_total_price = (item.retail_price*item.quantity) - item.discount_amount;
      if(item.is_warranty === 1){
          frame_total_price += constants.warrantyPrice;
      }
      let lense_details = addOns.map(addon => {
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
              retail_price: addon.retail_price*addon.quantity,
              quantity: addon.quantity,
              type: addon.type,
              is_sunwear: addon.is_sunwear,
              discount_amount: addon.discount_amount,
              user_credit: addon.user_credit,
              discount_note: addon.discount_note,
              discount_type: addon.discount_type,
              name: addon.name || '',
              index_value: addon.index_value || null,
              is_lens_change: addon.is_lens_change || false,
              lense_color_code: addon.lense_color_code || null
          };
          frame_total_price += (addon.retail_price*addon.quantity) - addon.discount_amount;
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
              retail_price: addon.retail_price*addon.quantity,
              quantity: addon.quantity,
              type: addon.type,
              is_sunwear: addon.is_sunwear,
              discount_amount: addon.discount_amount,
              user_credit: addon.user_credit,
              discount_note: addon.discount_note,
              discount_type: addon.discount_type,
              name: addon.name || '',
              index_value: addon.index_value || null
          };
          //frame_total_price += (addon.retail_price*addon.quantity) - addon.discount_amount;
          return frameAddon;
      });

      frame.frame_total_price = frame_total_price;
      frame.lense_details = lense_details;
      frame.changed_lense_details  = changed_lense_details;

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
          retail_price: addon.retail_price*addon.quantity,
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
          packages: addon.packages
      });
  });

  response.orderItemContactLens = orderItemContactLens.map(addon => {
    return ({
        sku_code: addon.sku_code,
        retail_price: addon.retail_price*addon.quantity,
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
        packages: addon.packages
    });
  });

  response.addOnsOnly = addOnsOnly;
  response.clipons = clipons;
  response.orderItemOthers = orderItemOthers.map(addon => {
    return ({
        sku_code: addon.sku_code,
        retail_price: addon.retail_price*addon.quantity,
        quantity: addon.quantity,
        type: addon.type,
        discount_amount: addon.discount_amount,
        user_credit: addon.user_credit,
        discount_note: addon.discount_note,
        discount_type: addon.discount_type,
        name: addon.name || '',
        packages: addon.packages
    });
  });

  return response;
};


const deleteOrder = async (payload) => {
  const order_no = payload.id.replace('-', '/');
  const updated_by = payload.updated_by;
  await Promise.all([
    db.updateOneByCondition({status: 0, order_status: constants.order_status.ORDER_CANCEL, updated_by }, {order_no}, 'OrderDetail'),
    db.saveData({
      order_no,
      status: 'order_deleted',
      source: 'store',
      created_by: payload.updated_by
  }, 'OrdersHistory')
  ]); 
  return true;
};

const getOthersProduct = async () => {
  return await db.rawQuery(
    `select op.id , op.sku, op.name, p.retail_price
      from others_product as op join products as p on p.sku = op.sku
      where op.status = 1 and p.active = true`,
    'SELECT'
  );
};

const updateOrderDelivery = async (payload) => {
  try {
    await Promise.all([
      db.updateOneByCondition(
        {scheduled_delivery_date: payload.scheduled_delivery_date, updated_by: payload.updated_by, updated_at: new Date() }, 
        {order_no: payload.order_no}, 
      'OrderDetail'),
      db.saveData({order_no: payload.order_no, status: `Delivery initiated via ${payload.delivery_partner}`, source: 'app'}, 'OrdersHistory'),
      db.saveData({
        order_no: payload.order_no, 
        delivery_partner: payload.delivery_partner,
        status: constants.delivery_status.INITIATED,
        tracking_ref_no: payload.airway_bill_no
      }, 'DeliveryPartners')
    ]);
    await orderShippedNotification(payload.order_no);
    return payload;
  } catch(error){
      console.log('Error: ', error);
      throw new Error(error.messages);
  }
};

module.exports = {
    getCart,
    addCart,
    getClipOns,
    getLenseOnly,
    deleteCart,
    deleteCartAddon,
    itemWarranty,
    formatOrderDetails,
    deleteOrder,
    getOthersProduct,
    updateOrderDelivery
};