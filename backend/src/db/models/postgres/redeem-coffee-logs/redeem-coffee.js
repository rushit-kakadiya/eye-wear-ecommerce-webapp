/**
 * Page Address DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const RedeemCoffeeLogs = sequelize.define(
  'redeem_coffee_logs',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    order_no: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    created_by: {
			type: Sequelize.UUID,
			allowNull: true,
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

module.exports = RedeemCoffeeLogs;
