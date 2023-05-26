// middlewares/cache.js

const NodeCache = require('node-cache');
const { utils } = require('../core');

// stdTTL: time to live in seconds for every generated cache element.
const cache = new NodeCache({ stdTTL: 10 * 60 });

const getUrlFromRequest =(req) => {
  const url = req.protocol + '://' + req.headers.host + req.originalUrl;
  return url;
};

const set = (req, res, next) => {
  const url = getUrlFromRequest(req);
  cache.set(url, req.data);
  return next();
};

const setUserData = (id, data) => {
  cache.set(id, data);
};

const get = (req, res, next) => {
  const url = getUrlFromRequest(req);
  const content = cache.get(url);
  if (content) {
    req.data = content;
    const response = utils.responseGenerator(req);
    return res.status(200).send(response);
  }
  return next();
};

const getCacheById = (id) => {
  return cache.get(id);
};

const getUserData = (req, res, next) => {
  const {user, originalUrl} = req;
  const url = originalUrl.split('/').pop();
  const content = getCacheById(user.id);
  if (content && content[url]) {
    req.data = content[url];
    const response = utils.responseGenerator(req);
    return res.status(200).send(response);
  }
  return next();
};

module.exports = { 
    get,
    getUserData,
    getCacheById,
    set,
    setUserData
};