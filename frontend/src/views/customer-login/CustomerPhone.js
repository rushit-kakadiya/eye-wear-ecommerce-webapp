/*global google*/
import React from "react";
import { Row, Col, Button, FormGroup, Label } from "reactstrap";

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

import { useForm, Controller } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Message from '../../utilities/message';


export default ({ addCustomer, setPhone, mobile, setMobileNo, setCountryCode }) => {


  const { register, handleSubmit, errors, control } = useForm(); // initialise the hook

  let formatted = ''
  let country = ''
  let phone = ''

  const onSubmit = (data) => {
    setPhone(formatted)
    setMobileNo(phone)
    setCountryCode(country)
    addCustomer()
  };


  const setMobileInfo = (value) => {

    phone = value[0]
    country = value[1].dialCode
    formatted = value[3]


    return value[0];
  }

  return (
    <Col md="12" className="login-box">
      <img src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/login-hto.png" />
      <div className="login-box-head">
        <h4>Please input your phone number</h4>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} className="login-box-form">
        <Row>
          <Col md='12' sm="12" xs="12">
            <FormGroup>
              <Label className={errors.phone ? ' label-danger' : ''} style={{ zIndex: 9, left: '57px' }} for="phone">Phone Number.</Label>
              <Controller
                as={<PhoneInput
                  inputStyle={{ padding: '27px 43px', borderRadius: '25px', width: '100%' }}
                  disableAreaCodes={false}
                  country={'id'}
                  specialLabel=""
                  // value={mobile}
                  onChange={(value) => setMobileInfo(value)}
                  inputProps={{
                    id: 'phone',
                    required: true,
                    autoFocus: true,
                    className: errors.phone ? 'form-control danger-border' : 'form-control'
                  }}
                />}
                control={control}
                // onChange={([selected]) => selected}
                onChange={(value) => setMobileInfo(value)}
                name="phone"
                rules={{ required: true, minLength: 9, maxLength: 15 }}
              />
              <span className="text-danger">{errors.phone && Message.validateField(errors.phone.type, 'Phone No.')}</span>
            </FormGroup>
          </Col>
          <Col md='12' sm="12" xs="12" >
            <FormGroup>
              <Button type="submit" className="button-staurdays">CONTINUE</Button>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </Col>
  );
}

