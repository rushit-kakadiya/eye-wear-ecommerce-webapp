import React from "react";
import {
  Col,
  Row,
  FormGroup,
  ModalBody,
} from "reactstrap";

export default ({ notes = ''}) => {
  return (
      <>
        <ModalBody>
          <Row>
            <Col className="text-left">
                <FormGroup>
                    <span>{notes}</span>
                </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        </>
  );
};


