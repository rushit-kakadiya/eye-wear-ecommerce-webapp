/**
 * User browsing history DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserBrowsingHistory = sequelize.define(
	'user_browsing_history',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		sku_code: {
			type: Sequelize.STRING(20),
			allowNull: false,
		},
		sku_category: {
			type: Sequelize.ENUM,
			allowNull: true,
			values: [
				'FRAME',
				'LENS',
				'CONTACTS_LENS'
			],
		},
		frame_code: {
			type: Sequelize.STRING(10),
			allowNull: true,
		},
		frame_name: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		variant_code: {
			type: Sequelize.STRING(10),
			allowNull: true,
		},
		variant_name: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		size_code: {
			type: Sequelize.STRING(10),
			allowNull: true,
		},
		size_label: {
			type: Sequelize.STRING(255),
			allowNull: true,
		},
		lense_category: {
			type: Sequelize.ENUM,
			allowNull: true,
			values: [
				'OPTICAL',
				'SUNWEAR'
			],
		},
		image_key: {
			type: Sequelize.TEXT,
			allowNull: true,
		},
		open_count: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
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
	}
);

module.exports = UserBrowsingHistory;
