
const { database: db } = require('../../utilities');
const { elasticsearch: {esClient} } = require('../../core');


const setElasticData = async (payload) => {
    try {
        if(payload.type === 3){
            const users = await db.findByCondition({role: 2, status: 1}, 'User', ['id', 'mobile', 'name', 'email', 'dob', 'gender', 'country_code']);
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
            return 'Users Done!';
        } else if(payload.type === 2){
            let query = `select tmp.*, p.id as turboly_id, p.retail_price, p.description, p.product_type, p.product_brand,
                concat('frames/', p.sku, '/', p.sku, '_S_0_U.jpg') as image_key_sunglass, 
                concat('frames/', p.sku, '/', p.sku, '_E_0_U.jpg') as image_key_eyeglass, true as active
                from 
                (select f.frame_name, f.frame_code, f.frame_rank,
                max(fd.fit) as fit, max(fd.material) as material, max(fd.face_shape) as face_shape, max(fd.frame_shape) as frame_shape, max(fd.gender) as gender, 
                vr.id as variant_id, vr.variant_code, vr.variant_name, vr.icon_image_key, vr.variant_rank,
                max(fm.sku_code) as sku_code
                from products p
                inner join frame_master fm on fm.sku_code = p.sku
                inner join frame f on f.frame_code = fm.frame_code
                inner join frame_details fd on fd.frame_code = f.frame_code
                inner join variants vr on fm.variant_code = vr.variant_code
                where p.active = true
                group by f.id, f.frame_code, f.frame_name, f.frame_code, f.frame_rank,
                vr.id, vr.variant_code, vr.variant_name, vr.icon_image_key, vr.variant_rank
                order by f.frame_code, vr.variant_code) as tmp inner join products p on tmp.sku_code = p.sku;`;

            const products = await db.rawQuery(query, 'SELECT');
            await esClient.indices.delete({
                index: 'store_products',
                ignore: [404]
            });
            await esClient.indices.create({ index: 'store_products' });
            const body = products.flatMap(product => [{ index: { _index: 'store_products' } }, product]);
            await esClient.bulk({
                refresh: true,
                body
            });
            //Stores
            let storeQuery = 'select * from stores where status = 1';
            const stores = await db.rawQuery(storeQuery, 'SELECT');
            await esClient.indices.delete({
                index: 'stores',
                ignore: [404]
            });
            await esClient.indices.create({ index: 'stores' });
            const storeBody = stores.flatMap(store => [{ index: { _index: 'stores' } }, store]);
            await esClient.bulk({
                refresh: true,
                body: storeBody
            });
            
            return 'Products Done!';
        }
    } catch (error) {
        console.log('Error:', error);
        throw new Error(error.message);
    }
};


module.exports = {
    setElasticData
};