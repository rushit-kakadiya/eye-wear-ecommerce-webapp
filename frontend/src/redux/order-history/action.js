import ApiClient from '../ApiClient';

import {
    ORDER_HISTORY
} from '../constants';

export const orderHistory = (data) => {
    return {
        type: ORDER_HISTORY,
        data
    }
}

export const fetchOrderHistory= (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise(() => {
        ApiClient
        .get('user/order-history', params,  user.data.token)
        .then(response => {
            dispatch(orderHistory(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
    })
        
}
