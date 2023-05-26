import { 
    FETCH_HTO_ORDER,
    LOGOUT,
    HTO_LOADING,
    HTO_ORDER_DETAIL,
    SELECT_HTO_USER,
    SELECT_HTO_USER_ADDRESS,
    GET_HTO_TIME_SLOT,
    GET_OPTICIAN_LIST,
    CLEAR_HTO_DETAIL,
    GET_INPUT_PERSON_LIST,
    GET_OPTICIAN_APPIONTMENTS_LIST
} from "../constants";

const INIT_STATE = {
    is_loading: false,
    total_rows: 0,
    list: [],
    selected_user: null,
    users_address: null,
    selected_user_address: null,
    detail: null,
    time_slot: null,
    optician_list: [],
    input_person_list: [],
    optician_appointments_list:[]
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_HTO_ORDER:
            return {
                ...state,
                ...action.data,
            }; 
        case HTO_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case HTO_ORDER_DETAIL:
            if(action.data.isUpdated){
                    state.detail.data['appointment_date'] = action.data.appointment_date || state.detail.data['appointment_date'];
                    state.detail.data['optician_id'] = action.data.optician_id ||  state.detail.data['optician_id'];
                    state.detail.data['opt_name'] = action.data.optician_name ||  state.detail.data['opt_name'];
                    state.detail.data['slot_start_time'] = action.data.slot_start_time ||  state.detail.data['slot_start_time'];
                    state.detail.data['appointment_status'] = action.data.appointment_status ||  state.detail.data['appointment_status'];
                    return {...state}
                } else{
                    return {
                        ...state,
                        detail: action.data,
                    };
                }
        case SELECT_HTO_USER:
            return {
                ...state,
                selected_user: action.data,
            };
        case SELECT_HTO_USER_ADDRESS:
            return {
                ...state,
                selected_user_address: action.data,
            };
        case GET_HTO_TIME_SLOT:
            return {
                ...state,
                time_slot: action.data,
            };
        case GET_OPTICIAN_LIST:
            return {
                ...state,
                optician_list: action.data,
            };
        case GET_INPUT_PERSON_LIST:
            return {
                ...state,
                input_person_list: action.data,
            };
        case GET_OPTICIAN_APPIONTMENTS_LIST:
            return {
                ...state,
                optician_appointments_list: action.data,
            };
        case CLEAR_HTO_DETAIL:
            return INIT_STATE;
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state
    }
};
    