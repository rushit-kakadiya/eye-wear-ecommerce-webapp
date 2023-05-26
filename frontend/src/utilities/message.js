const Message = {
  success: 'Success',
  error: 'Error!',
  commonError: 'Something went wrong!',
  validateField: (type, value, types = null) => {

    if (type !== "") {
      if (type === 'pattern' || type === "minLength" || type === "maxLength") {
        return `Please enter valid ${value}.`
      } else if (type === "validate") {
        return `Confirm password must be same as new password.`
      } else if (type === "valueAsNumber") {
        return `Payment amount should be minimum 50% from total amount.`
      } else {
        return `${value} is required.`
      }
    }

    if (types != null) {
      return types.message
    }

  },
  maxValue: (value, max) => {
    if (value > max) {
      return `Please enter maximum ${max}`
    } else {
      return false;
    }
  }
};

module.exports = Message;
