import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import Update from '../../../../views/products/frame/sku/Update';
import BackButton from '../../../../views/buttons/BackButton';

import { updateFrameSku, fetchFrameSkuDetail } from '../../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();

    const sku = props.match.params.sku;
    const { products } = useSelector(state => state);


    useEffect(() => {
        dispatch(fetchFrameSkuDetail({ sku }));
    }, [dispatch, sku]);

    const editFrameSku = (params, cb) => {
        dispatch(updateFrameSku(params, cb));
    };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="6">
                        <h3>
                            <BackButton  history={props.history}  /> &nbsp;
                            Edit Frame
                        </h3>
                    </Col>
                    <Col md="6" className="text-right">
                        <span
                            style={{ cursor: "pointer", lineHeight: '35px' }}
                            className="text-dark"
                            onClick={() => { props.history.push(`/frame/${sku}`); }}>
                            <i className="fas fa-eye text-primary p-1" > </i>  View
                        </span>
                    </Col>
                </Row>
                <br></br>
                <Update
                    detail={products.product_detail}
                    history={props.history}
                    editFrameSku={editFrameSku.bind(null)}
                    loading={products.is_loading}
                />
            </CardBody>
        </Card>
    )
}