/**
 * Variants DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Influencer = sequelize.define(
	'influencer',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		influencer_name: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		social_media_handle: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		social_media_type: {
			type: Sequelize.STRING(100),
			allowNull: false,
			defaultValue: 'INSTAGRAM'
		},
		sku_code: {
			type: Sequelize.STRING(20),
			allowNull: false,
		},
		category: {
			type: Sequelize.STRING(20),
			allowNull: false,
			defaultValue: 'EYEWEAR'
		},
		image_key: {
			type: Sequelize.TEXT,
			allowNull: true,
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
		rank: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
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

module.exports = Influencer;
