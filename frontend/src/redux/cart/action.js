import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {toastAction} from '../ToastActions';

import {
    GET_CART,
    ADD_CART,
    CART_LOADING,
    DELETE_CART,
    DELETE_CART_ADDON,
    FETCH_CART_ADDON,
    EMPTY_CART,
    SET_ITEM_WARRANTY,
    UPDATE_PRESCRIPTION_DETAIL,
    LENSES_ONLY_DISCOUNT,
    GET_CART_CLIPON,
    UPDATE_CART_PACKAGING
} from '../constants';

export const getCart = (data) => {
    return {
        type: GET_CART,
        data
    }
}


export const addCart = (data) => {
    return {
        type: ADD_CART,
        data
    }
}

export const loading = (status) => {
    return {
        type: CART_LOADING,
        status
    }
}

export const deleteCart = (data) => {
    return {
        type: DELETE_CART,
        data
    }
}

export const deleteCartAddon = (data) => {
    return {
        type: DELETE_CART_ADDON,
        data
    }
}

export const getLensesOnly = (data) => {
    return {
        type: FETCH_CART_ADDON,
        data
    }
}

export const emptyCart = () => {
    return {
        type: EMPTY_CART
    }
}

export const setItemWarranty = (data) => {
    return {
        type: SET_ITEM_WARRANTY,
        data
    }
}

export const updatePrescriptionDetail = (data) => {
    return {
        type: UPDATE_PRESCRIPTION_DETAIL,
        data
    }
}

export const lensesOnlyDiscount = (data) => {
    return {
        type: LENSES_ONLY_DISCOUNT,
        data
    }
}

export const getClipOns = (data) => {
    return {
        type: GET_CART_CLIPON,
        data
    }
}

export const updateCartPackaging = (data) => {
    return {
        type: UPDATE_CART_PACKAGING,
        data
    }
}

export const fetchCart = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/user/cart', params, user.data.token)
        .then(response => {
            dispatch(getCart(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        })
}

export const addToCart = (params) => (dispatch, getState) => {
    const {user} = getState();
    if(!params.sku_code){
        return Promise.reject(toastAction(false, 'Please select available size!'));
    }
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
            .post('admin/user/cart', params, user.data.token)
            .then(response => {
                dispatch(addCart(response.data));
                dispatch(loading(false));
                resolve(true);
            })
            .catch(error => {
                dispatch(loading(false));
                reject(HandleResponse(error, dispatch));
            });
    });
}

export const removeCart = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .delete('admin/user/cart', user.data.token, params)
        .then((response) => {
            dispatch(deleteCart(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const addCartAddon = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
            .post('admin/user/cart/addon', params, user.data.token)
            .then(response => {
                dispatch(addCart(response.data));
                dispatch(loading(false));
                resolve(true);
            })
            .catch(error => {
                dispatch(loading(false));
                reject(HandleResponse(error, dispatch));
            });
    });
}

export const editCartAddon = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
            .put('admin/user/cart/addon', params, user.data.token)
            .then(response => {
                dispatch(addCart(response.data));  
                dispatch(loading(false));
                resolve(true);
            })
            .catch(error => {
                dispatch(loading(false));
                reject(HandleResponse(error, dispatch));
            });
    });
}

export const removeCartAddon = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .delete(`admin/user/cart/addon`, user.data.token, params)
        .then((response) => {
            dispatch(deleteCartAddon(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const fetchLensesOnly = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('admin/user/cart/addon', params, user.data.token)
        .then(response => {
            dispatch(getLensesOnly(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        })
}

export const addPrescriptionToCart = (params) => (dispatch, getState) => {
    const {user, prescription} = getState();
    ApiClient
        .put('user/prescription-to-cart', params, user.data.token)
        .then(() => {
            const pres = prescription.list.find(p => p.id === params.id);
            if(pres){
                dispatch(updatePrescriptionDetail({...params, ...pres}));
            }
        })
        .catch(error => {
            console.log("error => ", error);
        })
}  

export const itemWarranty = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .put('admin/user/cart/warranty', params, user.data.token)
        .then((response) => {
            dispatch(setItemWarranty(params));
            dispatch(getCart(response.data));
        })
        .catch(error => {
            HandleResponse(error, dispatch);
        })
}

export const applyDiscount = (params) => (dispatch, getState) => {
    const {user, cart} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/user/cart/discount', params, user.data.token)
        .then((response) => {
            // const lensIndex = cart.lensesOnly && cart.lensesOnly.list.findIndex(row=>row.id === params.id);
            // const cliponsIndex = cart.clipons && cart.clipons.list.findIndex(row=>row.id === params.id);
            // if(lensIndex > -1)
            // {
            //     dispatch(lensesOnlyDiscount({...params, index: lensIndex, type: 'lens'}));
            // } else if(cliponsIndex > -1){
            //     dispatch(lensesOnlyDiscount({...params, index: cliponsIndex, type: 'clipon'}));
            // } else {
                dispatch(addCart(response.data));
            // }
            dispatch(loading(false));
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
    
} 

export const deleteDiscount = (params) => (dispatch, getState) => {
    const {user, cart} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .delete('admin/user/cart/discount', user.data.token, params)
        .then((response) => {
           dispatch(addCart(response.data));
           dispatch(loading(false));
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const fetchCartClipOns = (params) => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('catalogue/cart/clipons', params, user.data.token)
        .then(response => {
            dispatch(getClipOns(response.data));
        })
        .catch(error => {
            console.log("error => ", error);
        })
}

export const updateCartPackages = (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
        .put('catalogue/cart/packaging', params,  user.data.token)
        .then((response) => {
            dispatch(updateCartPackaging({...params, packages: response.data}));
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    })
        
}