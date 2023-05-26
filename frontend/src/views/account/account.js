/*global google*/
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from "reactstrap";


import ResetPassword from "./reset-password";
import Profile from "./profile";



export default (props) => {


    const { resetPassword, resetTimezone, time_zone, loading } = props

    return (
        <>
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                            <Profile resetTimezone={resetTimezone} loading={loading} time_zone={time_zone} />
                        </CardBody>
                    </Card>
                </Col>                
                <Col md="12">
                    <Card>
                        <CardBody>
                            <ResetPassword resetPassword={resetPassword} loading={loading} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

