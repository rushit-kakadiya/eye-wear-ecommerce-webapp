import { FETCH_ANALYTICS_LIST,ANALYTICS_LOADING, LOGOUT } from "../constants";

const INIT_STATE = {
    is_loading: false,
    total_rows: 0,
    list: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_ANALYTICS_LIST:
            return action.data; 
        case ANALYTICS_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state
    }
};
    