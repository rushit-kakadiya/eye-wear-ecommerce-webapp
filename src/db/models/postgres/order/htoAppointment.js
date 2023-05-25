/*
 * User DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const HtoAppointment = sequelize.define(
	'hto_appointment',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		order_no: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		optician_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		slot_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		appointment_date: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		created_by: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
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
		indexes:[{
			unique: false,
			fields:['order_no'],
		}],
	}
);

module.exports = HtoAppointment;
