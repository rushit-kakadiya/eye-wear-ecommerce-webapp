import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Add from '../../../../views/products/frame/name/Add';
import { createFrameName } from '../../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();


    const { products } = useSelector(state => state);

    // Add user in order
    const addFrameName = (params,cb) => {
        dispatch(createFrameName(params,cb));
    };

    return (
        <Card>
            <CardBody>
            <Row>
                <Col md="6">
                    <h3>
                        Add New Frame Name
                    </h3>
                </Col>
            </Row>
            <br></br>
            <Add
                history={props.history}
                addFrameName={addFrameName.bind(null)}
                loading={products.is_loading}
            />
            </CardBody>
        </Card>
    )
}