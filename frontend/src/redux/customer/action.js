import ApiClient from '../ApiClient';
import {addUserInOrder} from '../order/action';
import HandleResponse from '../../jwt/_helpers/HandleResponse';

import {
    FETCH_USER_LIST,
    CUSTOMER_LOADING,
    CUSTOMER_DETAIL,
    DELETE_USER_ADDRESS,
    UPDATE_CUSTOMER_PRESCRIPTION,
    DELETE_CUSTOMER_PRESCRIPTION,
    ADD_CUSTOMER_PRESCRIPTION,
    ADD_USER_ADDRESS,
    UPDATE_USER_ADDRESS,
    UPDATE_CUSTOMER
} from '../constants';

export const getUserList = (data) => {
    return {
        type: FETCH_USER_LIST,
        data
    }
}

export const loading = (status) => {
    return {
        type: CUSTOMER_LOADING,
        status
    }
}

export const getCustomerDetail = (data) => {
    return {
        type: CUSTOMER_DETAIL,
        data
    }
}

export const addCustomerAddress = (data) => {
    return {
        type: ADD_USER_ADDRESS,
        data
    }
}
export const updateCustomerAddress = (data) => {
    return {
        type: UPDATE_USER_ADDRESS,
        data
    }
}

export const deleteAddress = (data) => {
    return {
        type: DELETE_USER_ADDRESS,
        data
    }
}


export const addCustomerPrescription = (data) => {
    return {
        type: ADD_CUSTOMER_PRESCRIPTION,
        data
    }
}

export const updateCustomerPrescription = (data) => {
    return {
        type: UPDATE_CUSTOMER_PRESCRIPTION,
        data
    }
}

export const deleteCustomerPrescription = (data) => {
    return {
        type: DELETE_CUSTOMER_PRESCRIPTION,
        data
    }
}

export const updateCustomer = (data) => {
    return {
        type: UPDATE_CUSTOMER,
        data
    }
}


export const fetchUserList = (params) => (dispatch, getState) => {
    params = {
        ...params,
        created_at : params.created_at ? new Date(params.created_at).toISOString() : undefined,
        dob : params.dob ? new Date(params.dob).toISOString() : undefined
    };
    const {user} = getState();
    dispatch(loading(true));
    dispatch(getUserList({
        list: [],
        total_rows: 0
    }));
    ApiClient
        .get('admin/user', params,  user.data.token)
        .then(response => {
            dispatch(getUserList(response.data));
            dispatch(loading(false));
        })
        .catch((error) => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const fetchCustomerDetail = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/customer-detail', params,  user.data.token)
        .then(response => {
            dispatch(getCustomerDetail(response.data));
            dispatch(addUserInOrder({...response.data.profileSummary['user'], id: params['id']}));
            dispatch(loading(false));
        })
        .catch((error) => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const deleteUserAddress = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
    .delete(`user/address/${params}`,  user.data.token )
    .then(response => {
         dispatch(deleteAddress(params));
    })
    .catch((error) => {
        dispatch(loading(false));
        HandleResponse(error, dispatch);
    });
}

export const deletePrescriptions = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
    .delete(`user/prescription/${params}`,  user.data.token )
    .then(response => {
         dispatch(deleteCustomerPrescription(params));
    })
    .catch(() => {
        dispatch(loading(false));
    });
}

export const exportCustomers = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
            .get('admin/export/customers', params,  user.data.token)
            .then(response => {
                resolve(response.data);
                dispatch(loading(false));
            })
            .catch((error) => {
                dispatch(loading(false));
                reject(HandleResponse(error, dispatch));
            });
    });
}