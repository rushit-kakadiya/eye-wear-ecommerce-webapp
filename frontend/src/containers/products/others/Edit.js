import React, { useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../../../views/buttons/BackButton';
import EditOthers from '../../../views/products/others/Edit';
import { fetchProductsDetail, editOthersProduct } from '../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state);
    const sku = props.match.params.sku;
    const type = props.match.params.type;

    useEffect(() => {
        if (sku && type) {
            dispatch(fetchProductsDetail({ sku, type }))
        }
    }, [dispatch, sku, type]);


    // Add user in order
    const handleEditOthers = (params) => {
        dispatch(editOthersProduct(params))
            .then(() => {
                props.history.push(`/product/others/${params.sku}`);
            });
    };


    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="6">
                        <h3>
                            <BackButton history={props.history} /> &nbsp;
                            {sku ? 'Edit Others Product' : 'Add Others Product'}
                        </h3>
                    </Col>
                </Row>
                <br></br>
                <EditOthers
                    handleEditOthers={handleEditOthers.bind(null)}
                    products={products}
                />
            </CardBody>
        </Card>
    )
}