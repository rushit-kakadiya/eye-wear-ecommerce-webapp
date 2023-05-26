import ApiClient from '../ApiClient';
import HandleResponse from '../../jwt/_helpers/HandleResponse';

import {
    FETCH_FRAMES_SUCCESS,
    FRAME_DETAIL
} from '../constants';

export const getFrames = (data) => {
    return {
        type: FETCH_FRAMES_SUCCESS,
        data
    }
}


export const frameDetail = (data) => {
    return {
        type: FRAME_DETAIL,
        data
    }
}


export const fetchFrames = (params) => dispatch => {
    if(params.text.length > 1){
        ApiClient
            .get('admin/search', params)
            .then(response => {
                dispatch(getFrames(response.data.product.data));
            })
            .catch(error => {
                console.log("error => ", error);
            });
    }
}


export const fetchOrdersDetail = (params) => (dispatch) => {
    return new Promise((resolve, reject) => {
        ApiClient
        .get('catalogue/productDetails', {...params, store_id: params.store_id || 6591})
        .then(response => {
            dispatch(frameDetail(response.data));
            resolve(true);
        })
        .catch(error => {
            reject(HandleResponse(error, dispatch));
        });
    });
}
