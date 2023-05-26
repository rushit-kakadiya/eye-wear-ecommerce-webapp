/**
 * Payment auth response DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const PaymentAuthResponse = sequelize.define(
	'payment_auth_response',
	{
		id: {
			type: Sequelize.STRING(100),
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		account_holder_name: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		amount: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		suggested_amount: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		expected_amount: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		authorized_amount: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		capture_amount: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		currency: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		business_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		bank_code: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		account_number: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		owner_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		user_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		merchant_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		merchant_code: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		merchant_reference_code: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		external_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		order_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		eci: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		charge_type: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		masked_card_number: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		card_brand: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		card_type: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		descriptor: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		bank_reconciliation_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		approval_code: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		created: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		expiration_date: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		is_single_use: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		is_closed: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		redirect_url: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		disbursement_description: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		payment_type: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		paypal_response: {
			type: Sequelize.JSON,
			allowNull: true,
    	},
		status: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8',
		indexes:[
			{
				unique: false,
				fields:['external_id'],
			}],
	}
);

module.exports = PaymentAuthResponse;
