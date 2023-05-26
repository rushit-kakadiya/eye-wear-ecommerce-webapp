/*global google*/
import React from "react";
import { Row, Col, Button, } from "reactstrap";

export default ({ toggleStep, sendOtp, phone }) => {


  return (
    <Col md="12" className="VM-box">
      <div className="VM-box-back">
        <span><a onClick={() => toggleStep('phone')}>&#8249;</a></span>
      </div>
      <div className="VM-box-head">
        <h4>CHOOSE VERIFICATION METHOD</h4>
      </div>
      <div className="VM-box-help">
        <span>
          Choose one of these method to send <br></br>verification code (OTP) to <br></br>{phone}
        </span>
      </div>
      <Col className="VM-box-option">
        <Row>
          <Col md='12' sm="12" xs="12">
            <Button onClick={() => sendOtp("WHTSAPP")}> <img src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/wa-icon.svg" /> &nbsp;&nbsp;&nbsp;Send Via WhatsApp</Button>
          </Col>
          {/* <Col md='12' sm="12" xs="12" >
                        <Button onClick={() => sendOtp("MSG")}> <img src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/message-icon.svg"/>&nbsp;&nbsp;&nbsp;&nbsp;Send Via SMS</Button>
                    </Col> */}
        </Row>
      </Col>
    </Col>
  );
}

