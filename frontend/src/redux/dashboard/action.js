import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {
    FETCH_DASHBOARD_DATA,
    DASHBOARD_LOADING
} from '../constants';

export const getDashboardData = (data) => {
    return {
        type: FETCH_DASHBOARD_DATA,
        data
    }
}

export const loading = (status) => {
    return {
        type: DASHBOARD_LOADING,
        status
    }
}

export const fetchDashboardData = (params) => (dispatch, getState) => {
    params = {  
            ...params, 
            start_date:params.start_date ? new Date(params.start_date).toISOString() : undefined, 
            end_date:params.end_date ? new Date(params.end_date).toISOString() : undefined
            }
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/dashboard', params, user.data.token)
        .then(response => {
            dispatch(getDashboardData(response.data));
            dispatch(loading(false));
        })
        .catch((error) => {
            dispatch(loading(false));
            HandleResponse(error, dispatch)
        });
}
