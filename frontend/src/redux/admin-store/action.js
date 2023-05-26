import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {
    FETCH_STORE_LIST,
    STORE_LOADING,
    STORE_DETAIL,
    UPDATE_STORE,
    CHANGE_STORE_ACTIVITY,
    UPDATE_MAP_IMAGE,
    UPDATE_STORE_IMAGE,
    UPDATE_EMAIL_IMAGE
} from '../constants';

import {toastAction} from '../ToastActions';

export const getStoreList = (data) => {
    return {
        type: FETCH_STORE_LIST,
        data
    }
}

export const loading = (status) => {
    return {
        type: STORE_LOADING,
        status
    }
}

export const getStoreDetail = (data) => {
    return {
        type: STORE_DETAIL,
        data
    }
}

export const changeStore = (data) => {
    return {
        type: UPDATE_STORE,
        data
    }
}


export const changeStoreActivity = (data) => {
    return {
        type: CHANGE_STORE_ACTIVITY,
        data
    }
}


export const changeMapImage = (data) => {
    return {
        type: UPDATE_MAP_IMAGE,
        data
    }
}

export const changeStoreImage = (data) => {
    return {
        type: UPDATE_STORE_IMAGE,
        data
    }
}
 
export const changeEmailImage = (data) => {
    return {
        type: UPDATE_EMAIL_IMAGE,
        data
    }
}


export const fetchStoreList = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    dispatch(getStoreList({
        list: [],
        total_rows: 0
    }));
    ApiClient
        .get('admin/store', params, user.data.token)
        .then(response => {
            dispatch(getStoreList(response.data));
            dispatch(loading(false));
        })
        .catch((error) => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const updateStoreDetail = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .put('admin/store/activity', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
        })
        .catch((error) => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const fetchStoreDetail = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/store-details', params,  user.data.token)
        .then(response => {
            dispatch(getStoreDetail(response.data));
            dispatch(loading(false));
        })
        .catch((error) => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const createStore = (params,cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .post('admin/store', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            if(response){
                cb(response.data,false)
            }
        })
        .catch(error => {
            dispatch(loading(false));
            cb(error.data.message,true)
        });
}

export const updateStore = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .put('admin/store', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            if(response.status){
                toastAction(true, 'Store updated successfully')
                dispatch(getStoreDetail(response.data));
            }
        })
        .catch(() => {
            toastAction(false, 'There is some error in updating a store')
            dispatch(loading(false));
        });
}

export const updateStoreActivity = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .put('admin/store/activity', params, user.data.token)
        .then(response => {
            let status = false;
            if(params.status == 'true'){
                status = true
            }
            if(response.data){
                dispatch(changeStoreActivity(status));
            }
            dispatch(loading(false));
        })
        .catch((error) => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}



export const updateImage = (params, cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .postForumData('admin/store/images', params, user.data.token)
        .then(response => {
            console.log(response);

            if(response.data.status){
                console.log(params.type);
                if(params.type == "map_image"){
                    dispatch(changeMapImage(response.data.file));
                }
                else if(params.type == "store_image"){
                    dispatch(changeStoreImage(response.data.file));
                }
                else if(params.type == "email_image"){
                    dispatch(changeEmailImage(response.data.file));
                }
            }
            dispatch(loading(false));
            
        })
        .catch(() => {
            dispatch(loading(false));
        });
}

