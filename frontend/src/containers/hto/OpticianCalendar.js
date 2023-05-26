import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import { Modal, ModalHeader, NavLink } from 'reactstrap';
import {clearHtoDetail, getOpticianList, getOpticiAnppointments} from '../../redux/hto/action';
import OpticianCalendar from '../../views/hto/OpticianCalendar';
import OpticianCalendarModal from '../../views/modal/OpticianCalendarModal'; 

export default ({history}) =>{
   const [modal, setModal] =  useState({});
   const [selectedOptician, setSelectedOptician] = useState();
   const [viewEvent, setViewEvent] = useState();
   const [month, setMonth] = useState(0);
   const [type, setType] = useState('month');
   const {hto} = useSelector(state=> state); 
   const dispatch = useDispatch();
   const opticianAppiontmentList = hto.optician_appointments_list.map(row=>{return {...row, start:new Date(row.start), end:new Date(row.end)}});
   const filteredAppointments = selectedOptician ? opticianAppiontmentList.filter(row=>selectedOptician.includes(row.opticianId)) : [];
   
   useEffect(()=>{
      dispatch(getOpticianList());
   },[]);

   useEffect(()=>{
      dispatch(getOpticiAnppointments({month}));
   },[month])

   // Togle modal states
   const toggle = (key) => {
      setModal({...modal, [key]: !modal[key]});
   };

   //view optician event
   const alertselectedEvent = (event) => {
      setViewEvent(event);
      toggle('opticianCalendar');
   };


   //Clear existing information on create new order
   const clearHtoInformation = () => {
   dispatch(clearHtoDetail());
   }

   return(
      <>
      <OpticianCalendar 
      history={history}
      opticianList={hto.optician_list}
      events={!selectedOptician ? opticianAppiontmentList : filteredAppointments} 
      setSelectedOptician={setSelectedOptician.bind(null)}
      alertselectedEvent={alertselectedEvent.bind(null)}
      clearHtoInformation={clearHtoInformation.bind(null)}
      setMonth={setMonth.bind(null)}
      type={type}
      setType={setType.bind(null)}
      />
      <Modal
      isOpen={modal.opticianCalendar}
      toggle={() => toggle('opticianCalendar')}
      size="sm"
  >
   <ModalHeader toggle={() => toggle('opticianCalendar')}>{viewEvent &&   <NavLink href="#" active onClick={() => history.push(`/hto/detail/${viewEvent.id}`)} style={{textDecoration:'underline'}}>{viewEvent.appointmentNo}</NavLink>}</ModalHeader>
     <OpticianCalendarModal viewEvent={viewEvent}/> 
  </Modal>
  </>
   )
}