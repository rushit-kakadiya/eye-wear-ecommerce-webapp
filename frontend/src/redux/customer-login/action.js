import ApiClient from '../ApiClient';



export const otpSend  = (params, callback) => (dispatch, getState) => {
    ApiClient
        .post('user/otp/send', params)
        .then(response => {
            callback(response)
        })
        .catch(error => {
            console.log("error => ", error);
        });
}



export const otpVerify  = (params, callback) => (dispatch, getState) => {
    ApiClient
        .post('user/otp/verify', params)
        .then(response => {
            callback(response)
        })
        .catch(error => {
            callback(error.data.message)
            console.log("error => ", error);
        });
}



export const login  = (params, callback) => (dispatch, getState) => {
    ApiClient
        .post('user/login', params)
        .then(response => {
            callback(response)
        })
        .catch(error => {
            callback(error.data.message)
            console.log("error => ", error);
        });
}

