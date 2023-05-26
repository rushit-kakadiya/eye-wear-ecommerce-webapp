import React, {useEffect} from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import BackButton from '../../../views/buttons/BackButton';
import AddContactLens from '../../../views/products/contact-lens/Add';
import EditContactLens from '../../../views/products/contact-lens/Edit';
import { addContactLens, fetchProductsDetail, editContactLens } from '../../../redux/products/action';

export default (props) => {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state);
    const sku = props.match.params.sku;

    useEffect(() => {
        if(sku){
            dispatch(fetchProductsDetail({ sku, type: 'contact-lens' }));
        }
    }, [dispatch, sku]);


    // Add Contact Lens
    const handleAddContactLens = (params) => {
        dispatch(addContactLens(params))
        .then(() => {
            props.history.push('/products-list');
        });
    };

    // Edit Contact Lens
    const handleEditContactLens = (params) => {
        dispatch(editContactLens(params))
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
                            <BackButton  history={props.history} /> &nbsp;
                            {sku ? 'Edit Contact Lens' : 'Add New Contact Lens'}
                        </h3>
                    </Col>
                </Row>
                <br></br>
                {sku ?
                    <EditContactLens
                        history={props.history}
                        handleEditContactLens={handleEditContactLens.bind(null)}
                        products={products}
                    />
                :
                    <AddContactLens
                        history={props.history}
                        handleAddContactLens={handleAddContactLens.bind(null)}
                        loading={products.is_loading}
                    />
                }
            </CardBody>
        </Card>
    )
}