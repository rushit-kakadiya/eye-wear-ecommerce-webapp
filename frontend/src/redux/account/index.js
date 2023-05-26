import { ACCOUNTS_LOADING, LOGOUT } from "../constants";

const INIT_STATE = {
    is_loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ACCOUNTS_LOADING:
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
    