/*
* Turboly sale DB Schema
*/

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const TempTurbolySaleDetails = sequelize.define(
	'temp_turboly_sale_details',
	{
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		ref_code: {
			type: Sequelize.STRING(100),
			allowNull: false,
			unique: true,
		},
		status: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		store_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		store_code: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		register_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		is_ecommerce: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		completed_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
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

module.exports = TempTurbolySaleDetails;
