/**
 * User DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize, constants } = require('../../../../core');

const User = sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    country_code: {
      type: Sequelize.STRING(5),
      allowNull: false,
      defaultValue: '+62',
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    gender: {
      type: Sequelize.INTEGER(1), // 1: Male, 2: Female: 3: Other
      allowNull: true,
      defaultValue: 1
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_email_verified: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    is_mobile_verified: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    google_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    },
    facebook_id: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    profile_image: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    first_time_login: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
    is_first_order: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
		registration_referral_code: {
			type: Sequelize.STRING(50),
			allowNull: true
    },
    emp_ref_code: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    role: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 2, // 1 => admin, 2 => user, 3 => staff
    },
    status: {
      type: Sequelize.INTEGER(1),
      allowNull: false,
      defaultValue: 1,
    },
    is_send_notifications: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_send_email: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    currency: {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'IDR',
    },
    language: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'english',
    },
    is_send_newsletter: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    updated_by: {
      type: Sequelize.UUID,
      allowNull: true
    },
    store_id: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: ''
    },
		channel: {
			type: Sequelize.STRING(100),
			allowNull: false,
			defaultValue: constants.sale_channel.APP
		},
		index_referral: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: false,
		},
    time_zone: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: 'UTC',
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

module.exports = User;
