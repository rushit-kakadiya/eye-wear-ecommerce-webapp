import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Sku from '../../../../views/products/frame/sku/Add';
import { createFrameSku, fetchFrameNames, fetchFrameColors, checkFrameSizeAvialability  } from '../../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();


    const { products } = useSelector(state => state);


    useEffect(() => {
        dispatch(fetchFrameNames({page : 'all'}));
        dispatch(fetchFrameColors({page : 'all'}));
    }, []);



    const addFrameSku = (params,cb) => {
        dispatch(createFrameSku(params,cb));
    };


    const frameSizeAvialability = (params,cb) => {
        dispatch(checkFrameSizeAvialability(params,cb));
    };

    return (
        <Card>
            <CardBody>
            <Row>
                <Col md="6">
                    <h3>
                        Add New Frame
                    </h3>
                </Col>
            </Row>
            <br></br>
            <Sku
                history={props.history}
                addFrameSku={addFrameSku.bind(null)}
                frameSizeAvialability={frameSizeAvialability.bind(null)}
                loading={products.is_loading}
                frameName={products.frameNameList}
                frameVariants={products.frameColorList}
                frameSizes={products.frameSizes}
            />
            </CardBody>
        </Card>
    )
}