import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import Update from '../../views/store/Update';
import { updateStore, fetchStoreDetail } from '../../redux/admin-store/action';
import BackButton from '../../views/buttons/BackButton';
import { titleCase } from '../../utilities/methods';

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

    // Update Store
    const editStore = (params) => {
        dispatch(updateStore({ ...params, id }));
    };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="6">
                        <h3>
                            <BackButton path="/store" history={props.history} /> &nbsp;
                            {store.detail && store.detail.name ? titleCase(store.detail.name || '') : '---'}
                        </h3>
                    </Col>
                    <Col md="6" className="text-right">
                        <span
                            style={{ cursor: "pointer", lineHeight: '35px' }}
                            className="text-dark"
                            onClick={() => { props.history.push(`/store-detail/${id}`); }}>
                            <i className="fas fa-eye text-primary p-1" > </i>  View
                        </span>
                    </Col>
                </Row>
                <br></br>
                <Update
                    detail={store.detail}
                    options={options}
                    history={props.history}
                    loading={store.is_loading}
                    editStore={editStore.bind(null)}
                />
            </CardBody>
        </Card>
    )
}