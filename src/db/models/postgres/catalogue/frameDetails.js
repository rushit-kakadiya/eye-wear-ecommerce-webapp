/**
 * Frame Details DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const FrameDetail = sequelize.define(
  'frame_details',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    frame_code: {
      type: Sequelize.STRING(10),
      allowNull: false,
      unique: true,
    },
    fit: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    frame_shape: {
      type: Sequelize.ARRAY(Sequelize.STRING(100)),
      allowNull: false,
    },
    material: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    face_shape: {
      type: Sequelize.ARRAY(Sequelize.STRING(100)),
      allowNull: true,
    },
    gender: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    frame_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    frame_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    frame_rank: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    frame_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
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

module.exports = FrameDetail;
