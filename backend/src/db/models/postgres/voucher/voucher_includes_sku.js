/**
 * Voucher exclusive SKU  DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const VoucherIncludesSKU = sequelize.define(
	'voucher_includes_sku',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		voucher_id: {
			type: Sequelize.UUID,
			allowNull: false
        },
        type: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		sku_code: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true
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

module.exports = VoucherIncludesSKU;
