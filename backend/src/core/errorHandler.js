const exception = require('./exception');
const slackNotification = require('./slackNotification');

const errorFunction = async (layer, logLevel, error, display, req, res) => {
  let message = error.message;

  if (typeof message == 'object') {
    message = JSON.stringify(message);
  }
  // await slackNotification.sendErrorNotification(req.originalUrl, message);
  if (layer > logLevel) {
    req.displayError = display;
  } else {
    req.displayError = error.message;
  }
  exception.customException(req, res, error, 400);
};

function customError(message) {
  return { message };
}

customError.prototype = Object.create(Error.prototype);

module.exports = {
  errorFunction,
  customError
};
