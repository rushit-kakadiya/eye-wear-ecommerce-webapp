/*
* Turboly sale DB Schema
*/

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const TurbolySaleDetails = sequelize.define(
	'turboly_sale_details',
		{
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		ref_code: {
			type: Sequelize.STRING(100),
			allowNull: false,
			unique: true,
		},
		notes: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		register_id: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		store_id: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		customer_id: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		tax_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		discount_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		rounding_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		cogs: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		currency: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		workflow_state: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		is_ecommerce: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		ecommerce_ref_code: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		customer: {
			type: Sequelize.JSON,
			allowNull: false,
		},
		sale_lines: {
			type: Sequelize.ARRAY(Sequelize.JSON),
			allowNull: false,
		},
		payment_lines: {
			type: Sequelize.ARRAY(Sequelize.JSON),
			allowNull: false,
		},
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8',
	}
);

module.exports = TurbolySaleDetails;
