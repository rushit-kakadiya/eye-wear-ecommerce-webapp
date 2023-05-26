/**
 * Cart DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const CartItems = sequelize.define(
  'cart_items',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    prescription_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    product_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    sku_code: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    item_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1, // 1 => buy online, 2 => Buy for home try on
    },
    product_type: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1, // 1 => FRAME 2 => LENSE, 3 => CLIPON
    },
    product_category: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1, // 1 => OPTICAL 2 => SUNWEAR, 3 => CLIPON
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_warranty: {
      type: Sequelize.INTEGER(1), //  0 => no warranty,  1 => paid warranty, 2 => free warranty
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    },
    updated_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    discount_amount: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    discount_type: {
      type: Sequelize.INTEGER(1), // 1 => amount, 2 => %age
      allowNull: true
    },
    discount_note: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    packages: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    item_discount_amount: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0
    }
  },
  {
    schema: 'eyewear',
    freezeTableName: true,
    timestamps: false,
    collate: 'utf8_unicode_ci',
    charset: 'utf8',
  }
);

module.exports = CartItems;
