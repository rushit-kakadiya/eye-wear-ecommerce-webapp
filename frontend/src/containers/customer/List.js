import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '../../views/customer/List';
import {fetchUserList, exportCustomers} from '../../redux/customer/action';

export default (props) => {
    const [state, setState] = useState({page:1, search: '',  channel:'', created_at: null, dob: null});
    const [showFilter, setShowFilter] = useState(false);
    const dispatch = useDispatch();
    const {customer, user} = useSelector(state => state);

    useEffect(()  => {
        dispatch(fetchUserList({page: state.page, search: state.search, channel: state.channel, created_at: state.created_at, dob: state.dob}));
    }, [dispatch,state.page, state.search]);

    // Handle filter submit
    const handleFilter = (search) => {
        handleState('search', search);
        dispatch(fetchUserList({page: state.page, search: state.search, channel:state.channel, created_at:state.created_at, dob:state.dob}));
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
        noDataText: customer.is_loading ? "Loading ..." : "There is no data to display!"
    };

    // Export Customers in excel
    const exportCustomersData = () => {
        dispatch(exportCustomers({search: state.search, sales_channel: state.channel, start_date: state.created_at, dob: state.dob }))
        .then(url => window.open(url, 'Download'))
        .catch(error => console.log("error", error));
    }

    //Reset filters
    const resetFilter = () => {
    setState({page:1, search: '',channel:'', created_at:null, brithday:null });
    dispatch(fetchUserList({page: 1, search:"", channel:"", created_at:null, dob:null}));

    }
    return <List
                {...props} 
                options={options} 
                users={customer.users}
                handleFilter={handleState.bind(null)}
                exportCustomersData={exportCustomersData.bind(null)}
                loading={customer.is_loading}
                showFilter={showFilter}
                setShowFilter={setShowFilter.bind(null)}
                resetFilter={resetFilter.bind(null)}
                state={state}
                handleFilterSubmit={handleFilter.bind(null)}
                userData={user.data || {}}
           />
}