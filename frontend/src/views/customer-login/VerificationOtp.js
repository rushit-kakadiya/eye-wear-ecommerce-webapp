/*global google*/
import React, { useState } from "react";
import { Row, Col, Button, FormGroup, Input } from "reactstrap";
import OtpInput from 'react-otp-input';


import { useForm, Controller } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Message from '../../utilities/message';
import ResendOtp from "./ResendOtp";

export default ({ toggleStep, verifyOtp, reSendOtp, phone, otpType }) => {



  const { register, handleSubmit, errors, control } = useForm(); // initialise the hook

  const [otpError, setOtpError] = useState("")
  const [otp, setOtp] = useState("")

  const onSubmit = (data) => {

    let otp = data.otp[0];


    if (otp.toString().length < 6) {
      setOtpError("Please enter a 6 digit OTP.")
    } else {
      setOtpError("")
      verifyOtp(otp, () => {
        setOtpError("OTP may be expired or invalid.")
      })
    }
  };


  return (
    <Col md="12" className="VM-box">
      <div className="VM-box-back">
        <span> <a onClick={() => toggleStep('method')}>&#8249;</a></span>
      </div>
      <div className="VM-box-head">
        <h4>CONFIRM YOUR NUMBER</h4>
      </div>
      <div className="VM-box-help">
        <span>
          Insert the-6-digit code EYEWEAR <br></br>
          just sent to your Whatsapp <br></br>
          {phone}
        </span>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Col className="VM-box-otp">
          <Row>
            <Col md='12' sm="12" xs="12" >
              <Controller
                as={
                  <OtpInput
                    // onChange={(otp)=> console.log(otp) }
                    numInputs={6}
                    // containerStyle={{width:"100%"}}
                    hasErrored={true}
                    inputStyle={{ width: "100%", borderBottom: "solid 1px #ccc", borderLeft: "none", borderRight: "none", borderTop: "none", height: '50px' }}
                    isInputNum={true}
                    separator={<span>-</span>}
                    value={otp}
                  />}
                onChange={(otp) => { return otp }}
                control={control}
                name="otp"
                rules={{ required: true, minLength: 6, maxLength: 6 }}
              />
            </Col>
            <Col md='12' sm="12" xs="12" style={{ textAlign: "center", marginTop: '15px' }}>
              <span className="text-danger">{otpError != "" && otpError}</span>
            </Col>

            {/* <Col md='2' sm="2" xs="2">
                            <input type="text" name="d1" className={"form-control otp-digit" + (errors.d1 ? ' danger-border' : '')} ref={register({ required: true , pattern :  /[0-9]{1}/, minLength: 1, maxLength: 1,  })} maxLength="1"/>
                        </Col>
                        <Col md='2' sm="2" xs="2" >
                            <input type="text" name="d2" className={"form-control otp-digit" + (errors.d2 ? ' danger-border' : '')} ref={register({ required: true , pattern :  /[0-9]{1}/, minLength: 1, maxLength: 1,  })} maxLength="1"/>
                        </Col>
                        <Col md='2' sm="2" xs="2" >
                            <input type="text" name="d3" className={"form-control otp-digit" + (errors.d3 ? ' danger-border' : '')} ref={register({ required: true , pattern :  /[0-9]{1}/, minLength: 1, maxLength: 1,  })} maxLength="1"/>
                        </Col>
                        <Col md='2' sm="2" xs="2" >
                            <input type="text" name="d4" className={"form-control otp-digit" + (errors.d4 ? ' danger-border' : '')} ref={register({ required: true , pattern :  /[0-9]{1}/, minLength: 1, maxLength: 1,  })} maxLength="1"/>
                        </Col>
                        <Col md='2' sm="2" xs="2" >
                            <input type="text" name="d5" className={"form-control otp-digit" + (errors.d5 ? ' danger-border' : '')} ref={register({ required: true , pattern :  /[0-9]{1}/, minLength: 1, maxLength: 1,  })} maxLength="1"/>
                        </Col>
                        <Col md='2' sm="2" xs="2" >
                            <input type="text" name="d6" className={"form-control otp-digit" + (errors.d6 ? ' danger-border' : '')} ref={register({ required: true , pattern :  /[0-9]{1}/, minLength: 1, maxLength: 1,  })} maxLength="1"/>
                        </Col> */}
          </Row>
        </Col>
        <div className="VM-box-resend">
          <div>
            Didn't get a message?
          </div>
          <ResendOtp reSendOtp={reSendOtp} otpType={otpType} />
        </div>
        <div className="VM-box-tandc">
          <span>
            By signing up you agree to our<br></br>
            Terms of Use and <a target="_blank" href="https://eyewear.com/pages/privacy-policy"> Privacy Policy</a>
          </span>
        </div>
        <br></br>
        <br></br>
        <Col md='12' sm="12" xs="12" >
          <Button type="submit" className="button-staurdays">VERIFY</Button>
        </Col>
      </Form>
    </Col>
  );
}

