
import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import { selectUserAddress } from '../order/action';
import {toastAction} from '../ToastActions';

import {
    LOGIN_SUCCESS,
    LOGOUT,
    USER_LOADING,
    FETCH_USER,
    FETCH_USER_ADDRESS,
    ADD_USER_ADDRESS,
    UPDATE_USER_ADDRESS,
    UPDATE_USER_TIMEZONE
} from '../constants';


export const loginSuccess = (data) => {
    return {
        type: LOGIN_SUCCESS,
        data
    }
}

export const logout = (data) => {
    return {
        type: LOGOUT,
        data
    }
}

export const getUser = (data) => {
    return {
        type: FETCH_USER,
        data
    }
}

export const getUserAddress = (data) => {
    return {
        type: FETCH_USER_ADDRESS,
        data
    }
}

export const loading = (status) => {
    return {
        type: USER_LOADING,
        status
    }
}

export const addAddress = (data) => {
    return {
        type: ADD_USER_ADDRESS,
        data
    }
} 

export const updateAddress = (data) => {
    return {
        type: UPDATE_USER_ADDRESS,
        data
    }
}

export const updateUserTimezone = (data) => {
    return {
        type: UPDATE_USER_TIMEZONE,
        data
    }
}





export const login = (params) => dispatch => {
    return new Promise((resolve, reject) => {
        dispatch(loading(true));
        ApiClient
        .post('admin/login', params)
        .then(response => {
            dispatch(loginSuccess(response.data));
            dispatch(loading(false));
            resolve(true)
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    });
}

export const fetchUser = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
    .get('admin/user/search', params,  user.data.token)
    .then(response => {
        dispatch(getUser(response.data));
    })
    .catch(error => {
        HandleResponse(error, dispatch);
    });
}

export const fetchUserAddress = (params) => (dispatch, getState) => {
    const {user} = getState();
        ApiClient
        .get('admin/user/address', params,  user.data.token)
        .then(response => {
            dispatch(getUserAddress(response.data));
        })
        .catch(error => {
            HandleResponse(error, dispatch);
        });
}

export const addUserAddress = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/user/address', params,  user.data.token)
        .then(response => {
            dispatch(addAddress(response.data));
            dispatch(selectUserAddress(response.data));
            toastAction(true, response.message.id || 'Success!');
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
        
} 

export const updateUserAddress = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        const newParams = {
            user_id: params.user_id,
            id: params.id,
            receiver_name: params.receiver_name,
            label_address: params.label_address,
            phone_number: params.phone_number,
            zip_code: params.zip_code,
            address: params.address,
            address_details: params.address_details,
            city: params.city,
            province: params.province,
            country: params.country
        }
        ApiClient
        .put('admin/user/address', newParams,  user.data.token)
        .then((response) => {
            dispatch(updateAddress(newParams));
            dispatch(selectUserAddress(newParams));
            toastAction(true, response.message.id);
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            console.log('error', error)
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}



export const resetUserTimezone = (params,cb) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .put('admin/account/reset-timezone', params,  user.data.token)
        .then(response => {
            dispatch(loading(false));
            if(response.data.status){
                dispatch(updateUserTimezone(response.data.time_zone));
                toastAction(true, "Timezone updated successfully");
            }else{
                toastAction(false, "There is some error updating a timezone");
            }
        })
        .catch(error => {
            dispatch(loading(false));
            toastAction(false, "There is some error updating a timezone");
        });
}