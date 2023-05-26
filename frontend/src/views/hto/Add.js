import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardText, FormGroup, Button} from 'reactstrap';
import { NavLink } from "react-router-dom";
import Select from 'react-select';
import {addDayDate} from '../../utilities/methods';
import { salesChannel } from '../../utilities/constants';

export default ({hto, toggle, setCoffeeType, handleDateChange, setAppointmentTime, handleSubmit, appointment_date, user, setSalesChannel}) =>{
    return ( 
        <Row>
            <Col md="12">
            <Card>
                <CardBody>
                    <Row> 
                        <Col sm={{ offset: 1 }}>
                        <NavLink to="#" onClick={()=>  handleSubmit(2)}><i style={{fontSize: '20px'}}className="mdi mdi-arrow-left-bold-circle"></i></NavLink>
                        </Col>
                        <Col md="10">
                        <h4> New Home Try-On Schedule</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {
                            hto.selected_user ?
                            <Card body style={{width: '40%', marginLeft: '10%'}}>
                            <CardTitle><i className="mdi mdi-account"></i> Customer Detail <NavLink to="#" onClick={() => toggle('addUser')} style={{marginLeft: '5%', textDecoration: 'underline'}}>Change</NavLink></CardTitle>
                            <CardText>
                            <span>
                                {hto.selected_user.name} (0{hto.selected_user.mobile}) <br/>
                                {hto.selected_user.email}
                            </span>
                            </CardText>
                            </Card>
                            :
                            <FormGroup><Button style={{width: '40%', marginLeft: '10%'}} type="button" className="btn mt-2" outline color="primary" onClick={()=>toggle('addUser')}> <i className="mdi mdi-account-star-variant"></i> Add Customer</Button></FormGroup>
                            }
                        </Col>
                    </Row>
                    {hto.selected_user &&
                        <Card body style={{width: '40%', marginLeft: '10%'}}>
                        <CardTitle><i className="fas fa-home"></i> Customer Address </CardTitle>
                        <CardText>
                            { hto.selected_user_address &&
                                <fieldset>
                                    {hto.selected_user_address.address}<br/>
                                    {hto.selected_user_address.province}, {hto.selected_user_address.city}, {hto.selected_user_address.country} ({hto.selected_user_address.zip_code})
                                </fieldset>

                            }<br/>
                        <Button style={{ width: '60%', }} type="button" color="primary" onClick={() => toggle(user.users_address && user.users_address.length ? 'addressList' : 'addAddress')}>{ user.users_address && user.users_address.length ? hto.selected_user_address ? 'Change Address' : 'Select Address' : 'Add New Address'}</Button>
                        </CardText>
                        </Card>
                    }
                    {   hto.selected_user &&
                    <Card body style={{width: '40%', marginLeft: '10%'}}>
                         <CardTitle><i class="fas fa-calendar-alt"></i><span className="ml-2">Appointment Schedule</span></CardTitle>
                         <CardText>
                            <Row className="mb-2"> 
                                <Col sm="7">
                                    <Select
                                    placeholder="Select Date"
                                    onChange={(e)=>handleDateChange(e)}
                                    options={hto.time_slot && hto.time_slot.map(row => ({value: row.date, label: addDayDate(row.date)}))}
                                    />
                                </Col> 
                                <Col>
                                 <Select
                                    placeholder="Select time"
                                    disabled={!appointment_date}
                                    onChange={(e)=>setAppointmentTime(e.value)}
                                    options={appointment_date && hto.time_slot && hto.time_slot.find(row=>row.date === appointment_date)['slot_list'].map(row => ({value: row.slot_id, label: row.slot_start_time}))}
                                 />
                                </Col>
                            </Row>
                         </CardText>
                    </Card> }
                    {   hto.selected_user &&
                    <Card body style={{width: '40%', marginLeft: '10%'}}>
                         <CardTitle><i class="fas fa-chart-line"></i><span className="ml-2">Booking Channel</span></CardTitle>
                         <CardText>
                            <Row className="mb-2"> 
                                <Col sm="8">
                                    <Select
                                    placeholder="Select Booking Channel"
                                    onChange={(e)=>setSalesChannel(e.value)}
                                    options={salesChannel}
                                    />
                                </Col> 
                            </Row>
                         </CardText>
                    </Card> }
                    { hto.selected_user &&
                         <Card body style={{width: '40%', marginLeft: '10%'}}>
                         <CardTitle><i class="fa fa-coffee" aria-hidden="true"></i><span className="ml-2">Choose Free Coffee </span></CardTitle>
                         <CardText>
                            <div className="ml-4">
                                <input type="radio" name="free_coffee" defaultChecked  value="No Thanks" onClick={(e)=>setCoffeeType(e.target.value)}></input>
                                <label className="ml-1"> No, Thanks</label><br/>
                                <input type="radio" name="free_coffee"value="iced black" onClick={(e)=>setCoffeeType(e.target.value)}></input>
                                <label className="ml-1">iced black</label><br/>
                                <input type="radio" name="free_coffee" value="iced latte" onClick={(e)=>setCoffeeType(e.target.value)} ></input>
                                <label className="ml-1">iced latte</label><br/>
                                <input type="radio" name="free_coffee" value="es kopi susu" onClick={(e)=>setCoffeeType(e.target.value)}></input>
                                <label className="ml-1">es kopi susu</label><br/>
                            </div>
                         </CardText>
                         </Card>
                       }
                    <Row>
                        <Col>
                        <FormGroup><Button style={{width: '40%', marginLeft: '10%'}} type="button" className="btn mt-2" color="primary" disabled={!hto.selected_user && true} onClick={()=>handleSubmit()}>Book Appointment</Button></FormGroup>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Col>
    </Row>
    )
}