import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {
    FETCH_ANALYTICS_LIST,
    ANALYTICS_LOADING
} from '../constants';


export const loading = (status) => {
    return {
        type: ANALYTICS_LOADING,
        status
    }
}

export const getAnalyticsList = (data) => {
    return {
        type: FETCH_ANALYTICS_LIST,
        data
    }
}

export const fetchAnalyticsList = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(getAnalyticsList({
        total_rows: 0,
        list: []
    }));
    dispatch(loading(true));
    ApiClient
        .get('admin/members/performance', params,  user.data.token)
        .then(response => {
            dispatch(getAnalyticsList(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}
