const NodeCache = require('node-cache');

// stdTTL: time to live in seconds for every generated cache element.
const cache = new NodeCache({ stdTTL: 10 * 60 });

const set = (key, data) => {
  const success = cache.set(key, data);
  return success;
};

const get = (key) => {
  const content = cache.get(key);
  return content;
};

module.exports = {
  get,
  set
};
