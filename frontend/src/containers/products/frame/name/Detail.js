import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Detail from '../../../../views/products/frame/name/Detail';
import BackButton from '../../../../views/buttons/BackButton';
import { fetchFrameNameDetail } from '../../../../redux/products/action';

import { titleCase, replaceGlobal } from '../../../../utilities/methods';


export default (props) => {

    const dispatch = useDispatch();
    const { products } = useSelector(state => state);

    const id = props.match.params.id;
    

    const options = {
        sortIndicator: true,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        sizePerPage: 10,
        noDataText: products.is_loading ? "Loading ..." : "There is no data to display!"
    };

    useEffect(() => {
        dispatch(fetchFrameNameDetail({ id }));
    }, [dispatch, id]);




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
                            style={{ cursor: "pointer", lineHeight : '35px' }} 
                            className="text-dark" 
                            onClick={() => { }}>
                            <i className="fas fa-trash text-danger p-1" > </i>  Delete 
                        </span> &nbsp;      &nbsp;      &nbsp;                        
                        <span 
                            style={{ cursor: "pointer", lineHeight : '35px' }} 
                            className="text-dark" 
                            onClick={() => { props.history.push(`/update-frame-name/${id}`); }}>
                            <i className="fas fa-edit text-primary p-1" > </i>  Edit 
                        </span>
                    </Col>
                </Row>
                <br></br>
                <Detail
                    {...props}
                    detail={products.detail}
                    options={options}
                    is_loading={products.is_loading}
                />
            </CardBody>
        </Card>
    )
}