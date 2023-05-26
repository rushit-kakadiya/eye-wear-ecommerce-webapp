import { FETCH_CLIPON_SUCCESS, LOGOUT } from "../constants";

const INIT_STATE = [];

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_CLIPON_SUCCESS:
            return action.data; 
        case LOGOUT:
            return INIT_STATE;
        default:
            return state;
    }
};
    