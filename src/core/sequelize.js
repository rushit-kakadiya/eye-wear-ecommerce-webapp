const Sequelize = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(
  config.databases.postgres.dbName,
  config.databases.postgres.userName,
  config.databases.postgres.passoword,
  {
    dialect: 'postgres',
    host: config.databases.postgres.hostName,
    pool: {
      max: 10,
      min: 0,
      idle: 200000,
      acquire: 1000000,
    },
    define: {
      timestamps: false,
    }
  }
);

module.exports = sequelize;
