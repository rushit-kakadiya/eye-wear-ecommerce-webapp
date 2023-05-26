import Axios from 'axios';
import { googleMapKey } from '../../utilities/constants';
import ApiClient from '../ApiClient';



export const fetchAddress = (coordinates,callback) => dispatch => {
    Axios
        .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordinates.lat},${coordinates.lng}&key=${googleMapKey}`)
        .then(response => {
            callback(response.data.results[0].formatted_address)
        })
        .catch(error => {
            console.log("error => ", error);
        });
}




export const fetchAvailability  = (zipCode,callback) => (dispatch, getState) => {

    ApiClient
        .get(`catalogue/hto_check?lat=1&long=1&zipcode=${zipCode}`)
        .then(response => {
            callback({hto : response.data.is_payment_required, coffee: response.data.is_offer })
        })
        .catch(error => {
            console.log("error => ", error);
        });
}


export const register  = (params,  callback) => (dispatch, getState) => {
    
    ApiClient
        .post('user/register', params)
        .then(response => {
            callback(response)
        })
        .catch(error => {
            console.log("error => ", error);
        });
}


export const addAdrress  = (params, token,  callback) => (dispatch, getState) => {
    ApiClient
        .post('user/address', params, token)
        .then(response => {
            callback(response)
        })
        .catch(error => {
            console.log("error => ", error);
        });
}


export const bookAppointment  = (params, token, callback) => (dispatch, getState) => {
    ApiClient
        .post('user/book-hto', params, token)
        .then(response => {
            callback(response)
        })
        .catch(error => {
            console.log("error => ", error);
        });
}