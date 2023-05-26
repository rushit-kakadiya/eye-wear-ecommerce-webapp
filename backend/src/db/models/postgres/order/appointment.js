/*
 * HTO Appointment DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Appointment = sequelize.define(
	'appointment',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		appointment_no: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true,
		},
		address_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		store_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: false,
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
		notes: { // Custom sales notes can be saved here
			type: Sequelize.TEXT,
			allowNull: true
		},
		sales_channel: {
			type: Sequelize.ENUM,
			allowNull: false,
			values: [
				'app',
				'store',
				'whatsapp',
				'website',
				'booking_link'
			],
			defaultValue: 'app'
		},
		appointment_status: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		comment: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8'
	}
);

module.exports = Appointment;
