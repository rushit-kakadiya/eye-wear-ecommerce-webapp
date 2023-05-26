/**
 * Contact Lens DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const ContactLens = sequelize.define(
  'contact_lens',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    brand: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    retail_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    sku: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    suppliers: {
      type: Sequelize.STRING(100),
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
    created_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    updated_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1
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

module.exports = ContactLens;
