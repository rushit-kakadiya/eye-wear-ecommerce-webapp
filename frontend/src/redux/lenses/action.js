import ApiClient from '../ApiClient';

import {
    FETCH_LENSES_SUCCESS
} from '../constants';

export const getLenses = (data) => {
    return {
        type: FETCH_LENSES_SUCCESS,
        data
    }
}

export const fetchLenses = () => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/lenses', '', user.data.token)
        .then(response => {
            dispatch(getLenses(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
}
