/*global google*/
import React, {useState, useEffect} from 'react';
import { Row, Col, Button, } from "reactstrap";



export default ({reSendOtp, otpType}) => {


    const [timer, setTimer] = useState(30);


    const sendOtpAgain = (otpType) =>{
      setTimer(30)
      reSendOtp(otpType)
    }


    React.useEffect(() => {
        if (timer > 0) {
          setTimeout(() => setTimer(timer - 1), 1000);
        } else {
          setTimer(0);
        }
    });



    return (
        <span>
            {timer != 0 && <>Try again in {timer} Seconds </> }
            {timer == 0 && <a style={{cursor :'pointer'}}onClick={() => sendOtpAgain(otpType)}> resend</a>}
        </span>
    );
}

