/**
 * Sicepat delivery Address DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const DeliveryPartners = sequelize.define(
  'delivery_partners',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    shipper_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    delivery_partner: {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'sicepat',
    },
    status: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    shipper_ref_no: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    tracking_ref_no: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    order_no: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    previous_status: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: '',
    }, 
    tracking_id: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    is_updated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

module.exports = DeliveryPartners;
