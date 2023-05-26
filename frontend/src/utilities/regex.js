const Regex = {
  validateEmail: /^\S+@\S+$/i,
  validateMobile: /^\+?\d{9,14}$/,
  validName: /^([a-zA-Z_ ]){1,15}$/,
  validateInteger: /^\d*[1-9]\d*$/,
  validatePassword: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  validId: /^([a-zA-Z0-9]){1,15}$/,
};

module.exports = Regex;
