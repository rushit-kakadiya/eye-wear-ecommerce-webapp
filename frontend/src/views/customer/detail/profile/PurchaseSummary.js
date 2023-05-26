import React from 'react';
import { Row, Col } from "reactstrap";
import { getNumberFormat} from '../../../../utilities/methods'

export default () =>{
    return(
       <div className="p-3">
            <span className="text-muted"><h4>PURCHASE SUMMARY</h4></span>
            <Row>
                <Col sm={4} className="text-dark font-bold">Last Order</Col>
                <Col sm={4} className="text-dark font-bold">Total Spent</Col>
                <Col sm={4} className="text-dark font-bold">Average Spent</Col>
            </Row>
            <Row>
                <Col sm={4}>01 July 2020</Col>
                <Col sm={4}>{getNumberFormat(2002000)}</Col>
                <Col sm={4}>{getNumberFormat(1000)}</Col>
            </Row>
      </div> 
    )
}