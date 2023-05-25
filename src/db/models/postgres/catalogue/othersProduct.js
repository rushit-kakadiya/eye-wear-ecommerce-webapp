
/**
 * Lense Details DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const OthersProduct = sequelize.define(
	'others_product',
		{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		name: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		amount: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		sku: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 1,
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
		description: {
			type: Sequelize.STRING(255),
			allowNull: true,
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

module.exports = OthersProduct;
