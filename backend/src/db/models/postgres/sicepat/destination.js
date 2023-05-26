/**
 * Sicepat destination DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const SicepatDestination = sequelize.define(
	'sicepat_destination',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		destination_code: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		subdistrict: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		city: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		province: {
			type: Sequelize.TEXT,
			allowNull: false,
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
		},
		status: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
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

module.exports = SicepatDestination;
