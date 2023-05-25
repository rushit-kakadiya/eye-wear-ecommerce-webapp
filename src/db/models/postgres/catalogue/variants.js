/**
 * Variants DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Variants = sequelize.define(
	'variants',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		variant_code: {
			type: Sequelize.STRING(10),
			allowNull: false,
			unique: true,
		},
		variant_name: {
			type: Sequelize.STRING(255),
			allowNull: false,
		},
		variant_color_group: {
			type: Sequelize.ARRAY(Sequelize.STRING(30)),
			allowNull: false,
		},
		icon_image_key: {
			type: Sequelize.STRING(500),
			allowNull: true,
			defaultValue: 'variant-icon/icon_placeholder.png'
		},
		variant_rank: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
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

module.exports = Variants;
