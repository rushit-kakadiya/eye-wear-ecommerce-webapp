
import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import { emptyCart } from '../cart/action';
import {toastAction} from '../ToastActions';

import {
    FETCH_ORDER_SUCCESS,
    SELECT_STORE,
    SELECT_USER,
    ORDER_LOADING,
    SELECT_USER_ADDRESS,
    SET_DELIVERY_TYPE,
    SET_SALES_TYPE,
    SELECT_FRAME,
    ORDER_SUCCESS,
    ORDER_CANCEL,
    PROCESS_ORDER,
    FETCH_PACKAGING,
    UPDATE_STOCK_STORE,
    PICK_UP_STORE,
    SET_FILTER_STORE_ID,
    SET_HTO_APPIONTMENT_NO,
    UPDATE_ORDER_STATUS,
    APPLIED_DISCOUNT_VOUCHER,
    DISCOUNTED_CART_AMOUNT,    
    UPDATE_DELIVERY_ADDRESS,
    REDEEMED_COFFEE
} from '../constants';

export const getOrders = (data) => {
    return {
        type: FETCH_ORDER_SUCCESS,
        data
    }
}

export const selectStore = (data) => {
    return {
        type: SELECT_STORE,
        data
    }
}

export const pickUpStore = (data) => {
    return {
        type: PICK_UP_STORE,
        data
    }
}

export const addUserInOrder = (data) => {
    return {
        type: SELECT_USER,
        data
    }
}

export const loading = (status) => {
    return {
        type: ORDER_LOADING,
        status
    }
}

export const selectUserAddress = (data) => {
    return {
        type: SELECT_USER_ADDRESS,
        data
    }
}

export const setDeliveryType = (data) => {
    return {
        type: SET_DELIVERY_TYPE,
        data
    }
}

export const selectFrame = (data) => {
    return {
        type: SELECT_FRAME,
        data
    }
}

export const orderSuccess = (data) => {
    return {
        type: ORDER_SUCCESS,
        data
    }
}

export const setSalesChanenelType = (data) => {
    return {
        type: SET_SALES_TYPE,
        data
    }
}

export const orderPaymentCancelled = (data) => {
    return {
        type: ORDER_CANCEL,
        data
    }
}

export const orderProcess = (data) => {
    return {
        type: PROCESS_ORDER,
        data
    }
}

export const getPackaging = (data) => {
    return {
        type: FETCH_PACKAGING,
        data
    }
}

export const updateStockStore = (data) => {
    return {
        type: UPDATE_STOCK_STORE,
        data
    }
}

export const setFilterStoreId = (data) => {
    return {
        type: SET_FILTER_STORE_ID,
        data
    }
}

export const setHtoAppointment = (data) => {
    return {
        type: SET_HTO_APPIONTMENT_NO,
        data
    }
}

export const updateOrderStatus = (data) => {
    return {
        type: UPDATE_ORDER_STATUS,
        data
    }
}

export const appliedDiscountVoucher = (data) => {
    return {
        type: APPLIED_DISCOUNT_VOUCHER,
        data
    }
} 

export const updateDeliveryAddress = (data) =>{
    return {
        type: UPDATE_DELIVERY_ADDRESS,
        data
    }    
}

export const discountedCartAmount = (data) => {
    return {
        type: DISCOUNTED_CART_AMOUNT,
        data
    }
}

export const redeemedCoffee = (data) => {
    return {
        type: REDEEMED_COFFEE,
        data
    }
}

export const fetchOrders = (params) => (dispatch, getState) => {
    params = {
            ...params,
            start_date : params.start_date ? new Date(params.start_date).toISOString() : undefined,
            end_date : params.end_date ? new Date(params.end_date).toISOString() : undefined
        };
    const {user} = getState();
    dispatch(loading(true));
    dispatch(getOrders({
        total_rows: 0,
        list: []
    }));
    ApiClient
        .get('admin/order', params,  user.data.token)
        .then(response => {
            dispatch(getOrders(response.data));
            dispatch(loading(false));
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
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
                    dispatch(addUserInOrder({...newParams, id: params['id']}));
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
                    dispatch(addUserInOrder(response.data));
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

export const addDraftOrder = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .post('admin/order', params,  user.data.token)
        .then(() => {
            dispatch(loading(false));
            dispatch(addUserInOrder(null)); 
            dispatch(selectUserAddress(null));
            dispatch(setDeliveryType('store'));
            dispatch(selectStore(null));
            dispatch(emptyCart());
        })
        .catch(error => {
            dispatch(loading(false));
        });
} 

export const createOrder = (params) => (dispatch, getState) => {
    const {user} = getState();
    const name = params.name;
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        delete params.name;
        ApiClient
        .post('admin/user/checkout', params,  user.data.token)
        .then((response) => {
            dispatch(loading(false));
            dispatch(orderSuccess({...response.data, name }));
            dispatch(emptyCart());
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch, 'en'));
        });
    })
    
} 

export const createVAPayment = (params) => (dispatch, getState) => {
    const {user, order} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('user/va-payment', params,  user.data.token)
        .then((response) => {
            dispatch(loading(false));
            dispatch(orderSuccess({...order.order_detail, payment_amount: params.amount }));
            resolve(response.data);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
    
} 

export const createInStorePament = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/user/payment', params,  user.data.token)
        .then((response) => {
            dispatch(loading(false));
            dispatch(orderSuccess(null));
            resolve(response.data);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
    
} 

export const fetchOrdersDetail = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/order-detail', params,  user.data.token)
        .then(response => {
            dispatch(orderSuccess(response.data));
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


export const cancelOrder= (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        dispatch(loading(true));
        ApiClient
        .put('admin/order/cancel', params,  user.data.token)
        .then((response) => {
            dispatch(loading(false));
            dispatch(orderPaymentCancelled(response.data));
            toastAction(true, response.message.id);
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
        
}  

export const processOrder= (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/process-order', params,  user.data.token)
        .then((response) => {
            dispatch(orderProcess({...params, ...response.data}));
            toastAction(true, response.message.id);
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    })
        
}

export const updateOrderStaffOptician = (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/update-optician-staff', params,  user.data.token)
        .then((response) => {
            toastAction(true, response.message.id);
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    })
        
}

export const addWishlist = (params) => (dispatch, getState) => {
    const {user} = getState();
    if(!params.sku_code){
        return Promise.reject(toastAction(false, 'Please select available size!'));
    }
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/wishlist', params,  user.data.token)
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

export const fetchPackaging = () => (dispatch, getState) => {
    const {user} = getState();
    ApiClient
        .get('catalogue/packaging', '',  user.data.token)
        .then(response => {
            dispatch(getPackaging(response.data));
        })
        .catch(error => {
            console.log(error);
        });
} 

export const exportOrders = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
            .get('admin/export/orders', params,  user.data.token)
            .then(response => {
                resolve(response.data);
                dispatch(loading(false));
            })
            .catch(() => {
                reject(false);
                dispatch(loading(false));
            });
    });
}

export const updateOrderStockStore = (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/stock-store', params,  user.data.token)
        .then((response) => {
            dispatch(updateStockStore(params.stock_store_id))
            toastAction(true, response.message.id);
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    })
        
}


export const changeLens= (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/change-lens', params,  user.data.token)
        .then((response) => {
            toastAction(true, response.message.id);
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    })
        
} 

export const changeOrderStatus = (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/order/status', params,  user.data.token)
        .then((response) => {
            dispatch(updateOrderStatus(params));
            toastAction(true, response.message.id);
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    })
        
}

export const checkDiscountVoucher = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/apply-voucher', params,  user.data.token)
        .then((response) => {
            toastAction(true, response.message.id);
            dispatch(discountedCartAmount(response.data));
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => { 
            const errorMessage = error.data && error.data.message ? error.data.message.en : null;
            dispatch(loading(false));
            if(errorMessage){
                toastAction(false, errorMessage);
                reject(false);
            } else {
                reject(HandleResponse(error, dispatch));
            }
        });
    })
        
}

export const deleteOrder = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .delete(`admin/order/${params}`, user.data.token)
        .then((response) => {
            toastAction(true, response.message.id);
            dispatch(loading(false));
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const addDeliveryAddress = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/order-delivery', params,  user.data.token)
        .then((response) => {
            dispatch(updateDeliveryAddress(params));
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

export const checkSicepatAvialiblity = (params) => (dispatch, getState) => {
    const {user} = getState();
    return new Promise((resolve, reject) => {
        ApiClient
            .get('sicepat/sicepat-avialiblity', params,  user.data.token)
            .then(() => {
                resolve(true);
            })
            .catch(error => {
                reject(HandleResponse(error, dispatch));
            });
        })       
} 

export const submitSicepatOrder = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('sicepat/order', params,  user.data.token)
        .then((response) => {
            dispatch(updateDeliveryAddress(response.data));
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

export const redeemCoffee = (params) => (dispatch, getState) => {
    const {user} = getState();
    const newParams = {...params};
    delete params.store_name;
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/redeem-coffee', params,  user.data.token)
        .then((response) => {
            dispatch(redeemedCoffee({created_at: response.data.created_at, name: newParams.store_name}));
            toastAction(true, response.message.id);
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    })        
}

export const createXenditInvoice = (params) => (dispatch, getState) => {
    const {user, order} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .post('admin/xendit-invoice', params,  user.data.token)
        .then((response) => {
            dispatch(loading(false));
            dispatch(orderSuccess({...order.order_detail, payment_amount: params.amount }));
            resolve(response.data);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
    
} 