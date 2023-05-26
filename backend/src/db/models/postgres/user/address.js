/**
 * User User Address DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserAddress = sequelize.define(
  'user_address',
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
    receiver_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    label_address: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    phone_number: {
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    note: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    zip_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING(255),
        allowNull: true,
    },
    address_details : {
        type: Sequelize.STRING(255),
        allowNull: true,
    }, 
    city : {
        type: Sequelize.STRING(255),
        allowNull: true,
    },  
    province : {
        type: Sequelize.STRING(255),
        allowNull: true,
    }, 
    country : {
        type: Sequelize.STRING(255),
        allowNull: true,
    },  
    position:{
        type: Sequelize.GEOMETRY('POINT', 4326), //https://galxzx.github.io/blog/2017/03/15/Distance-Based-Queries-with-PostgreSQL-PostGIS-and-Sequelize/
        allowNull: true,
    }, 
    lat: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    long: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    created_by: {
        type: Sequelize.UUID,
        allowNull: true
    },
    updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: new Date()
    },
    updated_by: {
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
  }
);

module.exports = UserAddress;
