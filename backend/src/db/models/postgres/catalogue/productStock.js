/**
 * Product stocks DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const ProductStock = sequelize.define(
	'product_stocks',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		product_id: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		sku: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		store_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		store_name: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		quantity: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		reserved: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		in_transit_orders: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		in_transit_transfers: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8',
		indexes:[{
			unique: false,
			fields:['sku', 'store_id'],
		}]
	}
);

module.exports = ProductStock;
