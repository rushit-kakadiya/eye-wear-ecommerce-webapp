/**
 * User otp DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Roles = sequelize.define(
  'roles',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    role: {
      type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'super-admin',
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'Super Admin' // [Super Admin, Admin, Store Manager, Store Account, Customer Services, Finance]
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

module.exports = Roles;
