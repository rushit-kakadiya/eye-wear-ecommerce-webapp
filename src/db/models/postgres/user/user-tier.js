/**
 * User Referral DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserTier = sequelize.define(
    'user_tier',
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
        total_purchase: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        total_referral: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        tier: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        created_by: {
            type: Sequelize.UUID,
            allowNull: true,
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
        },
        last_updated: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        update_require: {
            type: Sequelize.BOOLEAN,
            allowNull: true
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

module.exports = UserTier;
