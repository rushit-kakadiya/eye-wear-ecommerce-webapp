import ApiClient from '../ApiClient';

import {
    FETCH_OTHER_PRODUCT
} from '../constants';

export const getOtherProduct = (data) => {
    return {
        type: FETCH_OTHER_PRODUCT,
        data
    }
}

export const fetchOtherProduct = () => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/others-product', '', user.data.token)
        .then(response => {
            dispatch(getOtherProduct(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
}
