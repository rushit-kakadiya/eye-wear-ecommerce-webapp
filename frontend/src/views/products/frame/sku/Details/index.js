import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";

import ProductDetails from './ProductDetails';
import Gallery from './Gallery';
import OtherVariants from './OtherVariants';

import BackButton from '../../../../../views/buttons/BackButton';
import { titleCase, checkRoleAccess } from '../../../../../utilities/methods';
import { roles_actions } from '../../../../../utilities/constants';


import '../../../products.scss';

export default ({
    history,
    options,
    sku,
    products,
    loading,
    handleDelete,
    type,
    userData,
    changeImage,
    getFrameSkuDetail,
    getFrameSkuGallery,
    getFrameSkuVariants
}) => {

    const [typeTab, setTypeTab] = useState("details");

    const changeAnalytics = (typeTab) => {
        setTypeTab(typeTab)
    }

    useEffect(() => {
        if (typeTab == 'details') {
            getFrameSkuDetail({ sku });
        } else if (typeTab == 'gallery') {
            getFrameSkuGallery({ sku })
        } else if (typeTab == 'variants') {
            getFrameSkuVariants({ sku })
        }
    }, [typeTab, sku]);




    return (
        <>
            <Row>
                <Col md="8">
                    <h3>
                        <BackButton path="/products-list"  /> &nbsp;
                            {products.product_detail && products.product_detail.sku_code ? products.product_detail.sku_code : '---'}
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
                                    onClick={() => { history.push(`/update-frame/${sku}`); }}>
                                    <i className="fas fa-edit text-primary p-1" > </i>  Edit
                                    </span>
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col>
                    <Nav pills className="custom-pills">
                        <NavItem className="cp">
                            <NavLink
                                className={classnames({ active: typeTab === "details" })}
                                onClick={() => changeAnalytics('details')}
                            >
                                Product Details
                            </NavLink>
                        </NavItem>
                        <NavItem className="cp">
                            <NavLink
                                className={classnames({ active: typeTab === "gallery" })}
                                onClick={() => changeAnalytics('gallery')}
                            >
                                Gallery
                            </NavLink>
                        </NavItem>
                        <NavItem className="cp">
                            <NavLink
                                className={classnames({ active: typeTab === "variants" })}
                                onClick={() => changeAnalytics('variants')}
                            >
                                Other Variants
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabContent activeTab={typeTab} className="mt-3">
                        <TabPane tabId="details">
                            <ProductDetails typeTab={typeTab} detail={products.product_detail} />
                        </TabPane>
                        <TabPane tabId="gallery">
                            <Gallery typeTab={typeTab} />
                        </TabPane>
                        <TabPane tabId="variants">
                            <OtherVariants typeTab={typeTab}  products={products} options={options}/>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </>
    )
}