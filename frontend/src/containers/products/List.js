import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import List from '../../views/products/List';
import { fetchAllProductsList, uploadLenses, fetchFrameSkuGallery, showFrameOnApp } from '../../redux/products/action';


export default (props) => {
    const dispatch = useDispatch();
    const {user, products} = useSelector(state => state);
    const [state, setState] = useState({page:1, type: '', search: ''});
    const [showFilter, setShowFilter] = useState(false);

    useEffect(()  => {
        if(props.location.state){
            setState({...state, type: props.location.state ? props.location.state.detail : state.type});
        } else {
            setState({...state, type: 'frame'});
        }
    }, [dispatch]);

    useEffect(()  => {
        dispatch(fetchAllProductsList({page: state.page, search: state.search, type: !state.type && props.location.state ? props.location.state.detail : (state.type || 'frame')}));
    }, [dispatch, state.page, state.type]);

    // Handle filter submit
    const handleFilter = (search) => {
        handleState('search', search);
        dispatch(fetchAllProductsList({page: state.page, search, type: state.type }));
    }

    // Handle event on page change
    const handlePageChange = (page) => {
        setState({...state, page});
    }
    // Handle event on set states
    const handleState = (key,  value) =>  {
        setState({...state, [key]: value, page: 1});
    }

    // Export Orders in excel
    const exportData = () => {
        // dispatch(exportOrders({search: state.search, type: state.type, start_date: state.start_date, end_date: state.end_date, sales_channel: state.sales_channel, sales_person: state.sales_person, optician: state.optician, date_search: state.date_search, payment_method:state.payment_method, store_id: order.selected_filter_store ? order.selected_filter_store.id : undefined}))
        //  .then(url => window.open(url, 'Download') )
        // .catch(error => console.log("error", error) );
    }
    //Reset filters
    const resetFilter = () => {
        setState({page:1, type: 'frame', search: ''});
        dispatch(fetchAllProductsList({page:1, type: 'frame', search: ''}));
    }

    //Upload excel to add luns in bulk
    const uploadExcelFile = (data) => {
        dispatch(uploadLenses(data.files[0]))
        .then(() => dispatch(fetchAllProductsList({page: 1, search: '', type: state.type })));
    }

    const getFrameGallery = (sku) => {
        dispatch(fetchFrameSkuGallery({sku}));
    }
    
    const showFramesOnApp = (data, cb) => {
        dispatch(showFrameOnApp(data))
        .then(() => cb(true))
        .catch(() => cb(false));

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
                options={options} 
                products={products} 
                time_zone={user.data.time_zone}
                handleFilter={handleState.bind(null)}
                loading={products.is_loading}
                exportData={exportData.bind(null)}
                uploadExcelFile={uploadExcelFile.bind(null)}
                handleFilterSubmit={handleFilter.bind(null)}
                setShowFilter={setShowFilter.bind(null)}
                showFilter={showFilter}
                state={state}
                resetFilter={resetFilter.bind(null)}
                userData={user.data}
                getFrameGallery={getFrameGallery.bind(null)}
                showFramesOnApp={showFramesOnApp.bind(null)}
            />;
        
};