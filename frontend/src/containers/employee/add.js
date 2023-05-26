import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Add from '../../views/employee/add';
import Update from '../../views/employee/update';
import {fetchRoles} from '../../redux/user-management/action';
import {addEmployees, updateEmployees} from '../../redux/employee/action';
import {fetchStores} from '../../redux/stores/action';

export default (props) => {
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const {user_management, stores, employees} = useSelector(state => state);

    useEffect(() => {
        if(!props.match.params.id) {
            dispatch(fetchStores());
            dispatch(fetchRoles());
        }
    },[props.match.params.id, dispatch]);

    // Add user in portal
    const addEmployee = (params) => {
        dispatch(addEmployees(params))
        .then(() => {
            props.history.push('/employee');
        });
    };

    // Update user in portal
    const updateEmployee = (params) => {
        dispatch(updateEmployees({...params, id: props.match.params.id}))
        .then(() => {
            props.history.push('/employee');
        })
        .catch((err) => {
            setError(err);
        });
    };
    return(
        !props.match.params.id ? 
        <Add 
            history={props.history} 
            addEmployee={addEmployee.bind(null)} 
            loading={employees.is_loading} 
            roles={user_management.roles}
            stores={stores}
        />
        :
        <Update 
            history={props.history} 
            updateEmployee={updateEmployee.bind(null)} 
            employees={employees}
            error={error}
            roles={user_management.roles}
            stores={stores}
            selectedEmpId={props.match.params.id}
        />
    )
}