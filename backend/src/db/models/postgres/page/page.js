/**
 * Page Address DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const Page = sequelize.define(
  'pages',
  {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING(255),
        allowNull: false,
    },
    contact_us: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    type: {
        type: Sequelize.STRING(255), // faq
        allowNull: false,
        defaultValue: 'faq',
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

module.exports = Page;
