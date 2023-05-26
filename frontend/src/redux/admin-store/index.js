import {
    FETCH_STORE_LIST,
    STORE_LOADING,
    STORE_DETAIL,
    UPDATE_STORE,
    CHANGE_STORE_ACTIVITY,
    UPDATE_MAP_IMAGE,
    UPDATE_STORE_IMAGE,
    UPDATE_EMAIL_IMAGE,
    LOGOUT,
} from "../constants";

const INIT_STATE = {
    is_loading: false,
    stores: {
        total_rows: 0,
        list: []
    },
    detail: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_STORE_LIST:
            return {
                ...state,
                stores: action.data,
            };
        case STORE_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case STORE_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case STORE_DETAIL:
            return {
                ...state,
                detail: {
                    ...action.data
                }
            };
        case CHANGE_STORE_ACTIVITY:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    active : action.data
                }
            };
        case UPDATE_STORE:
            return { 
                ...state, 
                detail: { 
                    ...state.editableDetail 
                } 
            };
        case UPDATE_MAP_IMAGE:
            return { 
                ...state, 
                detail: { 
                    ...state.detail,
                    map_image_key : action.data
                } 
            };
        case UPDATE_STORE_IMAGE:
            return { 
                ...state, 
                detail: { 
                    ...state.detail,
                    store_image_key : action.data
                } 
            };
        case UPDATE_EMAIL_IMAGE:
            return { 
                ...state, 
                detail: { 
                    ...state.detail,
                    email_image_key: action.data
                } 
            };
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state;
    }
};
