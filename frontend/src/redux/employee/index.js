import { FETCH_EMPLOYEE_SUCCESS, EMPLOYEE_LOADING, DELETE_EMPLOYEE, LOGOUT } from "../constants";

const INIT_STATE = {
    is_loading: false,
    total_rows: 0,
    list: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_EMPLOYEE_SUCCESS:
            return {...state, ...action.data}; 
        case EMPLOYEE_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case DELETE_EMPLOYEE:
            const index = state.list.findIndex(row => row.id === action.id);
            if(index > -1) {
                state.list.splice(index, 1);
            }  
            return { ...state };
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state;
    }
};
    