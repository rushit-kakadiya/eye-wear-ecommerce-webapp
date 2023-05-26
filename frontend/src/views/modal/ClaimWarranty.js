import React from 'react';
import { Row, Col} from "reactstrap";

export default () =>{
    return(
        <>
        <Row className="mt-3">
            <Col md="2"></Col>
            <Col>
            <strong>Return Warrany Remaining</strong><br/>
            <span className="ml-3 badge badge-secondary badge-pill">20 Days</span>
            </Col>
        </Row><br/>
        </>
    )
}