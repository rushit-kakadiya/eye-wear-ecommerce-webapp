import { FETCH_ADMIN_USERS_SUCCESS, USER_MANAGEMENT_LOADING, SET_USER_ID, UPDATE_USER_STATUS, GET_ROLES, LOGOUT } from "../constants";

const INIT_STATE = {
    is_loading: false,
    total_rows: 0,
    list: [],
    selectedUserId: '',
    roles: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_ADMIN_USERS_SUCCESS:
            return {...state, ...action.data}; 
        case USER_MANAGEMENT_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case SET_USER_ID:
            return {
                ...state,
                selectedUserId: action.id,
            };    
        case UPDATE_USER_STATUS:
            const index = state.list.findIndex(row => row.id === action.data.id);
            if(index > -1) {
                state.list[index].status = action.data.status;
            } 
            return {...state, list: [...state.list]};
        case GET_ROLES:
            return {...state, roles: action.data}; 
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state;
    }
};
    