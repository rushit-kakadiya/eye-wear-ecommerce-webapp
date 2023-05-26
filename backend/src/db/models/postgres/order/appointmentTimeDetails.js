/*
 * HTO Appointment Timing DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const AppointmentTimeDetails = sequelize.define(
	'appointment_time_details',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		appointment_id: {
			type: Sequelize.UUID,
			allowNull: false
		},
		slot_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		appointment_date: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		optician_id: {
			type: Sequelize.UUID,
			allowNull: true,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		created_by: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		updated_by: {
			type: Sequelize.UUID,
			allowNull: true,
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

module.exports = AppointmentTimeDetails;
