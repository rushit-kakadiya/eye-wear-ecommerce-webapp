/*
* Order item add on DB Schema
*/

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const OrderItemAddon = sequelize.define(
	'order_item_addons',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		order_item_id: {
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
		lense_color_code: {
			type: Sequelize.STRING(50),
			allowNull: false,
			default: 'CLEAR'
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
		quantity: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		prescription_id: {
			type: Sequelize.UUID,
			allowNull: true,
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
		type: {
			type: Sequelize.STRING(50),
			allowNull: true, // left, right, both, clipon, otherProduct, contactLens
		},
		is_sunwear: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
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
		is_lens_change: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		category: {
            type: Sequelize.INTEGER(1), // 1=>lens, 2=>clipon, 3=>contact lens, 4=> others
			allowNull: false,
			defaultValue: 1
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

module.exports = OrderItemAddon;
