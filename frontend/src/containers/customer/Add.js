import React, {useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Add from '../../views/customer/Add';
import {addUser} from '../../redux/order/action';

export default (props) => {
const dispatch = useDispatch();
const [mobile, setMobileNo] = useState('');
const [country_code, setCountryCode] = useState('62');
const {user} = useSelector(state => state);

// Add user in order
const addCustomer = (params) => {
    dispatch(addUser({...params, country_code , mobile:params.mobile.slice(country_code.length)}))
    .then(() => {
        props.history.push('/customer/add-address');
    });
    };

    return(
        <Add 
        history={props.history} 
        addCustomer={addCustomer.bind(null)} 
        loading={user.is_loading} 
        mobile={mobile}
        setMobileNo={setMobileNo.bind(null)}
        setCountryCode={setCountryCode.bind(null)}
        country_code={country_code}
        />
    )
}