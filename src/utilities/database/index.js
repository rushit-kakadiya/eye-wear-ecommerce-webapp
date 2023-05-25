/*
 * @file: database.js
 * @description: It Contain function layer for database methods.
 */
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../../core');

const db = require('../../db');
const models = db.models;
const postgresDB = models.postgresDB;

const createTable = (model) => {
  return postgresDB[model].sync({ force: true });
};

const dbTransaction = () => {
  return sequelize.transaction();
};

const saveData = (payload, model, transaction = null) => {
  return postgresDB[model].create(payload, { transaction: transaction });
};

const saveMany = async (payload, model, transaction = null) => {
  return postgresDB[model].bulkCreate(payload, { transaction: transaction });
};

const checkMobile = async (condition, model) => {
  return postgresDB[model].findOne({
    where: condition,
    attributes: ['mobile'],
  });
};

const findOneByCondition = (condition, model, attributes) => {
  return postgresDB[model].findOne({
    where: condition,
    attributes,
  });
};

const findByCondition = (condition, model, attributes, order = null) => {
  let query = {
    attributes,
  };
  if (condition) {
    query.where = condition;
  }
  if(order){
    query.order = [order];
  }
  return postgresDB[model].findAll(query);
};

const findAndCountAll = (
  condition,
  model,
  offset = 0,
  limit = 10,
  attributes
) => {
  return postgresDB[model].findAndCountAll({
    where: condition,
    offset,
    limit,
    attributes,
  });
};

const updateOneByCondition = (
  updatedPayload,
  condition,
  model,
  transaction = null
) => {
  return postgresDB[model].update(
    updatedPayload,
    {
      returning: true,
      where: condition,
    },
    { transaction: transaction }
  );
};

const deleteRecord = (condition, model, transaction = null) => {
  return postgresDB[model].destroy({
    where: condition,
  },
  { transaction: transaction });
};

const count = (condition, model) => {
  return postgresDB[model].count({
    where: condition
  });
};

const rawQuery = (query, type, replacements = {}) => {
  let queryOptions = {
    type: QueryTypes[type],
    replacements: replacements,
  };
  return sequelize.query(query, queryOptions);
};

const getSumByCondition = (condition, model, field) => {
  return postgresDB[model].sum(field, {
      where: condition,
  });
};

const findDistinctRecords = (key, model) => {
  return postgresDB[model].aggregate(key, 'DISTINCT', { plain: false });
};

module.exports = {
  createTable,
  dbTransaction,
  saveData,
  saveMany,
  checkMobile,
  findOneByCondition,
  findByCondition,
  updateOneByCondition,
  deleteRecord,
  rawQuery,
  findAndCountAll,
  count,
  getSumByCondition,
  findDistinctRecords
};
