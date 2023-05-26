import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Update from '../../../../views/products/frame/name/Update';
import BackButton from '../../../../views/buttons/BackButton';
import { updateFrameName, fetchFrameNameDetail } from '../../../../redux/products/action';


import { titleCase, replaceGlobal } from '../../../../utilities/methods';

export default (props) => {
    const dispatch = useDispatch();

    const id = props.match.params.id;


    const { products } = useSelector(state => state);



    useEffect(() => {
        dispatch(fetchFrameNameDetail({ id }));
    }, [dispatch, id]);


    const editFrameName = (params, cb) => {
        dispatch(updateFrameName(params, cb));
    };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="6">
                        <h3>
                            <BackButton path="/products" history={props.history} /> &nbsp;
                            {products.detail && products.detail.frame_code ? products.detail.frame_code : '---'}
                        </h3>
                    </Col>
                    <Col md="6" className="text-right">
                        <span
                            style={{ cursor: "pointer", lineHeight: '35px' }}
                            className="text-dark"
                            onClick={() => { props.history.push(`/frame-name/${id}`); }}>
                            <i className="fas fa-eye text-primary p-1" > </i>  View
                        </span>
                    </Col>
                </Row>
                <br></br>
                <Update
                    detail={products.detail}
                    history={props.history}
                    editFrameName={editFrameName.bind(null)}
                    loading={products.is_loading}
                />
            </CardBody>
        </Card>
    )
}