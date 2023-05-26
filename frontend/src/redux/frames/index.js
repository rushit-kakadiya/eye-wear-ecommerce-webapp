import { FETCH_FRAMES_SUCCESS, FRAME_DETAIL, LOGOUT } from "../constants";

const INIT_STATE = {
    list: [],
    detail: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_FRAMES_SUCCESS:
            return {...state, list: action.data}; 
        case FRAME_DETAIL: 
            return {
                ...state,
                detail: action.data,
            }; 
        case LOGOUT:
            return INIT_STATE;
        default:
            return state;
    }
};
    