/**
 * Frame DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Frame = sequelize.define(
  'frame',
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
    frame_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    frame_rank: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date(),
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
  }
);

module.exports = Frame;
