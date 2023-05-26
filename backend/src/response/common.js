const _ = require('lodash');
const { utils } = require('../core');

const genericResponse = async (req, res, next) => {
  if (!req.dummy) {
    const data = await utils.responseGenerator(req);
    res.send(data);
    res.end();
  } else {
    req.data = [
      {
        dummy: 'dummy Response Object',
      },
    ];
    const data = await utils.responseGenerator(req);
    res.send(data);
    res.end();
  }
};

module.exports = {
  genericResponse,
};
