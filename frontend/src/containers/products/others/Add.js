import React, {useEffect} from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../../../views/buttons/BackButton';
import AddOthers from '../../../views/products/others/Add';
import { addOthers } from '../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state);

    
    // Add others in products
    const handleAddOthers = (params) => {
        dispatch(addOthers(params))
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
                            <BackButton path="/products-list" history={props.history} /> &nbsp; Add New Others
                        </h3>
                    </Col>
                </Row>
                <br></br>
                <AddOthers
                    history={props.history}
                    handleAddOthers={handleAddOthers.bind(null)}
                    loading={products.is_loading}
                />
            </CardBody>
        </Card>
    )
}