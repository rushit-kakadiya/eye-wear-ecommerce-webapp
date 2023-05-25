/**
 * Sizes DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Size = sequelize.define(
	'sizes',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		size_code: {
			type: Sequelize.STRING(10),
			allowNull: false,
			unique: true,
		},
		size_key: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		size_label: {
			type: Sequelize.STRING(10),
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
		charset: 'utf8'
	}
);

module.exports = Size;
