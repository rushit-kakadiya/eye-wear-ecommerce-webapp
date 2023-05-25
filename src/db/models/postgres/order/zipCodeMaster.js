/*
 * zipcode master DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const ZipCodeMaster = sequelize.define(
	'zip_code_master',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		province: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		city_type: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		city: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		sub_district: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		zipcode: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		lat: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		long: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		is_hto_available: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_coffee_available: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
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
		indexes:[{
			fields:['zipcode'],
		}]
	}
);

module.exports = ZipCodeMaster;
