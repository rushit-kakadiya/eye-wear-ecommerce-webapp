/**
 * Cart add on items DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const CartAddonItems = sequelize.define(
  'cart_addon_items',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    cart_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    prescription_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: true,
    },
    addon_product_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    addon_product_sku: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    lense_color_code: {
      type: Sequelize.STRING(50),
      allowNull: false,
      default: 'CLEAR'
    },
    addon_item_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    type: {
      type: Sequelize.STRING(255),
      allowNull: true, // left, right, both
      defaultValue: 'both'
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
    is_sunwear: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    packages: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    category: {
      type: Sequelize.INTEGER(1), // 1=>lens, 2=>clipon, 3=>contact lens, 4=> others
      allowNull: false,
      defaultValue: 1
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

module.exports = CartAddonItems;
