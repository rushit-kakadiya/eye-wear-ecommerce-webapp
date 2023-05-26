/**
 * Frame images DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const CliponImage = sequelize.define(
  'clipon_images',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    sku_code: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    frame_code: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    variant_code: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    image_key: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
    image_category: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    image_type: {
      type: Sequelize.STRING(20), // FRAME, MODEL_M, MODEL_W, MODEL_M_GIF, MODEL_W_GIF
      allowNull: false,
    },
    image_code: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    image_order_key: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
    indexes: [{
      unique: false,
      fields: ['sku_code', 'status'],
    }]
  }
);

module.exports = FrameImage;
