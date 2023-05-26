const db = require('../../utilities/database');

const getContactLens = async () => {
    return await db.findByCondition({status: 1}, 'ContactLens', ['id', 'name', 'sku', 'retail_price']);
};

const getCartContactLens  = async (payload) => {
    const list = await db.rawQuery(
        `select c.id , c.addon_product_id, c.addon_product_sku, c.addon_item_count, c.is_sunwear, c.packages, cl.sku, cl.name, cl.retail_price,
          c.prescription_id, c.type, c.item_discount_amount as discount_amount, c.discount_type, c.discount_note, c.created_at
          from cart_addon_items as c join products as p on p.sku = c.addon_product_sku
          inner join contact_lens as cl on cl.sku = c.addon_product_sku
          where c.user_id='${payload.user_id}' and category = 3 ORDER BY c.created_at ASC`,
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

module.exports = {
    getContactLens,
    getCartContactLens
};