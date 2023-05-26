
import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {toastAction} from '../ToastActions';

import {
    GET_DISCOUNT_CATEGORIES_LIST,
    GET_SKU_LIST,
    DISCOUNT_LOADING,
    GET_VOUCHER_LIST,
    GET_VOUCHER_DETAIL,
    SET_INACTIVE_LIST_VOUCHER,
    SET_INACTIVE_VIEW_VOUCHER,
    LOGOUT
} from '../constants';

export const loading = (status) => {
    return {
        type: DISCOUNT_LOADING,
        status
    }
}

export const getDiscountCategory = (data) => {
    return {
        type: GET_DISCOUNT_CATEGORIES_LIST,
        data
    }
}

export const getSkuList = (data) => {
    return {
        type: GET_SKU_LIST,
        data
    }
}

export const getVoucherList = (data) => {
    return {
        type: GET_VOUCHER_LIST,
        data
    }
}

export const getVoucherdetail = (data) => {
    return {
        type: GET_VOUCHER_DETAIL,
        data
    }
}

export const setInactiveListVoucher = (data) => {
    return {
        type: SET_INACTIVE_LIST_VOUCHER,
        data
    }
}

export const setInactiveViewVoucher = (data) => {
    return {
        type: SET_INACTIVE_VIEW_VOUCHER,
        data
    }
}

export const logout = (data) => {
    return {
        type: LOGOUT,
        data
    }
}


export const discountCategoryList = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
    .get('admin/discount-categories', params,  user.data.token)
    .then(response => {
        dispatch(getDiscountCategory(response.data));
    })
    .catch(error => {
        HandleResponse(error, dispatch);
    });
}

export const fecthDiscountList = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .get('admin/voucher', params,  user.data.token)
        .then(response => {
            dispatch(getVoucherList(response.data));
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}

export const fecthSkuList = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
    .get('admin/product-sku', params,  user.data.token)
    .then(response => {
        dispatch(getSkuList({...params, list:response.data}));
    })
    .catch(error => {
        HandleResponse(error, dispatch);
    });
}

export const updateVoucher = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .put('admin/voucher', params, user.data.token)
        .then(response => {
            toastAction(true, response.message.id);
            dispatch(getVoucherList(response.data));
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
     })
    }

export const uploadImage = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .postFormData('admin/file-upload', params,  user.data.token)
        .then((response) => {
            dispatch(loading(false));
            resolve(response.data.data);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}

export const setDiscountVoucher = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/voucher', params,  user.data.token)
        .then((response) => {
            toastAction(true, response.message.id);
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}


export const fecthDiscountDetail = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    dispatch(getVoucherdetail(null));
    return new Promise((resolve, reject) => {
        ApiClient
        .get('admin/voucher-detail', params,  user.data.token)
        .then(response => {
            dispatch(getVoucherdetail(response.data));
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}


export const inactiveVoucher  = (params, type = '') => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));    
    return new Promise((resolve, reject) => {
    ApiClient
        .delete(`admin/voucher/${params}`, user.data.token)
        .then((response) => {
            toastAction(true, response.message.id);
            if(type === 'list')
            {
                dispatch(setInactiveListVoucher(params));
            } else {
                dispatch(setInactiveViewVoucher(params));
            }
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
            reject(HandleResponse(error, dispatch));
        });
    })
}
