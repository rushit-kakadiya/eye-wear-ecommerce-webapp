/**
 * User Prescription DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserPrescription = sequelize.define(
  'user_prescription',
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
    label: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    spheris_l: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    spheris_r: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    cylinder_l: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    cylinder_r: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    axis_l: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    axis_r: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    addition_l: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    addition_r: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    pupilary_distance: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 0,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date()
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: new Date()
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    is_primary: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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

module.exports = UserPrescription;
