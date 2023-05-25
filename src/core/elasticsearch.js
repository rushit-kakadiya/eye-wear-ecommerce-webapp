const config = require('config');
const elasticsearch = require('elasticsearch');

let esClient = new elasticsearch.Client({
  host: config.databases.elastic.host,
  apiVersion: '7.7', // use the same version of your Elasticsearch instance
  requestTimeout: 100000,
  keepAlive: false,
  log: [{
    type: 'stdio',
    levels: ['error'] // change these options
  }]
});

esClient.ping({
  requestTimeout: 30000 // specific to this first time ping only
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

module.exports = {
  esClient,
};
