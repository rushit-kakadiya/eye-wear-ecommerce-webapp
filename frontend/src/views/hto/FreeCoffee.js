import React from 'react';
import { Row, Col } from "reactstrap";
import {titleCase, getNumberFormat} from '../../utilities/methods';

export default ({detail}) => {
    return(
        <Row style={{border:'1px solid #ccc'}} className="p-3 mt-3">
            <Col md="12" className="text-muted"><h5>FREE COFFEE</h5></Col>
            <Col md="11">
                <Row style={{border:'1px solid #ccc'}} className="m-1 p-3">
                    <Col sm="8"><i className="fa fa-coffee" aria-hidden="true"></i> <strong>{titleCase(detail.notes || 'Free Coffee')}</strong></Col>
                    <Col sm="2"><strong>{getNumberFormat(0)}</strong></Col>
                </Row>
            </Col>
            </Row>
    )
};