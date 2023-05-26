import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Modal, ModalHeader } from 'reactstrap';
import {fetchUser, addUserAddress, updateUserAddress, fetchUserAddress} from  '../../redux/user/action';
import {selectHtoUser, selectHtoUserAddress, getHtoTimeSlote, bookAppiontment, addUser } from  '../../redux/hto/action';
import AddHto from '../../views/hto/Add';
import AddUser from '../../views/modal/AddUser';
import AddAddress from '../../views/modal/AddAddress';
import AddressList from '../../views/modal/AddressList';
import {toastAction} from '../../redux/ToastActions';

export default (props) =>{
    const [modal, setModal] =  useState({});
    const [appointment_date, setAppointmentDate] = useState();
    const [appointment_time, setAppointmentTime] = useState();
    const [sales_channel, setSalesChannel] = useState();
    const [coffee_type, setCoffeeType] = useState('No Thanks');
    const [editedAddressValue, setEditedValue] = useState({});

    const dispatch = useDispatch();
    const {user, hto} = useSelector(state => state);

    useEffect(() => {
        if(hto.selected_user){
            dispatch(getHtoTimeSlote());
            dispatch(fetchUserAddress({user_id: hto.selected_user.id}));
        }
    },[dispatch, hto.selected_user]);

    // Togle modal states
    const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };

    // Search users
    const searchUser = text => {
    dispatch(fetchUser({text}));
    };

    // Get user address
    const getSelectedAddress = address => {
        dispatch(selectHtoUserAddress(address));
    }

    //Handle date change
    const handleDateChange = (event) =>{
        setAppointmentTime();
        setAppointmentDate(event.value);
    }

    // Add Hto user
    const addUserInOrder = (params) => {
        dispatch(addUser(params))
        .then(() => {
            dispatch(selectHtoUserAddress(null));
            toggle('addUser');
        });
    };

    
    // Add address of selected user in order
    const addSelectedUserAddress = (params) => {
         if(params.id){
            dispatch(updateUserAddress({email: hto.selected_user.email, address_details: params.address, ...params}))
            .then(() => toggle('addAddress'));
        } else {
            delete params.id;
            dispatch(addUserAddress({user_id: hto.selected_user.id, email: hto.selected_user.email, address_details: params.address, ...params}))
            .then(() => toggle('addAddress'));
        }
    }

    //Book Appointment 
    const handleSubmit = (status = 1) =>{
        const params = {
           "address_id" :  hto.selected_user_address && hto.selected_user_address.id,
           "timeslot_id" : appointment_time,
           "notes" : coffee_type,
           "user_id" : hto.selected_user && hto.selected_user.id,
           appointment_date,
           status, 
           sales_channel
        }
        if(status === 2)
        { 
            if(hto.selected_user && !appointment_date && !appointment_time){
            toastAction(false, 'Ada yang salah. Silakan coba lagi');
            return false;
            } else {
                props.history.goBack();
            }
        }
        if(hto.selected_user){
        dispatch(bookAppiontment(params)).then(res=>{
            if(res && status === 1){
               dispatch(selectHtoUserAddress(null));
               dispatch(selectHtoUser(null));
               props.history.push(`/hto/detail/${res}`)
            } else{
                dispatch(selectHtoUserAddress(null));
                dispatch(selectHtoUser(null));
                props.history.push('/hto');
            }
           });
        }
    }

    return (
        <>
        <AddHto
         {...props}
         hto={hto}
         toggle={toggle.bind(null)}
         setCoffeeType={setCoffeeType.bind(null)}
         handleDateChange={handleDateChange.bind(null)}
         setAppointmentTime={setAppointmentTime.bind(null)}
         appointment_time={appointment_time}
         handleSubmit={handleSubmit.bind(null)}
         appointment_date={appointment_date}
         user={user}
         setSalesChannel={setSalesChannel.bind(null)}
        />
         <Modal
        isOpen={modal.addUser}
        toggle={() => toggle('addUser')}
        size="md"
        >
        <ModalHeader toggle={() => toggle('addUser')}>Add Customer</ModalHeader>
        <AddUser userList={user.list} toggle={() => toggle('addUser')} addUserInOrder={addUserInOrder.bind(null)} searchUser={searchUser.bind(null)} loading={hto.is_loading}/>
        </Modal>
        <Modal
            isOpen={modal.addAddress}
            toggle={() => toggle('addAddress')}
            size="md"
        >
        <ModalHeader toggle={() => toggle('addAddress')}>{editedAddressValue && editedAddressValue.id ? 'Edit Address' : 'Add Address' }</ModalHeader>
        <AddAddress toggle={() => toggle('addAddress')} addUserAddress={addSelectedUserAddress.bind(null)} loading={hto.is_loading} editedAddressValue={editedAddressValue}/>
        </Modal>
        <Modal
            isOpen={modal.addressList}
            toggle={() => toggle('addressList')}
            size="md"
        >
            <ModalHeader toggle={() => toggle('addressList')}>User Address</ModalHeader>
            <AddressList toggle={toggle} list={user.users_address} selectedAddress={hto.selected_user_address} getSelectedAddress={getSelectedAddress.bind(null)}  setEditedValue={setEditedValue}/>
        </Modal>
        </>
    )
}