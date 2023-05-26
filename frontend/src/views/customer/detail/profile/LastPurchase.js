import React from "react";
import { Row, Col } from "reactstrap";

export default () =>{
    return(
        <div className="p-3">
            <span className="text-muted"><h4>LAST PURCHASE</h4></span><br/>
            <div  style={{border:'2px solid #ccc', width:'100%'}} className="p-3">
            <Row>
                <Col sm={8}>
                    Puchase ID
                </Col>
                <Col sm={4} className="text-primary">
                   #23666
                </Col>
            </Row>
            <Row>
                <Col sm={8}>
                    Puchase Date
                </Col>
                <Col sm={4}>
                   2 Jan 2020, 1.30
                </Col>
            </Row>
            <br/>
            <Row>
                <Col sm={8}>
                    Status
                </Col>
                <Col >
                  <span className="border border-muted p-2 text-primary"> Delivered</span>
                </Col>
            </Row>
            <hr/>
        </div>
        </div>
    )
}