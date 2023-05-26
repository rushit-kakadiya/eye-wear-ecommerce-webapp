import ApiClient from '../ApiClient';

import {
    FETCH_STORE_SUCCESS
} from '../constants';

export const getStores = (data) => {
    return {
        type: FETCH_STORE_SUCCESS,
        data
    }
}

export const fetchStores = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/store', params,  user.data.token)
        .then(response => {
            dispatch(getStores(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
}
