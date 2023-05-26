const app = require('./app');
const { messages } = require('./core');
//const { logger } = require('./core');

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    req.logger.error(err);
    let response = {
      status: false,
      data: {},
      message: {
        en: err.error.details && err.error.details[0].message.toString().replace(/[\""]+/g, ''),
        id: messages.systemError.id
      }
    };
    res.status(400).json(response);
  } else {
    // pass on to another error handler
    next(err);
  }
});
