const { elasticsearch } = require('../../core');
const { esClient } = elasticsearch;

const createIndex = (index) => {
    return esClient.indices.create({ index });
};

const deleteIndex = (index) => {
    return esClient.indices.delete({
        index: index,
        ignore: [404]
    });
};

const searchInIndex = (index, query, from, size, attributes, sortArray = []) => {
  return esClient.search({
    index,
    body: {
      _source: {
          includes: attributes
      },
      query: query,
      sort: sortArray
    },
    from,
    size,
  });
};

const checkStatus = (index) => {
    return esClient.cluster.health({
        index: index
    });
};

const closeIndex = (index) => {
    return esClient.indices.close({
        index: index
    });
};

const putSettings = (index, type) => {
    return esClient.indices.putSettings({
        index: index,
        type: type,
        body: {
          settings: {
            analysis: {
              analyzer: {
                folding: {
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding']
                }
              }
            }
          }
        }
    });
};

const putMapping = (index, type, schema) => {
    return esClient.indices.putMapping({
        index: index,
        type: type,
        body: {
          properties: {
            body: schema
          }
        }
    });
};

const openIndex = (index) => {
    return esClient.indices.open({
        index: index
    });
};

module.exports = {
    createIndex,
    deleteIndex,
    searchInIndex,
    checkStatus,
    closeIndex,
    putSettings,
    putMapping,
    openIndex
};

