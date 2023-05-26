import ApiClient from '../ApiClient';
import { getOrderDetailsGroupByDate, getAppointmentItemGroupByDate } from "../../utilities/methods"

import {
    ORDERS_LOADING,
    FETCH_APPOINTMENT_LIST,
    FETCH_ORDERS_LIST,
    FETCH_SUMMARY,
    FETCH_GRAPHICAL_DATA,
    GRAPH_LOADING
} from '../constants';


export const loading = (status) => {
    return {
        type: ORDERS_LOADING,
        status
    }
}


export const graphLoading = (status) => {
    return {
        type: GRAPH_LOADING,
        status
    }
}


export const getAppointmentList = (data) => {
    return {
        type: FETCH_APPOINTMENT_LIST,
        data
    }
}

export const getSummary = (data) => {
    return {
        type: FETCH_SUMMARY,
        data
    }
}

export const getOrdersList = (data) => {
    return {
        type: FETCH_ORDERS_LIST,
        data
    }
}


export const getGraphicalAppointmentData = (data) => {
    return {
        type: FETCH_GRAPHICAL_DATA,
        data
    }
}

export const getGraphicalOrdersData = (data) => {
    return {
        type: FETCH_GRAPHICAL_DATA,
        data
    }
}




export const fetchSummary = (params) => (dispatch, getState) => {
    
    params = {  ...params, 
        ...(params.start_date ? { start_date: params.start_date.toISOString() } : undefined), 
        ...(params.end_date ? { end_date: params.end_date.toISOString() } : undefined)
    }

    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/member/summary', params,  user.data.token)
        .then(response => {
            dispatch(getSummary(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            console.log("error => ", error);
        });
}



export const fetchAppointmentList = (params) => (dispatch, getState) => {
    

    params = {  ...params, 
        ...(params.start_date ? { start_date: params.start_date.toISOString() } : undefined), 
        ...(params.end_date ? { end_date: params.end_date.toISOString() } : undefined)
    }

    const {user} = getState();
    dispatch(getAppointmentList({
        total_rows: 0,
        list: []
    }));
    dispatch(loading(true));
    ApiClient
        .get('admin/optician/appoitments', params,  user.data.token)
        .then(response => {
                dispatch(getAppointmentList(response.data));
                dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            console.log("error => ", error);
        });
}


export const fetchOrdersList = (params) => (dispatch, getState) => {

    params = {  ...params, 
        ...(params.start_date ? { start_date: params.start_date.toISOString() } : undefined), 
        ...(params.end_date ? { end_date: params.end_date.toISOString() } : undefined)
    }

    const {user} = getState();
    dispatch(getOrdersList({
        total_rows: 0,
        list: []
    }));
    dispatch(loading(true));
    ApiClient
        .get('admin/member/orders', params,  user.data.token)
        .then(response => {
            dispatch(getOrdersList(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            console.log("error => ", error);
        });
}


export const fetchGraphicalAppointmentData = (params) => (dispatch, getState) => {

    params = {  ...params, 
                ...(params.start_date ? { start_date: params.start_date.toISOString() } : undefined), 
                ...(params.end_date ? { end_date: params.end_date.toISOString() } : undefined)
            }

    const {user} = getState();
    dispatch(getGraphicalAppointmentData([]));
    dispatch(graphLoading(true));
    ApiClient
        .get('admin/optician/appoitments', params,  user.data.token)
        .then(response => {
                let data = getAppointmentItemGroupByDate(response.data.list);
                dispatch(getGraphicalAppointmentData(data));
                dispatch(graphLoading(false));
        })
        .catch(error => {
            dispatch(graphLoading(false));
            console.log("error => ", error);
        });
}


export const fetchGraphicalOrdersData = (params) => (dispatch, getState) => {

    
    params = {  ...params, 
        ...(params.start_date ? { start_date: params.start_date.toISOString() } : undefined), 
        ...(params.end_date ? { end_date: params.end_date.toISOString() } : undefined)
    }

    const {user} = getState();
    dispatch(getGraphicalOrdersData([]));
    dispatch(graphLoading(true));
    ApiClient
        .get('admin/member/orders', params,  user.data.token)
        .then(response => {

            let data = getOrderDetailsGroupByDate(response.data.list,params.type);
            dispatch(getGraphicalOrdersData(data));
            dispatch(graphLoading(false));
        })
        .catch(error => {
            dispatch(graphLoading(false));
            console.log("error => ", error);
        });
}

