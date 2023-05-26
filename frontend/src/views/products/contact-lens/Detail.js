import React from 'react';
import { Row, Col } from 'reactstrap';
import { getDateFormat, titleCase, getNumberFormat } from '../../../utilities/methods';


import '../products.scss';

export default ({
    detail,
    loading
}) => {
    return (
        <Row className='summary'>
            <Col md="8" sm="12">
                <Col md="12" sm="12" className="summary-section">
                    <Col md="12" className='summary-section-heading'> DETAILS </Col>
                    {loading ? 'loading...' : <>
                        <Col md="12" sm="12">
                            <Row>
                                <Col md="6" className='summary-section-item-head'> Contact Lens SKU  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.sku}   </Col>
                                <Col md="6" className='summary-section-item-head'> Brand  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.brand}   </Col>
                                <Col md="6" className='summary-section-item-head'> Price  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && getNumberFormat(detail.price)}   </Col>
                                <Col md="6" className='summary-section-item-head'> Description  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail ? detail.description : '--'}   </Col>
                                <Col md="6" className='summary-section-item-head'> Status  </Col>
                                <Col md="6" className="summary-section-item-value">  { detail && detail.status ? (<span className="badge badge-success">Active</span>) : (<span className="badge badge-danger">InActive</span>)}  </Col>
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
                                <Col md="4" className="summary-section-item-head"> <b> Created On </b> </Col>
                                <Col md="8" className="summary-section-item-value"> {detail && getDateFormat(detail.created_at, true, true)}  </Col>
                                <Col md="4" className="summary-section-item-head"> <b> Updated On </b> </Col>
                                <Col md="8" className="summary-section-item-value"> {detail && getDateFormat(detail.updated_at, true, true)}   </Col>
                                <Col md="4" className="summary-section-item-head"> <b> Created By </b> </Col>
                                <Col md="8" className="summary-section-item-value"> {detail && titleCase(detail.created_by || '----')}   </Col>
                                <Col md="4" className="summary-section-item-head"> <b> Updated By </b> </Col>
                                <Col md="8" className="summary-section-item-value"> {detail && titleCase(detail.updated_by || '----')}   </Col>
                            </Row>
                        }
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}