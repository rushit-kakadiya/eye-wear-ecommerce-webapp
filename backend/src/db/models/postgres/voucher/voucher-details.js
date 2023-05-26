/**
 * voucher details DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const VoucherDetails = sequelize.define(
	'voucher_details',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		voucher_code: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true
		},
		voucher_type: { // 1: percentage, 2: absolute
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		voucher_category: {
			type: Sequelize.ENUM,
			allowNull: false,
			values: [
				'generic',
				'user',
				'referral'
			],
			defaultValue: 'user'
		},
		voucher_tag: {
			type: Sequelize.ENUM,
			allowNull: false,
			values: [
				'generic',
				'user',
				'referral',
				'birthday'
			],
			defaultValue: 'user'
		},
		voucher_percentage: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		voucher_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 1,
		},
		voucher_max_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		minimum_cart_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 1,
		},
		is_single_user: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: true
		},
		first_order: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		date_constraint: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		expire_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		count_constraint: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		max_count: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		single_user_count_constraint: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		single_user_max_count: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		max_cart_size: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		voucher_title: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		term_conditions: {
			type: Sequelize.TEXT,
			allowNull: true,
			defaultValue: 'Voucher can\'t be combined with other discount/voucher,Can only be used for your first purchase via app (Android/iOS),Maximum discount Rp250.000'
		},
		sub_title: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		voucher_image_key: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		voucher_sku_mapping_type: { // 1: voucher_exclusive_sku table, 2: voucher_exclusive_sku_mapping, 3: All Products, 4: voucher_excludes_sku, 5: voucher_includes_sku
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		created_by: {
			type: Sequelize.UUID,
			allowNull: false
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		updated_by: {
			type: Sequelize.UUID,
			allowNull: true
		},
		hide: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		is_expired: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1, // 1 => active, 2 => in-active
		},
		start_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		min_cart_count: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 1,
		},
		avilabilty_type: {
			type: Sequelize.JSON,
			// allowNull: false,	// 1 => store, 2 => mobile, 3 => hto, 4 => whatsapp, 5 => website
			defaultValue: []
		},
		discount_category: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		discount_sub_category: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8'
	}
);

module.exports = VoucherDetails;

