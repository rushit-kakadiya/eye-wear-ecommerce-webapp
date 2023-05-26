const { logger } = require('../core');

function logResponse(req, res) {
  res.removeListener('close', logResponse);
  res.removeListener('finish', logResponse);

  const meta = {
    responseTime:
      process.hrtime(req.logger.fields.startTime)[0] * 1000 +
      process.hrtime(req.logger.fields.startTime)[1] / 1000000,
    req,
    res,
  };
  req.logger.info.call(req.logger, meta, `${req.method} ${req.originalUrl}`);
}

module.exports = (req, res, next) => {
  const props = { startTime: process.hrtime() };

  if (req.headers['x-request-id']) {
    props['x-request-id'] = req.headers['x-request-id'];
  }

  req.logger = logger.getInstance(props);

  if (req.originalUrl === '/api/v1/healthcheck/open') {
    return next();
  }

  // req.logger.info.call(req.logger, { req }, `${req.method} ${req.originalUrl}`);

  // res.on('finish', logResponse.bind(null, req, res));
  res.on('close', logResponse.bind(null, req, res));

  return next();
};
