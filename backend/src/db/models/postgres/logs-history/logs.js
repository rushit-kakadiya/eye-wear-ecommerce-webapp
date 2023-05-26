/**
 * Page Address DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Logs = sequelize.define(
  'logs_history',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    source_id: {
        type: Sequelize.UUID,
        allowNull: false
    },
    new_val: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    old_val: {
      type: Sequelize.JSON,
      allowNull: true
    },
    type: {
        type: Sequelize.STRING(255), // order, admin_user, store, employee, customer
        allowNull: false
    },
    action: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: false
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

module.exports = Logs;
