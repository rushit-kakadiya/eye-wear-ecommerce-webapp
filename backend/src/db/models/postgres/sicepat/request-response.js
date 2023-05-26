/**
 * Sicepat destination DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const SicepatRequestResponse = sequelize.define(
    'sicepat_request_response',
    {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.STRING(36),
            allowNull: false,
        },
        order_no: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        receipt_number: {
            type: Sequelize.STRING(12),
            allowNull: false,
            unique: true
        },
        reference_number: {
            type: Sequelize.STRING(36),
            allowNull: false,
        },
        request_number: {
            type: Sequelize.STRING(36),
            allowNull: true,
        },
        payload: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
        response: {
            type: Sequelize.JSONB,
            allowNull: true,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        created_by: {
            type: Sequelize.TEXT(36),
            allowNull: true,
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: new Date()
        },
        updated_by: {
            type: Sequelize.TEXT(36),
            allowNull: false,
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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

module.exports = SicepatRequestResponse;
