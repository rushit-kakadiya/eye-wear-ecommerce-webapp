import ApiClient from '../ApiClient';

import {
    FETCH_BANK_LIST
} from '../constants';

export const getBankList = (data) => {
    return {
        type: FETCH_BANK_LIST,
        data
    }
}

export const fetchBankList = () => dispatch => {
    ApiClient
        .get('admin/banks')
        .then(response => {
            dispatch(getBankList(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
}
