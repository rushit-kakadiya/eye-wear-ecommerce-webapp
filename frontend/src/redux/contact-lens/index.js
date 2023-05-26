import { FETCH_CONTACT_LENSES, LOGOUT } from "../constants";

const INIT_STATE = [];

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_CONTACT_LENSES:
            return action.data; 
        case LOGOUT:
            return INIT_STATE;
        default:
            return state;
    }
};
    