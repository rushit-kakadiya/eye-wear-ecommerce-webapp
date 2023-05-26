import React, {useEffect} from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../../../views/buttons/BackButton';
import AddClipOn from '../../../views/products/clip-on/Add';
import EditClipOn from '../../../views/products/clip-on/Edit';
import { addClipOn, fetchProductsDetail, editClipOn } from '../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();
    const { products, frames } = useSelector(state => state);
    const sku = props.match.params.sku;
    const type = props.match.params.type;

    useEffect(() => {
        if(sku && type){
            dispatch(fetchProductsDetail({ sku, type }));
        }
    }, [dispatch, sku, type]);


    // Add user in order
    const handleAddClipOn = (params) => {
        dispatch(addClipOn(params))
        .then(() => {
            props.history.push(`/clip-on/${params.sku_code}`);
        });
    };

    // Add user in order
    const handleEditClipOn = (params) => {
        dispatch(editClipOn(params))
        .then(() => {
            props.history.push(`/clip-on/${params.sku_code}`);
        });
    };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="6">
                        <h3>
                            <BackButton  history={props.history} /> &nbsp;
                            {sku  ? `Edit ${products.product_detail.name}` : 'Add New Clip-On'}
                        </h3>
                    </Col>
                </Row>
                <br></br>
                {sku  ?
                    <EditClipOn
                        history={props.history}
                        handleEditClipOn={handleEditClipOn.bind(null)}
                        products={products}
                    />
                :
                    <AddClipOn
                        history={props.history}
                        handleAddClipOn={handleAddClipOn.bind(null)}
                        loading={products.is_loading}
                        frames={frames}
                    />
                }
            </CardBody>
        </Card>
    )
}