const config = require('config');
const bunyan = require('bunyan');
const { v4 } = require('uuid');
const Elasticsearch = require('bunyan-elasticsearch');

const serializers = require('./serializers');

let esStream = new Elasticsearch({
  indexPattern: '[logstash-]YYYY.MM.DD',
  type: 'logs',
  host: config.databases.elastic.logHost,
});

esStream.on('error', function (err) {
  console.log('Elasticsearch Stream Error:', err.stack);
});

const logger = bunyan.createLogger({
  name: (config.logger && config.logger.name) || 'logger',
  streams: [
    {
      level: config.logger.level || bunyan.levelFromName.info,
      stream: process.stdout
    },
    // { 
    //   level: config.logger.level || bunyan.levelFromName.info,
    //   stream: esStream
    // }
  ],
  serializers: serializers,
});

logger.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);
});

const getContext = () => {
  return {
    'x-request-id': this.fields['x-request-id'],
  };
};

// eslint-disable-next-line no-proto
logger.__proto__.getContext = getContext;

const getInstance = (props = {}) => {
  if (typeof props === 'string') {
    props = JSON.parse(props);
  }

  let parentContext = {};

  if (props.loggerContext) {
    parentContext = props.loggerContext;
    delete props.loggerContext;
  }
  const properties = { 'x-request-id': v4(), ...props, ...parentContext };
  return logger.child(properties);
};

module.exports = {
  getInstance
};
