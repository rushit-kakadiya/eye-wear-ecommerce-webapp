const _ = require('lodash');
const Request = require('request');
var moment = require('moment');
var momentTz = require('moment-timezone');
const axios = require('axios');
const md5 = require('md5');

const responseGenerator = (req) => {
  let response = {};
  if (_.isEmpty(req.error)) {
    response.status = true;
    response.data = req['data'] || null;
    response.message = req['message'] || 'OK';
  } else {
    response.status = false;
    response.data = {};
    response.message = req.displayError;
  }
  return response;
};

const apiClient = ({ url, headers = {}, method, form = undefined }) => {
  let options = {
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (form) {
    options = { ...options, form };
  }
  return new Promise((resolve, reject) => {
    Request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else if (!error) {
        reject(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
};

const axiosClient = ({ url, headers = {}, method, params, data }) => {
  let options = {
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    params,
    data,
  };
  return axios(options);
};

// Generate random strings.
const generateRandom = (length = 32, alphanumeric = true) => {
  let data = '',
    keys = '';

  if (alphanumeric) {
    keys = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  } else {
    keys = '0123456789';
  }

  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }

  return data;
};

const fileFilter = fileName => {
  // accept image only
  const file_name = fileName.toLowerCase();
  if (!file_name.match(/\.(jpg|jpeg|png|gif|mp3|mp4|wav|m4a|xls|csv|xlsx)$/)) {
    return false;
  }
  return true;
};

// password encryption.
const encryptpassword = (password) => {
  return md5(password);
};

// Base64 encryption.
const base64Encryption = (string) => {
  return Buffer.from(string).toString('base64');
};

// Base64 decription.
const base64Decryption = (string) => {
  return Buffer.from(string, 'base64').toString('ascii');
};

const calDistanceBtwTwoLatLngs = (lat1, lon1, lat2, lon2) => {
  const radius = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const tempLat1 = lat1 * (Math.PI / 180);
  const tempLat2 = lat2 * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(tempLat1) * Math.cos(tempLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = radius * c;
  return +distance.toFixed(2);
};

// Get Date name by months
const getDatesName = (dates, months, month = 0) => {
  return dates.map(date => date.toString() + ' ' + months[new Date().getMonth() === 0 && month === 1 ? 11 : new Date().getMonth() - month]);
};

/*********** Jakarta Date format **********/
const getDateFormat = (date, hours = null, setTimeZero = false) => {
  date = moment(date);
  if (hours) {
    date.add(hours, 'hours');
  } else if (setTimeZero) {
    date.set({
      hour: 0,
      minute: 0,
      second: 0
    });
  }
  return date.toISOString();
};

/*********** Jakarta Date format **********/
const addSubtractDate = (type, value, duration = null) => {
  const date = moment();
  if (type === 'add') {
    date.add(value, duration);
  } else {
    date.subtract(Math.abs(value) + 1, duration);
  }
  return date.utcOffset(0).toISOString();
};

/********** Title case************/
const titleCase = (str = '') => {
  return str && str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
};
//Replace _ with space
const replaceGlobal = (str) => {
  return str && str.replace(/_/g, ' ');
};

/****** Calculate Age */
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const birthYear = birthDate.getFullYear();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  let calculatedAge = currentYear - birthYear;

  if (currentMonth < birthMonth - 1) {
    calculatedAge--;
  }
  if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
    calculatedAge--;
  }
  return calculatedAge;
};

/*********** Local Date string format **********/
const getLocalDateString = (date) => {
  if (date) {
    return new Date(date).toLocaleDateString();
  }
  return '-';
};

/*********** number format **********/
const getNumberFormat = (number, currency = 'Rp') => {

  if (currency == 'IDR') {
    return 'Rp' + ' ' + (number ? parseInt(number).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, '.') : '0');
  }
  else if (currency == 'USD') {
    return '$' + ' ' + (number ? parseInt(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0');
  }
  else if (currency == 'SGD') {
    return '$' + ' ' + (number ? parseInt(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0');
  }
  else {
    return currency + ' ' + (number ? parseInt(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '0');
  }
};

const dateDiffInDays = (a, b) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

const replaceSpecialChar = (string) => {
  return string.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
};

module.exports = {
  responseGenerator,
  apiClient,
  axiosClient,
  generateRandom,
  encryptpassword,
  base64Encryption,
  base64Decryption,
  fileFilter,
  calDistanceBtwTwoLatLngs,
  getDatesName,
  getDateFormat,
  titleCase,
  calculateAge,
  addSubtractDate,
  getLocalDateString,
  getNumberFormat,
  replaceGlobal,
  dateDiffInDays,
  replaceSpecialChar
};
