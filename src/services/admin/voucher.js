const config = require('config');
const db = require('../../utilities/database');
const { messages, constants, errorHandler, utils, s3Upload } = require('../../core');

const addVoucher = async (payload) => {
  if(await db.findOneByCondition({voucher_code: payload.voucher_code}, 'VoucherDetails')) throw errorHandler.customError(messages.voucherExit);
  let transaction = await db.dbTransaction();
  try{
      const voucherObject = {
          ...payload,
          date_constraint: true,
          count_constraint: !!payload.max_count,
          is_expired: false,
          voucher_category: 'generic',
          updated_by: payload.created_by,
          minimum_cart_amount: payload.minimum_cart_amount || 1,
          min_cart_count: payload.min_cart_count || 1,
          term_conditions: payload.term_conditions || null,
          voucher_image_key: payload.voucher_image_key || 'assets/vouchers/referral-voucher-banner.png',
          hide: payload.avilabilty_type.includes(2) ? false : true,
          sub_title: payload.sub_title || null
      };
      if(payload.voucher_type === 1) {
          voucherObject.voucher_percentage = payload.voucher_type_value;
      } else {
          voucherObject.voucher_amount = payload.voucher_type_value;
      }
      const voucher = await db.saveData(voucherObject, 'VoucherDetails', transaction);
      if(payload.voucher_sku_mapping && payload.voucher_sku_mapping.length > 0){
          let voucherSkuObject = payload.voucher_sku_mapping.reduce((accum, row) => {
              const newList = row.sku_code.split(',').map(val => ({
                  voucher_id: voucher.id,
                  type: row.type,
                  sku_code: val,
                  created_by: payload.created_by,
                  updated_by: payload.created_by
              }));
              return accum.concat(newList);
          }, []);
          const tableName = [1,2].includes(payload.voucher_sku_mapping_type) ? 'VoucherExcludesSKU' : 'VoucherIncludesSKU';
          await db.saveMany(voucherSkuObject, tableName, transaction);
      } 
      await transaction.commit();
      return true;
  } catch(error){
      console.log('Error:', error);
      transaction.rollback();
      throw errorHandler.customError(messages.systemError);
  }
};

const getVoucher = async (payload) => {
    const limit = payload['limit'] || constants.limit;
    const offset = (payload.page - 1) * limit;
    let condition = 'voucher_category = \'generic\'';
    if(payload.search){
        condition+= ` and (voucher_title ilike '%${payload.search}%' or voucher_code ilike '%${payload.search}%')`;
    }
    if(payload.status === 'active'){
        condition+= ' and status = 1 and is_expired=false';
    } else if(payload.status === 'scheduled'){
        condition+= ` and start_at >= '${utils.getDateFormat(new Date().setHours(0,0,0))}' and status = 1 and is_expired=false`;
    } else if(payload.status === 'expired'){
        condition+= ' and is_expired=true';
    } else if(payload.status === 'inactive'){
        condition+= ' and status = 2';
    }
    if(payload.discount_category){
        condition+= ` and discount_category = '${payload.discount_category}'` ;
    }
    if(payload.discount_sub_category){
        condition+= ` and discount_sub_category = '${payload.discount_sub_category}'` ;
    }

    const query =  `SELECT id, voucher_title, voucher_code, voucher_type, discount_category, discount_sub_category, voucher_sku_mapping_type, voucher_percentage, voucher_amount, expire_at, is_expired, start_at, max_count, status, avilabilty_type 
    from voucher_details
    WHERE ${condition} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    const list = await db.rawQuery(query, 'SELECT');
    const vouchers = await await db.rawQuery(`SELECT COUNT(id)::int from voucher_details WHERE ${condition}`, 'SELECT');
    return ({list, total_rows: vouchers[0].count});
};

const fileUpload = async (payload) => {
  const data = {
      body: payload,
      public: true
  };
  try {
      return await s3Upload.handleFileUpload(data, 'voucher', process.env.NODE_ENV === 'production' ? constants.bucket.product : '');
  } catch (error) {
      throw new Error(error.message);
  }
};



const getVoucherDetail = async (payload) => {
  let voucher = await db.findOneByCondition({id: payload.id, status: 1}, 'VoucherDetails');
  voucher = voucher.toJSON();
  voucher.excludesSku = await db.findByCondition({voucher_id: voucher.id, status: 1}, 'VoucherExcludesSKU', ['id', 'type', 'sku_code']);
  voucher.includesSku = await db.findByCondition({voucher_id: voucher.id, status: 1}, 'VoucherIncludesSKU', ['id', 'type', 'sku_code']);
  voucher.base_url = process.env.NODE_ENV === 'production' ? constants.bucket.product_url : config.aws.s3URL+'/';
  return voucher;
};

const updateVoucher = async (payload) => {
  return await db.updateOneByCondition({
      ...payload,
      updated_at: new Date()
  }, {id: payload.id}, 'VoucherDetails');
};

const deleteVoucher = async (payload) => {
  return await db.updateOneByCondition({
      status: 2,
      updated_at: new Date(),
      updated_by: payload.updated_by
  }, {id: payload.id}, 'VoucherDetails');
};

const validateAdminVoucher = async (user_id, voucher_id, cartItems, cartItemAddons) => {
    let voucherDiscountAmount = 0;
    let current_date = new Date();
    let userId = user_id;
    const voucherDetails = await db.findOneByCondition({id: voucher_id, status: 1, is_expired: false}, 'VoucherDetails');
    if(!voucherDetails) {
        throw new Error('Invalid voucher code.');
    }
    voucherCode = voucherDetails.voucher_code;

    let discountIneligibleSkuQuery = 'select sku_code from voucher_exclusive_sku where status = 1';

    let userOrderQuery = `select order_no, user_id, order_amount, voucher_code, sales_channel from order_details
        where user_id = :user_id and status = 1`;
    let voucherCountQuery = 'select count(order_no) as voucher_use_count from order_details where voucher_code = :voucher_code and status = 1';

    let discountIneligibleExcludesSkuMappingQuery  = `select sku_code from voucher_excludes_sku 
        where voucher_id = :voucher_id and status = 1`;

    let discounteligibleIncludesSkuMappingQuery  = `select sku_code, type from voucher_includes_sku 
        where voucher_id = :voucher_id and status = 1`;    


    let replacements = {
        voucher_code: voucherCode,
        user_id: userId,
        voucher_id
    };

    let promiseArr = [];
    promiseArr.push(db.rawQuery(discountIneligibleSkuQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(userOrderQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(voucherCountQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(discountIneligibleExcludesSkuMappingQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(discounteligibleIncludesSkuMappingQuery, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);

    let discountIneligibleSkus = results[0];
    let userOrderResult = results[1];
    let voucherCountResult = results[2];
    let discountIneligibleExcludesSkuMapping = results[3];
    let discounteligibleIncludesSkuMapping = results[4];
    console.log('user order result---------', !userOrderResult.find(o => voucherDetails.avilabilty_type.includes(constants.avilabilty_type[o.sales_channel])));
    if(!userOrderResult.find(o => voucherDetails.avilabilty_type.includes(constants.avilabilty_type[o.sales_channel]))) {
        throw new Error('Invalid voucher code.');
    }
    let userVoucherResult = userOrderResult.filter(res => {
        return res.voucher_code == voucherCode;
    });

    // Referral voucher code additional check
    // if(voucherDetails.voucher_category == constants.voucherCategory.REFERRAL) {
    //     if(userId == voucherDetails.user_id) {
    //         throw new Error('Invalid voucher code.');
    //     }

    //     if(userDetails.registration_referral_code !== '' && userDetails.registration_referral_code !== null) {
    //         if(userDetails.registration_referral_code !== voucherCode) {
    //             throw new Error('Invalid voucher code.');
    //         }
    //     }
    // }

    // user specific voucher code additional check
    if(voucherDetails.voucher_category == constants.voucherCategory.USER) {
        if(userId !== voucherDetails.user_id) {
            throw new Error('Invalid voucher code.');
        }
    }

    // voucher max count check 
    if(voucherDetails.count_constraint == true && voucherDetails.max_count < voucherCountResult[0].voucher_use_count) {
        throw new Error('Voucher code usage has exceeded the quota limit.');
    }

    // per user max count check 
    if(voucherDetails.single_user_count_constraint == true && voucherDetails.single_user_max_count < userVoucherResult.length) {
        throw new Error('Voucher code is already redeemed.');
    }

    // cart item count check
    if(voucherDetails.max_cart_size > 1 && voucherDetails.max_cart_size < (cartItems.length+cartItemAddons.length)) {
        throw new Error(`${voucherDetails.max_cart_size} frame allowed per order for this voucher.`);
    }

    // first order check
    // if(voucherDetails.first_order == true && userOrderResult.length > 0) {
    //     throw new Error('Promo code is only applicable on first order.');
    // }

    // voucher expiry check
    if(voucherDetails.date_constraint == true && voucherDetails.expire_at < current_date) {
        throw new Error('Voucher code is expired.');
    }
    // Validate voucher types for include sku
    if(discounteligibleIncludesSkuMapping.length > 0) {
        for(includesSku of discounteligibleIncludesSkuMapping) {
            if(includesSku.type === 'frames' && cartItems.length === 0) {
                throw new Error('Voucher code is applicable for frames. Please add frame in cart.');
            } else if(includesSku.type === 'lens' && (cartItemAddons.length === 0 || cartItemAddons.findIndex(c => c.type !== 'clipon') === -1)) {
                throw new Error('Voucher code is applicable for lens. Please add lens in cart.');
            } else if(includesSku.type === 'clipons' && (cartItemAddons.length === 0 || cartItemAddons.findIndex(c => c.type === 'clipon') === -1)) {
                throw new Error('Voucher code is applicable for clipons. Please add clipons in cart.');
            }
        }
    }

    let ineligbleSkuList = [];
    let eligbleSkuList = [];
    if(voucherDetails.voucher_sku_mapping_type == 1) {
        for(sku of discountIneligibleSkus) {
            ineligbleSkuList.push(sku.sku_code);
        }
        for(sku of discountIneligibleExcludesSkuMapping) {
            ineligbleSkuList.push(sku.sku_code);
        }
    } else if (voucherDetails.voucher_sku_mapping_type == 2) {
        for(sku of discountIneligibleExcludesSkuMapping) {
            ineligbleSkuList.push(sku.sku_code);
        }
    } else if (voucherDetails.voucher_sku_mapping_type == 3) {
        for(sku of discounteligibleIncludesSkuMapping) {
            eligbleSkuList.push(sku.sku_code);
        }
    }
    
    let cartAmount = 0;
    for(cartItem of cartItems) {
        // ineligible frame list
        if(ineligbleSkuList.includes(cartItem.sku_code)) {
            throw new Error(`Voucher code is not applicable on ${cartItem.frame_name} - ${cartItem.variant_name}. Please remove from cart.`);
        } else if (eligbleSkuList.length > 0 && discounteligibleIncludesSkuMapping.findIndex(sku => sku.type === 'frames') > -1 && !eligbleSkuList.includes(cartItem.sku_code)) {
            throw new Error(`Voucher code is not applicable on ${cartItem.frame_name} - ${cartItem.variant_name}. Please remove from cart.`);
        }
        cartAmount += (cartItem.retail_price * cartItem.item_count) - cartItem.item_discount_amount;
    }

    for(cartItemAddon of cartItemAddons) {
        // ineligible addon list
        if(ineligbleSkuList.includes(cartItemAddon.sku)) {
            throw new Error(`Voucher code is not applicable on addon ${cartItemAddon.name}. Please remove from cart.`);
        } else if(cartItemAddon.type !== 'clipon' && eligbleSkuList.length > 0 && discounteligibleIncludesSkuMapping.findIndex(sku => sku.type === 'lens') > -1 && !eligbleSkuList.includes(cartItemAddon.sku)) {
            throw new Error(`Voucher code is not applicable on addon ${cartItemAddon.name}. Please remove from cart.`);
        } else if(cartItemAddon.type === 'clipon' && eligbleSkuList.length > 0 && discounteligibleIncludesSkuMapping.findIndex(sku => sku.type === 'clipons') > -1 && !eligbleSkuList.includes(cartItemAddon.sku)) {
            throw new Error(`Voucher code is not applicable on clipon ${cartItemAddon.name}. Please remove from cart.`);
        }

        cartAmount += (cartItemAddon.retail_price * cartItemAddon.addon_item_count) - cartItemAddon.item_discount_amount;
    }

    // minimum cart value
    if(cartAmount < voucherDetails.minimum_cart_amount) {
        throw new Error(`Minimum order amount required ${voucherDetails.minimum_cart_amount} .`);
    }
    
    if(voucherDetails.voucher_type == constants.voucherType.percentage) {
        voucherDiscountAmount = Math.floor((cartAmount * voucherDetails.voucher_percentage)/100);
        if(voucherDiscountAmount >= voucherDetails.voucher_max_amount) {
            voucherDiscountAmount = voucherDetails.voucher_max_amount;
        }
    } else if (voucherDetails.voucher_type == constants.voucherType.absolute) {
        voucherDiscountAmount = voucherDetails.voucher_amount;
    }
    
    let response = {
        cartAmount: cartAmount,
        voucherDiscountAmount: voucherDiscountAmount,
        discountedCartAmount: cartAmount - voucherDiscountAmount,
        isForFrames: voucherDetails.voucher_sku_mapping_type === 1 || discounteligibleIncludesSkuMapping.findIndex(sku => sku.type === 'frames') > -1,
        isForLens: voucherDetails.voucher_sku_mapping_type === 1 || discounteligibleIncludesSkuMapping.findIndex(sku => sku.type === 'lens') > -1,
        isForClipons: voucherDetails.voucher_sku_mapping_type === 1 || discounteligibleIncludesSkuMapping.findIndex(sku => sku.type === 'clipons') > -1
    };

    return response;
};

const applyDiscount = async (payload) => {
    let cartItemQuery = `select p.retail_price, fm.frame_name, fm.variant_name, fm.sku_code,
        ci.item_count, ci.item_discount_amount
        from cart_items ci
        inner join frame_master fm on fm.sku_code = ci.sku_code
        inner join products p on p.sku = ci.sku_code
        where ci.user_id = :user_id and ci.type = 1 and ci.status = true`;
    let cartAddonQuery = `select cai.cart_id, cai.addon_item_count, cai.type, p."name", p.sku, p.retail_price, p.tax_rate, cai.item_discount_amount
        from cart_addon_items cai
        inner join products p on p.sku = cai.addon_product_sku
        where cai.user_id = :user_id and cai.status = true`;

    let replacements = {
        user_id: payload.user_id
    };

    let promiseArr = [];

    promiseArr.push(db.rawQuery(cartItemQuery, 'SELECT', replacements));
    promiseArr.push(db.rawQuery(cartAddonQuery, 'SELECT', replacements));

    let results = await Promise.all(promiseArr);

    let cartItems = results[0];
    let cartItemAddons = results[1];

    let validateVoucherResponse = await validateAdminVoucher(payload.user_id, payload.voucher_id, cartItems, cartItemAddons);

    return validateVoucherResponse;
};

module.exports = {
    addVoucher,
    getVoucher,
    getVoucherDetail,
    updateVoucher,
    deleteVoucher,
    fileUpload,
    applyDiscount,
    validateAdminVoucher
};