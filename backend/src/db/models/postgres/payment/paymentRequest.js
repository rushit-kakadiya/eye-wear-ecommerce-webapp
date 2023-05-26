/**
 * Payment request DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const PaymentRequest = sequelize.define(
  'payment_request',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
    },
    order_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    external_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
    },
    token_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    auth_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
    },
    bank_code: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    amount: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    cardless_credit_type: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    payment_type: {
      type: Sequelize.STRING(100),
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
    expiration_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    payment_method: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // 0=>cash, 1=>card, 2=>VA, 3=>cardless (kredivo), 4=>no payment, 5=>edc, 6=>bank transfer, Insurance=>7, 8=>Atome, 9=>Mekari, 10=>DANA, 11=>OVO, 12=>GoPay, 13=>LinkAja, 14=>ShopeePay, 15 => Paypal 16=>Dept Store, 17 => XENDIT CARD, 18 => Corporate Try On, 19 => Endorsement, 20 => Employee Claim, 21 => warranty, 22 => xendit invoice 
    },
    created_by: {
      type: Sequelize.STRING(36),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updated_by: {
      type: Sequelize.STRING(36),
      allowNull: true,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date(),
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: Sequelize.STRING(500),
      allowNull: true,
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
      fields:['order_no', 'external_id'],
    }]
  }
);

module.exports = PaymentRequest;
