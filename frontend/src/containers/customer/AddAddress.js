import React from 'react';
import { useSelector, useDispatch} from 'react-redux';
import AddAddress from '../../views/customer/AddAddress';
import {addUserAddress} from  '../../redux/user/action';

export default (props) => {
    const dispatch = useDispatch();
    const {user, order} = useSelector(state => state);

    const addAddress = (params) =>
    {
        dispatch(addUserAddress({user_id: order.selected_user.id, email: order.selected_user.email,...params})).then(() => {
            props.history.push('/customer');
        });
    }  

    return(
        <AddAddress history={props.history}  loading={user.is_loading} addAddress={addAddress.bind(null)}/>
    )
}