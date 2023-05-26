import {
    FETCH_FRAMES_NAME_LIST, FRAME_NAME_DETAIL, DELETE_FRAME_NAME, FETCH_FRAMES_COLOR_LIST,
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
    SHOW_ON_APP,
    LOGOUT
} from "../constants";

const INIT_STATE = {
    frameNameList: [],
    frameColorList: [],
    frameSizes: [
        { size_code: 'SZ01' },
        { size_code: 'SZ02' },
        { size_code: 'SZ04' },
        { size_code: 'SZ03' }
    ],
    is_loading: false,
    total_rows: 0,
    list: [],
    detail: {},
    product_detail: {},
    gallery : []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_FRAMES_COLOR_LIST:
            return {
                ...state,
                ...action.data
            };
        case FRAME_COLOR_DETAIL:
            return {
                ...state,
                detail: action.data,
            };
        case DELETE_FRAME_COLOR:
            return {
                ...state,
                detail: action.data,
            };
        case FETCH_FRAMES_NAME_LIST:
            return {
                ...state,
                ...action.data
            };
        case FRAME_NAME_DETAIL:
            return {
                ...state,
                detail: action.data,
            };
        case DELETE_FRAME_NAME:
            return {
                ...state,
                detail: action.data,
            };
        case FETCH_ALL_PRODUCTS_LIST:
            return {
                ...state,
                ...action.data
            };
        case FETCH_ALL_FRAMES_NAME_LIST:
            return {
                ...state,
                frameNameList: action.data
            };
        case FETCH_ALL_FRAMES_COLOR_LIST:
            return {
                ...state,
                frameColorList: action.data
            };
        case RESET_FRAMES_SIZES:
            return {
                ...state,
                frameSizes: INIT_STATE.frameSizes
            };
        case FETCH_ALL_FRAMES_SIZES:
            let fsizes = action.data.length > 0 ? state.frameSizes.filter(ar =>  !action.data.find(rm => (rm.size_code === ar.size_code) )) : INIT_STATE.frameSizes
            return {
                ...state,
                frameSizes: fsizes
            };
        case PRODUCT_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case FETCH_PRODUCTS_DETAIL:
            return {
                ...state,
                product_detail: action.data
            };
        case MANAGE_PRODUCT:
            return {
                ...state,
                product_detail: {
                    ...state.product_detail,
                    status : action.data
                }
            };
        case FETCH_GALLERY_DETAIL: 
            return {
                ...state,
                gallery: action.data
            };
        case SHOW_ON_APP: 
            const index = state.list.findIndex(p => p.sku === action.data.sku_code);
            if(index !== -1){
                const key = action.data.category === 'optical' ? 'show_on_app' :'show_sunwear_on_app'; 
                state.list[index][key] = action.data.status;
            }
            return ({...state, list: [...state.list]});
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            state.frameSizes = INIT_STATE.frameSizes;
            return state
    }
};
