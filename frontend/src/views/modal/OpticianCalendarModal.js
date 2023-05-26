import React from "react";
import { Col, Row, ModalBody } from "reactstrap";
import { getDateFormat, formatDate } from '../../utilities/methods';

export default ({viewEvent}) =>{
  return(
    <ModalBody>
         <Row className="ml-1">
             <Col sm="12">
             <b>Delivery Address</b>
             </Col>
             <Col>
             { viewEvent.address_details || '-------' }
             </Col>
         </Row>
         <Row className="ml-1 mt-2">
             <Col sm="12">
             <b>HTO Schedule</b>
             </Col>
             <Col>
             {`${getDateFormat(viewEvent.start, false, false)+' , '+ viewEvent.slot_start_time}`}
             </Col>
         </Row>
         <Row className="ml-1 mt-2">
             <Col sm="12">
              <b>Optician</b>
             </Col>
             <Col className="mt-2">
              {viewEvent.name || viewEvent.title}
             </Col>
         </Row>
         <hr/>
         <Row className="ml-1 mt-2">
             <Col sm="12">
             <i className="fa fa-user" aria-hidden="true"></i>
             <b className="ml-2">Customer Profile</b>
             </Col>
             <Col sm="12" className="mt-2">
             <b>Name</b>
             </Col>
             <Col>
              {viewEvent.username}
             </Col>
             <Col sm="12" className="mt-2">
             <b>Phone Number</b>
             </Col>
             <Col sm="12">
              <b>{'0'+viewEvent.mobile || '--------'}</b>
             </Col>
         </Row>
    </ModalBody>
  )
}