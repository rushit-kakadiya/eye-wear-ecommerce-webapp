/*global google*/
import React from "react";
import { Row, Col , } from "reactstrap";

import CustomerPhone from "./CustomerPhone";
import VerificationMethod from "./VerificationMethod";
import VerificationOtp from "./VerificationOtp";



import  './CustomerLogin.scss'

export default ({options, toggleStep, addCustomer, setPhone, phone,  sendOtp, verifyOtp, reSendOtp, mobile, setMobileNo, setCountryCode, otpType}) => {



    function AppointmentStep({appointmentStep}){
        if(appointmentStep == "phone"){
            return <CustomerPhone  addCustomer={addCustomer} setMobileNo={setMobileNo} setCountryCode={setCountryCode} setPhone={setPhone} mobile={mobile}/>
        }else if(appointmentStep == "method"){
            return <VerificationMethod toggleStep={toggleStep} sendOtp={sendOtp} phone={phone}/>
        }else if(appointmentStep == "otp"){
            return <VerificationOtp toggleStep={toggleStep} verifyOtp={verifyOtp} reSendOtp={reSendOtp} phone={phone} otpType={otpType}/>
        }
    }

    return (
        <>
            <Col md={{ size: 4, offset: 4 }} sm ="12" xs="12" className="box-login-container">          
                <AppointmentStep appointmentStep={options.appointmentStep} />
            </Col>
        </>
    );
}

