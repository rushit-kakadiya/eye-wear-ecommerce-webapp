/* -----------------------------------------------------------------------
   * @ description : Here defines all push notification configration and functions.
----------------------------------------------------------------------- */
//************* $ npm install fcm-node **************/

const FCM = require('fcm-notification');
const config = require('config');
const { serverKey, appTitle } = config.get('fcm');
const fcm = new FCM(serverKey);

const sendFCM = (tokens, title, body, payload, badgeCount = 1) => {
  const message = {
    apns: {
      payload: {
        aps: {
          badge: badgeCount,
        },
      },
    }
  };
  // message.collapse_key = appTitle;
  message.notification = { title, body: body.en };
  // message.priority = 'high';
  // message.notification.badge = badgeCount;
  message.data = payload ? payload : { messageFrom: appTitle };

  // console.log(message);
  fcm.sendToMultipleToken(message, tokens, async (err, response) => {
    if (err) {
      console.log('Something has gone wrong with fcm!', err);
    } else {
      console.log('Message response: ', response);
    }
  });
};

module.exports = sendFCM;
