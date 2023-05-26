const config = require('config');
const utils = require('./utils');

const sendErrorNotification = async (endpoint, message) => {
  let messageJSON = {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Backend Error*'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*API Endpoint   :* ${endpoint}\n *Error Message :* ${message}`,
        }
      }
    ]
  };
  await utils.axiosClient({
    url: config.slack_backend_error_channel_url,
    method: 'POST',
    data: messageJSON
  });
};

module.exports = {
  sendErrorNotification
};
