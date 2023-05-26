const _ = require('lodash');
const fs = require('fs');
const messages = require('./messages');

const customException = (req, res, err, statusCode) => {
  if (req.files) {
    Object.keys(req.files).forEach(function (file) {
      if (req.files[file].path) {
        fs.unlink(req.files[file].path, function (err) { console.log(err); });
      }
    });
  }

  let errJSON = {};
  if (!_.has(err, 'message')) {
    errJSON = {
      status: false,
      data: {},
      message: messages.systemError
    };
    errJSON.message.en = err.message;
  } else {
    if (typeof err.message === 'string') {
      let enDisplayMessage = err.message;
      err.message = messages.systemError;
      err.message.en = enDisplayMessage;
      req.displayError = err.message;
    }
    errJSON = {
      status: false,
      data: {},
      message: err.message
    };
  }

  if (req.displayError) {
    errJSON.message = req.displayError;
  }

  if (!_.isObject(err)) {
    errJSON.message = {
      en: err,
      id: messages.systemError,
    };
  }
  req.logger.error(err);

  statusCode = (_.isUndefined(statusCode) || !_.isNumber(statusCode)) ? 400 : statusCode;
  res.status(statusCode).send(errJSON);
  res.end();
};

module.exports = {
  customException,
};
