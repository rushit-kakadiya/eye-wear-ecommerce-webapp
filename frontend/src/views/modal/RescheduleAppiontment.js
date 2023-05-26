import React, {useState, useEffect} from 'react';
import {
    Row,
    Col,
    Button
} from 'reactstrap';
import Select from 'react-select';
import {addDayDate} from '../../utilities/methods';

export default ({timeSlot, setAppointmentDate, appointment_date, setAppointmentTime, appointment_time, handleUpdate}) =>{
    return(
        <>
        <Row className="mt-3 ml-4 mb-2">
        <Col sm="5">
        <Select
        placeholder="Select Date"
        onChange={(e)=>setAppointmentDate(e.value)}
        options={timeSlot && timeSlot.map(row => ({value: row.date, label: addDayDate(row.date)}))}
        />
        </Col> 
         <Col  sm="5">
          <Select
          placeholder="Select time"
          onChange={(e)=>setAppointmentTime(e)}
          options={appointment_date && timeSlot.find(row=>row.date == appointment_date)['slot_list'].map(row => ({value: row.slot_id, label: row.slot_start_time}))}
          />
        </Col>
        </Row>
        <Row className="mt-3 ml-2 mb-2">
            <Col sm="3"></Col>
            <Col >
            <Button color="primary" type="submit" disabled={!appointment_date || !appointment_time} onClick={()=>handleUpdate()}>
              Reschedule Appiontment
            </Button>
            </Col>
        </Row>
        </>
    )
}