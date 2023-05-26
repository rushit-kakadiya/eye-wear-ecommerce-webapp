import {GET_VOUCHER_LIST ,GET_DISCOUNT_CATEGORIES_LIST, GET_SKU_LIST, SET_INACTIVE_LIST_VOUCHER, SET_INACTIVE_VIEW_VOUCHER, DISCOUNT_LOADING, GET_VOUCHER_DETAIL, LOGOUT } from "../constants";

const INIT_STATE = {
    is_loading: false,
    categories: null,
    total_rows: 0,
    list: [],
    skuList: {frames:[], clipons:[], lens:[]},
    detail: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_VOUCHER_LIST:
            return {
                ...state,
                ...action.data
            }
        case GET_DISCOUNT_CATEGORIES_LIST:
            return {
                ...state,
                categories:action.data
            }   
        case GET_SKU_LIST:
            return {
                ...state,
                skuList:{...state.skuList, [action.data.type]:action.data.list}
            } 
        case DISCOUNT_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };  
        case GET_VOUCHER_DETAIL:
            return {
                ...state,
                detail: action.data,
            }; 
        case SET_INACTIVE_LIST_VOUCHER:  
            const index = state.list.findIndex((row)=>row.id === action.data)
            if(index > -1)
            {
                state.list[index].status = 2;
            }
            return {
                ...state
            };  
        case SET_INACTIVE_VIEW_VOUCHER: 
            state.detail.status = 2;              
            return {
                ...state
            };   
        case LOGOUT: 
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state; 
    }
}