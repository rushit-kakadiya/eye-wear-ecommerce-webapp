
import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {toastAction} from '../ToastActions';

import {
    FETCH_HTO_ORDER,
    HTO_LOADING,
    HTO_ORDER_DETAIL,
    SELECT_HTO_USER,
    SELECT_HTO_USER_ADDRESS,
    GET_HTO_TIME_SLOT,
    GET_OPTICIAN_LIST,
    CLEAR_HTO_DETAIL,
    GET_INPUT_PERSON_LIST,
    GET_OPTICIAN_APPIONTMENTS_LIST
} from '../constants';

export const getHtoOrders = (data) => {
    return {
        type: FETCH_HTO_ORDER,
        data
    }
}

export const selectHtoUser = (data) => {
    return {
        type: SELECT_HTO_USER,
        data
    }
}

export const loading = (status) => {
    return {
        type: HTO_LOADING,
        status
    }
}

export const ordersDetail = (data) => {
    return {
        type: HTO_ORDER_DETAIL,
        data
    }
}

export const getTimeSlot = (data) => {
    return {
        type: GET_HTO_TIME_SLOT,
        data
    }
}

export const selectHtoUserAddress = (data) => {
    return {
        type: SELECT_HTO_USER_ADDRESS,
        data
    }
}

export const getOptician = (data) => {
    return {
        type: GET_OPTICIAN_LIST,
        data
    }
}

export const getInputPerson = (data) => {
    return {
        type: GET_INPUT_PERSON_LIST,
        data
    }
}

export const clearHtoDetail = () => {
    return {
        type: CLEAR_HTO_DETAIL
    }
}

export const getOpticianAppiontmentsList = (data) => {
    return {
        type: GET_OPTICIAN_APPIONTMENTS_LIST,
        data
    }
}
export const addUser = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        const newParams = {
            name: params.name,
            mobile: params.mobile,
            email: params.email,
            gender: params.gender,
            dob: params.dob,
            country_code:params.country_code
        };
        if(params['id']){
            ApiClient
                .put('admin/user', {...newParams, id: params['id']},  user.data.token)
                .then(() => {
                    dispatch(selectHtoUser({...newParams, id: params['id']}));
                    dispatch(loading(false));
                    resolve(true);
                })
                .catch(error => {
                    dispatch(loading(false));
                    reject(HandleResponse(error, dispatch));
                });
        } else {
            ApiClient
                .post('admin/user', newParams,  user.data.token)
                .then(response => {
                    dispatch(selectHtoUser(response.data));
                    dispatch(loading(false));
                    resolve(true);
                })
                .catch(error => {
                    dispatch(loading(false));
                    reject(HandleResponse(error, dispatch));
                });
        }
    });
    
}  

export const fetchOrders = (params) => (dispatch, getState) => {
    params = {
        ...params,
        start_date : params.start_date ? new Date(params.start_date).toISOString() : undefined,
        end_date : params.end_date ? new Date(params.end_date).toISOString() : undefined
    };
    const {user} = getState();
    dispatch(loading(true));
    dispatch(getHtoOrders({
        total_rows: 0,
        list: []
    }));
    ApiClient
        .get('admin/order', params,  user.data.token)
        .then(response => {
            dispatch(getHtoOrders(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const fetchHtoOrdersDetail = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    dispatch(getHtoOrders({
        total_rows: 0,
        list: []
    }));
    ApiClient
        .get('admin/hto/order-detail', params,  user.data.token)
        .then(response => {
            dispatch(ordersDetail(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const downloadPDF = (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
            .get('admin/order-pdf', params,  user.data.token)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(HandleResponse(error, dispatch));
            });
    });
}

export const getHtoTimeSlote = (params) =>  (dispatch, getState) =>{
    const {user} = getState();
    ApiClient
    .get('catalogue/hto_slot', params, user.data.token)
    .then(response => {
        dispatch(getTimeSlot(response.data));
        dispatch(loading(false));
    })
    .catch(error => {
        dispatch(loading(false));
        HandleResponse(error, dispatch);
    });
}

export const bookAppiontment = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/hto/appointment', params,  user.data.token)
        .then((response) => {
            toastAction(true, response.message.id);
            dispatch(loading(false));
            resolve(response.data.id);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}

export const getOpticianList = (params) =>  (dispatch, getState) =>{
    const {user} = getState();
    ApiClient
    .get('admin/optician', params, user.data.token)
    .then(response => {
        dispatch(getOptician(response.data));
        dispatch(loading(false));
    })
    .catch(error => {
        dispatch(loading(false));
        HandleResponse(error, dispatch);
    });
}

export const getInputPersonList = (params) =>  (dispatch, getState) =>{
    const {user} = getState();
    ApiClient
    .get('admin/staff', params, user.data.token)
    .then(response => {
        dispatch(getInputPerson(response.data));
        dispatch(loading(false));
    })
    .catch(error => {
        dispatch(loading(false));
        HandleResponse(error, dispatch);
    });
}
export const updateOptician = (params) =>  (dispatch, getState) =>{
    const {user} = getState();
    const data = {
        appointment_id:params.appointment_id
    }
    if(params.optician_id){
        data.optician_id = params.optician_id;
    } else if(params.appointment_date && params.slot_id){
        data.appointment_date = params.appointment_date;
        data.slot_id = params.slot_id;
    } else if (params.appointment_status){
        data.status = params.appointment_status
        data.comment = params.comment
    }
    ApiClient
    .put('admin/hto-detail', data, user.data.token)
    .then(response => {
        dispatch(ordersDetail({...params, isUpdated:true}));
        toastAction(true, response.message.id);;
        dispatch(loading(false));
    })
    .catch(error => {
        dispatch(loading(false));
        HandleResponse(error, dispatch);
    });
}

export const getOpticiAnppointments = (params) =>  (dispatch, getState) =>{
    const {user} = getState();
    ApiClient
    .get('admin/optician/calendar', params, user.data.token)
    .then(response => {
        dispatch(getOpticianAppiontmentsList(response.data));
        dispatch(loading(false));
    })
    .catch(error => {
        dispatch(loading(false));
        HandleResponse(error, dispatch);
    });
}