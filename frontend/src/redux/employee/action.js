import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {toastAction} from '../ToastActions';

import {
    FETCH_EMPLOYEE_SUCCESS, 
    EMPLOYEE_LOADING, 
    DELETE_EMPLOYEE
} from '../constants';

export const getEmployees = (data) => {
    return {
        type: FETCH_EMPLOYEE_SUCCESS,
        data
    }
}

export const loading = (status) => {
    return {
        type: EMPLOYEE_LOADING,
        status
    }
}

export const deleteEmployee = (id) => {
    return {
        type: DELETE_EMPLOYEE,
        id
    }
};

export const fetchEmployees = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    dispatch(getEmployees({
        total_rows: 0,
        list: []
    }));
    ApiClient
        .get('admin/employee', params,  user.data.token)
        .then(response => {
            dispatch(getEmployees(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            console.log("error => ", error);
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}


export const addEmployees = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/employee', params,  user.data.token)
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

export const updateEmployees = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/employee', params,  user.data.token)
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

export const deleteEmployees = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .delete(`admin/employee/${params.id}`, user.data.token)
        .then(response => {
            toastAction(true, response.message.id || 'Success!');
            dispatch(loading(false));
            dispatch(deleteEmployee(params.id));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    }) 
} 
