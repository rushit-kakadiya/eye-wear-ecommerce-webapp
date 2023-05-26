import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '../../../../views/products/frame/color/List';
import { fetchFrameColors } from '../../../../redux/products/action';

export default (props) => {
    const [state, setState] = useState({ page:1, search: '' });

    const dispatch = useDispatch();
    const { products } = useSelector(state => state);

    useEffect(()  => {
        if( props.type ==  "appointments"){
             dispatch(fetchFrameColors({ page: state.page, search: state.search }));
        }
    }, [dispatch,state.page, state.search, props.type]);

    
    // Handle filter submit
    const handleFilter = (search) => {
        handleState('search', search);
        dispatch(fetchFrameColors({page: state.page, search: state.search}));
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
        noDataText: products.is_loading ? "Loading ..." : "There is no data to display!"
    };

    return <List
                {...props} 
                history={props.history}
                options={options} 
                products={products}
                handleFilter={handleState.bind(null)}
                loading={products.is_loading}
                state={state}
                handleFilterSubmit={handleFilter.bind(null)}
           />
}