import { FETCH_PRESCRIPTION_SUCCESS, LOGOUT, PRESCRIPTION_LOADING, ADD_PRESCRIPTION, UPDATE_PRESCRIPTION } from "../constants";

const INIT_STATE = {
    list: [],
    is_loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_PRESCRIPTION_SUCCESS:
            return {...state, list: action.data}; 
        case PRESCRIPTION_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case ADD_PRESCRIPTION:
            return {...state, list: [...state.list, action.data]};  
        case UPDATE_PRESCRIPTION:
            const index = state.list.findIndex(row => row.id === action.data.id);
            if(index > -1){
                state.list[index] = {...state.list[index], ...action.data}; 
            } 
            return {...state};    
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state;
    }
};