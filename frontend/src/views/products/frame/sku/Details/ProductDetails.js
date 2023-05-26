import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { getDateFormat } from '../../../../../utilities/methods';

export default ({
    options,
    detail,
    loading,
    changeImage
}) => {


    const sizeName = {
        'SZ01' : 'Narrow',
        'SZ02' : 'Medium',
        'SZ03' : 'Wide',
        'SZ04' : 'Extra Wide',
    }


    return (
        <Row className='summary'>
            <Col md="8" sm="12">
                <Col md="12" sm="12" className="summary-section">
                    <Col md="12" className='summary-section-heading'> DETAILS </Col>
                    {loading ? 'loading...' : <>
                        <Col md="12" sm="12">
                            <Row>
                                <Col md="6" className='summary-section-item-head'> Name  </Col>
                                <Col md="6" className="summary-section-item-value">  {detail && detail.frame_name}   </Col>
                                <Col md="6" className='summary-section-item-head'> Price  </Col>
                                <Col md="6" className="summary-section-item-value"> Rp. {detail && detail.retail_price}   </Col>
                                <Col md="6" className='summary-section-item-head'> Color </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.variant_name}   </Col>
                                <Col md="6" className='summary-section-item-head'> Size </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.size_code ? sizeName[detail.size_code] : "N/A"}   </Col>
                                <Col md="6" className='summary-section-item-head'> Material </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.material}   </Col>
                                <Col md="6" className='summary-section-item-head'> Model Shape  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.frame_shape}   </Col>
                                <Col md="6" className='summary-section-item-head'> Gender </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.gender}   </Col>
                                <Col md="6" className='summary-section-item-head'> Is Sunwear </Col>
                                <Col md="6" className="summary-section-item-value">  { detail && detail.is_sunwear ? 'Yes'  : 'No' }  </Col>
                                <Col md="6" className='summary-section-item-head'> Show on App </Col>
                                <Col md="6" className="summary-section-item-value">  { detail && detail.show_on_app ? 'Yes'  : 'No' }  </Col>
                                <Col md="6" className='summary-section-item-head'> Status </Col>
                                <Col md="6" className="summary-section-item-value">
                                    { detail && detail.status ? (<span className="badge badge-success">Active</span>) : (<span className="badge badge-danger">InActive</span>)}
                                </Col>
                                <Col md="6" className='summary-section-item-head'> Description  </Col>
                                <Col md="6" className="summary-section-item-value"> {detail && detail.description}   </Col>
                            </Row>
                        </Col>
                        <Col md="12" className="frame-size-specification-holder">
                            <table className="frame-size-specification">
                                <tr>
                                    <th>Width</th>
                                    <th>Bridge</th>
                                    <th>Temple Length</th>
                                    <th>Frame Width</th>
                                </tr>
                                <tr>
                                    <td> {detail && detail.lense_width} </td>
                                    <td> {detail && detail.bridge} </td>
                                    <td> {detail && detail.temple_length} </td>
                                    <td> {detail && detail.front_width} </td>
                                </tr>
                            </table>
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