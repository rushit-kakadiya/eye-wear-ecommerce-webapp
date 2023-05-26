/*
 * Turboly Draft DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const TurbolyDraftData = sequelize.define(
	'turboly_draft_data',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		order_no: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		turboly_ref_code: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		workflow_state: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		sale: {
			type: Sequelize.JSON,
			allowNull: false,
		},
		errors: {
			type: Sequelize.ARRAY(Sequelize.JSON),
			allowNull: false,
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

module.exports = TurbolyDraftData;
