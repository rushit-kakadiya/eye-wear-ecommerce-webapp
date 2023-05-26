import React, { useState, useEffect } from 'react';
import { Row, Col, Button,  } from 'reactstrap';
import classnames from "classnames"; 

import { s3BucketUser, s3BucketProduction } from '../../../../utilities/constants';
import { getDateFormat, titleCase, getNumberFormat } from '../../../../utilities/methods';

import '../../products.scss';

export default ({
    options,
    detail,
    loading,
    changeImage
}) => {

    const handleImageUpload = (data) =>{
        changeImage(data)
    }



    return (
        <Row className='summary'>
            <Col md="8" sm="12">
                <Col md="12" sm="12" className="summary-section">
                    <Col md="12" className='summary-section-heading'> DETAILS </Col>
                    {loading ? 'loading...' :<>
                    <Col md="12" sm="12">
                        <Row>
                            <Col md="6" className='summary-section-item-head'> Price </Col>
                            <Col md="6" className="summary-section-item-value"> { detail  && getNumberFormat(detail.frame_price) }   </Col>
                            <Col md="6" className='summary-section-item-head'> Frame Code </Col>
                            <Col md="6" className="summary-section-item-value"> { detail  && detail.frame_code }   </Col>
                            <Col md="6" className='summary-section-item-head'> Material</Col>
                            <Col md="6" className="summary-section-item-value"> { detail  && titleCase(detail.material) }   </Col>
                            <Col md="6" className='summary-section-item-head'> Model Shape  </Col>
                            <Col md="6" className="summary-section-item-value"> { detail && detail.frame_shape && detail.frame_shape.length !==0 ? detail.frame_shape.join(", ")  : "N/A" }   </Col>
                            <Col md="6" className='summary-section-item-head'> Gender  </Col>
                            <Col md="6" className="summary-section-item-value"> { detail && titleCase(detail.gender) }   </Col>
                            <Col md="6" className='summary-section-item-head'> Description </Col>
                            <Col md="6" className="summary-section-item-value"> 
                                { detail && detail.frame_description  } 
                            </Col>
                        </Row>
                    </Col> 
                    </>
                    }
                </Col>
            </Col>
            <Col md="4" sm="12" >
                <Col md="12" className="summary-section">
                    <Col md="12" className='summary-section-heading'> STORE CONTACT</Col>
                    <Col md="12">
                    {loading ? 'loading...' :
                        <Row>
                            <Col md="4" className="summary-section-item-head"> <b> Created  </b> </Col>
                            <Col md="8" className="summary-section-item-value"> {  detail && getDateFormat(detail.created_at, true, true) }  </Col>
                            <Col md="4" className="summary-section-item-head"> <b> Updated  </b> </Col>
                            <Col md="8" className="summary-section-item-value"> { detail && getDateFormat(detail.updated_at, true, true) }   </Col>
                        </Row>
                    }
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}