module.exports = {
    validateMobile: /^[0-9]{8,12}$/,
    validateMobileCode: /^\+?\d{1,3}$/,
    validateInteger:/^\d*[1-9]\d*$/,
    validatePassword: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
};