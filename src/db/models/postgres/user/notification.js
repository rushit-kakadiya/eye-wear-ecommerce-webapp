/**
 * User Notification DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Notification = sequelize.define(
  'user_notifications',
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
    target_id: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    type: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    status: {
        type: Sequelize.INTEGER, // 0 => unread, 1 => view, 2 => read
        allowNull: false,
        defaultValue: 0
    },
    message: {
        type: Sequelize.JSON,
        allowNull: true
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

module.exports = Notification;
