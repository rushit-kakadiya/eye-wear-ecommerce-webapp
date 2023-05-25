/*
 * Turboly products DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const TurbolyProducts = sequelize.define(
	'turboly_products',
	{
		id: {
			type: Sequelize.STRING(255),
			allowNull: false,
			primaryKey: true,
		},
		sku: {
			type: Sequelize.STRING(255),
			allowNull: false,
			unique: true,
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		retail_price: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		company_supply_price: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		tax_rate: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		tax_name: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		updated_at: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		product_type: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		product_brand: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		product_tags: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		product_suppliers: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		product_code: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		supplier_code: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		is_bundle: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		require_serial: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		track_inventory: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		consignee: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		consignor: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		active: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		attribute_1: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		attribute_2: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		attribute_3: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		attribute_4: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		attribute_5: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		image_url_1: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		image_url_2: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		image_url_3: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		image_url_4: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8',
		indexes: [{
			unique: true,
			fields:['sku'],
		}]
	}
);

module.exports = TurbolyProducts;
