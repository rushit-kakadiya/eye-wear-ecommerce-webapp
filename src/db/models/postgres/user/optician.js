/**
 * User DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Optician = sequelize.define(
  'optician',
  {
    id: {
      type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
    },
    country_code: {
      type: Sequelize.STRING(5),
      allowNull: false,
      defaultValue: '+62',
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING(12),
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    is_email_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_mobile_verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
      type: Sequelize.INTEGER(1),
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

module.exports = Optician;
