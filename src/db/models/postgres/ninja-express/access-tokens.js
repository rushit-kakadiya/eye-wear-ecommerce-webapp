/**
 * Page Address DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const AccessTokens = sequelize.define(
  'access_tokens',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    token: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'ninja',
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

module.exports = AccessTokens;
