/**
 * Appointment history DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const AppointmentHistory = sequelize.define(
  'appointment_history',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
		appointment_id: {
			type: Sequelize.UUID,
			allowNull: false
		},
    appointment_status: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    status: {
			type: Sequelize.INTEGER,
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

module.exports = AppointmentHistory;
