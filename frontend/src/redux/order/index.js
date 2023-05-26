import { 
    FETCH_ORDER_SUCCESS, 
    SELECT_STORE, 
    SELECT_USER, 
    LOGOUT,
    ORDER_LOADING,
    SELECT_USER_ADDRESS,
    SET_DELIVERY_TYPE,
    SELECT_FRAME,
    ORDER_SUCCESS,
    SET_SALES_TYPE,
    ORDER_CANCEL,
    PROCESS_ORDER,
    FETCH_PACKAGING,
    UPDATE_STOCK_STORE,
    PICK_UP_STORE,
    SET_FILTER_STORE_ID,
    SET_HTO_APPIONTMENT_NO,
    UPDATE_ORDER_STATUS,
    APPLIED_DISCOUNT_VOUCHER,
    DISCOUNTED_CART_AMOUNT,    
    UPDATE_DELIVERY_ADDRESS,
    REDEEMED_COFFEE
} from "../constants";

const INIT_STATE = {
    is_loading: false,
    total_rows: 0,
    list: [],
    delivery_type: 'store',
    sales_channel: 'store',
    selected_store: null,
    selected_user: null,
    selected_user_address: null,
    selected_frame: null,
    order_detail: null,
    packages: [],
    pick_up_store_id: null,
    selected_filter_store: null,
    hto_appointment_no: null,
    applied_discount_voucher: null,
    discounted_amount: null

};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case FETCH_ORDER_SUCCESS:
            return {
                ...state,
                ...action.data,
            }; 
        case SELECT_STORE:
            return {
                ...state,
                selected_store: action.data,
            };
        case PICK_UP_STORE:
            return {
                ...state,
                pick_up_store_id: action.data,
            };    
        case SELECT_USER:
            return {
                ...state,
                selected_user: action.data,
            };
        case ORDER_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case SELECT_USER_ADDRESS:
            return {
                ...state,
                selected_user_address: action.data,
            };
        case SET_DELIVERY_TYPE:
            return {
                ...state,
                delivery_type: action.data,
            };
        case SELECT_FRAME:    
            return {
                ...state,
                selected_frame: action.data,
            };
        case ORDER_SUCCESS: 
            return {
                ...INIT_STATE,
                order_detail: action.data,
                packages: state.packages
            };  
        case SET_SALES_TYPE:
            return {
                ...state,
                sales_channel: action.data,
                delivery_type: action.data === 'store' ? 'store' : ''
            }; 
        case ORDER_CANCEL:
            return {
                ...state,
                order_detail: {...state.order_detail, order_status: action.data}
            }; 
        case PROCESS_ORDER: 
            const index = state.list.findIndex(row => row.order_no === action.data.order_no);
            if(index > -1){
                state.list[index].order_status = action.data.order_status;
            }     
            return {...state};  
        case FETCH_PACKAGING:
            return {
                ...state,
                packages: action.data
            };    
        case UPDATE_STOCK_STORE:
            state.order_detail.stock_store_id = action.data;
            return {
                ...state
            }
        case SET_FILTER_STORE_ID:
            return {
                ...state,
                selected_filter_store: action.data,
            };
        case SET_HTO_APPIONTMENT_NO:
            return {
                ...state,
                hto_appointment_no:action.data
            };
        case UPDATE_ORDER_STATUS:
            state.order_detail.order_status=action.data.order_status;
            return {
                ...state               
            };
        case APPLIED_DISCOUNT_VOUCHER:
            return{
                ...state,              
                applied_discount_voucher:action.data
            };
        case DISCOUNTED_CART_AMOUNT:
            return {
                ...state,              
                discounted_amount:action.data
            };
        case UPDATE_DELIVERY_ADDRESS:
            return {
                ...state,
                order_detail: { ...state.order_detail, ...action.data }
            };
        case REDEEMED_COFFEE:
            return {
                ...state,
                order_detail: { ...state.order_detail, redeemedCoffee: action.data }
            }; 
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state
    }
};
    