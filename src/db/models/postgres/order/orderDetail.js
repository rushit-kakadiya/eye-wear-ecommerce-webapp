/*
 * Order details DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize, constants } = require('../../../../core');

const OrderDetail = sequelize.define(
	'order_details',
	{
		id: {
			type: Sequelize.UUID,
			allowNull: false,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},
		order_no: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true,
		},
		user_id: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		email_id: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		payment_req_id: {
			type: Sequelize.STRING(36),
			allowNull: false,
			unique: true,
		},
		address_id: {
			type: Sequelize.UUID,
			allowNull: true,
		},
		voucher_code: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		is_hto: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_payment_required: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		is_local_order: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_return: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		store_id: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		register_id: {
			type: Sequelize.STRING(100),
			allowNull: false,
		},
		payment_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		order_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		order_discount_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		user_credit_amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		eyewear_points_credit: {
			type: Sequelize.FLOAT,
			allowNull: false,
			defaultValue: 0,
		},
		is_credit: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		is_eyewear_points_credit: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		currency: {
			type: Sequelize.STRING(20),
			allowNull: false,
			defaultValue: 'IDR'
		},
		country_code: {
			type: Sequelize.STRING(20),
			allowNull: false,
			defaultValue: 'ID'
		},
		currency_code: {
			type: Sequelize.STRING(20),
			allowNull: false,
			defaultValue: 'IDR'
		},
		scheduled_delivery_date: {
			type: Sequelize.DATE,
			allowNull: false,
		},
		actual_delivery_date: {
			type: Sequelize.DATE,
			allowNull: true,
		},
		notes: { // Custom sales notes can be saved here
			type: Sequelize.TEXT,
			allowNull: true,
		},
		fulfillment_type: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1, //Filfillment Types: [0 = Pickup (Default), 1 = Delivery]
		},
		order_status: {
			type: Sequelize.ENUM,
			allowNull: false,
			values: [
				'payment_initiated',
				'payment_pending',
				'payment_confirmed',
				'payment_failed',
				'payment_cancelled',
				'order_cancelled',
				'order_pending',
				'order_confirmed',
				'ready_to_collect',
				'ready_for_delivery',
				'order_pickup_pending',
				'order_shipped',
				'order_delivered',
				'order_returned',
				'order_completed',
				'in_transit'
			]
		},
		payment_category: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0, //Payment status: [0 = no payment/pending, 1 = partial payment, 2 = Remaining payment, 3 = Full Payment]
		},
		payment_status: {
			type: Sequelize.ENUM,
			allowNull: false,
			values: [
				'payment_initiated',
				'payment_pending',
				'partial_paid',
				'payment_confirmed',
				'payment_failed',
				'payment_cancelled',
				'remaining_paid'
			],
			defaultValue: 'payment_initiated'
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
		sales_channel: {
			type: Sequelize.STRING(100),
			allowNull: false,
			defaultValue: constants.sale_channel.APP
		},
		created_by_staff: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		optician: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		stock_store_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		pick_up_store_id: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		hto_appointment_no: {
			type: Sequelize.STRING(100),
			allowNull: true,
		},
		index_order: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		}
	},
	{
		schema: 'eyewear',
		freezeTableName: true,
		timestamps: false,
		collate: 'utf8_unicode_ci',
		charset: 'utf8',
		indexes:[{
			unique: false,
			fields:['user_id'],
		},
		{
			unique: true,
			fields:['payment_req_id'],
		}]
  	}
);

module.exports = OrderDetail;
