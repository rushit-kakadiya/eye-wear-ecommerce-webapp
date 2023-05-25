/**
 * User wishlist DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');


const UserWishlist = sequelize.define(
    'user_wishlists',
    {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        product_id: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        sku_code: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            defaultValue: 1, 
        },
        product_category: {
            type: Sequelize.INTEGER(1),
            allowNull: false,
            defaultValue: 1, // 1 => OPTICAL 2 => SUNWEAR, 3 => CLIPON
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        created_by: {
			type: Sequelize.UUID,
			allowNull: true
		}  
    },
    {
        schema: 'eyewear',
        freezeTableName: true,
        timestamps: false,
        collate: 'utf8_unicode_ci',
        charset: 'utf8',
        indexes:[{
            unique: true,
            fields:['user_id', 'product_id', 'product_category'],
        }]
    }
  );

  module.exports = UserWishlist;
