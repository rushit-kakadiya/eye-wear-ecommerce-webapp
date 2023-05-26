import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {toastAction} from '../ToastActions';

import {
    FETCH_ADMIN_USERS_SUCCESS,
    USER_MANAGEMENT_LOADING,
    SET_USER_ID,
    UPDATE_USER_STATUS,
    GET_ROLES
} from '../constants';

export const getAdminUsers = (data) => {
    return {
        type: FETCH_ADMIN_USERS_SUCCESS,
        data
    }
}

export const loading = (status) => {
    return {
        type: USER_MANAGEMENT_LOADING,
        status
    }
}

export const setUserId = (id) => {
    return {
        type: SET_USER_ID,
        id
    }
}

export const updateStatus = (data) => {
    return {
        type: UPDATE_USER_STATUS,
        data
    }
}

export const getRoles = (data) => {
    return {
        type: GET_ROLES,
        data
    }
}

export const fetchRoles = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/roles', '',  user.data.token)
        .then(response => {
            dispatch(getRoles(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
            HandleResponse(error, dispatch);
        });
}

export const fetchAdminUsers = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    dispatch(getAdminUsers({
        total_rows: 0,
        list: []
    }));
    ApiClient
        .get('admin/admin-management', params,  user.data.token)
        .then(response => {
            dispatch(getAdminUsers(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            console.log("error => ", error);
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}


export const setUserPassword = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/admin-management/password', params,  user.data.token)
        .then(response => {
            dispatch(setUserId(''));
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

export const addAdminUser = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/admin-management', params,  user.data.token)
        .then(response => {
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

export const updateAdminUser = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/admin-management', params,  user.data.token)
        .then(response => {
            toastAction(true, response.message.id || 'Success!');
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            if(error.data && error.data.message && error.data.message.en.includes('old_password')){
                reject(error.data.message); 
            } else {
                reject(HandleResponse(error, dispatch));
            }
        });
    }) 
} 

export const updateAdminUserStatus = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/admin-management/status', params,  user.data.token)
        .then(response => {
            dispatch(updateStatus(params));
            toastAction(true, response.message.id || 'Success!');
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            if(error.data && error.data.message && error.data.message.en.includes('password')){
                reject(error.data.message); 
            } else {
                reject(HandleResponse(error, dispatch));
            }
        });
    }) 
} 