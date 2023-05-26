/**
 * Lense Details DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const ClipOn = sequelize.define(
  'clipon',
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
    color: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    size: {
      type: Sequelize.STRING(100),
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
    frame_sku: {
      type: Sequelize.STRING(100),
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
    created_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    updated_by: {
      type: Sequelize.UUID,
      allowNull: true
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

module.exports = ClipOn;
