import { FETCH_USER_LIST, CUSTOMER_LOADING, CUSTOMER_DETAIL, DELETE_USER_ADDRESS, UPDATE_CUSTOMER_PRESCRIPTION, DELETE_CUSTOMER_PRESCRIPTION, ADD_USER_ADDRESS,ADD_CUSTOMER_PRESCRIPTION, LOGOUT, UPDATE_USER_ADDRESS, UPDATE_CUSTOMER } from "../constants";

const INIT_STATE = {
    is_loading: false,
    users: {
        total_rows: 0,
        list: []
    },
    detail: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_LIST:
            return {
                ...state,
                users: action.data,
            };
        case CUSTOMER_LOADING:    
        return {
                ...state,
                is_loading: action.status,
            }; 
        case CUSTOMER_DETAIL:
            return {
                ...state,
                detail: {
                    ...action.data
                }
            }; 
        case ADD_USER_ADDRESS:
            if(state.detail && state.detail.profileSummary){
                state.detail.profileSummary.address = [...state.detail.profileSummary.address, action.data];
            }
            return { ...state }; 
        case UPDATE_USER_ADDRESS:
            const update_index = state.detail && state.detail.profileSummary.address.findIndex(row=>row.id === action.data.id);
            if(update_index > -1 && state.detail) {
                state.detail.profileSummary.address[update_index] = {...state.detail.profileSummary.address[update_index], ...action.data};
            }
            return { ...state };
        case DELETE_USER_ADDRESS:
            const index = state.detail && state.detail.profileSummary && state.detail.profileSummary.address.findIndex(row=>row.id === action.data);
            if(index > -1 && state.detail) {
                state.detail.profileSummary.address.splice(index, 1);
            }
            return { ...state };
        case ADD_CUSTOMER_PRESCRIPTION:
            state.detail.profileSummary.prescriptions = [...state.detail.profileSummary.prescriptions, action.data];
            return{ ...state };    
        case UPDATE_CUSTOMER_PRESCRIPTION:   
            const pres_index = state.detail.profileSummary.prescriptions.findIndex(row=> row.id === action.data.id);
            if(pres_index > -1){
                state.detail.profileSummary.prescriptions[pres_index] = {...state.detail.profileSummary.prescriptions[pres_index], ...action.data};
            }
        // eslint-disable-next-line no-fallthrough
        case DELETE_CUSTOMER_PRESCRIPTION:
            const delete_index = state.detail.profileSummary.prescriptions.findIndex(row=>row.id === action.data);
            if(delete_index > -1) {
                state.detail.profileSummary.prescriptions.splice(delete_index, 1);
            }    
            return { ...state };   
        case UPDATE_CUSTOMER:
            state.detail.profileSummary.user = {...state.detail.profileSummary.user, ...action.data};
            return{ ...state, detail: {...state.detail} };           
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state;
    }
};
    