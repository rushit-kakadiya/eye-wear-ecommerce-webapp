import React, { useState } from 'react';
import { Row, Col, FormGroup, Input, Label, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-validation/build/form';

import Map from "./Map";
import AreaAlert from "./AreaAlert";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DatePicker from "react-datepicker";
import { appointmentTimings, appointmentTimingsOld } from '../../utilities/constants';
import Message from '../../utilities/message';
import Regex from '../../utilities/regex';
import './appointment.scss'
import "react-datepicker/dist/react-datepicker.css";


export default ({
  markerposition,
  mapAddress,
  onMarkerDragEnd,
  updateMarker,
  mapModal,
  toggleMap,
  confirmLocation,
  dropAddress,
  addDays,
  checkingAvailability,
  areaAlertModal,
  region,
  toggleAreaAlertMap,
  setTime,
  time,
  setAppointmentDate,
  appointmentDate,
  coffee,
  setCoffee,
  userData,
  saveAppointment
}) => {


  const { register, handleSubmit, errors, control } = useForm(); // initialise the hook


  const onSubmit = (data) => {
    saveAppointment(data)
  };

  return (
    <Col>
      <Row>
        <Col md="12" className="logo-holder">
          <img src="https://eyewear-user.s3-ap-southeast-1.amazonaws.com/email-images/eyewearMenuTrp01Black@2x.png" />
        </Col>
        <Col md="12" className="form-heading">
          <h4>Home try-on Form</h4>
        </Col>
        <Col md="12" className="form-help">
          <span>Please fill up this form to book appointment</span>
        </Col>
        <Col md={{ size: 6, offset: 3 }} sm="12" xs="12" className="box-container">
          <Col md="12" className="appointment-box">
            <Col sm="12" xs="12">
              <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <Row>


                  {userData && Object.keys(userData).length === 0 ? (<>
                    <Col md='12' sm="12" xs="12" className="section-describe">
                      Profile
                    </Col>
                    <Col md='6' sm="12" xs="12">
                      <FormGroup>
                        <Label className={errors.first_name ? ' label-danger' : ''} for="first_name">First Name</Label>
                        <input className={"form-control" + (errors.first_name ? ' danger-border' : '')} type="text" name="first_name" id="first_name" placeholder="Min. 2 letters" ref={register({ required: true })} />
                        <span className="text-danger">{errors.first_name && Message.validateField(errors.first_name.type, 'First Name')}</span>
                      </FormGroup>
                    </Col>
                    <Col md='6' sm="12" xs="12">
                      <FormGroup>
                        <Label className={errors.last_name ? ' label-danger' : ''} for="last_name">Last Name</Label>
                        <input className={"form-control" + (errors.first_name ? ' danger-border' : '')} type="text" name="last_name" id="last_name" placeholder="Min. 2 letters" ref={register({ required: true })} />
                        <span className="text-danger">{errors.last_name && Message.validateField(errors.last_name.type, 'Last Name')}</span>
                      </FormGroup>
                    </Col>
                    <Col md='6' sm="12" xs="12">
                      <FormGroup>
                        <Label className={errors.email ? ' label-danger' : ''} for="email">Email</Label>
                        <input className={"form-control" + (errors.email ? ' danger-border' : '')} type="text" name="email" id="email" placeholder="john@example" ref={register({ required: true, pattern: Regex.validateEmail })} />
                        <span className="text-danger">{errors.email && Message.validateField(errors.email.type, 'Email')}</span>
                      </FormGroup>
                    </Col>
                    <Col md='6' sm="12" xs="12">
                      <FormGroup>
                        <Label className={"high-index" + (errors.dob ? ' label-danger' : '')} for="dob">Birthday</Label>
                        <Controller
                          as={<DatePicker
                            dateFormat="yyyy/MM/dd"
                            style={{ width: "100%" }}
                            autoComplete="false"
                            showYearDropdown
                            showMonthDropdown
                            autoComplete="off"
                          />}
                          onKeyDown={e => e.preventDefault()}
                          control={control}
                          valueName="selected" // DateSelect value's name is selected
                          onChange={([selected]) => selected}
                          rules={{ required: true }}
                          name="dob"
                          className={"form-control" + (errors.dob ? ' danger-border' : '')}
                          placeholderText="Select your Birthday"
                        />
                        <span className="text-danger">{errors.dob && Message.validateField(errors.dob.type, 'Date of birth')}</span>
                      </FormGroup>
                    </Col>
                    <Col md='6' sm="12" xs="12">
                      <FormGroup tag="fieldset">
                        <FormGroup check>
                          <Label check style={{ position: 'relative', left: 0, top: 0 }} className={(errors.gender ? ' label-danger' : '')}>
                            <input type="radio" name="gender" value="1" ref={register({ required: true })} />{' '}
                            Male
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check style={{ position: 'relative', left: 0, top: 0 }} className={(errors.gender ? ' label-danger' : '')} >
                            <input type="radio" name="gender" value="2" ref={register({ required: true })} />{' '}
                            Female
                          </Label>
                        </FormGroup>
                        <span className="text-danger">{errors.gender && Message.validateField(errors.gender.type, 'Gender')}</span>
                      </FormGroup>
                    </Col>
                    <hr className="section-dvider" ></hr>
                  </>) :

                    (<>
                      <Col md='12' sm="12" xs="12" className="user-info" style={{ textAlign: 'center' }}>
                        <p></p>
                        <h4>WELCOME BACK, {userData && userData.name}</h4>
                      </Col>
                    </>)
                  }
                  <Col md='12' sm="12" xs="12" className="section-describe">
                    HTO Address
                  </Col>
                  <Col md='12' sm="12" xs="12">
                    <FormGroup>
                      <input type="text" className={"form-control"} name="address_details" id="address_details" onClick={toggleMap} value={mapAddress} readOnly={true} ref={register({ required: true })} />
                      <Map
                        markerposition={markerposition}
                        mapAddress={mapAddress}
                        dropAddress={dropAddress}
                        onMarkerDragEnd={onMarkerDragEnd}
                        updateMarker={updateMarker}
                        mapModal={mapModal}
                        toggleMap={toggleMap}
                        confirmLocation={confirmLocation}
                      />
                    </FormGroup>
                  </Col>
                  <Col md='8' sm="12" xs="12">
                    <FormGroup>
                      <Label className={errors.address ? ' label-danger' : ''} for="address">Address Detail</Label>
                      <input className={"form-control" + (errors.address ? ' danger-border' : '')} type="text" name="address" id="address" placeholder="e.g: Floor/House/Blok Number, RT/RW" ref={register({ required: true })} />
                      <span className="text-danger">{errors.address && Message.validateField(errors.address.type, 'Address Detail')}</span>
                    </FormGroup>
                  </Col>
                  <Col md='4' sm="12" xs="12">
                    <FormGroup>
                      <Label className={errors.zip_code ? ' label-danger' : ''} for="zip_code">Zip Code</Label>
                      <input className={"form-control" + (errors.zip_code ? ' danger-border' : '')} type="text" name="zip_code" id="zip_code" placeholder="Zip Code"
                        ref={register({ required: true, minLength: 5, maxLength: 5 })}
                        onChange={(e) => (checkingAvailability(e))}
                        maxLength="5"
                      />
                      <span className="text-danger">{errors.zip_code && Message.validateField(errors.zip_code.type, 'Zip Code')}</span>
                      <AreaAlert areaAlertModal={areaAlertModal} toggleAreaAlertMap={toggleAreaAlertMap} />
                    </FormGroup>
                  </Col>
                  <hr className="section-dvider"></hr>
                  <Col md='12' sm="12" xs="12" className="section-describe">
                    HTO Schedule
                  </Col>
                  <Col md='8' sm="12" xs="12">
                    <FormGroup>
                      <Label className={"high-index" + (errors.appointmentDate ? ' label-danger' : '')} for="appointmentDate">Appointment Date</Label>
                      <Controller
                        as={<DatePicker
                          minDate={addDays(new Date(), 1)}
                          maxDate={addDays(new Date(), 15)}
                          style={{ width: "100%" }}
                          dateFormat="yyyy/MM/dd"
                          autoComplete="off"
                        />}
                        onKeyDown={e => e.preventDefault()}
                        control={control}
                        valueName="selected" // DateSelect value's name is selected
                        onChange={([selected]) => { return selected }}
                        name="appointmentDate"
                        rules={{ required: true }}
                        className={"form-control" + (errors.appointmentDate ? ' danger-border' : '')}
                        placeholderText="Select your appointment date"
                      />
                      <span className="text-danger">{errors.appointmentDate && Message.validateField(errors.appointmentDate.type, 'Appointment Date')}</span>
                    </FormGroup>
                  </Col>
                  <Col md='4' sm="12" xs="12">
                    <FormGroup>
                      <Label className={errors.time ? ' label-danger' : ''} for="time">Time</Label>
                      {/* <select 
                                            value={time} 
                                            className={"form-control" + ( errors.time  ? ' danger-border' : '')} 
                                            name="time" 
                                            id="time" 
                                            onChange={e => setTime(e.target.value)} 
                                            >
                                            { appointmentTimingsOld.map((time)=>{
                                                return (<option value={time} >{time}</option>)
                                            })}
                                        </select> */}

                      <Controller
                        control={control}
                        name="time"
                        rules={{ required: true }}
                        as={
                          <select
                            className={"form-control" + (errors.time ? ' danger-border' : '')}
                            id="time"
                            onChange={e => setTime(e.target.value)}>
                            <option key="" value={""} > Select Time</option>
                            {appointmentTimings.map((obj) => {
                              return (<option key={obj.value} value={obj.value} >{obj.label}</option>)
                            })}
                          </select>
                        }
                      />
                      <span className="text-danger">{errors.time && Message.validateField(errors.time.type, 'Time')}</span>
                    </FormGroup>
                  </Col>
                  {region == "inside" &&
                    (<>
                      <hr className="section-dvider"></hr>
                      <Col md='12' sm="12" xs="12" className="section-describe">
                        Would you like free coffee?
                      </Col>
                      <Col md='6' sm="12" xs="12">
                        <FormGroup tag="fieldset">
                          <FormGroup check>
                            <Label check style={{ position: 'relative', left: 0, top: 0 }}>
                              <input ref={register({ required: false })} type="radio" name="notes" value="No Thanks" defaultChecked={coffee} />{'  '}
                              No Thanks
                            </Label>
                          </FormGroup>
                          <FormGroup check >
                            <Label check style={{ position: 'relative', left: 0, top: 0 }}>
                              <input ref={register({ required: false })} type="radio" name="notes" value="Iced Black" />{'  '}
                              Iced Black
                            </Label>
                          </FormGroup>
                          <FormGroup check >
                            <Label check style={{ position: 'relative', left: 0, top: 0 }}>
                              <input ref={register({ required: false })} type="radio" name="notes" value="Iced Latte" />{'  '}
                              Iced Latte
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check style={{ position: 'relative', left: 0, top: 0 }}>
                              <input ref={register({ required: false })} type="radio" name="notes" value="Es kopi Susu" />{'  '}
                              Es kopi Susu
                            </Label>
                          </FormGroup>
                        </FormGroup>
                      </Col> </>)}
                  {region != "notallowed" &&
                    <Col md='12' sm="12" xs="12">
                      <FormGroup>
                        <Button type="submit" className="button-staurdays">BOOK HOME TRY-ON</Button>
                      </FormGroup>
                    </Col>
                  }
                </Row>
              </Form>
            </Col>
          </Col>
        </Col>
      </Row>
    </Col>
  )
}
