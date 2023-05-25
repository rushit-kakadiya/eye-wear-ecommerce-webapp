
const AWS = require('aws-sdk');
const config = require('config');
const { apiVersion, snsAccessKey, snsSecretAccessKey, region } = config.get('aws');


AWS.config.update({
  apiVersion: apiVersion,
  region: region,
  credentials: {
    accessKeyId: snsAccessKey,
    secretAccessKey: snsSecretAccessKey,
  }
});

const sendSMS = async ({ otp, number }) => {
  try {
    var params = {
      Message: `${otp} is the OTP to login to your EYEWEAR account. DO NOT share it to anyone`,
      PhoneNumber: number,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional', //default => Promotional
        },
      },
    };


    await new AWS.SNS().publish(params).promise();
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  sendSMS
};
