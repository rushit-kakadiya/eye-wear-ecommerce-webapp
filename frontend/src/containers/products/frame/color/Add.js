import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Add from '../../../../views/products/frame/color/Add';
import { createFrameColor } from '../../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();


    const { products } = useSelector(state => state);


    const addFrameColor = (params,cb) => {
        dispatch(createFrameColor(params,cb));
    };

    return (
        <Card>
            <CardBody>
            <Row>
                <Col md="6">
                    <h3>
                        Add New Frame Color
                    </h3>
                </Col>
            </Row>
            <br></br>
            <Add
                history={props.history}
                addFrameColor={addFrameColor.bind(null)}
                loading={products.is_loading}
            />
            </CardBody>
        </Card>
    )
}