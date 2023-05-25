/**
 * Stores DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Store = sequelize.define(
  'stores',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    store_code: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    store_region: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    fax: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    sales_tax: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'PPN'
    },
    ecommerce: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    can_access_other_store_stocks: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    zipcode: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    province: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    lat: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    long: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    store_image_key: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: 'store/EYEWEAR_STORE_PLACEHOLDER.jpg'
    },
    map_image_key: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: 'store/map_PLACEHOLDER.png'
    },
    store_timing: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    is_cafe: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    email_image_key: {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: 'email-images/banner/placeholder.jpg'
    },
    store_pk: {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: Sequelize.UUIDV4,
    },
    store_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    opening_time: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    closing_time: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    updated_by: {
      type: Sequelize.UUID,
      allowNull: true
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

module.exports = Store;
