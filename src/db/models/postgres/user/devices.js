/**
 * User devices DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserDevices = sequelize.define(
  'user_devices',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    device_token: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    device_type: {
        type: Sequelize.STRING(10),
        allowNull: true,
    },
    login_token: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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

module.exports = UserDevices;
