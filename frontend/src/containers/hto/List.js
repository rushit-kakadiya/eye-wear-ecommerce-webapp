import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import List from '../../views/hto/List';
import {fetchOrders, selectHtoUser, selectHtoUserAddress, clearHtoDetail} from '../../redux/hto/action';
import {exportOrders} from '../../redux/order/action';


export default (props) => {
    const dispatch = useDispatch();
    const {hto, order, user} = useSelector(state => state);
    const [state, setState] = useState({page:1, search: '', order_status: 'all', start_date: null, end_date: null, date_search:'htoby', sales_channel:''});
    const [showFilter, setShowFilter] = useState(false);
    
    useEffect(()  => {
        dispatch(fetchOrders({is_hto: true, page: state.page, search: state.search, order_status: state.order_status, start_date: state.start_date, end_date: state.end_date, date_search: state.date_search, sales_channel: state.sales_channel}));
    }, [dispatch,state.page, state.order_status]);

    // Handle filter submit
    const handleFilter = (search) => {
        handleState('search', search);
        dispatch(fetchOrders({is_hto: true, page: state.page, search, order_status: state.order_status, start_date: state.start_date, end_date: state.end_date, date_search: state.date_search, sales_channel: state.sales_channel }));
    }

    // Handle event on page change
    const handlePageChange = (page) => {
        setState({...state, page});
    }
    // Handle event on set states
    const handleState = (key,  value) =>  {
        setState({...state, [key]: value, page: 1});
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
        noDataText: hto.is_loading ? "Loading ..." : "There is no data to display!"
    };
    
    // Export Orders in excel
    const exportOrdersData = () => {
        dispatch(exportOrders({is_hto: true, search: state.search, order_status: state.order_status, start_date: state.start_date, end_date: state.end_date, date_search: state.date_search, sales_channel: state.sales_channel }))
        .then(url => window.open(url, 'Download') )
        .catch(error => console.log("error", error) );
    }

    //handle draft type hto
    const draftTypeHto = (row) => {
        dispatch(selectHtoUser({
            "id":row.user_id,
            "name":row.name,
            "email":row.email,
            "mobile":row.mobile
        }));
        dispatch(selectHtoUserAddress({
            "id":row.address_id,
            "user_id":row.user_id,
            "address":row.address,
            "phone_number":row.phone_number,
            "city":row.city,
            "country":row.country,
            "zip_code":row.zip_code
        }));
        props.history.push('hto/add')
    }
    //Clear existing information on create new order
    const clearHtoInformation = () => {
        dispatch(clearHtoDetail());
    }
    //Reset filters
    const resetFilter = () => {
        setState({page:1, search: '', order_status: 'all', start_date: null, end_date: null, date_search:'htoby', sales_channel:''});
        dispatch(fetchOrders({is_hto: true, page:1, search: '', order_status: 'all'}));
    }

    return <List 
                {...props} 
                options={options} 
                order={hto} 
                isHto={true}
                handleFilter={handleState.bind(null)}
                order_status={state.order_status}
                loading={hto.is_loading || order.is_loading}
                exportOrdersData={exportOrdersData.bind(null)}
                handleFilterSubmit={handleFilter.bind(null)}
                start_date={state.start_date}
                end_date={state.end_date}
                draftTypeHto={draftTypeHto.bind(null)}
                clearHtoInformation={clearHtoInformation.bind(null)}
                setShowFilter={setShowFilter.bind(null)}
                showFilter={showFilter}
                resetFilter={resetFilter.bind(null)}
                state={state}
                userData={user.data || {}}
            />;
        
};