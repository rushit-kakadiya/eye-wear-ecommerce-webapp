const db = require('../../utilities/database');
const { v4: uuidv4 } = require('uuid');
var path = require('path');
const { messages, utils, constants, errorHandler } = require('../../core');
const { storeImageUpload } = require('../../core/s3Upload');

const getStores = async (payload) => {
    const limit = constants.limit;
    const offset = (payload.page - 1) * limit;

    let condition = '';

    let table = 'stores';
    let fields = ' s.id, s.name, s.store_code, s.store_region, s.phone, s.email, s.is_cafe, s.city, s.active ';

    if (payload.search) {
        condition = condition + ` where (s.name ilike '%${payload.search}%')`;
    }
    if (payload.page) {
        const totalStores = await await db.rawQuery(`SELECT COUNT(s.id)::int from ${table} s ${condition}`, 'SELECT');

        const stores = await db.rawQuery(
            `SELECT ${fields} from ${table} s ${condition}  LIMIT ${limit} OFFSET ${offset}`,
            'SELECT'
        );

        return ({ list : stores, total_rows: totalStores[0].count });
    }  else {
        if(!payload.type){
            return await db.findByCondition({ status: 1, active: true }, 'Store', ['id', 'name']);
        } else {
            return await db.rawQuery(
                'select id, name from stores s where status=1 and cast(id as varchar) not in (select store_id from users where role=1 and store_id IS NOT NULL);',
                'SELECT'
            );
        }
    } 
    
};

const addStore = async (payload) => {

    let storeDuplicateQuery = 'select * from stores Where (id = :id)';

    let replacements = {
        id: payload.id
    };

    let storeDuplicateResults = await db.rawQuery(storeDuplicateQuery, 'SELECT', replacements);

    if(storeDuplicateResults.length > 0) {
        throw new Error('id The truboly id you have entered is duplicate');
    }
    
    let date = new Date();
    let store_pk = uuidv4();
    let storeObj = {
        ...payload,
        store_pk: store_pk,
        store_region : payload.region,
        created_at : date
    };
    delete storeObj.region;

    await db.saveData(storeObj, 'Store');
    await db.rawQuery(`INSERT INTO product_stocks (id, product_id, sku, updated_at, store_id, store_name, quantity, reserved, in_transit_orders, in_transit_transfers)
                SELECT uuid_generate_v4() as id, id as product_id, sku, current_timestamp as updated_at, int '${payload.id}' as store_id, '${payload.name}' as store_name, int '1000' as quantity, int '0'  as reserved, int  '0' as in_transit_orders, int '0' as in_transit_transfers FROM products`, 'SELECT');
    return storeObj;
};

const updateStore = async (payload) => {
    let transaction = await db.dbTransaction();
    try{

        let date = new Date();        
        await db.updateOneByCondition({
            ...payload,
            store_region : payload.region,
            updated_at: date,
        }, {
            id: payload.id
        }, 'Store');

        await transaction.commit();
        return payload;
    } catch (error) {
        transaction.rollback();
        throw errorHandler.customError(messages.updateStoreError);
    }
};

const storeDetail = async (store_id) => {

    let table = 'stores';
    let fields = ' * ';

    let replacements = {
        store_id
    }; 
    
    const store = await db.rawQuery(
        `SELECT ${fields} from ${table} s where s.id = :store_id`,
        'SELECT',
        replacements
    );

    if (store.length != 1) {
        throw new Error('Invalid Store no');
    }
    return  store[0] ;
};

const storeActivity = async (payload) => {
    const dbStore = await db.findOneByCondition({ id: payload.id }, 'Store');

    if (!dbStore) throw errorHandler.customError('Invalid Store');

    let status = false;
    if(payload.status == 'true'){
        status = true;
    }

    let activityStatus = await db.updateOneByCondition({ active : status },{ id: payload.id }, 'Store');

    if(activityStatus[0]){
        return true;
    }else{
        return false;
    }
};


const storeImages = async (payload) => {
    const dbStore = await db.findOneByCondition({ id: payload.id }, 'Store');

    if (!dbStore) throw errorHandler.customError('Invalid Store');

    const data = {
        body: payload,
        public: true
    };
    

    let type =  payload.type;
    let columnObj = {};
    let ext = path.extname(payload.originalFilename);


    let folder = `store/${payload.id}`;
    let fileName = '';
    
    if(type == 'store_image'){
        fileName = `store${ext}`;
        columnObj = { store_image_key : `store/${payload.id}/store${ext}` };
    }
    else if(type == 'map_image'){
        fileName = `map${ext}`;
        columnObj = { map_image_key : `store/${payload.id}/map${ext}` };
    }
    else if(type == 'email_image'){
        fileName = `email${ext}`;
        columnObj = { email_image_key : `store/${payload.id}/email${ext}` };
    }

    console.log(columnObj);
    
    let uploadingResponse = await storeImageUpload(data, folder, fileName); 

    let imageStatus = await db.updateOneByCondition( columnObj,{ id: payload.id }, 'Store');


    if(imageStatus[0]){
        return { status : true, file : `${uploadingResponse.fileName}`};
    }else{
        return false;
    }
};

const redeemCoffeeInStore = async (payload) => {
    let date = new Date();
    return await db.saveData({
        ...payload,
        created_at : date
    }, 'RedeemCoffeeLogs');
};

module.exports = {
    getStores,
    addStore,
    updateStore,
    storeDetail,
    storeActivity,
    storeImages,
    redeemCoffeeInStore
};