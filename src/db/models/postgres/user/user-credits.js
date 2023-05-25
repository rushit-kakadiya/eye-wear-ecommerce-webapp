/**
 * User credit DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserCredits = sequelize.define(
   	'user_credits',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: true
		},
		credit_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		activity_type: {
			type: Sequelize.ENUM,
			allowNull: false,
			values: [
				'REGISTER',
				'ORDER',
				'EXPIRE'
			]
		},
		activity_reference_id: {
			type: Sequelize.UUID,
			allowNull: true
		},
		transaction_type: {
			type: Sequelize.ENUM,
			allowNull: false,
			values: [
				'CREDIT',
				'DEBIT'
			]
		},
		opening_balance: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		closing_balance: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: new Date(),
		},
		created_by: {
			type: Sequelize.UUID,
			allowNull: false
		},
		updated_at: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		updated_by: {
			type: Sequelize.UUID,
			allowNull: true
		},
		status: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		}
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8'
	}
 );

 module.exports = UserCredits;
