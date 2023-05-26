
const config = require('config');
const moment = require('moment');
const _ = require('lodash');
const db = require('../utilities/database');
const elasticsearch = require('../utilities/elasticsearch');
const { messages, utils, constants, errorHandler } = require('../core');
const { cache } = require('../middleware');

let _formatESProducts = (result) => {
  let response = [];
  _.forEach(result, (data) => {
    let product = data._source;
    let is_wishListed = false;
    let frame = {
      frame_id: product.frame_id,
      frame_name: product.frame_name,
      frame_code: product.frame_code,
      fit: product.fit,
      material: product.material,
      face_shape: product.face_shape,
      frame_shape: product.frame_shape,
      gender: product.gender,
      variants: [],
    };
    let variant = {
      variant_id: product.variant_id,
      sku_code: product.sku_code,
      turboly_id: product.turboly_id,
      variant_name: product.variant_name,
      retail_price: product.retail_price,
      tax_rate: product.tax_rate,
      description: product.description,
      last_modified: new Date(product.updated_at),
      is_wishListed,
      images: [
        { url: product.image_url_1, is_primary: true },
        { url: product.image_url_2, is_primary: false },
        { url: product.image_url_3, is_primary: false },
        { url: product.image_url_4, is_primary: false },
      ],
    };
    frame.variants.push(variant);
    response.push(frame);
  });
  return response;
};

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

let formatProducts = (product_category, frame_codes, frames, frame_images, userWishlist, userCart) => {
  let response = [];

  for (frame_code of frame_codes) {
    let frame_group = frames.filter(frame => frame.frame_code === frame_code);

    let frame = {
      frame_name: frame_group[0].frame_name,
      frame_id: frame_group[0].frame_id,
      frame_code: frame_group[0].frame_code,
      fit: frame_group[0].fit,
      material: frame_group[0].material,
      face_shape: frame_group[0].face_shape,
      frame_shape: frame_group[0].frame_shape,
      gender: frame_group[0].gender,
      frame_description: frame_group[0].frame_description,
      base_url: config.s3URL,
    };

    frame.faceShapeDetails = frame.face_shape.map(fshp => (constants['faceShapes'][fshp]));
    frame.frameShapeDetails = frame.frame_shape.map(fshp => (constants['frameShapes'][fshp]));
    frame.materialDetails = constants['material'][frame.material];

    let frame_variants = [];
    for (frame_variant of frame_group) {
      let inserted_variant = frame_variants.find(variant => variant.variant_code === frame_variant.variant_code);

      if(typeof(inserted_variant) == 'undefined') {
        let sizeVariant = {
          sku_code: frame_variant.sku_code,
          turboly_id: frame_variant.turboly_id,
          retail_price: frame_variant.retail_price,
          country_code: frame_variant.country_code,
          currency_code: frame_variant.currency_code,
          size_code: frame_variant.size_code,
          size_key: frame_variant.size_key,
          size_label: frame_variant.size_label,
          lense_width: frame_variant.lense_width,
          bridge: frame_variant.bridge,
          temple_length: frame_variant.temple_length,
          front_width: frame_variant.front_width,
          is_hto: false,
          is_wishlisted: false,
          is_hto_added: false,
        };

        if(userWishlist.find(item => item.sku_code == frame_variant.sku_code)) {
          sizeVariant.is_wishlisted = true;
        }
        if(userCart.find(item => item.sku_code == frame_variant.sku_code)) {
          sizeVariant.is_hto_added = true;
        }


        if(frame_variant.hto_sku_code == null) {
          sizeVariant.is_hto = false;
        } else if (frame_variant.hto_quantity - frame_variant.hto_reserved > 0) {
          sizeVariant.is_hto = true;
        }

        let is_wishlisted = false;
        let is_hto_added = false;

        if(userWishlist.find(item => {
          return item.frame_code == frame_variant.frame_code
            && item.variant_code == frame_variant.variant_code
            && item.product_category == product_category;
        })) {
          is_wishlisted = true;
        }

        if(userCart.find(item => {
          return item.frame_code == frame_variant.frame_code
            && item.variant_code == frame_variant.variant_code
            && item.product_category == product_category
            && item.type == 2;
        })) {
          is_hto_added = true;
        }

        let is_vto = false;
        if(product_category == 1) {
            if(frame_variant.eyewear_vto == true) {
              is_vto = true;
            }
        }
        if(product_category == 2) {
          if(frame_variant.sunwear_vto == true) {
            is_vto = true;
          }
        }

        sizeVariant.is_vto = is_vto;

        let variant = {
          variant_id: frame_variant.variant_id,
          variant_code: frame_variant.variant_code,
          variant_name: frame_variant.variant_name,
          icon_image_key: frame_variant.icon_image_key,
          sku_code: frame_variant.sku_code,
          turboly_id: frame_variant.turboly_id,
          retail_price: frame_variant.retail_price,
          country_code: frame_variant.country_code,
          currency_code: frame_variant.currency_code,
          tax_rate: frame_variant.tax_rate,
          description: frame_variant.description,
          last_modified: new Date(frame_variant.updated_at),
          is_wishlisted: is_wishlisted,
          is_hto_added: is_hto_added,
          is_hto: frame_variant.is_hto,
          top_pick: frame_variant.top_pick,
          is_vto: is_vto,
          is_sunwear: frame_variant.is_sunwear,
          product_category: product_category,
          base_url: config.s3URL,
          size_code: frame_variant.size_code,
          size_key: frame_variant.size_key,
          size_label: frame_variant.size_label,
          size_detail: {
            size_key: frame_variant.size_key,
            size_label: frame_variant.size_label,
            lense_width: frame_variant.lense_width,
            bridge: frame_variant.bridge,
            temple_length: frame_variant.temple_length,
            front_width: frame_variant.front_width
          },
          sizeVariants: [],
        };
        variant.sizeVariants.push(sizeVariant);

        let images = frame_images.filter(image => {
          return (image.frame_code == frame_variant.frame_code) && (image.variant_code == frame_variant.variant_code);
        });

        if(images.length == 0) {
          images = staticImagesNew();
        }

        let base_images = images.filter(image => (image.image_code == 'E_0_U' || image.image_code == 'S_0_U'));
        let prescription_images = images.filter(image => (image.image_code == 'E_1_U' || image.image_code == 'S_1_U'));
        let material_images = images.filter(image => (image.image_code == 'E_6_U' || image.image_code == 'S_6_U'));

        if(base_images.length == 0) {
          variant.frame_default_image_key = 'assets/image_unavail_E_0.jpg';
        } else {
          variant.frame_default_image_key = base_images[0].image_key;
        }
        if(prescription_images.length == 0) {
          variant.prescription_image_key = 'assets/image_unavail_E_1.jpg';
        } else {
          variant.prescription_image_key = prescription_images[0].image_key;
        }

        if(material_images.length == 0) {
          variant.material_image_key = 'assets/image_unavail_E_2_E_4.jpg';
        } else {
          variant.material_image_key = material_images[0].image_key;
        }

        _.remove(images, (image) => {
          return image.image_code == 'E_0_U' || image.image_code == 'S_0_U' || image.image_code == 'E_6_U' || image.image_code == 'S_6_U';
        });

        variant.images = images;

        frame_variants.push(variant);
      } else {
        let sizeVariant = {
          sku_code: frame_variant.sku_code,
          turboly_id: frame_variant.turboly_id,
          retail_price: frame_variant.retail_price,
          country_code: frame_variant.country_code,
          currency_code: frame_variant.currency_code,
          size_code: frame_variant.size_code,
          size_key: frame_variant.size_key,
          size_label: frame_variant.size_label,
          lense_width: frame_variant.lense_width,
          bridge: frame_variant.bridge,
          temple_length: frame_variant.temple_length,
          front_width: frame_variant.front_width,
          is_hto: false,
          is_wishlisted: false,
          is_hto_added: false,
        };

        if(frame_variant.hto_sku_code == null) {
          sizeVariant.is_hto = false;
        } else if (frame_variant.hto_quantity - frame_variant.hto_reserved > 0) {
          sizeVariant.is_hto = true;
        }

        if(userWishlist.find(item => item.sku_code == frame_variant.sku_code)) {
          sizeVariant.is_wishlisted = true;
        }
        if(userCart.find(item => item.sku_code == frame_variant.sku_code)) {
          sizeVariant.is_hto_added = true;
        }

        let is_vto = false;
        if(product_category == 1) {
            if(frame_variant.eyewear_vto == true) {
              is_vto = true;
            }
        }
        if(product_category == 2) {
          if(frame_variant.sunwear_vto == true) {
            is_vto = true;
          }
        }
        sizeVariant.is_vto = is_vto;

        if(is_vto) {
          inserted_variant.is_vto = is_vto;
        }

        inserted_variant.sizeVariants.push(sizeVariant);
      }
    }
    frame.variants = frame_variants;
    response.push(frame);
  }
  return response;
};

let formatProductDetails = (product_category, frame_variants, frame_images, userWishlist, userCart) => {
  let formatted_frame = {
    frame_name: frame_variants[0].frame_name,
    frame_id: frame_variants[0].frame_id,
    frame_code: frame_variants[0].frame_code,
    fit: frame_variants[0].fit,
    material: frame_variants[0].material,
    face_shape: frame_variants[0].face_shape,
    frame_shape: frame_variants[0].frame_shape,
    gender: frame_variants[0].gender,
    frame_description: frame_variants[0].frame_description,
  };

  formatted_frame.faceShapeDetails = formatted_frame.face_shape.map(fshp => (constants['faceShapes'][fshp]));
  formatted_frame.frameShapeDetails = formatted_frame.frame_shape.map(fshp => (constants['frameShapes'][fshp]));
  formatted_frame.materialDetails = constants['material'][formatted_frame.material];

  let variants = [];
  for (frame_variant of frame_variants) {
    let inserted_variant = variants.find(variant => variant.variant_code === frame_variant.variant_code);

    if(typeof(inserted_variant) == 'undefined') {
      let sizeVariant = {
        sku_code: frame_variant.sku_code,
        turboly_id: frame_variant.turboly_id,
        retail_price: frame_variant.retail_price,
        country_code: frame_variant.country_code,
        currency_code: frame_variant.currency_code,
        size_code: frame_variant.size_code,
        size_key: frame_variant.size_key,
        size_label: frame_variant.size_label,
        lense_width: frame_variant.lense_width,
        bridge: frame_variant.bridge,
        temple_length: frame_variant.temple_length,
        front_width: frame_variant.front_width,
        is_hto: false,
        is_wishlisted: false,
        is_hto_added: false,
      };

      if(frame_variant.hto_sku_code == null) {
        sizeVariant.is_hto = false;
      } else if (frame_variant.hto_quantity - frame_variant.hto_reserved > 0) {
        sizeVariant.is_hto = true;
      }

      if(userWishlist.find(item => item.sku_code == frame_variant.sku_code)) {
        sizeVariant.is_wishlisted = true;
      }
      if(userCart.find(item => item.sku_code == frame_variant.sku_code)) {
        sizeVariant.is_hto_added = true;
      }

      let is_wishlisted = false;
      let is_hto_added = false;

      if(userWishlist.find(item => {
        return item.frame_code == frame_variant.frame_code
          && item.variant_code == frame_variant.variant_code
          && item.product_category == product_category;
      })) {
        is_wishlisted = true;
      }

      if(userCart.find(item => {
        return item.frame_code == frame_variant.frame_code
          && item.variant_code == frame_variant.variant_code
          && item.product_category == product_category
          && item.type == 2;
      })) {
        is_hto_added = true;
      }

      let is_vto = false;
      if(product_category == 1) {
          if(frame_variant.eyewear_vto == true) {
            is_vto = true;
          }
      }
      if(product_category == 2) {
        if(frame_variant.sunwear_vto == true) {
          is_vto = true;
        }
      }

      sizeVariant.is_vto = is_vto;

      let variant = {
        variant_id: frame_variant.variant_id,
        variant_code: frame_variant.variant_code,
        variant_name: frame_variant.variant_name,
        icon_image_key: frame_variant.icon_image_key,
        sku_code: frame_variant.sku_code,
        turboly_id: frame_variant.turboly_id,
        retail_price: frame_variant.retail_price,
        country_code: frame_variant.country_code,
        currency_code: frame_variant.currency_code,
        tax_rate: frame_variant.tax_rate,
        description: frame_variant.description,
        last_modified: new Date(frame_variant.updated_at),
        is_wishlisted: is_wishlisted,
        is_hto_added: is_hto_added,
        is_hto: frame_variant.is_hto,
        top_pick: frame_variant.top_pick,
        is_vto: is_vto,
        is_sunwear: frame_variant.is_sunwear,
        base_url: config.s3URL,
        size_code: frame_variant.size_code,
        size_key: frame_variant.size_key,
        size_label: frame_variant.size_label,
        size_detail: {
          size_key: frame_variant.size_key,
          size_label: frame_variant.size_label,
          lense_width: frame_variant.lense_width,
          bridge: frame_variant.bridge,
          temple_length: frame_variant.temple_length,
          front_width: frame_variant.front_width
        },
        sizeVariants: [],
      };
      variant.sizeVariants.push(sizeVariant);

      let images = frame_images.filter(image => {
        return (image.frame_code == frame_variant.frame_code) && (image.variant_code == frame_variant.variant_code);
      });

      if(images.length == 0) {
        variant.images = staticImagesNew();
      }

      let base_images = images.filter(image => (image.image_code == 'E_0_U' || image.image_code == 'S_0_U'));
      let prescription_images = images.filter(image => (image.image_code == 'E_1_U' || image.image_code == 'S_1_U'));
      let material_images = images.filter(image => (image.image_code == 'E_6_U' || image.image_code == 'S_6_U'));

      if(base_images.length == 0) {
        variant.frame_default_image_key = 'assets/image_unavail_E_0.jpg';
      } else {
        variant.frame_default_image_key = base_images[0].image_key;
      }
      if(prescription_images.length == 0) {
        variant.prescription_image_key = 'assets/image_unavail_E_1.jpg';
      } else {
        variant.prescription_image_key = prescription_images[0].image_key;
      }

      if(material_images.length == 0) {
        variant.material_image_key = 'assets/image_unavail_E_2_E_4.jpg';
      } else {
        variant.material_image_key = material_images[0].image_key;
      }

      _.remove(images, (image) => {
        return image.image_code == 'E_0_U' || image.image_code == 'S_0_U' || image.image_code == 'E_6_U' || image.image_code == 'S_6_U';
      });

      variant.images = images;

      variants.push(variant);
    } else {
      let sizeVariant = {
        sku_code: frame_variant.sku_code,
        turboly_id: frame_variant.turboly_id,
        retail_price: frame_variant.retail_price,
        country_code: frame_variant.country_code,
        currency_code: frame_variant.currency_code,
        size_code: frame_variant.size_code,
        size_key: frame_variant.size_key,
        size_label: frame_variant.size_label,
        lense_width: frame_variant.lense_width,
        bridge: frame_variant.bridge,
        temple_length: frame_variant.temple_length,
        front_width: frame_variant.front_width,
        is_hto: false,
        is_wishlisted: false,
        is_hto_added: false
      };

      if(frame_variant.hto_sku_code == null) {
        sizeVariant.is_hto = false;
      } else if (frame_variant.hto_quantity - frame_variant.hto_reserved > 0) {
        sizeVariant.is_hto = true;
      }

      if(userWishlist.find(item => item.sku_code == frame_variant.sku_code)) {
        sizeVariant.is_wishlisted = true;
      }
      if(userCart.find(item => item.sku_code == frame_variant.sku_code)) {
        sizeVariant.is_hto_added = true;
      }

      let is_vto = false;
      if(product_category == 1) {
          if(frame_variant.eyewear_vto == true) {
            is_vto = true;
          }
      }
      if(product_category == 2) {
        if(frame_variant.sunwear_vto == true) {
          is_vto = true;
        }
      }

      sizeVariant.is_vto = is_vto;

      if(is_vto) {
        inserted_variant.is_vto = is_vto;
      }

      inserted_variant.sizeVariants.push(sizeVariant);
    }
  }
  formatted_frame.variants = variants;
  return formatted_frame;
};

const addProduct = async () => {
  const data = await utils.apiClient({
    url: config.turboly.baseUrl,
    headers: {
      'X-AUTH-EMAIL': config.turboly.authEmail,
      'X-AUTH-TOKEN': config.turboly.authToken,
    },
    method: 'GET',
  });
  return data;
  //return await db.saveMany(data.products, 'Products');
};

const getProducts = async (payload, user = {}) => {
  const offset = (payload.page - 1) * constants.limit;

  let replacements = {
    is_sunwear: [true],
    offset,
    limit: constants.limit,
    store_id: payload.store_id,
    image_category: constants.product_category[payload.product_category],
    product_category: payload.product_category,
    country_code: payload.country_code
  };

  if (constants.product_category[payload.product_category] == constants.product_category[1] ) {
    replacements.is_sunwear.push(false);
  }

  let frameCodeQuery = '';
  let frameCountQuery = '';
  let frameQuery = '';

  frameCodeQuery = `select fm.frame_code
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = fm.sku_code
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0
    and ps.store_id = :store_id and fm.is_sunwear in (:is_sunwear) and pip.country_code = :country_code
    group by fm.frame_code, fm.frame_rank
    order by fm.frame_rank desc
    limit :limit offset :offset`;

  frameCountQuery = `select count(distinct(fm.frame_code)) as total_frames
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0
    and ps.store_id = :store_id and fm.is_sunwear in (:is_sunwear)`;

  frameQuery = `select fm.frame_code, fm.frame_id, fm.frame_name, fm.fit, fm.material, fm.face_shape,
    fm.frame_shape, fm.gender, fm.frame_description,
    fm.size_code, fm.lense_width, fm.bridge, fm.temple_length, fm.front_width, fm.size_key, fm.size_label,
    fm.variant_id, fm.variant_code, fm.variant_name, fm.icon_image_key,
    fm.sku_code, fm.hto_sku_code, fm.is_hto, fm.top_pick, fm.eyewear_vto, fm.sunwear_vto, fm.is_sunwear,
    p.id as turboly_id, p.tax_rate, p.description, p.updated_at,
    pip.retail_price, pip.country_code, pip.currency_code
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = fm.sku_code
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0
    and ps.store_id = :store_id and pip.country_code = :country_code
    and fm.is_sunwear in (:is_sunwear) and fm.frame_code in (:frame_codes)
    order by fm.frame_rank desc, fm.variant_rank desc, fm.size_code asc`;

  let frameImageQuery = `select fi.sku_code, fi.image_key, fi.image_category, fi.image_type, fi.image_code,
    fi.frame_code, fi.variant_code
    from frame_images fi
    where fi.image_category = (:image_category) and fi.frame_code in (:frame_codes) order by fi.image_order_key`;

  let wishListQuery = `select product_id, product_category, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from user_wishlists uw
    inner join products p on p.id = uw.product_id
    inner join frame_master fm on fm.sku_code = p.sku where user_id = :user_id`;
  let cartQuery  = `select product_id, product_category, type, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from cart_items ci
    inner join products p on p.id = ci.product_id
    inner join frame_master fm on fm.sku_code = p.sku
    where user_id = :user_id`;

  let promiseArr = [];
  promiseArr.push(db.rawQuery(frameCodeQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(frameCountQuery, 'SELECT', replacements));

  const frameResults = await Promise.all(promiseArr);

  const frameCodes = frameResults[0];
  const frameCount = frameResults[1];

  const pages = Math.ceil(frameCount[0].total_frames/constants.limit);

  let response = [];

  if(frameCodes.length != 0) {
    let frame_codes = frameCodes.map(frameCode => (frameCode.frame_code));
    replacements.frame_codes = frame_codes;

    if (!_.isEmpty(user)) {
      replacements.user_id = user.id;
    } else {
      replacements.user_id = null;
    }

    let promiseArr1 = [];
    promiseArr1.push(db.rawQuery(frameQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(frameImageQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(wishListQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(cartQuery, 'SELECT', replacements));

    const results = await Promise.all(promiseArr1);

    let frames = results[0];
    let frameImages = results[1];
    let userWishlist = results[2];
    let userCart = results[3];

    response = formatProducts(payload.product_category, frame_codes, frames, frameImages, userWishlist, userCart);
  }

  return {
    pages,
    products: response,
    currentPage: payload.page
  };
};

const filterProducts = async (payload, user = {}) => {
  const offset = (payload.page - 1) * constants.limit;

  let frameCodeQuery = '';
  let frameCountQuery = '';
  let frameQuery = '';

  frameCodeQuery = `select fm.frame_code
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = fm.sku_code
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0
    and ps.store_id = :store_id and fm.is_sunwear in (:is_sunwear) and pip.country_code = :country_code`;

  frameCountQuery = `select count(distinct(fm.frame_code)) as total_frames
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = fm.sku_code
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0
    and ps.store_id = :store_id and fm.is_sunwear in (:is_sunwear) and pip.country_code = :country_code`;

  frameQuery = `select fm.frame_id, fm.frame_code, fm.frame_name, fm.fit, fm.material, fm.face_shape,
    fm.frame_shape, fm.gender, fm.frame_description,
    fm.size_code, fm.lense_width, fm.bridge, fm.temple_length, fm.front_width, fm.size_key, fm.size_label,
    fm.variant_id, fm.variant_code, fm.variant_name, fm.icon_image_key,
    fm.sku_code, fm.hto_sku_code, fm.is_hto, fm.top_pick, fm.eyewear_vto, fm.sunwear_vto, fm.is_sunwear,
    p.id as turboly_id, p.tax_rate, p.description, p.updated_at,
    pip.retail_price, pip.country_code, pip.currency_code
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = p.sku
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0
    and ps.store_id = :store_id and pip.country_code = :country_code
    and fm.is_sunwear in (:is_sunwear) and fm.frame_code in (:frame_codes)`;

  let frameImageQuery = `select fi.sku_code, fi.image_key, fi.image_category, fi.image_type, fi.image_code,
    fi.frame_code, fi.variant_code
    from frame_images fi
    where fi.image_category = (:image_category) and fi.frame_code in (:frame_codes) order by fi.image_order_key`;

  let wishListQuery = `select product_id, product_category, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from user_wishlists uw
    inner join products p on p.id = uw.product_id
    inner join frame_master fm on fm.sku_code = p.sku where user_id = :user_id`;
  let cartQuery  = `select product_id, product_category, type, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from cart_items ci
    inner join products p on p.id = ci.product_id
    inner join frame_master fm on fm.sku_code = p.sku
    where user_id = :user_id`;

  let replacements = {
    is_sunwear: [true],
    offset,
    limit: constants.limit,
    store_id: payload.store_id,
    image_category: constants.product_category[payload.product_category],
    product_category: payload.product_category,
    country_code: payload.country_code
  };

  if (constants.product_category[payload.product_category] == constants.product_category[1] ) {
    replacements.is_sunwear.push(false);
  }

  let conditions = '';
  let group_by = '';
  let order_by = '';
  let limit = ' limit :limit offset :offset';

  if (!_.isEmpty(payload.fit)) {
    conditions += ' and fm.fit in (:fit)';
    replacements.fit = payload.fit;
  }

  if (!_.isEmpty(payload.frame_shape)) {
    let str = '';
    _.forEach(payload.frame_shape, (shp) => {
      str += `'${shp}',`;
    });
    str = str.slice(0, -1);
    conditions += ` and (fm.frame_shape && ARRAY[${str}]::varchar[])`;
  }

  if (!_.isEmpty(payload.material)) {
    conditions += ' and fm.material in (:material)';
    replacements.material = payload.material;
  }

  if (!_.isEmpty(payload.color)) {
    let str = '';
    _.forEach(payload.color, (clr) => {
      str += `'${clr}',`;
    });
    str = str.slice(0, -1);
    conditions += ` and (fm.variant_color_group && ARRAY[${str}]::varchar[])`;
  }

  if (!_.isEmpty(payload.face_shape)) {
    let str = '';
    _.forEach(payload.face_shape, (shp) => {
      str += `'${shp}',`;
    });
    str = str.slice(0, -1);
    conditions += ` and (fm.face_shape && ARRAY[${str}]::varchar[])`;
  }

  if (!_.isEmpty(payload.gender)) {
    conditions += ' and fm.gender in (:gender)';
    if (!_.includes(payload.gender, 'unisex')) {
      payload.gender.push('unisex');
    }
    replacements.gender = payload.gender;
  }

  if (!_.isEmpty(payload.prices)) {
    let priceFilters = constants.priceFilters[payload.country_code];
    if(_.isUndefined(priceFilters)) {
      throw new Error('Invalid request');
    }
    let str = '';
    _.forEach(payload.prices, (priceFilterKey) => {
      let priceFilter = _.find(priceFilters, (filter) => {
        return filter.key == priceFilterKey;
      });
      if(_.isUndefined(priceFilters)) {
        throw new Error('Invalid request');
      }
      str += ` (pip.retail_price between ${priceFilter.min_price} and ${priceFilter.max_price}) or`;
    });
    str = str.slice(0, -2);
    conditions += ` and (${str})`;
  }

  if (!_.isEmpty(user)) {
    replacements.user_id = user.id;
  } else {
    replacements.user_id = null;
  }

  if (payload.sort_by.key === 'price') {
    order_by = ` order by max(pip.retail_price) ${payload.sort_by.order}, max(fm.frame_rank) desc`;
    frame_order_by = ` order by pip.retail_price ${payload.sort_by.order}, (fm.frame_rank, fm.variant_rank) desc`;
    group_by = ' group by fm.frame_code';
  } else if (payload.sort_by.key === 'frame_name') {
    order_by = ` order by max(fm.frame_name) ${payload.sort_by.order}, max(fm.frame_rank) desc`;
    frame_order_by = ` order by fm.frame_name ${payload.sort_by.order}, (fm.frame_rank, fm.variant_rank) desc`;
    group_by = ' group by fm.frame_code';
  } else if (payload.sort_by.key === 'new_arrival') {
    order_by = ' order by max(fm.created_at) desc, max(fm.frame_rank) desc';
    frame_order_by = ' order by (fm.frame_rank, fm.variant_rank) desc';
    group_by = ' group by fm.frame_code';
  } else if (payload.sort_by.key === 'bestseller') {
    // conditions += ' and fm.top_pick = true';
    order_by = ' order by (max(cast(fm.top_pick as int)), max(fm.frame_rank)) desc';
    frame_order_by = ' order by (fm.frame_rank, fm.variant_rank) desc';
    group_by = ' group by fm.frame_code';
  } else if (payload.sort_by.key === 'rank')  {
    order_by = ' order by max(fm.frame_rank) desc';
    frame_order_by = ' order by (fm.frame_rank, fm.variant_rank) desc';
    group_by = ' group by fm.frame_code';
  } else {
    order_by = ' order by max(fm.frame_rank) desc';
    frame_order_by = ' order by (fm.frame_rank, fm.variant_rank) desc';
    group_by = ' group by fm.frame_code';
  }

  frameCodeQuery += conditions;
  frameCountQuery += conditions;
  frameQuery += conditions;

  frameCodeQuery  += group_by + order_by + limit;
  frameQuery += frame_order_by;

  let promiseArr = [];
  promiseArr.push(db.rawQuery(frameCodeQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(frameCountQuery, 'SELECT', replacements));

  const frameResults = await Promise.all(promiseArr);

  const frameCodes = frameResults[0];
  const frameCount = frameResults[1];

  const pages = Math.ceil(frameCount[0].total_frames/constants.limit);

  let response = [];

  if(frameCodes.length != 0) {
    let frame_codes = frameCodes.map(frameCode => (frameCode.frame_code));
    replacements.frame_codes = frame_codes;

    if (!_.isEmpty(user)) {
      replacements.user_id = user.id;
    } else {
      replacements.user_id = null;
    }

    let promiseArr1 = [];
    promiseArr1.push(db.rawQuery(frameQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(frameImageQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(wishListQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(cartQuery, 'SELECT', replacements));

    const results = await Promise.all(promiseArr1);

    let frames = results[0];
    let frameImages = results[1];
    let userWishlist = results[2];
    let userCart = results[3];

    response = formatProducts(payload.product_category, frame_codes, frames, frameImages, userWishlist, userCart);
  }

  return {
    pages,
    products: response,
    currentPage: payload.page
  };
};

const filterProductsCount = async (payload) => {
  let query = `select count(distinct(fm.frame_code)) as product_count
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = fm.sku_code
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0 and fm.is_sunwear in (:is_sunwear) and pip.country_code = :country_code
    and ps.store_id = :store_id`;

  let conditions = '';
  let replacements = {
    is_sunwear: [true],
    store_id: payload.store_id,
    country_code: payload.country_code
  };

  if (constants.product_category[payload.product_category] == constants.product_category[1] ) {
    replacements.is_sunwear.push(false);
  }

  if (!_.isEmpty(payload.fit)) {
    conditions += ' and fm.fit in (:fit)';
    replacements.fit = payload.fit;
  }

  if (!_.isEmpty(payload.frame_shape)) {
    let str = '';
    _.forEach(payload.frame_shape, (shp) => {
      str += `'${shp}',`;
    });
    str = str.slice(0, -1);
    conditions += ` and (fm.frame_shape && ARRAY[${str}]::varchar[])`;
  }

  if (!_.isEmpty(payload.material)) {
    conditions += ' and fm.material in (:material)';
    replacements.material = payload.material;
  }

  if (!_.isEmpty(payload.color)) {
    let str = '';
    _.forEach(payload.color, (clr) => {
      str += `'${clr}',`;
    });
    str = str.slice(0, -1);
    conditions += ` and (fm.variant_color_group && ARRAY[${str}]::varchar[])`;
  }

  if (!_.isEmpty(payload.face_shape)) {
    let str = '';
    _.forEach(payload.face_shape, (shp) => {
      str += `'${shp}',`;
    });
    str = str.slice(0, -1);
    conditions += ` and (fm.face_shape && ARRAY[${str}]::varchar[])`;
  }

  if (!_.isEmpty(payload.gender)) {
    conditions += ' and fm.gender in (:gender)';
    if (!_.includes(payload.gender, 'unisex')) {
      payload.gender.push('unisex');
    }
    replacements.gender = payload.gender;
  }

  if (!_.isEmpty(payload.prices)) {
    let priceFilters = constants.priceFilters[payload.country_code];
    if(_.isUndefined(priceFilters)) {
      throw new Error('Invalid request');
    }
    let str = '';
    _.forEach(payload.prices, (priceFilterKey) => {
      let priceFilter = _.find(priceFilters, (filter) => {
        return filter.key == priceFilterKey;
      });
      if(_.isUndefined(priceFilters)) {
        throw new Error('Invalid request');
      }
      str += ` (pip.retail_price between ${priceFilter.min_price} and ${priceFilter.max_price}) or`;
    });
    str = str.slice(0, -2);
    conditions += ` and (${str})`;
  }

  query += conditions;
  const result = await db.rawQuery(query, 'SELECT', replacements);
  return result[0];
};

const getSKUFrames = async (frame_codes, sku_codes, store_id, country_code, user_id = null, sunwear = false) => {
  let frameQuery = `select fm.frame_id, fm.frame_code, fm.frame_name, fm.fit, fm.material, fm.face_shape,
    fm.frame_shape, fm.gender, fm.frame_description,
    fm.size_code, fm.lense_width, fm.bridge, fm.temple_length, fm.front_width, fm.size_key, fm.size_label,
    fm.variant_id, fm.variant_code, fm.variant_name, fm.icon_image_key,
    fm.sku_code, fm.hto_sku_code, fm.is_hto, fm.top_pick, fm.eyewear_vto, fm.sunwear_vto, fm.is_sunwear,
    p.id as turboly_id, p.tax_rate, p.description, p.updated_at,
    pip.retail_price, pip.country_code, pip.currency_code
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = p.sku
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and ps.quantity - ps.reserved > 0
    and ps.store_id = :store_id and pip.country_code = :country_code
    and fm.is_sunwear in (:is_sunwear) and fm.sku_code in (:sku_codes)
    order by (fm.frame_rank, fm.variant_rank) desc`;

  let frameImageQuery = `select fi.sku_code, fi.image_key, fi.image_category, fi.image_type, fi.image_code,
    fi.frame_code, fi.variant_code
    from frame_images fi
    where fi.image_category = (:image_category) and fi.frame_code in (:frame_codes) order by fi.image_order_key`;

  let wishListQuery = `select product_id, product_category, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from user_wishlists uw
    inner join products p on p.id = uw.product_id
    inner join frame_master fm on fm.sku_code = p.sku where user_id = :user_id`;

  let cartQuery  = `select product_id, product_category, type, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from cart_items ci
    inner join products p on p.id = ci.product_id
    inner join frame_master fm on fm.sku_code = p.sku
    where user_id = :user_id`;

  let is_sunwear = [true];
  let product_category = 1;
  let image_category = constants.product_category[1];

  if(!sunwear) {
    is_sunwear.push(false);
  } else {
    product_category = 2;
    image_category = constants.product_category[2];
  }

  let replacements = {
    is_sunwear,
    frame_codes,
    sku_codes,
    store_id,
    product_category,
    image_category,
    country_code,
    user_id: user_id
  };
  

  let promiseArr = [];
  promiseArr.push(db.rawQuery(frameQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(frameImageQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(wishListQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(cartQuery, 'SELECT', replacements));

  const results = await Promise.all(promiseArr);
  let frames = results[0];
  let frameImages = results[1];
  let userWishlist = results[2];
  let userCart = results[3];

  let response = [];
  if(frames.length > 0) {
    response = formatProducts(product_category, frame_codes, frames, frameImages, userWishlist, userCart);
  }

  return response;
};

const getFilters = async (payload) => {
  let defaultPriceFilters = constants.priceFilters.ID;
  let priceFilters = constants.priceFilters[payload.country_code];
  if(_.isUndefined(priceFilters)) {
    priceFilters = defaultPriceFilters;
  }

  if(payload.country_code == 'US') {
    country_wise_prices = [
      { title: '0 - 500 USD', key: '0_800K', min_price: 0, max_price: 500 }
    ];
  } else if(payload.country_code == 'US') {
    country_wise_prices = [
      { title: '0 - 500 SGD', key: '0_800K', min_price: 0, max_price: 500 }
    ];
  } 

  let filters = [
    {
      title: 'SORT BY',
      data: [
        { title: 'BEST SELLERS', key: 'bestseller', order: 'desc' },
        { title: 'NEW ARRIVAL', key: 'new_arrival', order: 'desc' },
        // { title: 'FRAME NAME: A-Z', key: 'frame_name', order: 'asc' },
        // { title: 'FRAME NAME: Z-A', key: 'frame_name', order: 'desc' },
        { title: 'PRICE: LOW TO HIGH', key: 'price', order: 'asc' },
        { title: 'PRICE: HIGH TO LOW', key: 'price', order: 'desc' },
      ],
    },
    {
      title: 'FIT',
      data: [
        { title: 'Narrow', key: 'narrow' },
        { title: 'Medium', key: 'medium' },
        { title: 'Wide', key: 'wide' },
        { title: 'Extra Wide', key: 'extra_wide' },
      ],
    },
    {
      title: 'FRAME SHAPE',
      data: [
        { title: 'Round', key: 'round' },
        { title: 'Square', key: 'square' },
        { title: 'Aviator', key: 'aviator' },
        { title: 'Cat-Eyes', key: 'cateye' }
      ],
    },
    {
      title: 'MATERIAL',
      data: [
        { title: 'Acetate', key: 'acetate' },
        { title: 'Metal', key: 'metal' },
        { title: 'Mixed', key: 'mixed' },
        { title: 'Titanium', key: 'titanium' },
      ],
    },
    {
      title: 'COLOR',
      base_url: config.s3URL,
      data: [
        {
          title: 'Black',
          key: 'black',
          code: '#000000',
          image_key: 'color-group-icon/Black.png',
        },
        {
          title: 'Crystal',
          key: 'crystal',
          code: '#000000',
          image_key: 'color-group-icon/Crystal.png',
        },
        {
          title: 'Gold',
          key: 'gold',
          code: '#e2893b',
          image_key: 'color-group-icon/Gold.png',
        },
        {
          title: 'Silver',
          key: 'silver',
          code: '#d3d3d3',
          image_key: 'color-group-icon/Silver.png',
        },
        {
          title: 'Tortoise',
          key: 'tortoise',
          code: '#000000',
          image_key: 'color-group-icon/Tortoise.png',
        },
        {
          title: 'Blue',
          key: 'blue',
          code: '#5aade4',
          image_key: 'color-group-icon/Blue.png',
        },
        {
          title: 'Grey',
          key: 'grey',
          code: '#000000',
          image_key: 'color-group-icon/Grey.png',
        },
        {
          title: 'Two-Tone',
          key: 'two_tone',
          code: '#000000',
          image_key: 'color-group-icon/Two_Tone.png',
        },
      ],
    },
    {
      title: 'PRICE',
      data: priceFilters,
    },
  ];

  return filters;
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

  const productdata = await elasticsearch.searchInIndex(
    'products',
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
      'retail_price',
      'product_category',
      'image_key'
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

  storeResults.forEach((data) => {
    let store = data._source;
    store.base_url = config.s3URL;
    response.store.data.push(store);
  });

  for(data of productResults) {
    let product = data._source;

    if(payload.product_category !== product.product_category &&  payload.product_category !== 3) {
      continue;
    }

    product.baseUrl = config.s3URL;
    response.product.data.push(product);
  }

  response.product.count = response.product.data.length;
  response.store.count = response.store.data.length;
  

  return response;
};

const esProductSearch = async (payload, user = {}) => {
  // Query Sample
  // let query = {
  //   query_string: {
  //       query: '*keyword*',
  //       fields: ['column1', 'column2']
  //   }
  // };

  let query = {
    query_string: {
      query: `*${payload.text}*`,
      fields: [
        'sku_code',
        'frame_name',
        'frame_code',
        'fit',
        'material',
        'frame_shape',
        'face_shape',
        'variant_name',
        'product_brand',
        'product_tags',
      ],
    },
  };
  const data = await elasticsearch.searchInIndex(
    'products',
    query,
    payload.from,
    payload.size,
    []
  );
  let response = _formatESProducts(data.hits.hits);
  return response;
};
//NOTE:- moved in admin service
const addCart = async (payload, isAdmin = false) => {
  let query = '';
  if(payload['type'] === 2) {
    query = `select p2.sku, p2.id as turboly_id, ps.quantity, ps.reserved from products p
      inner join products p2 on p2.sku = concat('HTO', p.sku)
      inner join product_stocks ps on p2.id = ps.product_id
      where p.id = '${payload.product_id}' and p2.active = true and ps.quantity - ps.reserved >= ${Number(payload.item_count)}`;
  } else {
      query = `select ps.quantity, ps.reserved
        from products as p join product_stocks as ps on p.id = ps.product_id
        where p.id='${payload.product_id}' and active=true and ps.quantity - ps.reserved >= ${Number(payload.item_count)}`;
  }
  const product_stock = await db.rawQuery(
    query,
    'SELECT'
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
  //if (cart) {
    if(cart && cart.type === 2) throw new errorHandler.customError(messages.alreadyInCart);
    // if(cart.type === 1 && (Number(cart.item_count) + Number(payload.item_count)) > 5) throw new errorHandler.customError(messages.cartCountExceed);
    // await db.updateOneByCondition(
    //   { item_count: cart.item_count + payload.item_count },
    //   { id: cart.id },
    //   'CartItems'
    // );
 // }
  const data = await db.saveData(payload, 'CartItems');
  if(isAdmin){
    return await getCart(payload.user_id);
  } else {
    return data.id;
  }

};
//NOTE:- moved in admin service
const getCart = async (user_id) => {
  const data = await db.rawQuery(
    `select c.product_id, c.is_warranty, c.packages, p.sku, p.name, p.retail_price, p.company_supply_price, p.product_tags, p.image_url_1,
    p.image_url_2, p.image_url_3, p.image_url_4, f.frame_code, f.variant_code, f.size_code, f.frame_name, f.variant_name, c.user_id, c.item_count,
    c.type, c.id, c.product_category,c.prescription_id, c.discount_amount, c.discount_type, c.discount_note, c.created_at
    from cart_items as c join products as p on p.sku = c.sku_code
    join frame_master as f on f.sku_code = p.sku
    where c.user_id='${user_id}' ORDER BY c.created_at ASC`,
    'SELECT'
  );
  const cartList = data.map(async (row) => {
    const addon_items = await db.rawQuery(
      `select c.id , c.addon_product_id, c.addon_product_sku, c.addon_item_count, c.is_sunwear, p.sku, p.name, p.retail_price,
        ls.lense_type_name, ls.lense_type_amount, ls.is_prescription, ls.prescription_name, ls.prescription_amount,
        ls.filter_type_name, ls.filter_type_amount, ls.index_value, c.type, c.discount_amount, c.discount_type, c.discount_note, c.is_sunwear
        from cart_addon_items as c join products as p on p.sku = c.addon_product_sku
        inner join lenses_detail ls on p.sku = ls.sku_code
        where c.cart_id='${row.id}'`,
      'SELECT'
    );

    // TODO: Store update
    const frame_sizes = await db.rawQuery(
      `select p.id as turboly_id, s.size_label, fm.sku_code, fm.frame_name from frame_master fm
      inner join products p on p.sku = fm.sku_code
      inner join product_stocks ps on ps.product_id = p.id
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
  result = {list: result, grand_total: result.reduce((total, row) => {
    if(row.type === 1){
      total.purchase+=row.product_total_price;
    } else {
      total.hto+=row.product_total_price;
    }
    return total;
  },{hto: 0, purchase: 0})
  };
  // const cacheData = cache.getCacheById(user_id);
  // cache.setUserData(user_id, {...cacheData, 'cart': result});
  return result;
};

const getProductDetails = async (payload, user = {}) => {
  let frameQuery = `select fm.frame_id, fm.frame_code, fm.frame_name, fm.fit, fm.material, fm.face_shape,
    fm.frame_shape, fm.gender, fm.frame_description,
    fm.size_code, fm.lense_width, fm.bridge, fm.temple_length, fm.front_width, fm.size_key, fm.size_label,
    fm.variant_id, fm.variant_code, fm.variant_name, fm.icon_image_key,
    fm.sku_code, fm.hto_sku_code, fm.is_hto, fm.top_pick, fm.eyewear_vto, fm.sunwear_vto, fm.is_sunwear,
    p.id as turboly_id, p.tax_rate, p.description, p.updated_at,
    pip.retail_price, pip.country_code, pip.currency_code
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_stocks ps on ps.sku = fm.sku_code
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true and 
    ps.store_id = :store_id  and pip.country_code = :country_code
    and ps.quantity - ps.reserved > 0
    and fm.is_sunwear in (:is_sunwear) and fm.frame_code = (:frame_code)
    order by fm.variant_rank desc, fm.size_code asc`;

  let frameImageQuery = `select fi.sku_code, fi.image_key, fi.image_category, fi.image_type, fi.image_code,
    fi.frame_code, fi.variant_code
    from frame_images fi
    where fi.frame_code = (:frame_code) and fi.image_category = (:image_category) and fi.status = 1 order by fi.image_order_key`;

  let wishListQuery = `select product_id, product_category, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from user_wishlists uw
    inner join products p on p.id = uw.product_id
    inner join frame_master fm on fm.sku_code = p.sku where user_id = :user_id`;
  let cartQuery  = `select product_id, product_category, type, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from cart_items ci
    inner join products p on p.id = ci.product_id
    inner join frame_master fm on fm.sku_code = p.sku
    where user_id = :user_id`;


  let replacements = {
    frame_code: payload.id,
    is_sunwear: [true],
    image_category: constants.product_category[payload.product_category],
    store_id: payload.store_id,
    product_category: payload.product_category,
    country_code: payload.country_code
  };

  if (constants.product_category[payload.product_category] == constants.product_category[1] ) {
    replacements.is_sunwear.push(false);
  }

  if (!_.isEmpty(user)) {
    replacements.user_id = user.id;
  } else {
    replacements.user_id = null;
  }

  let promiseArr = [];
  promiseArr.push(db.rawQuery(frameQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(frameImageQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(wishListQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(cartQuery, 'SELECT', replacements));

  const results = await Promise.all(promiseArr);

  if(results[0].length == 0) {
    throw new Error('Invalid frame code');
  }

  let frames = results[0];
  let frameImages = results[1];
  let userWishlist = results[2];
  let userCart = results[3];

  const formatted_frame = formatProductDetails(payload.product_category, frames, frameImages, userWishlist, userCart);

  return formatted_frame;
};

const getProductStockDetails = async (payload) => {
  let promiseArr = [];
  let options = {
    url: config.turboly.baseUrl + 'stocks',
    headers: {
      'X-AUTH-EMAIL': config.turboly.authEmail,
      'X-AUTH-TOKEN': config.turboly.authToken,
    },
    method: 'GET',
    params: {
      sku: payload.id,
    },
    data: {},
  };

  let stockPromise = utils.axiosClient(options);
  promiseArr.push(stockPromise);

  let query = 'select * from eyewear.stores where status = 1';
  let storePromise = db.rawQuery(query, 'SELECT', {});
  promiseArr.push(storePromise);

  let results = await Promise.all(promiseArr);

  const stockResult = results[0].data.stocks;
  const storeResult = results[1];

  if (storeResult.length === 0) {
    throw new errorHandler.customError(messages.skuNotFound);
  } else if (stockResult.length === 0) {
    throw new errorHandler.customError(messages.skuNotFound);
  }

  let response = [];

  for (stock of stockResult) {
    if (stock.quantity > 0) {
      let store = storeResult.find(dbStore => dbStore.id == stock.store_id);
      if(typeof(store) != 'undefined') {
        delete stock['product_id'];
        delete stock['updated_at'];
        delete stock['store_name'];
        delete store['updated_at'];
        store.base_url = config.s3URL;

        if (!_.isUndefined(payload.lat) && !_.isUndefined(payload.long)) {
          store.distance = utils.calDistanceBtwTwoLatLngs(payload.lat, payload.long, store.lat, store.long);
        } else {
          store.distance = -1;
        }
        let res = Object.assign({}, stock, { store_details: store });
        response.push(res);
      }
    }
  }
  return response;
};

const updateCart = async (payload) => {
  if(payload['sku_code']){
    const product_stock = await db.rawQuery(
      `select ps.quantity
        from products as p join product_stocks as ps on p.id = ps.product_id
        where p.sku='${payload.sku_code}' and active=true and ps.quantity >= ${Number(payload.item_count)}`,
      'SELECT'
    );
    if(product_stock && product_stock.length === 0) throw new errorHandler.customError(messages.itemOutOfStock);
  } else if(payload['item_count']){
    const cart = await db.findOneByCondition(
      { id: payload.id },
      'CartItems',
      ['item_count', 'sku_code']
    );
    const product_stock = await db.rawQuery(
      `select ps.quantity
        from products as p join product_stocks as ps on p.id = ps.product_id
        where p.sku='${cart.sku_code}' and active=true and ps.quantity >= ${Number(payload.item_count)}`,
      'SELECT'
    );
    if(product_stock && product_stock.length === 0) throw new errorHandler.customError(messages.itemOutOfStock);
  }

  await Promise.all([
    db.updateOneByCondition(
      { ...payload },
      { id: payload.id },
      'CartItems'
    ),
    getCart(payload.user_id),
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

const removeCart = async (payload) => {
  const result = payload.data.reduce((ids, row) => {
      ids.product.push(row.sku_code);
      ids.category.push(row.product_category);
      ids.type.push(row.type);
      return ids;
  }, {product: [], category: [], type: []});
  await db.deleteRecord({ user_id: payload.user_id, sku_code: result.product, product_category: result.category, type: result.type }, 'CartItems');
  return await getCart(payload.user_id);
};
// NOTE:- moved in admin service
const deleteCart = async (payload) => {
  await db.deleteRecord(payload, 'CartItems');
  await db.deleteRecord({cart_id: payload.id, user_id: payload.user_id}, 'CartAddonItems');
  return await getCart(payload.user_id);
};

const addCartAddon = async (payload) => {
  const product_stock = await db.rawQuery(
    `select ps.quantity
      from products as p join product_stocks as ps on p.id = ps.product_id
      where p.sku='${payload.addon_product_sku}' and active=true and ps.quantity >= ${Number(payload.addon_item_count)}`,
    'SELECT'
  );
  if(product_stock && product_stock.length === 0) throw new errorHandler.customError(messages.itemOutOfStock);
  const cart = await db.findOneByCondition(
    { cart_id: payload.cart_id, addon_product_sku: payload.addon_product_sku },
    'CartAddonItems',
    ['id', 'addon_item_count']
  );
  if (cart) {
    await db.updateOneByCondition(
      { addon_item_count: cart.addon_item_count + payload.addon_item_count },
      { id: cart.id },
      'CartAddonItems'
    );
  } else {
    await db.saveData(payload, 'CartAddonItems');
  }
  return await getCart(payload.user_id);
};

const updateCartAddon = async (payload) => {
  const addon_product_sku = payload.current_addon_product_sku;
  delete payload.current_addon_product_sku;
  const condition = { user_id: payload.user_id, addon_product_sku };
  if(payload['cart_id']){
    condition.cart_id = payload.cart_id;
  }
  await db.updateOneByCondition(payload, condition, 'CartAddonItems');
  return await getCart(payload.user_id);
};
//NOTE:- moved in admin service
const deleteCartAddon = async (payload) => {
  return await db.deleteRecord(payload, 'CartAddonItems');
};

const searchLenses = async (payload) => {
  let query = '';

  let replacements = {
    id: payload.id,
  };

  if (payload.category.toLowerCase() == 'lense_category') {
    query = `select distinct category_id as id, category_name, true as is_subcategory,
            'lense_type' as subcategory_name from lenses`;
  } else if (payload.category.toLowerCase() == 'lense_type') {
    query = `select distinct lense_type_id as id, lense_type_name as name, lense_type_amount as amount, lense_type_description as description,
            is_prescription as is_subcategory, 'prescription' as subcategory_name from lenses where category_id = :id order by name desc`;
  } else if (payload.category.toLowerCase() == 'prescription') {
    query = `select distinct prescription_id as id, prescription_name as name, prescription_description as description,
            prescription_optional_description as optional_description, prescription_amount  as amount, is_filter as is_subcategory,
            'filter' as subcategory_name from lenses where lense_type_id = :id and is_prescription = true order by prescription_amount`;
  } else if (payload.category.toLowerCase() == 'filter') {
    query = `select filter_type_id as id, filter_type_name as name, filter_description as description,
        filter_type_amount as amount , false as is_subcategory from lenses where prescription_id = :id and is_filter = true order by filter_type_amount`;
  } else {
    throw new Error('Invalid category !!!');
  }

  let response = await db.rawQuery(query, 'SELECT', replacements);

  return response;
};

const searchLenseSKU = async (payload) => {
  let query = '';

  let replacements = {
    id: payload.id,
    store_id: payload.store_id,
  };

  if (payload.category.toLowerCase() == 'lense_type') {
    query = `select p.sku as sku_code, p.id as turboly_id, p.retail_price, ps.quantity from lenses ls
            inner join products p on ls.sku_code = p.sku
            inner join product_stocks ps on ps.sku = p.sku and cast(ps.store_id as varchar) = cast(:store_id as varchar)
            where lense_type_id = :id`;
  } else if (payload.category.toLowerCase() == 'prescription') {
    query = `select p.sku as sku_code, p.id as turboly_id, p.retail_price, ps.quantity from lenses ls
            inner join products p on ls.sku_code = p.sku
            inner join product_stocks ps on ps.sku = p.sku and cast(ps.store_id as varchar) = cast(:store_id as varchar)
            where prescription_id = :id`;
  } else if (payload.category.toLowerCase() == 'filter') {
    query = `select p.sku as sku_code, p.id as turboly_id, p.retail_price, ps.quantity from lenses ls
            inner join products p on ls.sku_code = p.sku
            inner join product_stocks ps on ps.sku = p.sku and cast(ps.store_id as varchar) = cast(:store_id as varchar)
            where filter_type_id = :id`;
  } else {
    throw new Error('Invalid category !!!');
  }

  let response = await db.rawQuery(query, 'SELECT', replacements);

  if(response.length == 0) {
    throw new Error('Invalid details');
  }

  let lense = response[0];

  if(lense.quantity <= 0) {
    throw new Error('Lense out of stock');
  }

  return lense;
};

const getQRProduct = async (payload, user = {}) => {
  let frameQuery = `select f.id as frame_id, f.frame_name, f.frame_code,
    fd.fit, fd.material, fd.face_shape, fd.frame_shape, fd.gender,
    fsz.size_code, fsz.sku_code, fsz.lense_width, fsz.bridge, fsz.temple_length, fsz.front_width, sz.size_key, sz.size_label,
    vr.id as variant_id, vr.variant_code, vr.variant_name, vr.icon_image_key, fm.is_sunwear,
    fm.sku_code, p.id as turboly_id, p.retail_price, p.tax_rate, p.description, p.updated_at,
    (case
      when uw.user_id is NULL then false
      else true end) as is_wishlisted, fm.is_hto
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join frame f on f.frame_code = fm.frame_code
    inner join frame_details fd on fd.frame_code = fm.frame_code
    inner join frame_sizes fsz on fsz.sku_code = fm.sku_code
    inner join sizes sz on fsz.size_code = sz.size_code
    inner join variants vr on fm.variant_code = vr.variant_code
    left join user_wishlists uw on p.id = uw.product_id and uw.user_id = (:user_id)
    where p.active = true and fm.sku_code = (:sku_code)
    order by fm.frame_code, fm.variant_code, fm.size_code`;

  let frameImageQuery = `select fi.sku_code, fi.image_key, fi.image_category, fi.frame_code, fi.variant_code
    from frame_images fi
    where fi.sku_code = :sku_code and fi.status = 1 order by fi.image_id`;

  let replacements = {
    sku_code: payload.id
  };

  if (!_.isEmpty(user)) {
    replacements.user_id = user.id;
  } else {
    replacements.user_id = null;
  }

  let promiseArr = [];
  promiseArr.push(db.rawQuery(frameQuery, 'SELECT', replacements));
  promiseArr.push(db.rawQuery(frameImageQuery, 'SELECT', replacements));

  const results = await Promise.all(promiseArr);

  if(results[0].length == 0) {
    throw new Error('Invalid frame code');
  }

  const formatted_frame = formatProductDetails(results[0], results[1]);

  return formatted_frame;
};

const htoCheck = async (payload, user = {}) => {
  let query = `select province, city, lat, long, hto_status, is_payment_required, is_offer, amount, price_per_frame
      from hto_zip_code hzc where zipcode = :zipcode and hto_status = true`;

  let replacements = {
    zipcode: payload.zipcode,
  };

  const result = await db.rawQuery(query, 'SELECT', replacements);

  let response = {
    province: 'NA',
    city: 'NA',
    lat: 0,
    long: 0,
    hto_status: true,
    is_payment_required: true,
    is_offer: false,
    amount: 3000000,
    price_per_frame: 500000
  };

  if (result.length != 0) {
    response = result[0];
  }

  return response;
};

const htoSlot = async (payload, user = {}) => {
  let slotQuery = 'select * from hto_slot';
  let opticianQuery = 'select * from optician';
  let appointmentQuery = `select atd.appointment_id, atd.optician_id, atd.slot_id, cast(atd.appointment_date as Date), atd.status
    from appointment_time_details atd
    where (Date(atd.appointment_date)  between cast(:start_date as Date) and cast(:end_date as Date)) and atd.status = 1`;

  let start_date = new Date();
  start_date.setDate(start_date.getDate() + 1);
  var end_date = new Date();
  end_date.setDate(end_date.getDate() + 16);

  let replacements = {
    start_date: moment(start_date).format('YYYY-MM-DD'),
    end_date: moment(end_date).format('YYYY-MM-DD'),
  };

  let promiseArr = [];

  promiseArr.push(db.rawQuery(slotQuery, 'SELECT', {}));
  promiseArr.push(db.rawQuery(opticianQuery, 'SELECT', {}));
  promiseArr.push(db.rawQuery(appointmentQuery, 'SELECT', replacements));

  let results = await Promise.all(promiseArr);

  let slots = results[0];
  let opticians = results[1];
  let appointments = results[2];

  let response = [];

  for (let date = start_date; date < end_date; date.setDate(date.getDate() + 1)) {
    let dateObj = {
      date: moment(date).format('YYYY-MM-DD'),
      slot_list: []
    };

    for (slot of slots) {
      let slotObj = {
        slot_id: slot.id,
        slot_start_time: slot.slot_start_time,
        slot_end_time: slot.slot_end_time,
      };

      let bookedAppointments = appointments.filter(appointment => {
        return (appointment.slot_id == slot.slot_id && appointment.appointment_date == moment(date).format('YYYY-MM-DD'));
      });

      if( bookedAppointments.length != 0 ) {
        let availableOpticians = opticians.filter((optician) => {
          return !bookedAppointments.some((appointment) => {
              return optician.id == appointment.optician_id;
          });
        });

        if( availableOpticians.length != 0 ) {
          slotObj.is_available = false;
        } else {
          slotObj.is_available = true;
        }
      } else {
        slotObj.is_available = true;
      }

      dateObj.slot_list.push(slotObj);
    }
    response.push(dateObj);
  }

  return response;
};

const lenseDetails = async (payload) => {
  let query = `select ld.*, p.id as turboly_id, pip.retail_price, pip.currency_code, pip.country_code
    from lense_international_mapping ld
    inner join products p on p.sku = ld.sku_code
    inner join product_international_prices pip on pip.sku_code = ld.sku_code
    where ld.status = 1 and ld.country_code = :country_code and pip.country_code = :country_code
    order by created_at`;

  let replacements = {
    country_code: payload.country_code
  };

  let results = await db.rawQuery(query, 'SELECT', replacements);

  let lenses = [];
  let sku_details = [];

  for(result of results) {
    let sku_obj = {
      sku_code: result.sku_code,
      turboly_id: result.turboly_id,
      retail_price: result.retail_price,
      currency_code: result.currency_code
    };

    sku_details.push(sku_obj);

    let lense_categories = lenses.filter(data => data.key == result.category_id);
    if(lense_categories.length == 0) {
      let temp_category = {
        key: result.category_id,
        label: result.category_name,
        description: result.category_description || '',
        optional_description: '',
        amount: result.category_amount || 0,
        currency_code: result.currency_code,
        country_code: result.country_code,
        is_child: true,
        sku: '',
        turboly_id: '',
        childs: []
      };

      let db_prescriptions = results.filter(data => data.category_id == result.category_id && data.is_prescription == true);

      if(db_prescriptions.length == 0) {
        temp_category.is_child = false;
        temp_category.sku = result.sku_code;
        temp_category.turboly_id = result.turboly_id;
      } else {
        let temp_prescriptions = [];
        for (db_prescription of db_prescriptions) {
          let prescriptions = temp_prescriptions.filter(data => {
            return data.key == db_prescription.prescription_id;
          });

          if(prescriptions.length == 0) {
            let temp_prescription = {
              key: db_prescription.prescription_id,
              label: db_prescription.prescription_name,
              description: db_prescription.prescription_description || '',
              optional_description: '',
              amount: db_prescription.prescription_amount || 0,
              currency_code: result.currency_code,
              country_code: result.country_code,
              is_child: true,
              sku: '',
              turboly_id: '',
              childs: []
            };

            if(temp_category.key == 'sunwear') {
              temp_prescription.colors = constants.lenseColors;
            }

            let db_lense_types = results.filter(data => {
              return data.category_id == result.category_id && data.is_prescription == true
                && data.prescription_id == db_prescription.prescription_id && data.is_lense_type == true;
            });

            if(db_lense_types.length == 0) {
              temp_prescription.is_child = false;
              temp_prescription.sku = db_prescription.sku_code;
              temp_prescription.turboly_id = db_prescription.turboly_id;
            } else {
              let temp_lense_types = [];
              for (db_lense_type of db_lense_types) {
                let lense_types = temp_lense_types.filter(data => {
                  return data.key == db_lense_type.lense_type_id;
                });

                if(lense_types.length == 0) {
                  let temp_lense_type = {
                    key: db_lense_type.lense_type_id,
                    label: db_lense_type.lense_type_name,
                    description: db_lense_type.lense_type_description || '',
                    optional_description: db_lense_type.lense_type_optional_description || '',
                    amount: db_lense_type.lense_type_amount || 0,
                    currency_code: result.currency_code,
                    country_code: result.country_code,
                    is_child: true,
                    sku: '',
                    turboly_id: '',
                    childs: []
                  };

                  let db_filter_types = results.filter(data => {
                    return data.category_id == result.category_id && data.is_prescription == true
                      && data.prescription_id == db_prescription.prescription_id && data.is_lense_type == true
                      && data.lense_type_id == db_lense_type.lense_type_id && data.is_filter == true;
                  });

                  if(db_filter_types.length == 0) {
                    temp_lense_type.is_child = false;
                    temp_lense_type.sku = db_lense_type.sku_code;
                    temp_lense_type.turboly_id = db_lense_type.turboly_id;
                  } else {
                    let temp_filter_types = [];
                    for (db_filter_type of db_filter_types) {
                      let lense_filter_types = temp_filter_types.filter(data => {
                        return data.key == db_filter_type.filter_type_id;
                      });
                      if(lense_filter_types.length == 0) {
                        let temp_filter_type = {
                          key: db_filter_type.filter_type_id,
                          label: db_filter_type.filter_type_name,
                          description: db_filter_type.filter_type_description || '',
                          optional_description: '',
                          amount: db_filter_type.filter_type_amount || 0,
                          currency_code: result.currency_code,
                          country_code: result.country_code,
                          is_child: false,
                          sku: db_filter_type.sku_code,
                          turboly_id: db_filter_type.turboly_id,
                          childs: []
                        };
                        temp_filter_types.push(temp_filter_type);
                      }
                    }
                    temp_lense_type.childs = temp_filter_types;
                  }
                  temp_lense_types.push(temp_lense_type);
                }
              }

              if(db_prescription.prescription_id == 'optical_single_vision') {
                let uv420Filter = results.filter(data => {
                  return data.category_id == 'optical' && data.is_prescription == true
                    && data.prescription_id == 'optical_single_vision' && data.is_lense_type == true
                    && data.lense_type_id == 'optical_single_vision_classic' && data.is_filter == true
                    && data.filter_type_id == 'optical_single_vision_classic_uv420' && data.is_filter == true;
                });
                if(uv420Filter.length != 0) {
                  let temp = {
                    key: uv420Filter[0].filter_type_id,
                    label: uv420Filter[0].filter_type_name,
                    description: uv420Filter[0].filter_type_description || '',
                    optional_description: '',
                    amount: uv420Filter[0].filter_type_amount || 0,
                    currency_code: result.currency_code,
                    country_code: result.country_code,
                    is_child: false,
                    sku: uv420Filter[0].sku_code,
                    turboly_id: uv420Filter[0].turboly_id,
                    childs: []
                  };
                  temp_lense_types.splice(1, 0, temp);
                }
              }
              temp_prescription.childs = temp_lense_types;
            }
            temp_prescriptions.push(temp_prescription);
          }
        }
        temp_category.childs = temp_prescriptions;
      }
      lenses.push(temp_category);
    }
  }
  return {
    lense_data: lenses,
    sku_details
  };
};

//NOTE:- itemWarranty function moved in admin

const clipOns = async () => {
  return await db.rawQuery(
    `select p.id, c.name, p.retail_price, c.sku, c.color, c.size
    from clipon c join products as p on p.sku = c.sku where c.status = 1`,
    'SELECT'
  );
};

const addTopPick = async (payload, user) => {
  let toppickQuery = `select p.id as product_id, fm.sku_code, fm.hto_sku_code from frame_master fm
    inner join products p on p.sku = fm.sku_code
    where top_pick = true order by frame_rank, variant_rank limit 10`;
  let cartQuery = 'select sku_code from cart_items ci where user_id = :user_id and type = 2';

  let replacements = {
    user_id: user.id
  };

  let toppickResults = await db.rawQuery(toppickQuery, 'SELECT', {});
  let cartResults = await db.rawQuery(cartQuery, 'SELECT', replacements);


  if(cartResults.length == 10) {
    throw new Error('Cart is full. Please remove some items from cart');
  }

  let currentCartSKUs = [];

  for(cartItem of cartResults) {
    currentCartSKUs.push(cartItem.sku_code);
  }

  let cartItems = [];
  for (item of toppickResults) {
    if(!_.includes(currentCartSKUs, item.sku_code)) {
      let cartObj = {
        product_id: item.product_id,
        sku_code: item.sku_code,
        user_id: user.id,
        item_count: 1,
        type: 2,
        product_category: payload.product_category,
        created_at: new Date(),
        created_by: user.id,
        updated_at: new Date(),
        updated_by: user.id
      };
      cartItems.push(cartObj);
    }
  }

  cartItems.slice(toppickResults.length - cartResults.length);
  await db.saveMany(cartItems, 'CartItems');


  return 'Top pick items added';
};

const getPackaging = async () => {
  return await db.findByCondition({status: 1}, 'Packaging', ['id','name', 'sku']);
};

const updateCartPackages = async (payload) => {
  const table = !payload.type || payload.type === 'frame' ? 'CartItems' : 'CartAddonItems';
  const cart = await db.findOneByCondition({id: payload.id}, table , ['packages']);
  if(!cart) {
    throw new Error('Cart is not found!');
  }
  let packages = cart.packages ? cart.packages.split(',') : [];
  const index = packages.findIndex(pkg => pkg === payload.sku);
  if(index > -1){
    packages.splice(index, 1);
  } else {
    packages.push(payload.sku);
  }
  packages = packages.join(',');
  await db.updateOneByCondition({ packages, updated_by: payload.user_id }, {id: payload.id}, table);
  return packages;
};

const influencerList = async (payload) => {
  let influencerQuery = `select inf.influencer_name, inf.social_media_handle, inf.social_media_type,
    inf.category, inf.image_key,
    inf.sku_code, fm.frame_name, fm.variant_name, fm.size_label,
    fm.frame_code, fm.variant_code, fm.size_code
    from influencer inf
    inner join frame_master fm
      on fm.sku_code = inf.sku_code
    where inf.status = 1 order by rank desc`;

  let data = await db.rawQuery(influencerQuery, 'SELECT', {});

  data = data.map(dt => {
    dt.base_url = config.s3URL;
    return dt;
  });

  return data;
};

const saveRecentlyViewed = async (payload, user = {}) => {
  let replacements = {
    sku_code: payload.sku_code,
    user_id: user.id
  };

  let lense_category;
  if(payload.product_category == 1) {
    lense_category = 'OPTICAL';
  } else if(payload.product_category == 2) {
    lense_category = 'SUNWEAR';
  }

  replacements.lense_category = lense_category;

  let productQuery = `
    select 
      fm.sku_code, fm.frame_name, fm.frame_code, fm.variant_name,
      fm.variant_code, fm.size_label, fm.size_code,
      fi.image_key
    from frame_master fm
    left join frame_images fi
      on fi.frame_code = fm.frame_code and fi.variant_code = fm.variant_code 
      and fi.image_code in ('E_0_U', 'S_0_U') and fi.image_category = :lense_category
    where fm.sku_code = :sku_code limit 5`;

  let historyQuery = `
    select 
      id, open_count
    from user_browsing_history 
    where sku_code = :sku_code
    and user_id = :user_id and status = 1 and lense_category = :lense_category`;

  let frameHistoryQuery = `
    select 
      id, open_count
    from user_frame_browsing_history 
    where frame_code = :frame_code
    and user_id = :user_id and status = 1 and lense_category = :lense_category`;

  let frameData = await db.rawQuery(productQuery, 'SELECT', replacements);
  let historyData = await db.rawQuery(historyQuery, 'SELECT', replacements);

  if(frameData.length == 0) {
    throw new Error('Invalid SKU');
  }

  replacements.frame_code = frameData[0].frame_code;

  let frameHistoryData = await db.rawQuery(frameHistoryQuery, 'SELECT', replacements);

  let auditObj = {
    user_id: user.id,
    sku_code: payload.sku_code,
    sku_category: payload.sku_category,
    frame_code: frameData[0].frame_code,
    frame_name: frameData[0].frame_name,
    variant_code: frameData[0].variant_code,
    variant_name: frameData[0].variant_name,
    size_code: frameData[0].size_code,
    size_label: frameData[0].size_label,
    image_key: frameData[0].image_key,
    lense_category: lense_category,
    created_at: new Date(),
    created_by: user.id,
    updated_at: new Date(),
    updated_by: user.id,
  };

  if(historyData.length == 0) {
    await db.saveData(auditObj, 'UserBrowsingHistory');
  } else {
    let dt = historyData[0];
    replacements = {
      open_count: dt.open_count + 1,
      updated_at: new Date(),
      updated_by: user.id,
      id: dt.id
    };
   let updateQuery = `
    update user_browsing_history set 
      open_count = :open_count,
      updated_at = :updated_at,
      updated_by = :updated_by
    where id = :id`;
    await db.rawQuery(updateQuery, 'SELECT', replacements);
  }

  if(frameHistoryData.length == 0) {
    let frameObj = {
      user_id: user.id,
      frame_code: frameData[0].frame_code,
      frame_name: frameData[0].frame_name,
      last_open_sku_code: payload.sku_code,
      last_open_variant_code: frameData[0].variant_code,
      last_open_variant_name: frameData[0].variant_name,
      lense_category: lense_category,
      image_key: frameData[0].image_key,
      created_at: new Date(),
      created_by: user.id,
      updated_at: new Date(),
      updated_by: user.id,
    };

    await db.saveData(frameObj, 'UserFrameBrowsingHistory');
  } else {
    let dt = frameHistoryData[0];
    replacements = {
      last_open_sku_code: payload.sku_code,
      last_open_variant_code: frameData[0].variant_code,
      last_open_variant_name: frameData[0].variant_name,
      image_key: frameData[0].image_key,
      open_count: dt.open_count + 1,
      updated_at: new Date(),
      updated_by: user.id,
      id: dt.id
    };
    let updateQuery = `
      update user_frame_browsing_history set
        last_open_sku_code = :last_open_sku_code,
        last_open_variant_code = :last_open_variant_code,
        last_open_variant_name = :last_open_variant_name,
        image_key = :image_key,
        open_count = :open_count,
        updated_at = :updated_at,
        updated_by = :updated_by
      where id = :id`;
    await db.rawQuery(updateQuery, 'SELECT', replacements);
  }

  await db.saveData(auditObj, 'UserBrowsingHistoryAudit');

  return {
    message: 'Frame viewed successfully'
  };
};

const getRecentlyViewedList = async (payload, user = {}) => {
  let replacements = {
    store_id: payload.store_id,
    country_code: payload.country_code,
    user_id: user.id
  };

  let historyQuery = `
      select 
        fm.sku_code, fm.frame_name, fm.frame_code, fm.variant_code, fm.variant_name,
        fm.size_label, fm.material, fm.top_pick,
        ufbh.id, ufbh.user_id, ufbh.lense_category, ufbh.image_key,
        ufbh.open_count, ufbh.created_at, ufbh.status,
        pip.country_code, pip.retail_price, pip.currency_code
      from user_frame_browsing_history ufbh
      inner join frame_master fm on fm.sku_code = ufbh.last_open_sku_code
      inner join products p on p.sku = fm.sku_code
      inner join product_stocks ps on ps.sku = fm.sku_code
      inner join product_international_prices pip on pip.sku_code = fm.sku_code
      where
        ufbh.user_id = :user_id and ufbh.status = 1 and
        p.active = true and 
        ps.store_id = :store_id and pip.country_code = :country_code and
        ps.quantity - ps.reserved > 0
      order by ufbh.updated_at desc limit 20;
  `;


  let data = await db.rawQuery(historyQuery, 'SELECT', replacements);

  let eyeglassFrameCodes = [];
  let sunglassFrameCodes = [];

  for(dt of data) {
    if(dt.lense_category == 'OPTICAL') {
      eyeglassFrameCodes.push(dt.frame_code);
    } else if (dt.lense_category == 'SUNWEAR') {
      sunglassFrameCodes.push(dt.frame_code);
    }
  }

  let eyeglassFrameData = [];
  let sunglassFrameData = [];
  if(eyeglassFrameCodes.length > 0) {
    replacements.eyeglassFrameCodes = eyeglassFrameCodes;
    let query = `
      select fm.frame_code,
        count(distinct(fm.variant_code)) as variant_count, count(distinct(fm.size_code)) as size_count
      from user_frame_browsing_history ufbh
      inner join frame_master fm on fm.frame_code = ufbh.frame_code
      inner join products p on p.sku = fm.sku_code
      inner join product_stocks ps on ps.sku = fm.sku_code
      where
        fm.frame_code in (:eyeglassFrameCodes) and
        ufbh.user_id = :user_id and ufbh.status = 1 and
        p.active = true and 
        ps.store_id = :store_id and
        ps.quantity - ps.reserved > 0
      group by fm.frame_code;
    `;
    eyeglassFrameData = await db.rawQuery(query, 'SELECT', replacements);
  }
  if(sunglassFrameCodes.length > 0) {
    replacements.sunglassFrameCodes = sunglassFrameCodes;
    let query = `
      select fm.frame_code,
        count(distinct(fm.variant_code)) as variant_count, count(distinct(fm.size_code)) as size_count
      from user_frame_browsing_history ufbh
      inner join frame_master fm on fm.frame_code = ufbh.frame_code
      inner join products p on p.sku = fm.sku_code
      inner join product_stocks ps on ps.sku = fm.sku_code
      where
        fm.frame_code in (:sunglassFrameCodes) and fm.is_sunwear in (true) and
        ufbh.user_id = :user_id and ufbh.status = 1 and
        p.active = true and 
        ps.store_id = :store_id and
        ps.quantity - ps.reserved > 0
      group by fm.frame_code;
    `;
    sunglassFrameData = await db.rawQuery(query, 'SELECT', replacements);
  }


  data = data.map(dt => {
    dt.base_url = config.s3URL;
    dt.materialDetails = constants['material'][dt.material];

    let sizeVariant = {
      sku_code: dt.sku_code,
      turboly_id: dt.turboly_id,
      retail_price: dt.retail_price,
      country_code: dt.country_code,
      currency_code: dt.currency_code,
      size_code: dt.size_code,
      size_key: dt.size_key,
      size_label: dt.size_label,
      lense_width: dt.lense_width,
      bridge: dt.bridge,
      temple_length: dt.temple_length,
      front_width: dt.front_width,
      is_hto: false,
      is_wishlisted: false,
      is_hto_added: false,
    };
    dt.sizeVariants = [sizeVariant];
    

    if(dt.lense_category == 'OPTICAL') {
      let frameCountData = _.find(eyeglassFrameData, (eyeglass) => {
        return eyeglass.frame_code = dt.frame_code;
      });

      if(!_.isUndefined(frameCountData)) {
        dt.variant_count = frameCountData.variant_count;
        dt.size_count = frameCountData.size_count;
      } else {
        dt.variant_count = 1;
        dt.size_count = 1;
      }

      dt.product_category = 1;
      if(dt.image_key !== null) {
        dt.grid_image_key = dt.image_key.replace('E_0_U', 'E_1_U');
      }
    } else if (dt.lense_category == 'SUNWEAR') {
      let frameCountData = _.find(sunglassFrameData, (sunglass) => {
        return sunglass.frame_code = dt.frame_code;
      });

      if(!_.isUndefined(frameCountData)) {
        dt.variant_count = frameCountData.variant_count;
        dt.size_count = frameCountData.size_count;
      } else {
        dt.variant_count = 1;
        dt.size_count = 1;
      }

      dt.product_category = 2;
      if(dt.image_key !== null) {
        dt.grid_image_key = dt.image_key.replace('S_0_U', 'S_1_U');
      }
    }
    return dt;
  });

  return data;
};

const _getRecentlyViewedFrames = async (frame_codes, product_category, payload, user) => {
  let replacements = {
    user_id: user.id,
    frame_codes,
    is_sunwear: [true],
    image_category: constants.product_category[product_category],
    product_category,
    country_code: payload.country_code
  };

  if (product_category == 1) {
    replacements.is_sunwear.push(false);
  }

  let frameQuery = `
    select
      fm.frame_code, fm.frame_id, fm.frame_name, fm.fit, fm.material, fm.face_shape,
      fm.frame_shape, fm.gender, fm.frame_description,
      fm.size_code, fm.lense_width, fm.bridge, fm.temple_length, fm.front_width, fm.size_key, fm.size_label,
      fm.variant_id, fm.variant_code, fm.variant_name, fm.icon_image_key,
      fm.sku_code, fm.hto_sku_code, fm.is_hto, fm.top_pick, fm.eyewear_vto, fm.sunwear_vto,
      p.id as turboly_id, p.tax_rate, p.description, p.updated_at,
      pip.retail_price, pip.country_code, pip.currency_code
    from frame_master fm
    inner join products p on p.sku = fm.sku_code
    inner join product_international_prices pip on pip.sku_code = fm.sku_code
    where p.active = true
    and pip.country_code = :country_code
    and fm.is_sunwear in (:is_sunwear) and fm.frame_code in (:frame_codes)
    order by fm.frame_rank desc, fm.variant_rank desc, fm.size_code asc`;

  let frameImageQuery = `
    select 
      fi.sku_code, fi.image_key, fi.image_category, fi.image_type, fi.image_code,
      fi.frame_code, fi.variant_code
    from frame_images fi
    where fi.image_category = (:image_category) and fi.frame_code in (:frame_codes) order by fi.image_order_key`;

  let wishListQuery = `
    select
      product_id, product_category, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from user_wishlists uw
    inner join products p on p.id = uw.product_id
    inner join frame_master fm on fm.sku_code = p.sku where user_id = :user_id`;

  let cartQuery  = `
    select 
      product_id, product_category, type, fm.sku_code, fm.frame_code, fm.variant_code, fm.size_code
    from cart_items ci
    inner join products p on p.id = ci.product_id
    inner join frame_master fm on fm.sku_code = p.sku
    where user_id = :user_id`;

    let promiseArr1 = [];
    promiseArr1.push(db.rawQuery(frameQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(frameImageQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(wishListQuery, 'SELECT', replacements));
    promiseArr1.push(db.rawQuery(cartQuery, 'SELECT', replacements));

    const results = await Promise.all(promiseArr1);

    let frames = results[0];
    let frameImages = results[1];
    let userWishlist = results[2];
    let userCart = results[3];

    let response = [];
    if(frames.length > 0) {
      response = formatProducts(product_category, frame_codes, frames, frameImages, userWishlist, userCart);
    }

    return response;
};

const getRecentlyViewedFrames = async (payload, user = {}) => {
  let replacements = {
    user_id: user.id
  };
  
  let opticalFrameHistoryQuery = `
    select 
      ubh.frame_code
    from user_browsing_history ubh
    inner join frame_master fm
      on fm.frame_code = ubh.frame_code
    where ubh.user_id = :user_id
    and ubh.status = 1 
    and ubh.sku_category = 'FRAME'
    and ubh.lense_category = 'OPTICAL'
    and fm.is_sunwear in (true, false)
    group by ubh.frame_code
    order by max(ubh.updated_at) desc
    limit 20`;

  let sunwearFrameHistoryQuery = `
    select 
      ubh.frame_code
    from user_browsing_history ubh
    inner join frame_master fm
      on fm.frame_code = ubh.frame_code
    where ubh.user_id = :user_id
    and ubh.status = 1 
    and ubh.sku_category = 'FRAME'
    and ubh.lense_category = 'SUNWEAR'
    and fm.is_sunwear in (true)
    group by ubh.frame_code
    order by max(ubh.updated_at) desc
    limit 20`;

  let opticalFrameHistory = await db.rawQuery(opticalFrameHistoryQuery, 'SELECT', replacements);
  let sunwearFrameHistory = await db.rawQuery(sunwearFrameHistoryQuery, 'SELECT', replacements);

  let eyeglassFrameCodes = [];
  for(let dt of opticalFrameHistory) {
    eyeglassFrameCodes.push(dt.frame_code);
  }

  let sunglassFrameCodes = [];
  for(let dt of sunwearFrameHistory) {
    sunglassFrameCodes.push(dt.frame_code);
  }

  let eyeglassFrames = [];
  let sunglassFrames = [];
  if(eyeglassFrameCodes.length > 0) {
    eyeglassFrames = await _getRecentlyViewedFrames(eyeglassFrameCodes, product_category = 1, payload, user);
  }
  if(sunglassFrameCodes.length > 0) {
    sunglassFrames = await _getRecentlyViewedFrames(sunglassFrameCodes, product_category = 2, payload, user);
  }


  return {
    eyeglassFrames,
    sunglassFrames
  };
};

module.exports = {
  addProduct,
  getProducts,
  getFilters,
  esTextSearch,
  esProductSearch,
  getProductDetails,
  getProductStockDetails,
  addCart,
  getCart,
  filterProducts,
  filterProductsCount,
  getSKUFrames,
  updateCart,
  removeCart,
  deleteCart,
  addCartAddon,
  updateCartAddon,
  searchLenses,
  getQRProduct,
  searchLenseSKU,
  htoCheck,
  htoSlot,
  deleteCartAddon,
  lenseDetails,
  clipOns,
  addTopPick,
  getPackaging,
  updateCartPackages,
  influencerList,
  saveRecentlyViewed,
  getRecentlyViewedList,
  getRecentlyViewedFrames
};
