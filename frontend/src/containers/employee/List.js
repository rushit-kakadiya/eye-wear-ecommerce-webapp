import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import EmployeeList from '../../views/employee/List';
import {fetchRoles} from '../../redux/user-management/action';
import {fetchEmployees, deleteEmployees} from '../../redux/employee/action';
import {fetchStores} from '../../redux/stores/action';

export default (props) => {
    const [state, setState] = useState({page:1, search: '',  role: '', store_id: ''});
    const dispatch = useDispatch();
    const {user_management, employees, user, stores} = useSelector(state => state);
    
    useEffect(()  => {
        dispatch(fetchEmployees({...state, page: state.page}));
    }, [dispatch, state.page]);

    useEffect(() => {
        dispatch(fetchRoles());
        dispatch(fetchStores());
    }, [dispatch]);

    // Handle event on page change
    const handlePageChange = (page) => {
        setState({...state, page});
    }

    // Handle search submit
    const handleFilterSubmit = () => {
        dispatch(fetchEmployees({...state, page: 1}));
    }

    //Reset filters
    const resetFilter = () => {
        setState({...state, search: '',  role: '', store_id: ''});
        dispatch(fetchEmployees({page: state.page, search: '',  role: '', store_id: ''}));
    }

    //Handle Delete Employee
    const handleDelete = (id) => {
        confirmAlert({
            title: 'Delete Employee!',
            message: 'Are you sure to delete this Employee!',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                            dispatch(deleteEmployees({id}))
                        }
            },
            {
                label: 'No'
            }
            ]
        });
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
        noDataText: employees.is_loading ? "Loading ..." : "There is no data to display!"
    }; 

    return(
        <>
            <EmployeeList
                options={options}
                user={employees}
                history={props.history}
                setState={setState.bind(null)}
                handleFilterSubmit={handleFilterSubmit.bind(null)}
                handleDelete={handleDelete.bind(null)}
                userData={user.data || {}}
                stores={stores}
                loading={employees.is_loading}
                resetFilter={resetFilter.bind(null)}
                roles={user_management.roles}
                state={state}
            />
        </>
    )
}