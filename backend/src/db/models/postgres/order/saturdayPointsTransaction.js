/*
 * zipcode master DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const SaturdayPointsTransactions = sequelize.define(
	'eyewear_points_transactions',
	{
        id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		order_no: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		rewards: {
			type: Sequelize.FLOAT,
			allowNull: true,
            defaultValue: 0,
		},
		points: {
			type: Sequelize.FLOAT,
			allowNull: true,
            defaultValue: 0
		},
		transaction_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
            defaultValue: 0,
		},
		status: {
            type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		expire_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
		},
		created_at: {
			type: Sequelize.DATE,
			allowNull: true,
			defaultValue: new Date(),
		},
        created_by: {
			type: Sequelize.UUID,
			allowNull: true,
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
		type: {
			type: Sequelize.INTEGER,
			allowNull: false, // 1 => CREDIT, 2 => DEBIT
		},
		opening_balance: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		closing_balance: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		opening_points: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		closing_points: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		percentage: {
			type: Sequelize.INTEGER,
			allowNull: true,
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

module.exports = SaturdayPointsTransactions;
