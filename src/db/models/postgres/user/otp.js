/**
 * User otp DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserOtp = sequelize.define(
  'user_otps',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    otp: {
        type: Sequelize.STRING(20),
        allowNull: true,
    },
    phone_number: {
      type: Sequelize.STRING(15),
      allowNull: true,
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
    is_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

module.exports = UserOtp;
