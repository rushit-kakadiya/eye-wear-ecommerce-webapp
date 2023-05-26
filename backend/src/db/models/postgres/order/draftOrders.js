/*
 * Draft orders DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const DraftOrders = sequelize.define(
	'draft_orders',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		order_no: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		address_id: {
			type: Sequelize.UUID,
			allowNull: true,
		},
		store_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		stock_store_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
        order_amount: {
			type: Sequelize.FLOAT,
			allowNull: true,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		created_by: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
		},
		updated_by: {
			type: Sequelize.UUID,
			allowNull: true,
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		sales_channel: {
			type: Sequelize.STRING(100),
			allowNull: false,
			defaultValue: 'store'
		}
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8',
		indexes:[{
			unique: false,
			fields:['user_id'],
		}]
  	}
);

module.exports = DraftOrders;
