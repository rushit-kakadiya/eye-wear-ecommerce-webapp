import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';
import {toastAction} from '../ToastActions';
import {
    FETCH_FRAMES_NAME_LIST, 
    FRAME_NAME_DETAIL, 
    DELETE_FRAME_NAME,
    FETCH_FRAMES_COLOR_LIST,
    FRAME_COLOR_DETAIL,
    DELETE_FRAME_COLOR,
    PRODUCT_LOADING,
    FETCH_ALL_PRODUCTS_LIST,
    FETCH_ALL_FRAMES_NAME_LIST,
    FETCH_ALL_FRAMES_COLOR_LIST,
    FETCH_ALL_FRAMES_SIZES,
    RESET_FRAMES_SIZES,
    FETCH_PRODUCTS_DETAIL,
    MANAGE_PRODUCT,
    FETCH_GALLERY_DETAIL,
    SHOW_ON_APP
} from "../constants";

export const loading = (status) => {
    return {
        type: PRODUCT_LOADING,
        status
    }
}

export const getFrameNames = (data) => {
    return {
        type: FETCH_FRAMES_NAME_LIST,
        data
    }
}


export const getFrameNameDetail = (data) => {
    return {
        type: FRAME_NAME_DETAIL,
        data
    }
}


export const unsetFrameName = (data) => {
    return {
        type: DELETE_FRAME_NAME,
        data
    }
}

export const getFrameColors = (data) => {
    return {
        type: FETCH_FRAMES_COLOR_LIST,
        data
    }
}


export const getFrameColorDetail = (data) => {
    return {
        type: FRAME_COLOR_DETAIL,
        data
    }
}


export const unsetFrameColor = (data) => {
    return {
        type: DELETE_FRAME_COLOR,
        data
    }
}


export const getAllFrameNames = (data) => {
    return {
        type: FETCH_ALL_FRAMES_NAME_LIST,
        data
    }
}


export const getAllFrameColors = (data) => {
    return {
        type: FETCH_ALL_FRAMES_COLOR_LIST,
        data
    }
}

export const resetFrameSizes = (data) => {
    return {
        type: RESET_FRAMES_SIZES,
        data
    }
}

export const getAllFrameSizes = (data) => {
    return {
        type: FETCH_ALL_FRAMES_SIZES,
        data
    }
}


export const getAllProductsList = (data) => {
    return {
        type: FETCH_ALL_PRODUCTS_LIST,
        data
    }
}

export const getProductsDetail = (data) => {
    return {
        type: FETCH_PRODUCTS_DETAIL,
        data
    }
}


export const getFrameSkuGallery = (data) => {
    return {
        type: FETCH_GALLERY_DETAIL,
        data
    }
}


export const controlProduct = (data) => {
    return {
        type: MANAGE_PRODUCT,
        data
    }
}

export const setShowOnAppStatus = (data) => {
    return {
        type: SHOW_ON_APP,
        data
    }
}

export const createFrameName = (params,cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .post('admin/frame/name', params, user.data.token)
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

export const fetchFrameNames = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    // dispatch(resetFrameSizes([]));
    ApiClient
        .get('admin/frame/names', params)
        .then(response => {
            dispatch(loading(false));
            if (response.status) {
                if(params.page == 'all'){
                    dispatch(getAllFrameNames(response.data));
                }else{
                    dispatch(getFrameNames(response.data));
                }
            }
        })
        .catch(error => {
            console.log("error => ", error);
        });
}


export const fetchFrameNameDetail = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/frame-name/details', params)
        .then(response => {
            dispatch(loading(false));
            if (response.status) {
                dispatch(getFrameNameDetail(response.data));
            }
        })
        .catch(error => {
            console.log("error => ", error);
        });
}

export const deleteFrameName = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/frame-name/activity', params)
        .then(response => {
            dispatch(loading(false));
            if (response.status) {
                dispatch(unsetFrameName(response.data));
            }
        })
        .catch(error => {
            console.log("error => ", error);
        });
}

export const updateFrameName = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .put('admin/frame/name', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            if(response.status){
                toastAction(true, 'Frame Name updated successfully')
                dispatch(getFrameNameDetail(response.data));
            }
        })
        .catch(() => {
            toastAction(false, 'There is some error in updating a Frame Name')
            dispatch(loading(false));
        });
}

export const createFrameColor = (params,cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .post('admin/frame/color', params, user.data.token)
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

export const fetchFrameColors = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/frame/colors', params)
        .then(response => {
            dispatch(loading(false));
            if (response.status) {
                if(params.page == 'all'){
                    dispatch(getAllFrameColors(response.data));
                }else{
                    dispatch(getFrameColors(response.data));
                }
            }
        })
        .catch(error => {
            console.log("error => ", error);
        });
}


export const fetchFrameColorDetail = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/frame-color/details', params)
        .then(response => {
            dispatch(loading(false));
            if (response.status) {
                dispatch(getFrameNameDetail(response.data));
            }
        })
        .catch(error => {
            console.log("error => ", error);
        });
}

export const deleteFrameColor = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/frame-color/activity', params)
        .then(response => {
            dispatch(loading(false));
            if (response.status) {
                dispatch(unsetFrameName(response.data));
            }
        })
        .catch(error => {
            console.log("error => ", error);
        });
}

export const updateFrameColor = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .put('admin/frame/color', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            if(response.status){
                toastAction(true, 'Frame Color updated successfully')
                dispatch(getFrameColorDetail(response.data));
            }
        })
        .catch(() => {
            toastAction(false, 'There is some error in updating a Frame Color')
            dispatch(loading(false));
        });
}

export const updateImage = (params, cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .postForumData('admin/frame-color/images', params, user.data.token)
        .then(response => {
            console.log(response);

            if(response.data.status){
                console.log(params.type);
            }
            dispatch(loading(false));
            
        })
        .catch(() => {
            dispatch(loading(false));
        });
}



export const checkFrameSizeAvialability = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    ApiClient
        .get('admin/frame-size/availability', params)
        .then(response => {
            dispatch(loading(false));
            if (response.status) {
                if(response.data.length > 0){
                    dispatch(getAllFrameSizes(response.data));
                }else{
                    dispatch(resetFrameSizes([]));
                }

            }
        })
        .catch(error => {
            console.log("error => ", error);
            dispatch(loading(false));
        });
}


export const createFrameSku = (params,cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .post('admin/frame', params, user.data.token)
        .then(response => {
            if(response){
                cb(response.data,false)
            }
        })
        .catch((error) => {
            dispatch(loading(false));
            cb(error.data.message,true)
            reject(HandleResponse(error, dispatch));
        });
    })
} 



export const updateFrameSku = (params,cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .put('admin/frame', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            cb(response.data,false)
        })
        .catch((error) => {
            dispatch(loading(false));
            // cb(error.data.message,true)
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const fetchFrameSkuDetail = (params,cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .get(`admin/frame`, params, user.data.token)
        .then(response => {
            if(response){
                dispatch(getProductsDetail(response.data));
                cb(response.data,false)
            }
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 


export const fetchFrameSkuGallery = (params, cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .get(`admin/frame/gallery`, params, user.data.token)
        .then(response => {
            if(response){
                dispatch(getFrameSkuGallery(response.data));
                resolve(true);
            }
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const fetchFrameClipOnGallery = (params, cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .get(`admin/clip-on/gallery`, params, user.data.token)
        .then(response => {
            if(response){
                dispatch(getProductsDetail(response.data));
                resolve(response.data,false)
            }
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 


export const fetchFrameSkuVariants = (params,cb) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .get('admin/frame/variants', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            dispatch(getAllProductsList(response.data));
            cb(response.data,false)
        })
        .catch((error) => {
            dispatch(loading(false));
            // cb(error.data.message,true)
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const fetchAllProductsList = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    dispatch(getAllProductsList({
        total_rows: 0,
        list: []
    }));
    ApiClient
        .get('admin/products-list', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            dispatch(getAllProductsList(response.data));
        })
        .catch(error => {
            dispatch(loading(false));
            HandleResponse(error, dispatch);
        });
}

export const addLens = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .post('admin/lenses', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const fetchProductsDetail = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .get('admin/product/detail', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            dispatch(getProductsDetail(response.data));
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}

export const editLens = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .put('admin/lenses', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const manageProduct = (params) => (dispatch, getState) => {
    const { user } = getState();
    // dispatch(loading(true));
    return new Promise((resolve, reject) => {

        console.log(params);
    ApiClient
        .put(`admin/manage/product`, params , user.data.token)
        .then(response => {
            // dispatch(loading(false));
            console.log(response.data.status);
            dispatch(controlProduct(response.data.status));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const addClipOn = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .post('admin/clip-on', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const editClipOn = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .put('admin/clip-on', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const addContactLens = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .post('admin/contact-lens', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 


export const addOthers = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .post('admin/others', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 


export const editContactLens = (params) => (dispatch, getState) => {
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .put('admin/contact-lens', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const editOthersProduct = (params) => (dispatch, getState) => {
    console.log(params);
    const { user } = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
    ApiClient
        .put('admin/others', params, user.data.token)
        .then(response => {
            dispatch(loading(false));
            toastAction(true, response.message.id || 'Success!');
            resolve(true);
        })
        .catch((error) => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
} 

export const uploadLenses = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .postFormData('admin/lens-upload', params,  user.data.token)
        .then(() => {
            dispatch(loading(false));
            resolve(true);
        })
        .catch(error => { 
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}

export const showFrameOnApp = (params) => (dispatch, getState) => {
    const {user} = getState();
    dispatch(loading(true));
    return new Promise((resolve, reject) => {
        ApiClient
        .put('admin/show-frame-on-app', params,  user.data.token)
        .then(() => {
            dispatch(loading(false));
            dispatch(setShowOnAppStatus(params));
            resolve(true);
        })
        .catch(error => {
            dispatch(loading(false));
            reject(HandleResponse(error, dispatch));
        });
    })
}