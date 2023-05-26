const bunyan = require('bunyan');

function stringify(value) {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

module.exports = {
  req: function reqSerializer(req) {
    if (!req) {
      return req;
    }

    return {
      method: req.method,
      url: req.url,
      body: stringify(req.body),
      headers: req.headers,
      httpVersion: req.httpVersion,
      query: stringify(req.query),
    };
  },
  res: function resSerializer(res) {
    if (!res) {
      return res;
    }

    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
    };
  },
  err: bunyan.stdSerializers.err,
};
