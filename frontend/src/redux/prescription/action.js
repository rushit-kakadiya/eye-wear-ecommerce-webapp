import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {
    FETCH_PRESCRIPTION_SUCCESS,
    PRESCRIPTION_LOADING,
    ADD_PRESCRIPTION,
    UPDATE_PRESCRIPTION
} from '../constants';

export const getPrescription = (data) => {
    return {
        type: FETCH_PRESCRIPTION_SUCCESS,
        data
    }
}

export const prescription = (data) => {
    return {
        type: ADD_PRESCRIPTION,
        data
    }
}

export const loading = (status) => {
    return {
        type: PRESCRIPTION_LOADING,
        status
    }
}

export const editPrescription = (data) => {
    return {
        type: UPDATE_PRESCRIPTION,
        data
    }
}

export const fetchPrescription = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/user/prescription', params, user.data.token)
        .then(response => {
            dispatch(getPrescription(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
}

export const addPrescription = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
            .post('admin/user/prescription', params, user.data.token)
            .then(response => {
                dispatch(loading(false));
                dispatch(prescription(response.data));
                resolve(response.data);
            })
            .catch(error => {
                dispatch(loading(false));
                reject(HandleResponse(error, dispatch));
            });
    });
}

export const updatePrescription = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
            .put('admin/user/prescription', params, user.data.token)
            .then(() => {
                dispatch(loading(false));
                dispatch(editPrescription(params));
                resolve(true);
            })
            .catch(error => {
                dispatch(loading(false));
                reject(HandleResponse(error, dispatch));
            });
    });
}
