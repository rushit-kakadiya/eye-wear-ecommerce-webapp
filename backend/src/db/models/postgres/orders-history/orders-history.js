/**
 * Page Address DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const OrdersHistory = sequelize.define(
  'orders_history',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    order_no: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    status: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    source: {
        type: Sequelize.ENUM,
        values: ['turboly', 'ninja', 'xendit', 'app', 'store'],
        allowNull: false,
        defaultValue: 'ninja',
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

module.exports = OrdersHistory;
