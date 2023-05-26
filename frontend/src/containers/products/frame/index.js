import React, { useState, useEffect } from 'react';
import classnames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Input, Button, Card, CardBody } from 'reactstrap';
import FrameNameList from './name/List';
import ColorNameList from './color/List';


export default (props) => {

    const [type, setType] = useState("summary");
    
    const changeAnalytics = (type) => {
        setType(type)
    }

    return (
        <>
            <Card>
                <CardBody>
                    <Row>
                        <Col md="6">
                            <h3>
                                Frame
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Nav pills className="custom-pills">
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: type === "summary" })}
                                        onClick={() => changeAnalytics('summary')}
                                    >
                                        Frame Name
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: type === "appointments" })}
                                        onClick={() => changeAnalytics('appointments')}
                                    >
                                        Frame Color                                  
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <TabContent activeTab={type} className="mt-3">
                                <TabPane tabId="summary">
                                   <FrameNameList {...props} type={type}/>
                                </TabPane>
                                <TabPane tabId="appointments">
                                    <ColorNameList {...props} type={type}/>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}