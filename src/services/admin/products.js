const db = require('../../utilities/database');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const xlsx = require('node-xlsx');
const { messages, utils, constants, errorHandler, s3Upload } = require('../../core');
const { storeImageUpload } = require('../../core/s3Upload');
const { turboly_order_status } = require('../../core/constants');


const getFrameNames = async (payload) => {

    let condition = '';
    let limitedQuery = '';

    if (payload.page != 'all') {
        const limit = constants.limit;
        const offset = (payload.page - 1) * limit;
        limitedQuery = ` LIMIT ${limit} OFFSET ${offset}`;
    }

    let table = 'frame_details';
    let fields = ' fd.id, fd.frame_name, fd.frame_code, fd.fit, fd.frame_shape, fd.material, fd.face_shape, fd.gender, fd.frame_description, fd.frame_name, fd.frame_rank,  fd.frame_price';

    if (payload.search) {
        condition = condition + ` where (fd.frame_name ilike '%${payload.search}%')`;
    }

    const totalFrameNames = await await db.rawQuery(`SELECT COUNT(fd.id)::int from ${table} fd ${condition}`, 'SELECT');

    const frameNames = await db.rawQuery(
        `SELECT ${fields} from ${table} fd ${condition} order by fd.frame_code desc ${limitedQuery}`,
        'SELECT'
    );

    return ({ list: frameNames, total_rows: totalFrameNames[0].count });
};

const addFrameName = async (payload) => {

    let frameNameDuplicateQuery = 'select * from frame_details Where (frame_code = :frame_code)';

    let replacements = {
        frame_code: payload.frame_code
    };

    let frameNameDuplicateResults = await db.rawQuery(frameNameDuplicateQuery, 'SELECT', replacements);

    if (frameNameDuplicateResults.length > 0) {
        throw new Error('frame_code The Frame Code you have entered is duplicate');
    }


    if (payload.fit) {
        let sizeSpecifications = payload.fit.map((item) => {
            let frame_sizes_pk = uuidv4();
            return { ...item, frame_code : payload.frame_code, id : frame_sizes_pk };
        });

        delete payload.fit;
        await db.saveMany(sizeSpecifications, 'FrameSize');
    }

    let date = new Date();
    let frame_details_pk = uuidv4();


    let frameNameObj = {
        ...payload,
        id: frame_details_pk,
        created_at: date
    };

    await db.saveData(frameNameObj, 'FrameDetail');
    return frameNameObj;
};

const frameNameDetails = async (frame_detail_id) => {

    let table = 'frame_details';
    let fields = ' * ';

    let replacements = {
        frame_detail_id
    };

    const store = await db.rawQuery(
        `SELECT ${fields} from ${table} fd where fd.id = :frame_detail_id`,
        'SELECT',
        replacements
    );

    if (store.length != 1) {
        throw new Error('Invalid Frame Detail no');
    }
    return store[0];
};

const updateFrameNameActivity = async (payload) => {
    const dbStore = await db.findOneByCondition({ id: payload.id }, 'FrameDetail');

    if (!dbStore) throw errorHandler.customError('Invalid Frame');

    let status = false;
    if (payload.status == 'true') {
        status = true;
    }

    let activityStatus = await db.updateOneByCondition({ active: status }, { id: payload.id }, 'FrameDetail');

    if (activityStatus[0]) {
        return true;
    } else {
        return false;
    }
};

const updateFrameName = async (payload) => {
    let transaction = await db.dbTransaction();
    try {

        let date = new Date();
        await db.updateOneByCondition({
            ...payload,
            updated_at: date,
        }, {
            frame_code: payload.frame_code
        }, 'FrameDetail');

        await transaction.commit();
        return payload;
    } catch (error) {
        transaction.rollback();
        throw errorHandler.customError(messages.updateStoreError);
    }
};


const getFrameColors = async (payload) => {

    let condition = '';
    let limitedQuery = '';

    if (payload.page != 'all') {
        const limit = constants.limit;
        const offset = (payload.page - 1) * limit;
        limitedQuery = ` LIMIT ${limit} OFFSET ${offset}`;
    }

    let table = 'variants';
    let fields = ' v.id, v.variant_code, v.variant_color_group, v.variant_name, v.icon_image_key';

    if (payload.search) {
        condition = condition + ` where (v.variant_name ilike '%${payload.search}%')`;
    }

    const totalStores = await await db.rawQuery(`SELECT COUNT(v.id)::int from ${table} v ${condition}`, 'SELECT');

    const stores = await db.rawQuery(
        `SELECT ${fields} from ${table} v ${condition} order by v.variant_code desc ${limitedQuery}`,
        'SELECT'
    );

    return ({ list: stores, total_rows: totalStores[0].count });
};

const frameColorDetails = async (variants_id) => {

    let table = 'variants';
    let fields = ' * ';

    let replacements = {
        variants_id
    };

    const store = await db.rawQuery(
        `SELECT ${fields} from ${table} v where v.id = :variants_id`,
        'SELECT',
        replacements
    );

    if (store.length != 1) {
        throw new Error('Invalid Variants no');
    }
    return store[0];

};

const addFrameColor = async (payload) => {

    let variantDuplicateQuery = 'select * from variants Where (variant_code = :id)';

    let replacements = {
        id: payload.variant_code
    };

    let variantDuplicateResults = await db.rawQuery(variantDuplicateQuery, 'SELECT', replacements);

    if (variantDuplicateResults.length > 0) {
        throw new Error('variant_code The Variant Code you have entered is duplicate');
    }

    let date = new Date();
    let variants_pk = uuidv4();
    let variantObj = {
        ...payload,
        id: variants_pk,
        created_at: date
    };

    await db.saveData(variantObj, 'Variants');
    return variantObj;
};

const updateFrameColorActivity = async (payload) => {
    const dbStore = await db.findOneByCondition({ id: payload.id }, 'Variants');

    if (!dbStore) throw errorHandler.customError('Invalid Store');

    let status = false;
    if (payload.status == 'true') {
        status = true;
    }

    let activityStatus = await db.updateOneByCondition({ active: status }, { id: payload.id }, 'Variants');

    if (activityStatus[0]) {
        return true;
    } else {
        return false;
    }
};

const updateFrameColor = async (payload) => {
    let transaction = await db.dbTransaction();
    try {

        let date = new Date();
        await db.updateOneByCondition({
            ...payload,
            store_region: payload.region,
            updated_at: date,
        }, {
            variant_code: payload.variant_code
        }, 'Variants');

        await transaction.commit();
        return payload;
    } catch (error) {
        transaction.rollback();
        throw errorHandler.customError(messages.updateStoreError);
    }
};



const frameColorImages = async (payload) => {
    const dbStore = await db.findOneByCondition({ id: payload.id }, 'Variants');

    if (!dbStore) throw errorHandler.customError('Invalid Variant');

    const data = {
        body: payload,
        public: true
    };


    let type = payload.type;
    let columnObj = {};
    let ext = path.extname(payload.originalFilename);


    let folder = `store/${payload.id}`;
    let fileName = '';

    if (type == 'store_image') {
        fileName = `store${ext}`;
        columnObj = { store_image_key: `store/${payload.id}/store${ext}` };
    }

    // console.log(columnObj);

    let uploadingResponse = await storeImageUpload(data, folder, fileName);
    let imageStatus = await db.updateOneByCondition(columnObj, { id: payload.id }, 'Variants');


    if (imageStatus[0]) {
        return { status: true, file: `${uploadingResponse.fileName}` };
    } else {
        return false;
    }
};



const frameSizeAvialability = async (payload) => {

    let table = 'frame_master';
    let fields = ' size_code ';

    let replacements = {
        variant_code: payload.variant_code,
        frame_code: payload.frame_code
    };

    const frameMaster = await db.rawQuery(
        `SELECT ${fields} from ${table} fm where fm.frame_code = :frame_code and fm.variant_code = :variant_code`,
        'SELECT',
        replacements
    );

    return frameMaster;

};

const addFrameSku = async (payload) => {

    
    // let frameNameDuplicateQuery = 'select * from products Where ( sku = :sku )';
    
    // let replacements = {
    //     sku: completeSku
    // };
    // let frameDuplicateResults = await db.rawQuery(frameNameDuplicateQuery, 'SELECT', replacements);
    // if (frameDuplicateResults.length > 0) {
    //     throw new Error('frame_code The Frame Sku you have entered is duplicate');
    // }

    
    let frameSkuObjs = [];
    let productObjs = [];
    let date = new Date();


    payload.size.map((size) => {
        
        let frame_details_pk = uuidv4();
        let completeSku = `${payload.frame_code}${size.slice(-2)}${payload.variant_code.slice(-3)}`;

        let frameSkuObj = {
            ...payload,
            id: frame_details_pk,
            size_code: size,
            sku_code: completeSku,
            hto_sku_code: `HTO${completeSku}`,
            created_at: date
        };

        let productObj = {
            ...payload,
            sku: completeSku,
            product_type: 'Frame',
            created_at: date,
        };

        frameSkuObjs.push(frameSkuObj);
        productObjs.push(productObj);
    });

    await db.saveMany(frameSkuObjs, 'FrameMaster');
    await db.saveMany(productObjs, 'Products');

    return frameSkuObjs;
};


const updateFrameSku = async (payload) => {
    let transaction = await db.dbTransaction();
    try {
        let date = new Date();

        let frameSkuObj = {
            ...payload,
            updated_at: date
        };

        await db.updateOneByCondition(frameSkuObj, { frame_code: payload.frame_code, size_code: payload.size_code, variant_code: payload.variant_code }, 'FrameMaster');
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};


const viewFrameSku = async (payload) => {


    let fields = '*,fm.status as status, fm.updated_at as updated_at, fm.created_at as created_at';
    let table = 'frame_master';
    let condition = 'where (fm.sku_code = :sku)';


    let replacements = {
        sku: payload.sku
    };

    const frameSkuDetails = await db.rawQuery(
        `SELECT ${fields} from ${table} fm 
            left join frame_details fd on fd.frame_code = fm.frame_code  
            left join frame_sizes fs on fs.frame_code = fm.frame_code and  fs.size_code = fm.size_code 
            left join variants v on v.variant_code = fm.variant_code 
            left join products p on p.sku = fm.sku_code ${condition} `,
        'SELECT',
        replacements
    );


    console.log(frameSkuDetails);

    if (!frameSkuDetails[0]) {
        throw new Error('Invalid Frame SKU');
    }

    return frameSkuDetails[0];
};


const viewFrameGallery = async (payload) => {

    let fields = '*';
    let table = 'frame_images';
    
    let frame_code =  payload.sku.substring(0,6);
    let variant_code = `VR${payload.sku.substring(payload.sku.length - 3)}`;
    
     let replacements = {
        frame_code,
        variant_code
    };
    
    let condition = 'where ( fi.frame_code = :frame_code and fi.variant_code = :variant_code )';
    
    if(payload.category){
        condition = 'where ( fi.frame_code = :frame_code and fi.variant_code = :variant_code and fi.image_category = :image_category )';
        replacements.image_category = payload.category;
    }
    
    const frameSkuDetails = await db.rawQuery(
        `SELECT ${fields} from ${table} fi  ${condition} `,
        'SELECT',
        replacements
    );
    
   
    return frameSkuDetails;
};


const viewFrameVariants = async (payload) => {


    let fields = '*';
    let table = 'frame_master';
    let condition = 'where ( fd.frame_code = :sku )';


    let replacements = {
        sku: payload.sku.substring(0,6)
    };

    

    const list = await db.rawQuery(
        `SELECT p.id, p.sku, p.retail_price as price, f.id as frame_id, CONCAT(fd.frame_name,' ',v.variant_name) as name, f.status 
        from ${table} f
        inner join products p on p.sku = f.sku_code
        inner join frame_details fd on f.frame_code = fd.frame_code
        inner join variants v on f.variant_code = v.variant_code
        ${condition} ORDER BY f.created_at`,
        'SELECT',
        replacements
    );
    
    
    if (!list[0]) {
        throw new Error('Invalid Frame SKU');
    }
    
    return ({ list });
};




const uploadFrameSkuImage = async (sku) => {

    const frameSkuDetails = await db.findOneByCondition({ sku_code: sku }, 'FrameMaster');

    if (!frameSkuDetails) {
        throw new Error('Invalid Frame SKU');
    }

    return frameSkuDetails;
};


const getFrameVariant = async (frameCode) => {

    let condition = `where (fm.frame_code = ${frameCode}%')`;
    let limitedQuery = '';

    if (payload.page != 'all') {
        const limit = constants.limit;
        const offset = (payload.page - 1) * limit;
        limitedQuery = ` LIMIT ${limit} OFFSET ${offset}`;
    }

    let table = 'frame_master';
    let fields = ' fm.sku_code, fd.frame_name, fd.show_on_app, fd.status, p.retail_price';


    const totalFrameVariants = await await db.rawQuery(`SELECT COUNT(fm.id)::int from ${table} fd ${condition}`, 'SELECT');

    const frameVariants = await db.rawQuery(
        `SELECT ${fields} from ${table} fm left join frame_detail fd on fd.frame_code = fm.frame_code left join products p on p.sku = fm.sku_code ${condition} order by fm.sku_code desc ${limitedQuery}`,
        'SELECT'
    );

    return ({ list: frameVariants, total_rows: totalFrameVariants[0].count });
};


const getProductsList = async (payload) => {
    const { limit } = constants;
    const offset = (payload.page - 1) * limit;
    let condition = `p.sku ilike '%${payload.search}%'`;
    if (payload.type === 'frame') {
        condition = condition + ` or CONCAT(fd.frame_name,' ',v.variant_name) ilike '%${payload.search}%'`;
        const products = await await db.rawQuery(
            `SELECT COUNT(p.id)::int from frame_master f
            inner join products p on p.sku = f.sku_code
            inner join frame_details fd on f.frame_code = fd.frame_code
            inner join variants v on f.variant_code = v.variant_code
            ${condition ? 'WHERE ' + condition : ''}`, 'SELECT');
        const list = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, f.id as frame_id, CONCAT(fd.frame_name,' ',v.variant_name) as name, f.status, f.show_on_app, f.show_sunwear_on_app from frame_master f
            inner join products p on p.sku = f.sku_code
            inner join frame_details fd on f.frame_code = fd.frame_code
            inner join variants v on f.variant_code = v.variant_code
            ${condition ? 'WHERE ' + condition : ''} ORDER BY f.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
            'SELECT'
        );
        return ({ list, total_rows: products[0].count });
    } else if (payload.type === 'clip-on') {
        condition = condition + ` or c.name ilike '%${payload.search}%'`;
        const products = await await db.rawQuery(
            `SELECT COUNT(p.id)::int from clipon c
            inner join products p on p.sku = c.sku
            ${condition ? 'WHERE ' + condition : ''}`, 'SELECT');
        const list = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, c.id as clipon_id, c.name as name, c.status from clipon c
            inner join products p on p.sku = c.sku
            ${condition ? 'WHERE ' + condition : ''} ORDER BY c.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
            'SELECT'
        );
        return ({ list, total_rows: products[0].count });
    } else if (payload.type === 'lens') {
        condition = condition + ` or l.name ilike '%${payload.search}%'`;
        const products = await await db.rawQuery(
            `SELECT COUNT(p.id)::int from lenses_detail l
            inner join products p on p.sku = l.sku_code
            ${condition ? 'WHERE ' + condition : ''}`, 'SELECT');
        const list = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, l.id as lens_id, l.brand, l.name, l.status from lenses_detail l
            inner join products p on p.sku = l.sku_code
            ${condition ? 'WHERE ' + condition : ''} ORDER BY l.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
            'SELECT'
        );
        return ({ list, total_rows: products[0].count });
    } else if (payload.type === 'contact-lens') {
        condition = condition + ` or cl.name ilike '%${payload.search}%'`;
        const products = await await db.rawQuery(
            `SELECT COUNT(p.id)::int from contact_lens cl
            inner join products p on p.sku = cl.sku
            ${condition ? 'WHERE ' + condition : ''}`, 'SELECT');
        const list = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, cl.id as contact_lens_id, cl.brand, cl.name, cl.status from contact_lens cl
            inner join products p on p.sku = cl.sku
            ${condition ? 'WHERE ' + condition : ''} ORDER BY cl.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
            'SELECT'
        );
        return ({ list, total_rows: products[0].count });
    } else if (payload.type === 'others') {
        condition = condition + ` or op.name ilike '%${payload.search}%'`;
        const products = await await db.rawQuery(
            `SELECT COUNT(p.id)::int from others_product op
            inner join products p on p.sku = op.sku
            ${condition ? 'WHERE ' + condition : ''}`, 'SELECT');
        const list = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, op.id as other_product_id, op.name, op.status from others_product op
            inner join products p on p.sku = op.sku
            ${condition ? 'WHERE ' + condition : ''} ORDER BY op.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
            'SELECT'
        );
        return ({ list, total_rows: products[0].count });
    }
};

const addLenses = async (payload) => {
    const productSku = await db.findOneByCondition({ sku: payload.sku_code }, 'Products', ['sku']);
    if (productSku) throw errorHandler.customError(messages.skuExist);
    let transaction = await db.dbTransaction();
    try {
        const newDate = new Date();
        const id = utils.generateRandom(6, false);
        const productObj = {
            id,
            sku: payload.sku_code.toLocaleUpperCase(),
            name: payload.name,
            retail_price: payload.retail_price,
            created_at: newDate,
            product_type: payload.category_name + ' lens',
            product_brand: payload.brand,
            company_supply_price: 0,
            tax_rate: 0,
            tax_name: '-',
            active: true,
            created_by: payload.created_by,
            updated_by: payload.created_by
        };
        const lensObj = {
            ...payload,
            sku_code: payload.sku_code.toLocaleUpperCase(),
            category_id: payload.category_name.toLocaleLowerCase(),
            is_prescription: true,
            prescription_id: `${payload.category_name} ${payload.prescription_name}`.replace(/ /g, '_').toLocaleLowerCase(),
            lense_type_id: `${payload.category_name} ${payload.prescription_name} ${payload.lense_type_name}`.replace(/ /g, '_').toLocaleLowerCase(),
            is_filter: !!payload.filter_type_name,
            filter_type_id: payload.filter_type_name ? `${payload.category_name} ${payload.prescription_name} ${payload.lense_type_name} ${payload.filter_type_name}`.replace(/ /g, '_').toLocaleLowerCase() : '',
            created_at: newDate,
            updated_at: newDate,
            updated_by: payload.created_by
        };
        await db.saveData(productObj, 'Products', transaction);
        await db.saveData(lensObj, 'LensesDetail', transaction);
        await db.rawQuery(`INSERT INTO product_stocks (id, product_id, sku, updated_at, store_id, store_name, quantity, reserved, in_transit_orders, in_transit_transfers)
                SELECT uuid_generate_v4() as id, '${id}' as product_id, '${payload.sku_code}' as sku, current_timestamp as updated_at, id as store_id, name as store_name, int '1000' as quantity, int '0'  as reserved, int  '0' as in_transit_orders, int '0' as in_transit_transfers FROM stores where status = 1`, 'SELECT');
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const getProductDetail = async (payload) => {
    const condition = `p.sku='${payload.sku}'`;
    if (payload.type === 'lens') {
        const product = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, l.id as lens_id, l.brand, l.name, l.status, l.category_name, l.prescription_name, l.lense_type_name, l.filter_type_name, l.index_value, l.created_at, l.updated_at, u.name as created_by, up.name as updated_by from products p
            inner join lenses_detail l on p.sku = l.sku_code
            left join users u on u.id=l.created_by
            left join users up on up.id=l.updated_by
            ${condition ? 'WHERE ' + condition : ''} LIMIT 1`,
            'SELECT'
        );
        return product.length > 0 ? product[0] : {};
    } else if (payload.type === 'clip-on') {
        const product = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, cl.id as clipon_id, cl.name, cl.status, cl.color, cl.size, cl.frame_sku, cl.created_at, cl.updated_at, u.name as created_by, up.name as updated_by, fm.frame_name, fm.variant_name from products p
            inner join clipon cl on p.sku = cl.sku
            left join users u on u.id=cl.created_by
            left join users up on up.id=cl.updated_by
            left join frame_master fm on fm.sku_code=cl.frame_sku
            ${condition ? 'WHERE ' + condition : ''} LIMIT 1`,
            'SELECT'
        );
        return product.length > 0 ? product[0] : {};
    } else if (payload.type === 'others') {
        const product = await db.rawQuery(
            `SELECT p.id, p.sku, p.retail_price as price, o.id as others_id, o.name, o.status , o.sku, o.created_at, o.updated_at, o.description,  u.name as created_by, up.name as updated_by from products p
            inner join others_product o on p.sku = o.sku
            left join users u on u.id=o.created_by
            left join users up on up.id=o.updated_by
            ${condition ? 'WHERE ' + condition : ''} LIMIT 1`,
            'SELECT'
        );
        return product.length > 0 ? product[0] : {};
    } else if (payload.type === 'contact-lens') {
        const product = await db.rawQuery(
            `select p.id, p.sku, p.retail_price as price, cl2.id as contact_lens, cl2.name, cl2.status, cl2.brand, cl2.description, cl2.created_at, cl2.updated_at, u.name as created_by, up.name as updated_by 
            from products p inner join contact_lens cl2 on p.sku = cl2.sku left join users u on u.id=cl2.created_by left join users up on up.id=cl2.updated_by
            ${condition ? 'WHERE ' + condition : ''} LIMIT 1`,
            'SELECT'
        );
        return product.length > 0 ? product[0] : {};
    }
    else {
        return {};
    }
};

const EditLenses = async (payload) => {
    const productSku = await db.findOneByCondition({ sku: payload.sku_code }, 'Products', ['sku']);
    if (!productSku) throw errorHandler.customError(messages.skuNotFound);
    let transaction = await db.dbTransaction();
    try {
        const newDate = new Date();
        const productObj = {
            name: payload.name,
            retail_price: payload.retail_price,
            updated_at: newDate,
            product_type: payload.category_name + ' lens',
            product_brand: payload.brand,
            company_supply_price: 0,
            updated_by: payload.updated_by
        };
        const lensObj = {
            ...payload,
            category_id: payload.category_name.toLocaleLowerCase(),
            is_prescription: true,
            prescription_id: `${payload.category_name} ${payload.prescription_name}`.replace(/ /g, '_').toLocaleLowerCase(),
            lense_type_id: `${payload.category_name} ${payload.prescription_name} ${payload.lense_type_name}`.replace(/ /g, '_').toLocaleLowerCase(),
            is_filter: !!payload.filter_type_name,
            filter_type_id: payload.filter_type_name ? `${payload.category_name} ${payload.prescription_name} ${payload.lense_type_name} ${payload.filter_type_name}`.replace(/ /g, '_').toLocaleLowerCase() : '',
            updated_at: newDate,
            updated_by: payload.updated_by
        };
        await db.updateOneByCondition(productObj, { sku: payload.sku_code }, 'Products', transaction);
        await db.updateOneByCondition(lensObj, { sku_code: payload.sku_code }, 'LensesDetail', transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const manageProduct = async (payload) => {
    if (payload.type === 'lens') {
        await db.updateOneByCondition({ status: payload.status }, { sku_code: payload.sku }, 'LensesDetail');
    } else if (payload.type === 'clip-on') {
        await db.updateOneByCondition({ status: payload.status }, { sku: payload.sku }, 'ClipOn');
    } else if (payload.type === 'others') {
        await db.updateOneByCondition({ status: payload.status }, { sku: payload.sku }, 'OthersProduct');
    } else if (payload.type === 'contact-lens') {
        await db.updateOneByCondition({ status: payload.status }, { sku: payload.sku }, 'ContactLens');
    } else if (payload.type === 'frame') {
        await db.updateOneByCondition({ status: payload.status }, { sku_code: payload.sku }, 'FrameMaster');
    }


    return { status: payload.status };
};

const addClipOn = async (payload) => {
    const productSku = await db.findOneByCondition({ sku: payload.sku_code }, 'Products', ['sku']);
    if (productSku) throw errorHandler.customError(messages.skuExist);
    let transaction = await db.dbTransaction();
    try {
        const newDate = new Date();
        const id = utils.generateRandom(6, false);
        const productObj = {
            id,
            sku: payload.sku_code.toLocaleUpperCase(),
            name: payload.name,
            retail_price: payload.retail_price,
            created_at: newDate,
            product_type: 'clip-on',
            product_brand: '--',
            company_supply_price: 0,
            tax_rate: 0,
            tax_name: '-',
            created_by: payload.created_by,
            updated_by: payload.created_by
        };
        const clipOnObj = {
            ...payload,
            sku: payload.sku_code.toLocaleUpperCase(),
            amount: payload.retail_price,
            created_at: newDate,
            updated_at: newDate,
            updated_by: payload.created_by
        };
        await db.saveData(productObj, 'Products', transaction);
        await db.saveData(clipOnObj, 'ClipOn', transaction);
        await db.rawQuery(`INSERT INTO product_stocks (id, product_id, sku, updated_at, store_id, store_name, quantity, reserved, in_transit_orders, in_transit_transfers)
                SELECT uuid_generate_v4() as id, '${id}' as product_id, '${payload.sku_code}' as sku, current_timestamp as updated_at, id as store_id, name as store_name, int '1000' as quantity, int '0'  as reserved, int  '0' as in_transit_orders, int '0' as in_transit_transfers FROM stores where status = 1`, 'SELECT');
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const editClipOn = async (payload) => {
    let transaction = await db.dbTransaction();
    try {
        const newDate = new Date();
        
        const productObj = {
            retail_price: payload.retail_price,
            updated_at: newDate,
        };

        const clipOnObj = {
            ...payload,
            updated_at: newDate,
        };

        await db.updateOneByCondition(clipOnObj, { sku: payload.sku_code }, 'ClipOn', transaction);
        await db.updateOneByCondition(productObj, { sku: payload.sku_code }, 'Products', transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};


const addContactLens = async (payload) => {
    const productSku = await db.findOneByCondition({ sku: payload.sku_code }, 'Products', ['sku']);
    if (productSku) throw errorHandler.customError(messages.skuExist);
    let transaction = await db.dbTransaction();
    try {
        const id = utils.generateRandom(6, false);
        const productObj = {
            id,
            sku: payload.sku_code.toLocaleUpperCase(),
            name: payload.name,
            retail_price: payload.retail_price,
            created_at: new Date(),
            product_type: 'Contact Lens',
            product_brand: payload.product_brand,
            company_supply_price: 0,
            tax_rate: 0,
            tax_name: '-',
            active: true,
            created_by: payload.created_by,
            updated_by: payload.created_by
        };
        const contactLensObj = {
            ...payload,
            sku: payload.sku_code.toLocaleUpperCase(),
            created_at: new Date(),
            updated_at: new Date(),
            updated_by: payload.created_by
        };
        await db.saveData(productObj, 'Products', transaction);
        await db.saveData(contactLensObj, 'ContactLens', transaction);
        await db.rawQuery(`INSERT INTO product_stocks (id, product_id, sku, updated_at, store_id, store_name, quantity, reserved, in_transit_orders, in_transit_transfers)
                SELECT uuid_generate_v4() as id, '${id}' as product_id, '${payload.sku_code}' as sku, current_timestamp as updated_at, id as store_id, name as store_name, int '1000' as quantity, int '0'  as reserved, int  '0' as in_transit_orders, int '0' as in_transit_transfers FROM stores where status = 1`, 'SELECT');
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};


const addOthersProuct = async (payload) => {
    const productSku = await db.findOneByCondition({ sku: payload.sku }, 'Products', ['sku']);
    if (productSku) throw errorHandler.customError(messages.skuExist);
    let transaction = await db.dbTransaction();
        try { 

            let date = new Date();
            let finalSku = payload.sku.toLocaleUpperCase();
            const productObj = {
                ...payload,
                sku: finalSku,
                retail_price: payload.price,
                created_at: date,
                product_type: 'Others',
            };
            const otherProductObj = {
                ...payload,
                sku: finalSku,
                created_at: date,
            };

            await db.saveData(productObj, 'Products', transaction);
            await db.saveData(otherProductObj, 'OthersProduct', transaction);

            // await db.rawQuery(`INSERT INTO product_stocks (id, product_id, sku, updated_at, store_id, store_name, quantity, reserved, in_transit_orders, in_transit_transfers)
            //     SELECT uuid_generate_v4() as id, '${id}' as product_id, '${payload.sku_code}' as sku, current_timestamp as updated_at, id as store_id, name as store_name, int '1000' as quantity, int '0'  as reserved, int  '0' as in_transit_orders, int '0' as in_transit_transfers FROM stores where status = 1`, 'SELECT');
            await transaction.commit();
            return true;
    } catch(error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const EditContactLens = async (payload) => {
    let transaction = await db.dbTransaction();
    try {
        let newDate = new Date();
        const productObj = {
            retail_price: payload.retail_price,
            updated_at: newDate,
        };
        const contactLensObj = {
            ...payload,
            updated_at: newDate,
        };
        await db.updateOneByCondition(productObj, { sku: payload.sku_code }, 'Products', transaction);
        await db.updateOneByCondition(contactLensObj, { sku: payload.sku_code }, 'ContactLens', transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};


const editOthersProuct = async (payload) => {
    let transaction = await db.dbTransaction();
    try {
        const newDate = new Date();
        const productObj = {
            retail_price: payload.price,
            updated_at: newDate,
        };

        const otherProductObj = {
            ...payload,
            updated_at: newDate,
        };

        await db.updateOneByCondition(otherProductObj, { sku: payload.sku }, 'OthersProduct', transaction);
        await db.updateOneByCondition(productObj, { sku: payload.sku }, 'Products', transaction);
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const lensUpload = async (payload, created_by) => {
    const data = {
        body: payload,
        public: true
    };
    let transaction = await db.dbTransaction();
    try {
        const workSheetsFromFile = xlsx.parse(payload.path);
        //return workSheetsFromFile;
        const sheetData = workSheetsFromFile[0].data;
        const finalData = sheetData.reduce((data, row, i) => {
        if(row.length > 0 && i > 0){
            let lense_type = row[10].split(' ').shift();

        let prescription_id = '';
        if(row[9] === 'Single Vision'){
            prescription_id = row[3].toLowerCase()+'_single_vision';
        }else if(row[9] === 'Progressive'){
            prescription_id = row[3].toLowerCase()+'_progressive';
        }else if(row[9] === 'Bifocal'){
            prescription_id = row[3].toLowerCase()+'_bifocal';
        }

        let lense_type_id = '';
        if( lense_type === 'Classic'){
            lense_type_id = '_classic';
        }else if( lense_type === 'Blue' || lense_type === 'Bluelight'){
            lense_type_id = '_blue_light';
        }else if( lense_type === 'High'){
            lense_type_id = `${row[10].toString().replace(/\./g,'')}`;
        }
        
        lense_type_id = `${prescription_id}${lense_type_id}`;
        let filter_type_id = '';
        if(row[11] === 'Transition'){
            filter_type_id = '_transition';
        }else if( row[11] === 'Blue Light'){
            filter_type_id = '_blue_light';
        }else if( row[11] === 'Tinted'){
            filter_type_id = '_tinted';
        }else if( row[11] === 'Polarized'){
            filter_type_id = '_polarized';
        }  
        filter_type_id = `${lense_type_id}${filter_type_id}`;
            data.sku.push(row[4]);
            data.lens.push({
                brand: row[1],
                category_id: row[3].toLocaleLowerCase(),
                category_name: row[3],
                sku_code: row[4].toLocaleUpperCase(),
                is_prescription: !!row[4],
                name: row[5],
                prescription_id,
                prescription_name: row[9] || '',
                is_lense_type: !!row[10],
                lense_type_id: row[10] ? lense_type_id : '',
                lense_type_name: row[10],
                is_filter: !!row[11],
                filter_type_id: row[11] ? filter_type_id : '',
                filter_type_name: row[11] || '',
                index_value: row[7],
                created_at: new Date(),
                created_by
            });
            data.product.push({
                sku: row[4].toLocaleUpperCase(),
                name: row[5],
                retail_price: row[12],
                company_supply_price: 0,
                tax_rate: 0,
                tax_name: '-',
                created_at: new Date(),
                created_by
            });
            data.stocks.push(db.rawQuery(`INSERT INTO product_stocks (id, sku, updated_at, store_id, store_name, quantity, reserved, in_transit_orders, in_transit_transfers)
            SELECT uuid_generate_v4() as id, '${row[4].toLocaleUpperCase()}' as sku, current_timestamp as updated_at, id as store_id, name as store_name, int '1000' as quantity, int '0'  as reserved, int  '0' as in_transit_orders, int '0' as in_transit_transfers FROM stores where status = 1`, 'SELECT'));
        }
        return data;
        },{product: [], lens: [], stocks: [], sku: []});
        if(
            !sheetData[0][0].toLocaleLowerCase().includes('no') || 
            !sheetData[0][1].toLocaleLowerCase().includes('brand') || 
            !sheetData[0][2].toLocaleLowerCase().includes('vendor') ||
            !sheetData[0][3].toLocaleLowerCase().includes('category') || 
            !sheetData[0][4].toLocaleLowerCase().includes('sku') ||  
            !sheetData[0][5].toLocaleLowerCase().includes('product') ||
            !sheetData[0][6].toLocaleLowerCase().includes('detail') || 
            !sheetData[0][7].toLocaleLowerCase().includes('index') || 
            !sheetData[0][8].toLocaleLowerCase().includes('coating') ||
            !sheetData[0][9].toLocaleLowerCase().includes('prescription') || 
            !sheetData[0][10].toLocaleLowerCase().includes('lens') || 
            !sheetData[0][11].toLocaleLowerCase().includes('filter') ||  
            !sheetData[0][12].toLocaleLowerCase().includes('price')
            ){
            throw errorHandler.customError('Invalid sheet format!');
        }
        const existingSKU = await db.findByCondition({sku: finalData.sku}, 'Products', ['sku']); 
        if(existingSKU && existingSKU.length > 0){
            const skus = existingSKU.map(s => s.sku);
            throw errorHandler.customError(`${skus.join(',')} are duplicate sku. Please remove from sheet`);
        }
        await db.saveMany(finalData.product, 'Products', transaction);
        await db.saveMany(finalData.lens, 'LensesDetail', transaction);
        await s3Upload.handleFileUpload(data, 'lens', process.env.NODE_ENV === 'production' ? constants.bucket.product : '');
        await Promise.all(finalData.stocks);
        await transaction.commit();
        return true;
    } catch (error) {
        console.log('Error:', error);
        transaction.rollback();
        throw new Error(error.message);
    }
};

const showFrameOnApp = async (payload) => {
    const frameObject = {
        updated_at: new Date(),
        updated_by: payload.updated_by
    };
    if(payload.category === 'optical'){
        frameObject.show_on_app = payload.status;
    } else {
        frameObject.show_sunwear_on_app = payload.status;
    }
    return await db.updateOneByCondition(frameObject, { sku_code: payload.sku_code }, 'FrameMaster');
};

module.exports = {
    getFrameNames,
    addFrameName,
    frameNameDetails,
    updateFrameNameActivity,
    updateFrameName,
    getFrameColors,
    frameColorDetails,
    addFrameColor,
    updateFrameColorActivity,
    updateFrameColor,
    frameColorImages,
    frameSizeAvialability,
    addFrameSku,
    viewFrameSku,
    viewFrameGallery,
    viewFrameVariants,
    updateFrameSku,
    uploadFrameSkuImage,
    getFrameVariant,
    getProductsList,
    addLenses,
    getProductDetail,
    EditLenses,
    manageProduct,
    addClipOn,
    editClipOn,
    addOthersProuct,
    editOthersProuct,
    addContactLens,
    EditContactLens,
    lensUpload,
    showFrameOnApp
};