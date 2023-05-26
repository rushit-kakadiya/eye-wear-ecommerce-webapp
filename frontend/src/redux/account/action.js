import ApiClient from '../ApiClient';

import { ACCOUNTS_LOADING } from '../constants';


export const loading = (status) => {
    return {
        type: ACCOUNTS_LOADING,
        status
    }
}

export const resetUserPassword = (params,cb) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .put('admin/account/reset-password', params,  user.data.token)
        .then(response => {
            dispatch(loading(false));
            cb(response.data.message,false)
        })
        .catch(error => {
            dispatch(loading(false));
            cb(error.data.message,true)
        });
}





