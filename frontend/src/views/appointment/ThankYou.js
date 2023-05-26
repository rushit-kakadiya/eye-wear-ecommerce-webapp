/*global google*/
import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from "reactstrap";


import './appointment.scss'


export default (props) => {


  useEffect(() => {
    if (!props.location?.state?.status) {
      props.history.push('/tryon/login')
    }
  }, [props.location?.state?.status])


  return (
    <>
      <Col md={{ size: 4, offset: 4 }} sm="12" xs="12" className="thankyou-container">
        <Col md="12" className="thankyou-box">
          <img className="thankyou-banner" src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/thankyou-med.png" />
          <div className="thankyou-box-head">
            <h4>GOOD THINGS AWAIT</h4>
            <span className="seeyou-soon"> See you soon! &nbsp; <img className="smile" src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/smile.png" /></span>
          </div>
          <Col>
            <Row className="app-instruction">
              <Col md="12" className="statement">
                Download EYEWEAR app <br></br>to track your order status
              </Col>
              <Col md="6" sm="6" xs="6" className="play-store">
                <img className="smile" src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/app-store.png" />
              </Col>
              <Col md="6" sm="6" xs="6" className="app-store">
                <img className="smile" src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/play-store.png" />
              </Col>
            </Row>
          </Col>
        </Col>
      </Col>
    </>
  );
}

