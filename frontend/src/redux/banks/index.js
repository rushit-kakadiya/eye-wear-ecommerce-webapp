import { FETCH_BANK_LIST, LOGOUT } from "../constants";

const INIT_STATE = [];

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_BANK_LIST:
            return action.data; 
        case LOGOUT:
            return INIT_STATE;
        default:
            return state;
    }
};
    