/**
 * Voucher exclusive SKU  DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const VoucherExclusiveSKUMapping = sequelize.define(
	'voucher_exclusive_sku_mapping',
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
		},
		sku_code: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		created_by: {
			type: Sequelize.UUID,
			allowNull: true
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		updated_by: {
			type: Sequelize.UUID,
			allowNull: true
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: false,
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

module.exports = VoucherExclusiveSKUMapping;
