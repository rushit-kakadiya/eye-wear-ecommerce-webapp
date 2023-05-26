/*global google*/
import React from "react";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

export default ({ areaAlertModal, toggleAreaAlertMap }) => {


  return (
    <div>
      <Modal isOpen={areaAlertModal} toggle={() => { }} className="alert-modal">
        <ModalBody>
          <Col md="12" className="areaalert-box">
            <img className="areaalert-banner" src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/marker-location.png" />
            <div className="areaalert-box-head">
              <h4>
                Oops! You Are Outside Our <br></br>
                Home Try-On Coverage Area
              </h4>
              <span className="seeyou-soon"> Currently home try-on available in </span>

              <Row className="location-avail">
                <Col md="6" sm="6" xs="6" >
                  <ul>
                    <li>Jabodetabek</li>
                    <li>Surabaya</li>
                    <li>Bandung</li>
                  </ul>
                </Col>
                <Col md="6" sm="6" xs="6" >
                  <ul>
                    <li>Medan</li>
                    <li>Bali</li>
                    <li>More Soon..</li>
                  </ul>
                </Col>
              </Row>
            </div>
            <Row className="help-instruction">
              <Col md="12" className="tanc">
                <span>No worries!</span>
                <p>
                  You can still have a try-on for our frames with refundable deposits!
                </p>
              </Col>
              <Col md="12" className="tanc">
                <span>*T&C apply</span>
                <p>
                  (Frames should be returned in the same physical condition, otherwise, your deposit will be forfeited)
                </p>
              </Col>
              <Col md="12" sm="12" xs="12" className="chat-whtsapp">
                <a href="https://api.whatsapp.com/send/?phone=628170104888&text=Hi+EYEWEAR%21+Saya+tertarik+dengan+layanan+Home+Try-On.&app_absent=1" target="_blank">
                  <img src="https://eyewear-user.s3.ap-southeast-1.amazonaws.com/hto-web/wa-icon.svg" /> &nbsp;&nbsp;&nbsp;CHAT WITH OUR CS VIA WHATSAPP
                </a>
              </Col>
              <Col md="12" sm="12" xs="12" className="change-address">
                <a onClick={toggleAreaAlertMap} >CHANGE ADDRESS</a>
              </Col>
            </Row>
          </Col>
        </ModalBody>
      </Modal>
    </div>
  );
}

