/**
 * User Referral DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserReferral = sequelize.define(
  	'user_referral',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		referral_code: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		referral_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		created_by: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		updated_by: {
			type: Sequelize.UUID,
			allowNull: true,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
			defaultValue: 1,
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

module.exports = UserReferral;
