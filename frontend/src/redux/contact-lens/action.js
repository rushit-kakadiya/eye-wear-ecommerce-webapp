import ApiClient from '../ApiClient';

import {
    FETCH_CONTACT_LENSES
} from '../constants';

export const getContactLenses = (data) => {
    return {
        type: FETCH_CONTACT_LENSES,
        data
    }
}

export const fetchContactLenses = () => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/contact-lens', '', user.data.token)
        .then(response => {
            dispatch(getContactLenses(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        });
}
