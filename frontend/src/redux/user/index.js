import { LOGIN_SUCCESS, LOGOUT, USER_LOADING, FETCH_USER, FETCH_USER_ADDRESS, ADD_USER_ADDRESS, UPDATE_USER_ADDRESS, UPDATE_USER_TIMEZONE } from "../constants";

const INIT_STATE = {
    is_login: false,
    is_loading: false,
    data: null,
    list: [],
    users_address: []
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                is_login: true,
                data: action.data,
            };
        case USER_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case FETCH_USER:
            return {
                ...state,
                list: action.data,
            };
        case FETCH_USER_ADDRESS:
            return {
                ...state,
                users_address: action.data,
            };
        case ADD_USER_ADDRESS:
            return {
                ...state,
                users_address: [...state.users_address, action.data],
            };
        case UPDATE_USER_ADDRESS:
            const index = state.users_address.findIndex(row => row.id === action.data.id);
            if (index > -1) {
                state.users_address[index] = { ...state.users_address[index], ...action.data };
            }
            return {
                ...state
            };
        case UPDATE_USER_TIMEZONE:
            return {
                ...state,
                data: {
                    ...state.data,
                    time_zone: action.data
                }
            };
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state;
    }
};
