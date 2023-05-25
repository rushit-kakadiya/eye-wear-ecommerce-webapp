/* -----------------------------------------------------------------------
   * @description : Here initialising nodemailer transport for sending mails.
----------------------------------------------------------------------- */
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;
const config = require('config');
const { constants } = require('../../core');
const { smtpUser, smtpPass, smtpPort, smtpServer, mailFrom, mailFromHTO } = config.get(
  'awssmtp'
);

const dirPath = '../../email-templates/';

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: smtpServer, // hostname
    port: smtpPort, // port for secure SMTP
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })
);

const htmlFromatWithObject = async (request, file) => {
  const tempDir = path.resolve(__dirname, dirPath, file);
  const template = new EmailTemplate(path.join(tempDir));
  return await template.render({ ...request });
};

function sendMail(request, calendarObj, cb) {

  let mailList = [];
  let bccList = [];
  let options = {
    from: request.hto != undefined && request.hto == true ? mailFromHTO : mailFrom,
    to: request.to, // list of receivers
    subject: request.subject, // Subject line
    html: request.html, // html body
  };


  if (calendarObj) {

    let alternatives = {
        'Content-Type': 'text/calendar',
        'method': 'REQUEST',
        'content': new Buffer(calendarObj.toString()),
        'component': 'VEVENT',
        'Content-Class': 'urn:content-classes:calendarmessage'
    };

    options['alternatives'] = alternatives;
    options['alternatives']['contentType'] = 'text/calendar';
    options['alternatives']['content'] = new Buffer(calendarObj.toString());

  }


  if (request.cc) {
    mailList.push(...request.cc);
  }


  if (request.bcc) {
    bccList.push(...request.bcc);
  }


  options.cc = mailList;
  options.bcc = bccList;
  
  if (request.replyTo) {
    options.replyTo = request.replyTo;
  }
  if (request.attachments) {
    options.attachments = request.attachments;

    console.log(request.attachments);
  }

  transporter.sendMail(options, function (error, info) {
    cb(error, info);
  });
}

module.exports = {
  sendMail,
  htmlFromatWithObject,
  subjects: {
    userAccount: 'Account Verification',
    userLogin: 'Login Confirmation Email',
    forgotPassword: 'Forgot Pasword',
    licenseApprove: 'Bookzdoctor Approval',
  },
};
