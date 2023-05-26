/**
 * User Cards DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const UserCards = sequelize.define(
  'user_cards',
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
    token_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    card_holder_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    card_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    card_brand: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    card_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    is_primary: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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

module.exports = UserCards;
