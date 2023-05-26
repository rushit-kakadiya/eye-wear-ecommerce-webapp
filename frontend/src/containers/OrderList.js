import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import OrderList from '../views/order/List';
import {fetchOrders, selectStore, addUserInOrder, setDeliveryType, setSalesChanenelType, processOrder, orderSuccess, fetchPackaging, exportOrders, setFilterStoreId} from '../redux/order/action';
import {fetchStores} from '../redux/stores/action';
import {getOpticianList, getInputPersonList} from  '../redux/hto/action';

export default (props) => {
    const dispatch = useDispatch();
    const {order, stores, user, hto} = useSelector(state => state);
    const [state, setState] = useState({page:1, order_status: props.location.state ? props.location.state.order_status : 'all', payment_status: '', start_date: null, end_date: null, sales_channel:'', delivery_type:'', sales_person:'', optician:'', date_search:'', payment_method:undefined });
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    useEffect(()  => {
        if(order.selected_filter_store){
            setShowFilter(true)
        }
        dispatch(fetchOrders({page: state.page, search: state.search, order_status: state.order_status, start_date: state.start_date, end_date: state.end_date, sales_channel: state.sales_channel, sales_person: state.sales_person, optician: state.optician, date_search: state.date_search, store_id: order.selected_filter_store ? order.selected_filter_store.id : undefined, payment_method:state.payment_method || undefined }));
    }, [dispatch,state.page, user, state.order_status, order.selected_filter_store]);

    useEffect(() => {
        // dispatch(getOpticianList());
        dispatch(getInputPersonList()); 
        dispatch(fetchStores());
        dispatch(fetchPackaging());
        return () => dispatch(setFilterStoreId(null));       
    },[dispatch]);
    
    // Handle filter submit
    const handleFilter = (search) => {
        handleState('search', search);
        dispatch(fetchOrders({page: state.page, search, order_status: state.order_status, start_date: state.start_date, end_date: state.end_date , sales_channel: state.sales_channel, sales_person: state.sales_person, optician: state.optician, date_search: state.date_search, store_id: order.selected_filter_store ? order.selected_filter_store.id : undefined, payment_method:state.payment_method, payment_status: state.payment_status}));
    }

    // Clear userInfo
    const clearUserInfo = () => {
        dispatch(addUserInOrder(null));
    }

    // Handle event on page change
    const handlePageChange = (page) => {
        setState({...state, page});
    }
    // Handle event on set states
    const handleState = (key,  value) =>  {
        setState({...state, [key]: value, page: 1});
    }
    // process to create new order
    const hadnleStoreSelection  = (data) => {
        dispatch(selectStore(data));
    }
    //select store to filter list 
    const hadnleFilterStore  = (data) => {
        dispatch(setFilterStoreId({id:data}));
    }
    // Select order type
    const selectOrderType = (type) => {
        dispatch(setSalesChanenelType(type));
    }
    // Get info from draft order
    const draftOrder = (data) => {
        if(data.store_id){
            const store = stores.find(row => row.id.toString() === data.store_id.toString());
            dispatch(selectStore({value: store.id, label: store.name}));
        }
        dispatch(setDeliveryType(data.address_id ? 'delivery' : 'store'));
        dispatch(addUserInOrder({
            id: data.user_id,
            name: data.name,
            email: data.email,
            mobile: data.mobile
        }));
        props.history.push('/order/add');
    }
    //Process/compete order
    const orderProcess = (order_no, order_status) => {
        setLoading(true);
        dispatch(processOrder({order_no, order_status}))
        .then(()=> setLoading(false) )
        .catch(() => setLoading(false));
    }
    // Pagination options
    const options = {
        sortIndicator: true,
        page: state.page,
        onPageChange: handlePageChange,
        hideSizePerPage: true,
        paginationSize: 10,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        alwaysShowAllBtns: false,
        withFirstAndLast: true,
        sizePerPage: 10,
        noDataText: order.is_loading ? "Loading ..." : "There is no data to display!"
    };

    //Select Payment methods
    const selectPaymentMethod =  (data) => {
        dispatch(orderSuccess(data));
        props.history.push('/order/success');
    };

    // Export Orders in excel
    const exportOrdersData = () => {
        dispatch(exportOrders({search: state.search, order_status: state.order_status, start_date: state.start_date, end_date: state.end_date, sales_channel: state.sales_channel, sales_person: state.sales_person, optician: state.optician, date_search: state.date_search, payment_method:state.payment_method, store_id: order.selected_filter_store ? order.selected_filter_store.id : undefined, payment_status: state.payment_status}))
         .then(url => window.open(url, 'Download') )
        .catch(error => console.log("error", error) );
    }
    //Reset filters
    const resetFilter = () => {
        setState({page:1, order_status: 'all', search: '', start_date: null, end_date: null, sales_channel:'', delivery_type:'', sales_person:'', optician:'', date_search:'', store_id:'', payment_method: undefined, payment_status: ''});
        dispatch(fetchOrders({page:1, order_status: 'all', search: '', store_id:''}));
        dispatch(setFilterStoreId(null));
    }
    
    return <OrderList 
                {...props} 
                options={options} 
                order={order} 
                stores={stores}
                storeId={user.data.store_id || ''}
                time_zone={user.data.time_zone}
                hadnleStoreSelection={hadnleStoreSelection.bind(null)} 
                handleFilter={handleState.bind(null)}
                selectOrderType={selectOrderType.bind(null)}
                order_status={state.order_status}
                draftOrder={draftOrder.bind(null)}
                clearUserInfo={clearUserInfo.bind(null)}
                orderProcess={orderProcess.bind(null)}
                loading={loading || order.is_loading}
                selectPaymentMethod={selectPaymentMethod.bind(null)}
                exportOrdersData={exportOrdersData.bind(null)}
                start_date={state.start_date}
                end_date={state.end_date}
                handleFilterSubmit={handleFilter.bind(null)}
                setShowFilter={setShowFilter.bind(null)}
                showFilter={showFilter}
                state={state}
                resetFilter={resetFilter.bind(null)}
                opticianList={hto.optician_list}
                inputPersonList={hto.input_person_list}
                hadnleFilterStore={hadnleFilterStore.bind(null)}
                userData={user.data}
            />;
        
};