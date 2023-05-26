/*
 * HTO slot DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const HtoSlot = sequelize.define(
	'hto_slot',
	{
		id: {
			type: Sequelize.UUID,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		slot_start_time: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		slot_end_time: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		start_time: {
			type: Sequelize.TIME,
			allowNull: false,
		},
		end_time: {
			type: Sequelize.TIME,
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
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

module.exports = HtoSlot;
