import React, { useState, useEffect } from 'react';
import classnames from "classnames";
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';

import Form from 'react-validation/build/form';
import { toastAction } from '../../redux/ToastActions';
import PhoneInput from 'react-phone-input-2';
import AutoComplete from 'react-google-autocomplete';

import { storeTimings } from '../../utilities/constants';
import Message from '../../utilities/message';
import { splitAtFirstSpace } from '../../utilities/methods';

import './store.scss';

export default ({
    history,
    options,
    loading,
    addStore
}) => {

    const { register, handleSubmit, errors, setError, setValue, control, reset } = useForm()

    let formatted= ''
    let country= ''
    let phone= ''

    const setMobileInfo = (value) => {
        
        phone = value[0]
        country = value[1].dialCode
        formatted = value[3]
        return value[0];
    }

    const onSubmit = (data) => {
        addStore(data,(message, error)=>{
            if(error){
                let messageData = splitAtFirstSpace(message.en);
                setError(messageData[0], {type :'server',  message : messageData[1]});
            }else{
                toastAction(true, "Store added successfully.");
                history.push(`/store-detail/${message.id}`);
            }
        })
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='summary'>
                <Col md="8" sm="12">
                    <Col md="12" sm="12" className="summary-section">
                        <Col md="12" className='summary-section-heading'> STORE PROFILE </Col>
                        <FormGroup>
                            <label className="control-label" htmlFor="id">
                                Id
                            </label>
                            <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.id ? ' danger-border' : '')}
                                    type="number"
                                    name="id"
                                    placeholder="Truboly Id"
                                    ref={register({
                                        required: true
                                    })}
                                />
                            </div>
                            <span className="text-danger">{errors.id && Message.validateField(errors.id.type, 'Store Id', errors.id.types)}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="name">
                                Name
                            </label>
                            <div className="mb-2" >
                                <input
                                   className={"form-control" + (errors.name ? ' danger-border' : '')}
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    ref={register({
                                        required: true
                                    })}
                                />
                            </div>
                            <span className="text-danger">{errors.name && Message.validateField(errors.name.type, 'Name')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="is_cafe">
                                Cafe
                            </label>
                            <div className="mb-2" >
                                <input
                                    type="checkbox"
                                    name="is_cafe"
                                    ref={register({ })}
                                />
                            </div>
                            <span className="text-danger">{errors.cafe && Message.validateField(errors.cafe.type, 'Cafe')}</span>
                        </FormGroup>
                    </Col>
                    <Col md="12" sm="12" className="summary-section  mt-30">
                        <Col md="12" className='summary-section-heading'> STORE ADDRESS </Col>

                        <FormGroup>
                            <label className="control-label" htmlFor="region">
                                Region
                            </label>
                            <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.region ? ' danger-border' : '')}
                                    type="text"
                                    name="region"
                                    placeholder="Region"
                                    ref={register({})}
                                />
                            </div>
                            <span className="text-danger">{errors.region && Message.validateField(errors.region.type, 'Region')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="address">
                                Detail Address
                            </label>
                            {/* <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.address ? ' danger-border' : '')}
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    ref={register({
                                        required: true
                                    })}
                                />
                            </div> */}
                             <Controller
                                as={
                                    <AutoComplete
                                    className="form-control"
                                    apiKey={"AIzaSyAi11lLDJCDlCM3iLi8O-TZgWkKbWLtORc"}
                                    onPlaceSelected={(place, inputRef) => {setValue('address',place.formatted_address)}}
                                    onChange={(e) => {  return e.target.value }}
                                    placeholder="Search your province, district, etc"
                                    options={{
                                       types: ["geocode", "establishment" ]
                                    }}
                                />}
                                control={control}
                                name="address"
                                rules={{ required: true }}
                                className={"form-control" + (errors.address ? ' danger-border' : '')}   
                            />
                            <span className="text-danger">{errors.address && Message.validateField(errors.address.type, 'Address')}</span>
                        </FormGroup>
                        <Row>
                            <Col md="6" sm="12">
                                <FormGroup>
                                    <label className="control-label" htmlFor="opening_time">
                                        Opening Hours
                                    </label>
                                    <Controller
                                        control={control}
                                        name="opening_time"
                                        rules={{ required: true }}
                                        as={
                                            <select
                                                className={"form-control" + (errors.opening_time ? ' danger-border' : '')}
                                                id="opening_time"
                                                onChange={e => { }}
                                            >
                                                <option key="" value={""} > Select Time</option>
                                                {storeTimings.map((obj) => {
                                                    return (<option key={obj.open} value={obj.open} >{obj.open}</option>)
                                                })}
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.opening_time && Message.validateField(errors.opening_time.type, 'Opening Time')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6" sm="12">
                                <FormGroup>
                                    <label className="control-label" htmlFor="closing_time">
                                        Closing Hours
                                    </label>
                                    <Controller
                                        control={control}
                                        name="closing_time"
                                        rules={{ required: true }}
                                        as={
                                            <select
                                                className={"form-control" + (errors.closing_time ? ' danger-border' : '')}
                                                id="time"
                                                onChange={e => { }}
                                            >
                                                <option key="" value={""} > Select Time </option>
                                                {storeTimings.map((obj) => {
                                                    return (<option key={obj.close} value={obj.close} >{obj.close}</option>)
                                                })}
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.closing_time && Message.validateField(errors.closing_time.type, 'Closing Time')}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                            <label className="control-label" htmlFor="zipcode">
                                Zip Code
                            </label>
                            <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.zipcode ? ' danger-border' : '')}
                                    type="number"
                                    name="zipcode"
                                    placeholder="Zip Code"
                                    ref={register({})}
                                />
                            </div>
                            <span className="text-danger">{errors.zipcode && Message.validateField(errors.zipcode.type, 'Zipcode')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="name">
                                City
                            </label>
                            <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.city ? ' danger-border' : '')}
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    ref={register({
                                        required: true
                                    })}
                                />
                            </div>
                            <span className="text-danger">{errors.city && Message.validateField(errors.city.type, 'City')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="province">
                                Province
                            </label>
                            <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.province ? ' danger-border' : '')}
                                    type="text"
                                    name="province"
                                    placeholder="Province"
                                    ref={register({
                                        required: true
                                    })}
                                />
                            </div>
                            <span className="text-danger">{errors.province && Message.validateField(errors.province.type, 'Province')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="country">
                                Country
                            </label>
                            <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.country ? ' danger-border' : '')}
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    ref={register({
                                        required: true
                                    })}
                                />
                            </div>
                            <span className="text-danger">{errors.country && Message.validateField(errors.country.type, 'Country')}</span>
                        </FormGroup>
                        <Row>
                            <Col md="6" sm="12">
                                <FormGroup>
                                    <label className="control-label" htmlFor="lat">
                                        Latitude
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.lat ? ' danger-border' : '')}
                                            type="text"
                                            name="lat"
                                            placeholder="Latitude"
                                            ref={register({})}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.lat && Message.validateField(errors.lat.type, 'Latitude')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6" sm="12">
                                <FormGroup>
                                    <label className="control-label" htmlFor="long">
                                        Longitude
                                </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.long ? ' danger-border' : '')}
                                            type="text"
                                            name="long"
                                            placeholder="Longitude"
                                            ref={register({})}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.long && Message.validateField(errors.long.type, 'Logitude')}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                                <FormGroup>
                                    <Button type="button" disabled={loading} onClick={() => reset()} color="danger" outline={true} style={{ width: "100%" }}>Cancel Edit</Button>
                                </FormGroup>
                            </Col>
                            <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                                <FormGroup>
                                    <Button type="submit" disabled={loading} color="primary" style={{ width: "100%" }}>Create</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Col>
                <Col md="4" sm="12" >
                    <Col md="12" className="summary-section">
                        <Col md="12" className='summary-section-heading'> STORE CONTACT</Col>
                        <FormGroup>
                            <label className="control-label" htmlFor="phone">
                                Mobile
                        </label>
                            <Controller
                                as={<PhoneInput
                                    disableAreaCodes={false}
                                    country={'id'}
                                    specialLabel=""
                                    // value={mobile}
                                    onChange={(value) => {   setMobileInfo(value)  }}
                                    inputProps={{
                                        id: 'phone',
                                        required: true,
                                        autoFocus: true,
                                        className: errors.phone ? 'form-control danger-border' : 'form-control'
                                    }}
                                />}
                                control={control}
                                name="phone"
                                rules={{ required: true, minLength: 9, maxLength: 15 }}
                            />
                            <span className="text-danger">{errors.phone && Message.validateField(errors.phone.type, 'Mobile')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="email">
                                Email
                            </label>
                            <div className="mb-2" >
                                <input
                                    className={"form-control" + (errors.email ? ' danger-border' : '')}
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    ref={register({
                                        required: true,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "invalid email address"
                                        }
                                    })}
                                />
                            </div>
                            <span className="text-danger">{errors.email && Message.validateField(errors.email.type, 'Email')}</span>
                        </FormGroup>
                    </Col>
                </Col>
            </Row>
        </Form>
    )
}