import React, {useEffect, useState} from 'react';
import { Row, Col, Card, CardBody, Button, FormGroup, Modal, ModalHeader,  Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import { useSelector, useDispatch} from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import BackButton from '../../views/buttons/BackButton';
import Detail from '../../views/customer/Detail';
import StoreListModal from '../../views/modal/StoreList';
import AddressList from '../../views/modal/AddressList';
import AddAddress from '../../views/modal/AddAddress';
import PrescriptionList from '../../views/modal/PrescriptionList';
import AddPrescription from '../../views/modal/AddPrescription';
import AddUser from '../../views/modal/AddUser';
import {selectStore, setSalesChanenelType, addUser} from '../../redux/order/action';
import {addUserAddress, updateUserAddress, fetchUser} from  '../../redux/user/action';
import {updatePrescription, addPrescription} from '../../redux/prescription/action';
import {selectHtoUser} from '../../redux/hto/action';
import {fetchCustomerDetail, deleteUserAddress, updateCustomerPrescription, deletePrescriptions, addCustomerPrescription, addCustomerAddress, updateCustomerAddress, updateCustomer} from '../../redux/customer/action';
import {titleCase, replaceGlobal} from '../../utilities/methods'; 
import Timeline from '../../views/order/detail/Timeline';

export default (props) => {
    const [modal, setModal] =  useState({});
    const [type, setType] =  useState('summary');
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [editedAddressValue, setEditedValue] = useState({});
    const [selectedPrescription, setSelectPrescription] = useState({});
    const dispatch = useDispatch();
    const {stores, customer, order, user} = useSelector(state => state);
    const id = props.match.params.id;
    const options = {
        sortIndicator: true,
        // page: state.page,
        // onPageChange: handlePageChange,
        hideSizePerPage: true,
        // paginationSize: 10,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        alwaysShowAllBtns: false,
        withFirstAndLast: true,
        sizePerPage: 20,
        noDataText: customer.is_loading ? "Loading ..." : "There is no data to display!"
    };

    useEffect(() => {
        dispatch(fetchCustomerDetail({id, type}));
    }, [dispatch, type, id]);

    // Togle modal states
    const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };

    // process to create new order
    const hadnleStoreSelection  = (data) => {
        dispatch(selectStore(data));
    }

    // Select order type
    const selectOrderType = (type) => {
        dispatch(setSalesChanenelType(type));
    }

      // Add address of selected user in order
      const addSelectedUserAddress = (params) => {
        if(params.id){
            dispatch(updateUserAddress({user_id: order.selected_user.id, email: order.selected_user.email, address_details: params.address, ...params}))
            .then(() =>{ 
                dispatch(updateCustomerAddress(params));
                setModal({});
            });
        } else {
            delete params.id;
            dispatch(addUserAddress({user_id: order.selected_user.id, email: order.selected_user.email, address_details: params.address, ...params}))
            .then((res) => { 
                dispatch(addCustomerAddress(res)); 
                setModal({});
                });
        }
        
    };

    // Create user prescription
    const createPrescription = (params) => {
        if(selectedPrescription && selectedPrescription.id) {
            dispatch(updatePrescription({...params, id: selectedPrescription.id, user_id: order.selected_user.id})).then(() => {
                dispatch(updateCustomerPrescription({...params, id: selectedPrescription.id}));
                toggle('prescription'); 
            });
        } else {
            dispatch(addPrescription({...params, user_id: order.selected_user.id})).then((res) => {
                dispatch(addCustomerPrescription(res));
                setModal({});
            });
        }
    }

    //handle delete
    const handleDelete = (data, isAddress = false) => {
        confirmAlert({
            title: isAddress ? 'Delete Address' : 'Delete Prescription',
            message: isAddress ? 'Are you sure to delete this Address!' : 'Are you sure to delete this Prescription!',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    if(isAddress){
                        dispatch(deleteUserAddress(data.id));
                    } else {
                        dispatch(deletePrescriptions(data.id));
                    }
                }
            },
            {
                label: 'No'
            }
            ]
        });
    };

    // update customer
    const addUserInOrder = (params) => {
        dispatch(addUser({...params, id}))
        .then(() => {
            dispatch(updateCustomer({...params, id}));
            toggle('addUser');
        });
    }

    // Search users
    // const searchUser = text => {
    //     dispatch(fetchUser({text}));
    // };
    

    
    if(customer.is_loading && !customer.detail) return(<div style={{textAlign: 'center'}} className="mt-5"><h5>loading ...</h5></div>)
    if(!customer.detail) return(<div style={{textAlign: 'center'}} className="mt-5"><h3>Customer Not Found!</h3></div>)
    return(
        <Card>
            <CardBody>
                <Row>
                    <Col>
                        <h3><BackButton path="/customer" history={props.history}/> {customer.detail && customer.detail.profileSummary.user? titleCase(customer.detail.profileSummary.user.name || '') : '---'} {customer.detail.profileSummary.user ? ` - ( ${titleCase(replaceGlobal(customer.detail.profileSummary.user.channel))} )` : ''}</h3>
                    </Col>
                    <Col md="3" className="text-right ml-0">
                        <FormGroup>
                            <Button type="button" color="primary  mt-2"  onClick={()  =>  {
                            dispatch(selectHtoUser(order.selected_user));
                                props.history.push('/hto/add');
                            }
                            }>Add HTO Appointment</Button>
                        </FormGroup>
                    </Col>
                    <Col  sm="2">
                        <Button style={{width: '100%'}} color="primary mt-2" type="button" id={`Popover-1`} onClick={()  => setPopoverOpen(!popoverOpen)}>
                            + Add New Order
                        </Button>
                        <Popover placement="bottom" isOpen={popoverOpen} target="Popover-1">
                              <PopoverHeader>Select Order Channel</PopoverHeader>
                              <PopoverBody style={{width:"230px"}}>
                                <FormGroup>
                                  <Button color="primary" type="button" style={{width:'45%'}}  onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    toggle('store');
                                    selectOrderType('store');
                                  }}>In Store</Button>
                                  <Button color="primary" className="ml-1" type="button"  style={{width:'53%'}} onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('whatsapp');
                                    props.history.push('/order/add')
                                  }}>
                                  Whatsapp
                                </Button>
                                <Button color="primary" className="mt-1" type="button"  style={{width:'45%'}} onClick={() => {
                                        setPopoverOpen(!popoverOpen);
                                        hadnleStoreSelection(null);
                                        selectOrderType('hto');
                                        props.history.push('/order/add')
                                    }}>HTO
                                  </Button>
                                  <Button color="primary" className="mt-1 ml-1" type="button" style={{width:'53%'}} onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('website');
                                    props.history.push('/order/add')
                                  }}>
                                  Website
                                </Button>
                                </FormGroup>
                              </PopoverBody>
                          </Popover>
                    </Col>
                </Row>
                <Row>
                    <Col className="ml-4" sm="3">
                        <h4>{customer.detail && customer.detail.profileSummary.user ? customer.detail.profileSummary.user.mobile.charAt(0) === '0' ? customer.detail.profileSummary.user.mobile : '0'+customer.detail.profileSummary.user.mobile : '---'}  <i className="fab fa-whatsapp text-success ml-2" ></i></h4>
                    </Col>
                </Row>
                    <Detail 
                        {...props}
                        type={type}
                        setType={setType.bind(null)}
                        detail={customer.detail}
                        order={order}
                        toggle={toggle.bind(null)}
                        options={options}
                        setSelectPrescription={setSelectPrescription.bind(null)}
                        handleDelete={handleDelete.bind(null)}
                        is_loading={customer.is_loading}
                        setEditedValue={setEditedValue.bind(null)}
                        userData={user.data || {}}
                    />
                    <Modal
                        isOpen={modal.store}
                        toggle={() => toggle('store')}
                        className={null}
                        size="md"
                    >
                    <ModalHeader toggle={() => toggle('store')}>Select Store</ModalHeader>
                        <StoreListModal history={props.history} stores={stores} hadnleStoreSelection={hadnleStoreSelection.bind(null)} toggle={toggle.bind(null)} />
                    </Modal>

                    <Modal
                        isOpen={modal.addressList}
                        toggle={() => toggle('addressList')}
                        size="md"
                    >
                        <ModalHeader toggle={() => toggle('addressList')}>User Address</ModalHeader>
                        <AddressList 
                        toggle={toggle} 
                        list={customer.detail.profileSummary.address && customer.detail.profileSummary.address.length && customer.detail.profileSummary.address.slice(1)} 
                        selectedAddress={order.selected_user_address} 
                        isPreview={true}
                        setEditedValue={setEditedValue}
                        handleDelete={handleDelete.bind(null)}
                        />
                    </Modal>

                    <Modal
                    isOpen={modal.addAddress}
                    toggle={() => toggle('addAddress')}
                    size="md"
                    >
                        <ModalHeader toggle={() => toggle('addAddress')}>{editedAddressValue && editedAddressValue.id ? 'Edit Address' : 'Add Address' }</ModalHeader>
                        <AddAddress toggle={() => toggle('addAddress')} addUserAddress={addSelectedUserAddress.bind(null)} loading={customer.is_loading} editedAddressValue={editedAddressValue}/>
                  
                    </Modal>
                    <Modal
                        isOpen={modal.prescriptionList}
                        toggle={() => toggle('prescriptionList')}
                        size="md"
                    >
                        <ModalHeader toggle={() => toggle('prescriptionList')}>Prescription List</ModalHeader>
                        <PrescriptionList 
                            toggle={toggle} 
                            setSelectPrescription={setSelectPrescription.bind(null)}
                            list={customer.detail.profileSummary.prescriptions && customer.detail.profileSummary.prescriptions.slice(2)}
                            handleDelete={handleDelete.bind(null)}
                            />
                        </Modal>

                        <Modal
                            isOpen={modal.prescription}
                            toggle={() => toggle('prescription')}
                            size="xl"
                        >
                            <ModalHeader toggle={() => toggle('prescription')}>{selectedPrescription && selectedPrescription.id ? 'Edit Prescription' : 'Add Prescription'} </ModalHeader>
                            <AddPrescription 
                                loading={customer.is_loading}
                                selectedPrescription={selectedPrescription}
                                addUpdataPrescription={createPrescription.bind(null)}
                            />
                        </Modal>
                        <Modal
                            isOpen={modal.addUser}
                            toggle={() => toggle('addUser')}
                            size="md"
                        >
                            <ModalHeader toggle={() => toggle('addUser')}>Edit Customer</ModalHeader>
                            <AddUser 
                                userList={[]} 
                                toggle={() => toggle('addUser')} 
                                addUserInOrder={addUserInOrder.bind(null)} 
                                searchUser={() => false} 
                                loading={order.is_loading} 
                                selectedUser={order.selected_user}
                                isEdit={true}
                            />
                        </Modal>

                        <Modal
                            isOpen={modal.activityList}
                            toggle={() => toggle('activityList')}
                            size="lg"
                            >
                            <ModalHeader toggle={() => toggle('activityList')}>Customer History List</ModalHeader>
                            <Timeline 
                                toggle={toggle} 
                                orderHistory={customer.detail.profileSummary.activity && customer.detail.profileSummary.activity.length && customer.detail.profileSummary.activity.slice(10,customer.detail.profileSummary.activity.length)}
                                userData={user.data || {}}
                                title={'Customer History List'}
                            />
                        </Modal>
                    </CardBody>
                </Card>
            )
}