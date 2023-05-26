import React from 'react';
import { Row, Col, Label, NavLink } from "reactstrap";
import Select from 'react-select';
import {titleCase, getDateFormat} from '../../utilities/methods';
import {appointment_status_list} from '../../utilities/constants';

export default ({detail, stores, opticianList, setOptician, optician, handleUpdate, toggle, appointment_status, setAppointmentStatus, handleStatus, cancelComment}) => {
    return (
        <Row style={{ border: '1px solid #ccc' }} className="p-3">
            <Col sm="12">
                <h5 className="text-muted">HOME TRY-ON DETAIL</h5>
                    <Row>
                        <Col sm="7">
                            <h6 style={{fontWeight:'bold'}}>Delivery Address</h6>  
                        </Col> 
                        <Col>            
                            <h6 style={{fontWeight:'bold'}}>HTO Schedule</h6>
                        </Col>
                    </Row>              
                <Row>
                    <Col sm="7">
                        <span>{detail.address_details  ? detail.address_details : ""}</span><br></br>
                        <span>{detail.address ? detail.address : ""}</span>
                    </Col>
                <Col>
                    <span>{`${getDateFormat(detail.appointment_date, false, false)} , ${detail.slot_start_time}`}</span><br/>
                    { detail.appointment_status != 'appointment_completed' && <NavLink to="#" className="text-info" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>toggle('rescheduleHto')}>Reschedule</NavLink>}
                </Col>
                </Row>
                    <Row>
                        <Col sm="7" className="mt-3">
                            <Row>
                                <Col>
                                    <h6 className="fw-bold">Nearest Store Location</h6>
                                </Col>
                            </Row>
                            {stores.map((row, index) => 
                                <Row key={index}>
                                    <Col>
                                        <span>{row.name} ({(row.distance/1000).toFixed(2)} KM)</span>
                                    </Col>
                                </Row>
                            )}
                        </Col>
                        <Col sm="5">
                            <Label for="exampleCustomSelect"style={{fontWeight:'bold'}} className="mt-3"> Optician</Label>
                              <Select
                                onChange={(e)=>{ setOptician(e); handleUpdate(e) }}
                                options={opticianList && opticianList.map(row => ({value: row.id, label: titleCase(row.name)}))}
                                value={optician}
                                isDisabled={['appointment_completed','appointment_cancelled'].includes(detail.appointment_status)}
                              />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="5">
                        <Label for="exampleCustomSelect" style={{fontWeight:'bold'}} className="mt-3"> Status</Label>
                            <Select
                            isDisabled={['appointment_completed','appointment_cancelled'].includes(detail.appointment_status)}
                            onChange={(e)=>{ handleStatus({"appointment_status": e.value}); setAppointmentStatus(e);}}
                            options={appointment_status_list}
                            value={appointment_status}
                            />
                        </Col>
                    </Row>
                    {detail.appointment_status === 'appointment_cancelled' &&
                    <Row className="mt-2" >
                        <Col sm="12" style={{color:"#ffc107"}}><i className="fa fa-file mr-2" aria-hidden="true"></i> <string>Cancellation Note</string></Col>
                        <span style={{marginLeft: '2%', padding: '1%', backgroundColor:"rgb(240, 245, 245)"}}>{detail.comment || cancelComment || '--------------------'}</span>
                    </Row>
                    }
            </Col>
        </Row>
        
    )
}

