import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '../../views/store/List';
import { fetchStoreList } from '../../redux/admin-store/action';

export default (props) => {
    const [state, setState] = useState({ page:1, search: '' });
    const dispatch = useDispatch();
    const { store, user } = useSelector(state => state);

    useEffect(()  => {
        dispatch(fetchStoreList({ page: state.page, search: state.search }));
    }, [dispatch,state.page, state.search]);

    
    // Handle filter submit
    const handleFilter = (search) => {
        handleState('search', search);
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
        noDataText: store.is_loading ? "Loading ..." : "There is no data to display!"
    };

    return <List
                {...props} 
                options={options} 
                store={store.stores}
                handleFilter={handleState.bind(null)}
                loading={store.is_loading}
                state={state}
                handleFilterSubmit={handleFilter.bind(null)}
                userData={user.data || {}}
           />
}