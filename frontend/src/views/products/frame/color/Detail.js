import React, { useState, useEffect } from 'react';
import { Row, Col, Button, } from 'reactstrap';
import classnames from "classnames";
import { s3BucketUser, s3BucketProduction } from '../../../../utilities/constants';
import { getDateFormat } from '../../../../utilities/methods';


import '../../products.scss';

export default ({
    options,
    detail,
    loading,
    changeImage
}) => {

    const handleImageUpload = (data) => {
        changeImage(data)
    }


    return (
        <Row className='summary'>
            <Col md="8" sm="12">
                <Col md="12" sm="12" className="summary-section">
                    <Col md="12" className='summary-section-heading'> DETAILS </Col>
                    {loading ? 'loading...' : <>
                        <Col md="12" sm="12">
                            <Row>
                                <Col md="6" className='summary-section-item-head'> Frame Color Code  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.variant_code}   </Col>
                                <Col md="6" className='summary-section-item-head'> Frame Color Name  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.variant_name}   </Col>
                                <Col md="6" className='summary-section-item-head'> Frame Group  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.variant_color_group}   </Col>
                                <Col md={"12"} className='summary-section-image-uploader'>
                                    <Row>
                                        <Col md={"8"} className='summary-section-image-uploader-left'>
                                            <Col md="12" className=''> Color Icon </Col>
                                            <Col md="12" className=""> 
                                                <input
                                                    type="file"
                                                    name="icon_image_key"
                                                    id="icon_image_key"
                                                    accept="image/*"
                                                    onChange={(event)=>{handleImageUpload({file : event.target.files[0], type : "icon_image_key", id : detail.id}, event.target.value = '')}}
                                                    hidden
                                                />
                                                <Button className="btn mt-2" disabled={loading} color="primary" size="sm" onClick={()=>document.getElementById('icon_image_key').click()} disabled={loading}>
                                                    Browse
                                                </Button>
                                                <span className="help-block"> Format: .jpg, ,jpeg, .png, .webp </span>
                                            </Col>
                                        </Col>
                                        <Col md={"4"} className='summary-section-image-uploader-right text-right'>
                                            <a href={ detail && detail.icon_image_key ? `${s3BucketProduction + detail.icon_image_key}` : "" }  target="_blank"> 
                                                <img style={{ width: '25px', borderRadius : '0px' }} src={ detail && detail.icon_image_key  ? `${s3BucketProduction + detail.icon_image_key}` : `${s3BucketProduction + "variant-icon/icon_placeholder.png"}`} />
                                            </a>     
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </>
                    }
                </Col>
            </Col>
            <Col md="4" sm="12" >
                <Col md="12" className="summary-section">
                    <Col md="12" className='summary-section-heading'> PRODUCT HISTORY</Col>
                    <Col md="12">
                        {loading ? 'loading...' :
                            <Row>
                                <Col md="4" className="summary-section-item-head"> <b> Created </b> </Col>
                                <Col md="8" className="summary-section-item-value"> {detail && getDateFormat(detail.created_at, true, true)}  </Col>
                                <Col md="4" className="summary-section-item-head"> <b> Updated </b> </Col>
                                <Col md="8" className="summary-section-item-value"> {detail && getDateFormat(detail.updated_at, true, true)}   </Col>
                            </Row>
                        }
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}