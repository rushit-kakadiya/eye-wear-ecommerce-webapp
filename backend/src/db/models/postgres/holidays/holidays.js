/**
 * Holidays in year DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Holidays = sequelize.define(
  'holidays',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    year: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    dates: {
        type: Sequelize.JSON,
        allowNull: false,
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

module.exports = Holidays;
