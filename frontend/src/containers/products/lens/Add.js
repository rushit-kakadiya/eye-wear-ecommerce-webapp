import React, {useEffect} from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../../../views/buttons/BackButton';
import AddLens from '../../../views/products/lens/Add';
import EditLens from '../../../views/products/lens/Edit';
import { addLens, fetchProductsDetail, editLens } from '../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state);
    const sku = props.match.params.sku;

    useEffect(() => {
        if(sku){
            dispatch(fetchProductsDetail({ sku, type: 'lens' }));
        }
    }, [dispatch, sku]);


    // Add user in order
    const handleAddLens = (params) => {
        dispatch(addLens(params))
        .then(() => {
            props.history.push('/products-list');
        });
    };

    // Add user in order
    const handleEditLens = (params) => {
        dispatch(editLens(params))
        .then(() => {
            props.history.push('/products-list');
        });
    };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="6">
                        <h3>
                            <BackButton history={props.history} /> &nbsp;
                            {sku ? 'Edit Lens' : 'Add New Lens'}
                        </h3>
                    </Col>
                </Row>
                <br></br>
                {sku ?
                    <EditLens
                        history={props.history}
                        handleEditLens={handleEditLens.bind(null)}
                        products={products}
                    />
                :
                    <AddLens
                        history={props.history}
                        handleAddLens={handleAddLens.bind(null)}
                        loading={products.is_loading}
                    />
                }
            </CardBody>
        </Card>
    )
}