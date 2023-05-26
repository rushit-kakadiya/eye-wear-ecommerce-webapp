import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Detail from '../../../../views/products/frame/sku/Details/';
import { updateImage, fetchFrameSkuDetail, fetchFrameSkuGallery, fetchFrameSkuVariants, manageProduct } from '../../../../redux/products/action';



export default (props) => {

    const dispatch = useDispatch();
    const { products, user } = useSelector(state => state);

    const sku = props.match.params.sku;
    const type = 'frame';
    const userData = user.data;

    const options = {
        sortIndicator: true,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
        clearSearch: true,
        sizePerPage: 10,
        noDataText: products.is_loading ? "Loading ..." : "There is no data to display!"
    };


    //Handle Delete Frame
    const handleDelete = (status) => {
        if (status != "") {
            dispatch(manageProduct({ sku, type, status }))
        }
    }

    const changeImage = (sku) => {
        dispatch(updateImage(sku));
    }

    const getFrameSkuDetail = (sku) => {
        dispatch(fetchFrameSkuDetail( sku ));
    }

    const getFrameSkuGallery = (sku) => {
        dispatch(fetchFrameSkuGallery(sku));
    }

    const getFrameSkuVariants = (sku) => {
        dispatch(fetchFrameSkuVariants( sku ));
    }

    return (
        <Card>
            <CardBody>
                <Detail
                    {...props}
                    options={options}
                    sku={sku}
                    type={type}
                    userData={userData}
                    products={products}
                    options={options}
                    is_loading={products.is_loading}
                    changeImage={changeImage.bind(null)}
                    handleDelete={handleDelete.bind(null)}
                    getFrameSkuDetail={getFrameSkuDetail.bind(null)}
                    getFrameSkuGallery={getFrameSkuGallery.bind(null)}
                    getFrameSkuVariants={getFrameSkuVariants.bind(null)}
                />
            </CardBody>
        </Card>
    )
}