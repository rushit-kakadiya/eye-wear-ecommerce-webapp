/*
* Order items DB Schema
*/

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const OrderItem = sequelize.define(
	'order_items',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		prescription_id: {
			type: Sequelize.UUID,
			allowNull: true,
		},
		order_no: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		sku: {
			type: Sequelize.STRING(30),
			allowNull: false,
		},
		retail_price: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		discount_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		user_credit: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		eyewear_points_credit: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		currency_code: {
			type: Sequelize.STRING(20),
			allowNull: false,
			defaultValue: 'IDR'
		},
		tax_rate: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0
		},
		quantity: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		order_item_total_price: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		product_type: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
			defaultValue: 1, // 1 => FRAME 2 => LENSE, 3 => CLIPON
		},
		product_category: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1, // 1 => OPTICAL 2 => SUNWEAR,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		is_warranty: {
			type: Sequelize.INTEGER(1), //  0 => no warranty,  1 => paid warranty, 2 => free warranty
			allowNull: false,
			defaultValue: 0,
		},
		discount_type: {
			type: Sequelize.INTEGER(1), // 1 => amount, 2 => %age
			allowNull: true
		},
		discount_note: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		packages: {
            type: Sequelize.STRING(255),
            allowNull: true
		},
		item_discount_amount: {
			type: Sequelize.FLOAT,
			allowNull: true,
			defaultValue: 0
		}
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8',
	}
);

module.exports = OrderItem;
