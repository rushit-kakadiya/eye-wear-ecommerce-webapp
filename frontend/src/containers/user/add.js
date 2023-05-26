import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Add from '../../views/user/add';
import Update from '../../views/user/update';
import {addAdminUser, updateAdminUser, fetchRoles} from '../../redux/user-management/action';
import {fetchStores} from '../../redux/stores/action';

export default (props) => {
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const {user_management, stores} = useSelector(state => state);

    useEffect(() => {
        dispatch(fetchStores({type: props.match.params.id ? '' : 'admin'}));
        dispatch(fetchRoles());
    },[props.match.params.id, dispatch]); 
    // Add user in portal
    const addEmployee = (params) => {
        delete params.confirm_password;
        dispatch(addAdminUser(params))
        .then(() => {
            props.history.push('/admin');
        });
    };

    // Update user in portal
    const updateEmployee = (params) => {
        delete params.confirm_password;
        dispatch(updateAdminUser({...params, id: props.match.params.id}))
        .then(() => {
            props.history.push('/admin');
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
            loading={user_management.is_loading} 
            roles={user_management.roles}
            stores={stores}
        />
        :
        <Update 
            history={props.history} 
            updateEmployee={updateEmployee.bind(null)} 
            user_management={user_management}
            error={error}
            roles={user_management.roles}
            selectedUserId={props.match.params.id}
            stores={stores}
        />
    )
}