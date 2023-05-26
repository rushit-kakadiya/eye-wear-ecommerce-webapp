import React, { useEffect } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import LensDetail from '../../views/products/lens/Detail';
import ClipOnDetail from '../products/clip-on/Detail';
import OthersDetail from '../../views/products/others/Detail';
import { fetchProductsDetail, manageProduct } from '../../redux/products/action';
import ContactLensDetail from '../../views/products/contact-lens/Detail';
import BackButton from '../../views/buttons/BackButton';
import { titleCase, checkRoleAccess } from '../../utilities/methods';
import { roles_actions } from '../../utilities/constants';


export default (props) => {
    const dispatch = useDispatch();
    const { products, user } = useSelector(state => state);
    const sku = props.match.params.sku;
    const type = props.match.params.type;
    const userData = user.data;

    useEffect(() => {
        dispatch(fetchProductsDetail({ sku, type }));
    }, [dispatch, sku, type]);

    //Handle Delete Product
    const handleDelete = (status) => {
        if (status !== "") {
            dispatch(manageProduct({ sku, type, status }))
        }
    }

    const renderView = () => {
        if (type === 'lens') {
            return <LensDetail
                {...props}
                detail={products.product_detail}
                is_loading={products.is_loading}
                type={type}
            />
        } else if (type === 'clip-on') {
            return <ClipOnDetail
                {...props}
                detail={products.product_detail}
                is_loading={products.is_loading}
            />
        } else if (type === 'others') {
            return <OthersDetail
                {...props}
                detail={products.product_detail}
                is_loading={products.is_loading}
            />
        } else if (type === 'contact-lens') {
            return <ContactLensDetail
                {...props}
                detail={products.product_detail}
                is_loading={products.is_loading}
            />
        }
    }

    const handleRedirection = () => {
        if (type === 'lens') {
            props.history.push(`/edit-lens/${sku}`)
        }
        else if (type === 'clip-on') {
            props.history.push(`/edit-clip-on/${sku}`)
        }
        else if (type === 'others') {
            props.history.push(`/edit-others/${sku}`)
        }
        else if (type === 'contact-lens') {
            props.history.push(`/edit-contact-lens/${sku}`)
        }
    }

    if (products.is_loading) return (<div style={{ textAlign: 'center' }} className="mt-5"><h5>loading ...</h5></div>)
    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md="8">
                        <h3>
                            <BackButton path="/products-list" history={props.history} data={type}/> &nbsp;
                            {products.product_detail && products.product_detail.name ? titleCase(products.product_detail.name || '') : '---'}
                        </h3>
                    </Col>
                    <Col md="4" className="text-right">
                        {checkRoleAccess(userData.accessRole, userData.permissions, type, roles_actions.is_update) &&
                            <Row>
                                <Col sm={"8"}>
                                    <select
                                        name="discount_category"
                                        className="form-control"
                                        onChange={(e) => handleDelete(e.target.value)}
                                    >
                                        <option value="" >Select Activity</option>
                                        <option value={1}>Active</option>
                                        <option value={0}>InActive</option>
                                    </select>
                                </Col>
                                <Col sm={"4"}>
                                    <span
                                        style={{ cursor: "pointer", lineHeight: '35px' }}
                                        className="text-dark"
                                        onClick={() => handleRedirection()}>
                                        <i className="fas fa-edit text-primary p-1" > </i>  Edit
                                    </span>
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
                <br></br>
                {renderView()}
            </CardBody>
        </Card>
    )
}