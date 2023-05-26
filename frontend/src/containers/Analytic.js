import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import EmployeeAnalystic from '../views/analytic/EmployeeAnalystic';


import { fetchAnalyticsList } from '../redux/analytics/action';


export default (props) =>{

    const dispatch = useDispatch();

    const { analytics } = useSelector(state => state);

    const [type, setType] = useState("staff");
    const [state, setState] = useState({page:1, search: '', start_date: null, end_date: null });
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        let params = {
            type : type,
            start_date: state.start_date, 
            end_date: state.end_date,
            page :state.page,
            search: state.search
        }
        dispatch(fetchAnalyticsList(params));       
    },[type, state.page, state.search]);


    const handleFilter = (search) => {
        handleState('search', search);
        let params = {
            type : type,
            start_date: state.start_date, 
            end_date: state.end_date,
            page :state.page,
            search: state.search
        }
        dispatch(fetchAnalyticsList(params));    
    }   


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
        type,
        page: state.page,
        onPageChange: handlePageChange,
        hideSizePerPage: true,
        paginationSize: 10,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        alwaysShowAllBtns: false,
        withFirstAndLast: true,
        sizePerPage: 10,
        noDataText: analytics.is_loading ? "Loading ..." : "There is no data to display!",
    };

    const changeAnalytics = (type) => {
        setState({page:1, start_date: null, end_date: null });
        setType(type)
    }

    const resetFilter = () => {
        setState({page:1,  start_date: null, end_date: null, search: ''});
        let params = {
            type : type,
            page : 1,
            search: ''
        }
        dispatch(fetchAnalyticsList(params));    
    }


    return(
        <EmployeeAnalystic 
            {...props} 
            options={options} 
            resetFilter={resetFilter.bind(null)}
            analytics={analytics} 
            changeAnalytics={changeAnalytics} 
            handleFilter={handleState.bind(null)}
            setShowFilter={setShowFilter.bind(null)}
            handleFilterSubmit={handleFilter.bind(null)}
            showFilter={showFilter}
            state={state}
            start_date={state.start_date}
            end_date={state.end_date}
            loading={loading || analytics.is_loading}
        />
    )
}