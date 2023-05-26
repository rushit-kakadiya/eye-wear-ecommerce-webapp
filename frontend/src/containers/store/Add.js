import React, { useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Add from '../../views/store/Add';
import { createStore } from '../../redux/admin-store/action';

export default (props) => {
    const dispatch = useDispatch();


    const { store } = useSelector(state => state);

    // Add user in order
    const addStore = (params,cb) => {
        dispatch(createStore(params,cb));
    };

    return (
        <Card>
            <CardBody>
            <Row>
                <Col md="6">
                    <h3>
                        Create Store
                    </h3>
                </Col>
            </Row>
            <br></br>
            <Add
                history={props.history}
                addStore={addStore.bind(null)}
                loading={store.is_loading}
            />
            </CardBody>
        </Card>
    )
}