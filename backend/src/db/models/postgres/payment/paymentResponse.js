/**
 * Payment response DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const PaymentResponse = sequelize.define(
  'payment_response',
  {
    id: {
			type: Sequelize.STRING(100),
			allowNull: false,
			primaryKey: true,
    },
    transaction_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    order_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    amount: {
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
    payment_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    business_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    account_number: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    bank_code: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    callback_virtual_account_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    owner_id: {
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
    mid_label: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    transaction_timestamp: {
			type: Sequelize.DATE,
			allowNull: true,
    },
    cardless_credit_type: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    callback_authentication_token: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    customer_details: {
			type: Sequelize.JSON,
			allowNull: true,
    },
    shipping_address: {
			type: Sequelize.JSON,
			allowNull: true,
    },
    items: {
			type: Sequelize.ARRAY(Sequelize.JSON),
			allowNull: true,
    },
    payment_type: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    transaction_status: {
			type: Sequelize.STRING(100),
			allowNull: true,
    },
    paypal_token: {
      type: Sequelize.STRING(100),
			allowNull: true,
    },
    payer_id: {
      type: Sequelize.STRING(100),
			allowNull: true,
    },
		paypal_response: {
			type: Sequelize.JSON,
			allowNull: true,
    },
    created: {
			type: Sequelize.DATE,
			allowNull: true,
    },
    updated: {
			type: Sequelize.DATE,
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
    indexes:[{
			unique: false,
			fields:['external_id'],
		}]
  }
);

module.exports = PaymentResponse;
