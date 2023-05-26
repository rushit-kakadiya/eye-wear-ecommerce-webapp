import { GET_CART, ADD_CART, CART_LOADING, DELETE_CART, DELETE_CART_ADDON, FETCH_CART_ADDON, LOGOUT, EMPTY_CART, SET_ITEM_WARRANTY, UPDATE_PRESCRIPTION_DETAIL, LENSES_ONLY_DISCOUNT, GET_CART_CLIPON, UPDATE_CART_PACKAGING } from "../constants";

const INIT_STATE = {
    data: null,
    is_loading: false,
    lensesOnly: null,
    clipons: null,
    contactLens: null,
    othersProduct: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CART:
            return {...state, ...action.data}; 
        case ADD_CART: 
            return {...state, ...action.data}; 
        case CART_LOADING:
            return {
                ...state,
                is_loading: action.status,
            };
        case DELETE_CART:
            return {...state, ...action.data}; 
        case DELETE_CART_ADDON:
            return {...state, ...action.data}; 
        case FETCH_CART_ADDON:
            return {...state, lensesOnly: action.data};
        case EMPTY_CART:
            return INIT_STATE; 
        case SET_ITEM_WARRANTY:
            const _index = state.data ? state.data.list.findIndex(row => row.id === action.data.id) : -1;
            if(_index > -1) {
                state.data.list[_index].is_warranty = action.data.is_warranty;
            }
            return {
                ...state,
                data: {...state.data}
            };   
        case UPDATE_PRESCRIPTION_DETAIL:
            if(action.data.type === 'cart'){
                const cartIndex = state.data ? state.data.list.findIndex(row => row.id === action.data.cart_id) : -1;
                if(cartIndex > -1) {
                    state.data.list[cartIndex].prescription_details = action.data;
                }
                return {
                    ...state,
                    data: {...state.data}
                }; 
            } else {
                const lensesOnlyIndex = state.lensesOnly ? state.lensesOnly.list.findIndex(row => row.id === action.data.cart_id) : -1;
                const contactLensIndex = state.contactLens ? state.contactLens.list.findIndex(row => row.id === action.data.cart_id) : -1;
                if(lensesOnlyIndex > -1) {
                    state.lensesOnly.list[lensesOnlyIndex].prescription_details = action.data;
                } if(contactLensIndex) {
                    state.contactLens.list[contactLensIndex].prescription_details = action.data;
                }
                return {
                    ...state,
                    lensesOnly: {...state.lensesOnly},
                    contactLens: {...state.contactLens}
                }; 
            } 
        case LENSES_ONLY_DISCOUNT:
            return {...state, ...action.data};
        case GET_CART_CLIPON:
            return {...state, clipons: action.data};    
        case UPDATE_CART_PACKAGING:
            if(action.data.type === 'frame')
            {
                const _cartIndex = state.data ? state.data.list.findIndex(row => row.id === action.data.id) : -1;
                if(_cartIndex > -1) {
                    state.data.list[_cartIndex].packages = action.data.packages;
                }
                return {
                    ...state,
                    data: {...state.data}
                };
            } else if(action.data.type === 'addon') 
            {
                const _cartIndex = state.lensesOnly ? state.lensesOnly.list.findIndex(row => row.id === action.data.id) : -1;
                if(_cartIndex > -1) {
                    state.lensesOnly.list[_cartIndex].packages = action.data.packages;
                }
                return {
                    ...state,
                    data: {...state.data}
                };
            } else if(action.data.type === 'contactLens') 
            {
                const _cartIndex = state.contactLens ? state.contactLens.list.findIndex(row => row.id === action.data.id) : -1;
                if(_cartIndex > -1) {
                    state.contactLens.list[_cartIndex].packages = action.data.packages;
                }
                return {
                    ...state,
                    data: {...state.data}
                };
            } else 
            {
                const _cartIndex = state.clipons ? state.clipons.list.findIndex(row => row.id === action.data.id) : -1;
                if(_cartIndex > -1) {
                    state.clipons.list[_cartIndex].packages = action.data.packages;
                }
                return {
                    ...state,
                    data: {...state.data}
                };
            } 
        case LOGOUT:
            return INIT_STATE;
        default:
            state.is_loading = false;
            return state;
    }
};
    