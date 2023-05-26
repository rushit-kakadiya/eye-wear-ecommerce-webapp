import { 
    FETCH_APPOINTMENT_LIST, 
    FETCH_ORDERS_LIST, 
    FETCH_SUMMARY, 
    ORDERS_LOADING,     
    FETCH_GRAPHICAL_DATA, 
    GRAPH_LOADING,
    LOGOUT } from "../constants";

const INIT_STATE = {
    is_loading: false,
    is_graph_loading: false,
    total_rows: 0,
    list: [],
    appointments : {}, 
    revenueStore : {},
    revenueHTO : {},
    member : {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_APPOINTMENT_LIST:
            return {
                ...state,
                ...action.data,
            } 
        case FETCH_ORDERS_LIST:
            return {
                ...state,
                ...action.data,
            } 
        case FETCH_SUMMARY:
            return {
                ...state,
                ...action.data,
            } 
        case ORDERS_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case GRAPH_LOADING:
            return {
                ...state,
                is_graph_loading: action.status,
            };
        case FETCH_GRAPHICAL_DATA:
            return {
                ...state,
                list: action.data,
            };
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state
    }
};
    