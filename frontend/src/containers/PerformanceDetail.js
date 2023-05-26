import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import PerformanceDetail from '../views/performance-detail/detail';


import { fetchAppointmentList, fetchOrdersList, fetchSummary, fetchGraphicalAppointmentData, fetchGraphicalOrdersData } from '../redux/performance-detail/action';


export default (props) =>{

    const dispatch = useDispatch();

    const userId = props.match.params ? props.match.params.id : ''; 
    const member = props.match.params ? props.match.params.member : ''; 




    const { performance_detail } = useSelector(state => state);
    const [type, setType] = useState("summary");
    const [graphType, setGraphType] = useState( member == "optician" ? "bookings" : "staffsales");



    const [state, setState] = useState({page:1, start_date: null, end_date: null });
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);


    useEffect(() => {

        let params = {
            member:member,
            type : type,
            start_date: state.start_date, 
            end_date: state.end_date,
            page :state.page,
            userId: userId
        }

        if(type == "summary"){
            dispatch(fetchSummary(params));       
        }else if(type == "appointments"){
            dispatch(fetchAppointmentList(params));  
        }else if(type == "optician_hto_sales" || type == "optician_store_sales" || type == "staff_store_sales"){
            dispatch(fetchOrdersList(params));  
        }
        

    },[type, state.page]);



    useEffect(() => {
        let params = {
            member:member,
            type : graphType,
            start_date: state.start_date, 
            end_date: state.end_date,
            userId: userId
        }     

        if(type == "summary"){
            if(graphType == "bookings"){
                dispatch(fetchGraphicalAppointmentData(params));  
            }else {
                dispatch(fetchGraphicalOrdersData(params));  
            }
        }

    },[graphType,type]);


    const handleFilter = () => {
        let params = {
            member:member,
            type : type,
            start_date: state.start_date, 
            end_date: state.end_date,
            page :state.page,
            userId: userId
        }
        
        if(type == "summary"){
            dispatch(fetchSummary(params));       
            params = {...params, type  : graphType}
            if(graphType == "bookings"){
                dispatch(fetchGraphicalAppointmentData(params));  
            }else {
                dispatch(fetchGraphicalOrdersData(params));  
            }
        }else if(type == "appointments"){
            dispatch(fetchAppointmentList(params));  
        }else if(type == "optician_hto_sales" || type == "optician_store_sales" || type == "staff_store_sales"){
            dispatch(fetchOrdersList(params));  
        }
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
        member,
        graphType,
        page: state.page,
        onPageChange: handlePageChange,
        hideSizePerPage: true,
        paginationSize: 10,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        alwaysShowAllBtns: false,
        withFirstAndLast: true,
        sizePerPage: 10,
        noDataText: performance_detail.is_loading ? "Loading ..." : "There is no data to display!",
    };

    const changePerformance = (type) => {
        setType(type)
    }


    const changeGraphPerformance = (graphType) => {
        setGraphType(graphType)
    }

    const resetFilter = () => {
        setState({page:1,  start_date: null, end_date: null });

        let params = {
            member:member,
            type : type,
            page :state.page,
            userId: userId
        }
        
        if(type == "summary"){
            dispatch(fetchSummary(params));
            params = {...params, type  : graphType}
            if(graphType == "bookings"){
                dispatch(fetchGraphicalAppointmentData(params));  
            }else {
                dispatch(fetchGraphicalOrdersData(params));  
            }       
        }else if(type == "appointments"){
            dispatch(fetchAppointmentList(params));  
        }else if(type == "optician_hto_sales" || type == "optician_store_sales" || type == "staff_store_sales"){
            dispatch(fetchOrdersList(params));  
        }
    }

    return(
        <PerformanceDetail 
            {...props} 
            options={options} 
            resetFilter={resetFilter.bind(null)}
            performanceDetail={performance_detail} 
            changePerformance={changePerformance} 
            changeGraphPerformance={changeGraphPerformance}
            handleFilter={handleState.bind(null)}
            setShowFilter={setShowFilter.bind(null)}
            handleFilterSubmit={handleFilter.bind(null)}
            showFilter={showFilter}
            state={state}
            start_date={state.start_date}
            end_date={state.end_date}
            loading={loading || performance_detail.is_loading}
        />
    )
}