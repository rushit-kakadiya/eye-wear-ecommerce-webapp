import ApiClient from '../ApiClient';

import {
    FETCH_CLIPON_SUCCESS
} from '../constants';

export const getClipOns = (data) => {
    return {
        type: FETCH_CLIPON_SUCCESS,
        data
    }
}

export const fetchClipOns = () => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('catalogue/clipons', '', user.data.token)
        .then(response => {
            dispatch(getClipOns(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
}
