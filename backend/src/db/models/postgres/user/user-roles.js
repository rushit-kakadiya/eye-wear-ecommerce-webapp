/**
 * User otp DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserRoles = sequelize.define(
  'user_roles',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    role: {
        type: Sequelize.STRING(50),
        allowNull: false,
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
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    },
    created_by: {
        type: Sequelize.UUID,
        allowNull: true,
    },
    updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
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

module.exports = UserRoles;
