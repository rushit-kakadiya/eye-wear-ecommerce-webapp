import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Detail from '../../views/store/Detail';
import BackButton from '../../views/buttons/BackButton';
import { fetchStoreDetail, updateStoreActivity, updateImage } from '../../redux/admin-store/action';

import { titleCase, replaceGlobal } from '../../utilities/methods';


export default (props) => {

    const dispatch = useDispatch();
    const { store } = useSelector(state => state);

    const id = props.match.params.id;
    

    const options = {
        sortIndicator: true,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        sizePerPage: 10,
        noDataText: store.is_loading ? "Loading ..." : "There is no data to display!"
    };

    useEffect(() => {
        dispatch(fetchStoreDetail({ id }));
    }, [dispatch, id]);


    const changeStoreActivity = (status) => {
        let params = {status , id};
        dispatch(updateStoreActivity(params));
    };

    const changeImage = (data,cb) => {
        dispatch(updateImage(data,cb));
    }



    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="8">
                        <h3>
                            <BackButton path="/store" history={props.history} /> &nbsp;
                            {store.detail && store.detail.name ? titleCase(store.detail.name || '') : '---'}
                        </h3>
                    </Col>
                    <Col md="4" className="text-right">
                        <Row>
                            <Col sm={"8"}>
                                <select
                                    name="discount_category"
                                    className="form-control"
                                    onChange={(e) => changeStoreActivity(e.target.value)}
                                >
                                    <option value="" >Select Activity</option>
                                    <option value={true}>Active</option>
                                    <option value={false}>InActive</option>
                                </select>
                            </Col>
                            <Col sm={"4"}>                            
                                <span 
                                    style={{ cursor: "pointer", lineHeight : '35px' }} 
                                    className="text-dark" 
                                    onClick={() => { props.history.push(`/update-store/${id}`); }}>
                                    <i className="fas fa-edit text-primary p-1" > </i>  Edit 
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br></br>
                <Detail
                    {...props}
                    detail={store.detail}
                    options={options}
                    is_loading={store.is_loading}
                    changeImage={changeImage.bind(null)}
                />
            </CardBody>
        </Card>
    )
}