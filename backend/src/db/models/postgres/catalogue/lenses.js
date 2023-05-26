/**
 * Lense Details DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Lenses = sequelize.define(
	'lenses',
		{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		category_id: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		category_name: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		category_description: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		category_amount: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		is_prescription: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		prescription_id: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		prescription_name: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		prescription_description: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		prescription_amount: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		is_lense_type: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		lense_type_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		lense_type_name: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		lense_type_description: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		lense_type_optional_description: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		lense_type_amount: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		is_filter: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		filter_type_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		filter_type_name: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		filter_type_description: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		filter_type_amount: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 0
		},
		sku_code: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 1,
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

module.exports = Lenses;
