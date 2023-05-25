/**
 * Frame sizes DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const FrameSize = sequelize.define(
	'frame_sizes',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		frame_code: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		size_code: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		lense_width: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		bridge: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		temple_length: {
			type: Sequelize.STRING(10),
			allowNull: false,
		},
		front_width: {
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
		charset: 'utf8',
		indexes:[
		{
			unique: false,
			fields:['frame_code', 'size_code'],
		}]
	}
);

module.exports = FrameSize;
