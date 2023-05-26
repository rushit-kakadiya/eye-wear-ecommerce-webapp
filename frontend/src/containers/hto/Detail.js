import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, CardBody, Modal, ModalHeader, Button, Popover, PopoverHeader, PopoverBody, FormGroup } from "reactstrap";
import BackButton from '../../views/buttons/BackButton';
import Detail from '../../views/hto/Detail';
import CustomerDetail from '../../views/order/detail/CustomerDetail';
import PersonInCharge from '../../views/order/detail/PersonInCharge';
import Timeline from  '../../views/order/detail/Timeline'
import { fetchHtoOrdersDetail, downloadPDF, getOpticianList , updateOptician, getHtoTimeSlote, clearHtoDetail} from '../../redux/hto/action';
import { selectStore, addUserInOrder, setSalesChanenelType, setHtoAppointment} from '../../redux/order/action';
import FreeCoffee from '../../views/hto/FreeCoffee';
import BookingDetail from '../../views/hto/BookingDetail';
import RescheduleAppiontment from '../../views/modal/RescheduleAppiontment';
import StoreListModal from "../../views/modal/StoreList";
import CancelHtoOppiontment from "../../views/modal/CancelHtoOppiontment";
import {appointment_status_list} from '../../utilities/constants';
import {fetchStores} from '../../redux/stores/action';

export default (props) => {
    const [modal, setModal] =  useState({});
    const [downloading, setDownload] = useState(false);
    const [appointment_date, setAppointmentDate] = useState();
    const [appointment_time, setAppointmentTime] = useState({});
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [cancelComment, setCancelComment] = useState("");
    const order_no = props.match.params ? props.match.params.id : ''; 
    const dispatch = useDispatch();
    const {hto, stores, user} = useSelector(state => state);
    const {is_loading, detail, optician_list} = hto;
    const [appointment_status, setAppointmentStatus] = useState({label:"Select Status", value:""});
    const [optician , setOptician] = useState({label:"Select Optician", value:""});
    const opticianData = detail ? optician_list.find(row=> detail && row.id === detail.data.optician_id) : null;
    const htoStatus = detail ? appointment_status_list.find(row=>row.value === detail.data.appointment_status) : null;
 
    useEffect(() => {
       if(order_no){
            dispatch(getHtoTimeSlote());
            dispatch(getOpticianList({}));
            dispatch(fetchHtoOrdersDetail({id: order_no}));
            dispatch(fetchStores());
        }
        return () => dispatch(clearHtoDetail());
    }, [dispatch, order_no]);

     // Togle modal states
     const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };

    // Generate order pdf
    const generatePDF = () => {
        setDownload(true);
        dispatch(downloadPDF({order_no})).then(res=> {
            setDownload(false);
            res.map(row => window.open(row.href, 'Download'));
        });
    }

    const handleStatus = (data = {}) => {
        if(data.appointment_status && data.appointment_status === 'appointment_cancelled')
        {
            toggle('cancelHtoOppiontment');
        } else (
            handleUpdate(data)
        )
    }
    //Update optician
    const handleUpdate = (data = {}) => {
         var params = {
            appointment_id : detail.data.id,
            optician_id: data.value || undefined,
            optician_name: data.label || undefined,
            appointment_date: appointment_date || undefined,
            slot_id: appointment_time.value || undefined,
            slot_start_time: appointment_time.label || undefined,
            appointment_status: data.appointment_status || undefined,
            comment: cancelComment || ""
         };
         if(appointment_time.value) { 
            toggle('rescheduleHto');
            setAppointmentDate();
            setAppointmentTime({});
        }
        dispatch(updateOptician(params));        
    }

    // process to create new order
    const hadnleStoreSelection  = (data) => {
        dispatch(selectStore(data));
    }
    // Select order type
    const selectOrderType = (type) => {
        dispatch(setSalesChanenelType(type));
    }
    // Add User in Order
    const  addCustomerInOrder = () => {
        const {data} = hto.detail;
        dispatch(addUserInOrder({
            id: data.user_id,
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            dob: data.dob,
            gender: data.gender
        }));
    }

    const selectHtoAppiontment = () =>{
         dispatch(setHtoAppointment(detail.data.appointment_no))
    }
    
    if(is_loading) return(<div style={{textAlign: 'center'}} className="mt-5"><h5>loading ...</h5></div>)
    if(!detail) return(<div style={{textAlign: 'center'}} className="mt-5"><h3>Order Not Found!</h3></div>)
    return(
        <>
        <Row>
            <Col md="12">
                <Card>
                    <CardBody>
                        <Row> 
                            <Col sm="4">
                                <h6> <BackButton path="/hto/inside-area" history={props.history}/> Home Try-On: {detail.data.appointment_no}</h6> 
                            </Col>
                            {detail.data.appointment_status === 'appointment_cancelled' &&
                                <Col sm="2"><span className=" badge badge-danger badge-pill">Appointment Cancelled</span></Col>
                            }
                            {/* <Col md="3" sm={{offset: 2}}>
                                <Nav>
                                    <NavItem>
                                        <NavLink disabled={downloading} href="#" active onClick={() => generatePDF()} style={{textDecoration: 'overline'}}>
                                            Download PDF
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col> */}
                            { detail.data.appointment_status === 'appointment_completed' &&
                            <Col sm="2" className="mb-2">
                                <Modal
                                    isOpen={modal.store}
                                    toggle={() => toggle('store')}
                                    className={null}
                                    size="md"
                                >
                                <ModalHeader toggle={() => toggle('store')}>Select Store</ModalHeader>
                                    <StoreListModal history={props.history} stores={stores} hadnleStoreSelection={hadnleStoreSelection.bind(null)} toggle={toggle.bind(null)}/>
                                </Modal>
                                <Button color="success" style={{display:"grid"}} id={`Popover-1`} onClick={()  => setPopoverOpen(!popoverOpen)}> Purchase </Button>
                                <Popover placement="bottom" isOpen={popoverOpen} target="Popover-1" toggle={toggle.bind(null)}>
                              <PopoverHeader>Select Order Channel</PopoverHeader>
                              <PopoverBody style={{width:'200px'}}>
                                <FormGroup>
                                  <Button color="primary" type="button" onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    toggle('store');
                                    selectOrderType('store');
                                    addCustomerInOrder();
                                    selectHtoAppiontment();
                                  }}>In Store</Button>
                                  <Button color="primary" className="ml-1" type="button" onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('whatsapp');
                                    addCustomerInOrder();
                                    selectHtoAppiontment();
                                    props.history.push('/order/add')
                                  }}>
                                  Whatsapp
                                </Button>
                                  <Button color="primary" className="mt-1" type="button" style={{width:'42%'}} onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('hto');
                                    addCustomerInOrder();
                                    selectHtoAppiontment();
                                    props.history.push('/order/add')
                                  }}>
                                  Hto
                                </Button>
                                  <Button color="primary" className="mt-1 ml-1" type="button" style={{width:'53%'}} onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('website');
                                    addCustomerInOrder();
                                    selectHtoAppiontment();
                                    props.history.push('/order/add')
                                  }}>
                                  Website
                                </Button>
                                </FormGroup>
                              </PopoverBody>
                          </Popover>
                            </Col>
                            }
                        </Row>
                        <Row> 
                            <Col md="7" sm={{ offset: 1 }}>
                                <Detail 
                                    detail={detail.data} 
                                    stores={detail.stores} 
                                    opticianList={optician_list} 
                                    setOptician={setOptician} 
                                    optician={opticianData ? { label:opticianData.name, value:opticianData.id } : optician} 
                                    handleUpdate={handleUpdate.bind(null)}
                                    toggle={toggle.bind(null)}
                                    appointment_status={htoStatus ? { label:htoStatus.label, value:htoStatus.value } : appointment_status}
                                    setAppointmentStatus={setAppointmentStatus.bind(null)}
                                    handleStatus={handleStatus.bind(null)}
                                    cancelComment={cancelComment}
                                />
                                <FreeCoffee detail={detail.data}/>
                                {detail.history.length > 0 &&
                                <Timeline orderHistory={detail.history} userData={user.data}/>
                                }
                            </Col>
                            <Col md="3" className="ml-4">
                                <CustomerDetail detail={detail.data} history={props.history} user_id={detail.data.user_id}/>
                                <PersonInCharge detail={{optician: detail.data.opt_name, created_by_staff: detail.data.created_by_name}}/>
                                <BookingDetail detail={detail.data} userData={user.data}/>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
               
            </Col>
        </Row>   
        <Modal
            isOpen={modal.rescheduleHto}
            toggle={() => toggle('rescheduleHto')}
            size="md"
        >
            <ModalHeader toggle={() => toggle('rescheduleHto')}>Appointment Schedule</ModalHeader>
            <RescheduleAppiontment 
                toggle={toggle}
                timeSlot={hto.time_slot}
                setAppointmentDate={setAppointmentDate.bind(null)} 
                appointment_date={appointment_date}
                setAppointmentTime={setAppointmentTime.bind(null)}
                appointment_time={appointment_time}
                handleUpdate={handleUpdate.bind(null)}
                />
        </Modal>

        <Modal
             isOpen={modal.cancelHtoOppiontment}
             toggle={() => toggle('cancelHtoOppiontment')}
             size="md"
        >
            <ModalHeader>Why do you cancel?</ModalHeader>
            <CancelHtoOppiontment
                cancelComment={cancelComment}
                setCancelComment={setCancelComment.bind(null)}
                toggle={toggle}     
                handleUpdate={handleUpdate.bind(null)}     
            />
        </Modal>
        </>
    )
}