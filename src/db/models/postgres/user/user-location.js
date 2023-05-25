/**
 * User Location DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserLocation = sequelize.define(
    'user_location',
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
        language: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        country_code: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        currency_code: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        timezone: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Date.now()
        },
        created_by: {
            type: Sequelize.UUID,
            allowNull: true
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Date.now()
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: true
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

module.exports = UserLocation;
