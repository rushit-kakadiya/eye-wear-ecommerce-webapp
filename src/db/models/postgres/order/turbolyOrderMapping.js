/*
 * Turboly Order Mapping DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const TurbolyOrderMapping = sequelize.define(
    'turboly_order_mapping',
    {
        mapping_id: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        turboly_invoice_id: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
        },
        order_no: {
            type: Sequelize.STRING(50),
            allowNull: false,
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
        indexes:[{
            unique: false,
            fields:['order_no'],
        },
        {
            unique: true,
            fields:['turboly_invoice_id'],
        }]
    }
);

module.exports = TurbolyOrderMapping;
