const config = require('config');
const app = require('./app');
const { port } = config.get('app');
const cronJobs = require('./cron');

cronJobs();

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json({ status: false, data: null, message: err.error.details && err.error.details[0].message.toString().replace(/[\""]+/g, '') });
  } else {
    // pass on to another error handler
    next(err);
  }
});

