'use strict'

var crypto = require('./crypto');
var _ = require('lodash'),
  Promise = require('bluebird'),
  exceptions = require('./exception'),
  //redisClient = require('./redis').redisClient,
  config = require('config');


//var redis = Promise.promisifyAll(require('redis'));
//Promise.promisifyAll(redis.RedisClient.prototype);
//Promise.promisifyAll(redis.Multi.prototype);

var redis = require('./redis');

var client = redis.newRedisClient,
  sessionAge = config.constants.sessionAge,
  tokenLength = 32;

var tokenMissingMessage = 'unauthorised request',
  unauthorisedMessage = 'token has been expired',
  serverErrorMessage = 'unauthorised request!!!';

module.exports = {
  authFilter: function (req, res, next) {
    if (_.has(req.headers, 'token')) {
      client.getAsync(req.headers.token).then(function (data) {
        if (!data) {
          throw new Error(tokenMissingMessage);
        }
        var user = JSON.parse(data);
        req.user = user;
        client.ttlAsync(req.headers.token).then((ttl) => {
          if (ttl == -1 || ttl > req.user.sessionTTL / 2) {
          } else {
            client.expire(req.headers.token, req.user.sessionTTL);
          }
        });
        req.logLevel = 1;
        req.accessLevel = 1;
        if (req.user.application) {
          if (req.user.application.logLevel) {
            req.logLevel = req.user.application.logLevel;
          }
          if (req.user.application.accessLevel) {
            req.accessLevel = req.user.application.accessLevel;
          }
        }
        next();
      }).catch((err) => {
        req.error = new Error(tokenMissingMessage);
        exceptions.customException(req, res, tokenMissingMessage, 401);
      });
    } else {
      req.error = new Error(tokenMissingMessage);
      exceptions.customException(req, res, tokenMissingMessage, 401);
    }
  },
  authFilterAndUnAuthFilter: function (req, res, next) {
    console.log('-------------------12')
    req.user = {};
    req.user.application = {
      accessLevel: 3,
      logLevel: 1,
      production: true
    };

    if (_.has(req.headers, 'token') && req.headers.token) {
      client.getAsync(req.headers.token).then(function (data) {
        if (!data) {
          next();
          return;
        }
        var user = JSON.parse(data);
        req.user = user;
        client.ttlAsync(req.headers.token).then((ttl) => {
          if (ttl == -1 || ttl > req.user.sessionTTL / 2) {
          } else {
            client.expire(req.headers.token, req.user.sessionTTL)
          }
        });
        next();
      }).catch((err) => {
        req.error = new Error(tokenMissingMessage);
        exceptions.customException(req, res, tokenMissingMessage, 401);
      });
    } else {
      next();
    }
  },
  notLoggedInFilterAdmin: function (req, res, next) {
    req.user = {};
    req.user.application = {
      accessLevel: 3,
      logLevel: 1,
      production: true
    };
    next();
  },
  authFilterwithApp: function (req, res, next) {
    if (_.has(req.headers, 'token')) {
      client.getAsync(req.headers.token).then(function (data) {
        if (!data) {
          throw new Error(tokenMissingMessage);
        }
        var user = JSON.parse(data);
        req.user = user;
        client.ttlAsync(req.headers.token).then((ttl) => {
          if (ttl == -1 || ttl > 1000) {
          } else {
            client.expire(req.headers.token, req.user.sessionTTL)
          }
        });
        next();
      }).catch((err) => {
        req.error = new Error(tokenMissingMessage);
        exceptions.customException(req, res, tokenMissingMessage, 401);
      });
    } else {
      req.error = new Error(tokenMissingMessage);
      exceptions.customException(req, res, tokenMissingMessage, 401);
    }
  }
};
