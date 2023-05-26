import React, { useState, useEffect } from 'react';
import { Row, Col, Button, } from 'reactstrap';
import classnames from "classnames";

import './store.scss';
import { s3BucketUser, s3BucketProduction } from '../../utilities/constants';

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
          <Col md="12" className='summary-section-heading'> STORE PROFILE </Col>
          {loading ? 'loading...' : <>
            <Col md="12" sm="12">
              <Row>
                <Col md="6" className='summary-section-item-head'> Store ID  </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.id}   </Col>
                {/* <Col md="6" className='summary-section-item-head'> Store No  </Col>
                            <Col md="6" className="summary-section-item-value"> { detail  && detail.store_no }   </Col> */}
                <Col md="6" className='summary-section-item-head'> Cafe  </Col>
                <Col md="6" className="summary-section-item-value">
                  {detail && detail.is_cafe ? "Yes" : "No"}
                </Col>
                <Col md="6" className='summary-section-item-head'> Can Access other Store Stock  </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.can_access_other_store_stocks ? "Yes" : "No"}   </Col>
                <Col md="6" className='summary-section-item-head'> Sales Tax  </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.sales_tax}   </Col>
                <Col md="6" className='summary-section-item-head'> Ecommerce  </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.ecommerce ? "Yes" : "No"}   </Col>
                <Col md="6" className='summary-section-item-head'> Status </Col>
                <Col md="6" className="summary-section-item-value">
                  {detail && detail.active ? (<span className="badge badge-success">Active</span>) : (<span className="badge badge-danger">InActive</span>)}
                </Col>
                <Col md={"12"} className='summary-section-image-uploader'>
                  <Row>
                    <Col md={"8"} className='summary-section-image-uploader-left'>
                      <Col md="12" className=''> Map Image </Col>
                      <Col md="12" className="">
                        <input
                          type="file"
                          name="map_image"
                          id="map_image"
                          accept="image/*"
                          onChange={(event) => { handleImageUpload({ file: event.target.files[0], type: "map_image", id: detail.id }, event.target.value = '') }}
                          hidden
                        />
                        <Button className="btn mt-2" disabled={loading} color="primary" size="sm" onClick={() => document.getElementById('map_image').click()} disabled={loading}>
                          Browse
                        </Button>
                        <span className="help-block"> Format: .jpg, ,jpeg, .png, .webp </span>
                      </Col>
                    </Col>
                    <Col md={"4"} className='summary-section-image-uploader-right text-right'>
                      <a href={detail && detail.map_image_key} target="_blank">
                        <img style={{ width: '100px', borderRadius: '5px' }} src={detail && detail.map_image_key ? `${s3BucketProduction + detail.map_image_key}` : `${s3BucketProduction + "store/map_PLACEHOLDER.png"}`} />
                      </a>
                    </Col>
                  </Row>
                </Col>
                <Col md={"12"} className='summary-section-image-uploader'>
                  <Row>
                    <Col md={"8"} className='summary-section-image-uploader-left'>
                      <Col md="12" className=''> Store Image </Col>
                      <Col md="12" className="">
                        <input
                          type="file"
                          name="store_image"
                          id="store_image"
                          accept="image/*"
                          onChange={(event) => handleImageUpload({ file: event.target.files[0], type: "store_image", id: detail.id })}
                          hidden
                        />
                        <Button className="btn mt-2" disabled={loading} color="primary" size="sm" onClick={() => document.getElementById('store_image').click()} disabled={loading}>
                          Browse
                        </Button>
                        <span className="help-block"> Format: .jpg, ,jpeg, .png, .webp </span>
                      </Col>
                    </Col>
                    <Col md={"4"} className='summary-section-image-uploader-right text-right'>
                      <a href={detail && detail.store_image_key} target="_blank">
                        <img style={{ width: '100px', borderRadius: '5px' }} src={detail && detail.store_image_key ? `${s3BucketProduction + detail.store_image_key}` : `${s3BucketProduction + "store/EYEWEAR_STORE_PLACEHOLDER.jpg"}`} />
                      </a>
                    </Col>
                  </Row>
                </Col>
                <Col md={"12"} className='summary-section-image-uploader'>
                  <Row>
                    <Col md={"8"} className='summary-section-image-uploader-left'>
                      <Col md="12" className=''> Email Image </Col>
                      <Col md="12" className="">
                        <input
                          type="file"
                          name="email_image"
                          id="email_image"
                          accept="image/*"
                          onChange={(event) => handleImageUpload({ file: event.target.files[0], type: "email_image", id: detail.id })}
                          hidden
                        />
                        <Button className="btn mt-2" disabled={loading} color="primary" size="sm" onClick={() => document.getElementById('email_image').click()} disabled={loading}>
                          Browse
                        </Button>
                        <span className="help-block"> Format: .jpg, ,jpeg, .png, .webp </span>
                      </Col>
                    </Col>
                    <Col md={"4"} className='summary-section-image-uploader-right text-right'>
                      <a href={detail && detail.email_image_key} target="_blank">
                        <img style={{ width: '100px', borderRadius: '5px' }} src={detail && detail.email_image_key ? `${s3BucketProduction + detail.email_image_key}` : `${s3BucketProduction + "store/email_PLACEHOLDER.jpg"}`} />
                      </a>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </>
          }
        </Col>
        <Col md="12" sm="12" className="summary-section  mt-30">
          <Col md="12" className='summary-section-heading'> STORE ADDRESS </Col>
          {loading ? 'loading...' : <>
            <Col md="12" sm="12">
              <Row>
                <Col md="6" className='summary-section-item-head'> Region </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.store_region}    </Col>
                <Col md="6" className='summary-section-item-head'> Detail Address </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.address}    </Col>
                <Col md="6" className='summary-section-item-head'> Opening Hour </Col>
                <Col md="6" className="summary-section-item-value"> {detail && `${detail.opening_time} to ${detail.closing_time}`}    </Col>
                <Col md="6" className='summary-section-item-head'> Zipcode </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.zipcode}    </Col>
                <Col md="6" className='summary-section-item-head'> City </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.city}    </Col>
                <Col md="6" className='summary-section-item-head'> Province </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.province}    </Col>
                <Col md="6" className='summary-section-item-head'> Country </Col>
                <Col md="6" className="summary-section-item-value"> {detail && detail.country}    </Col>
                <Col md="6" className='summary-section-item-head'> Lat,Long </Col>
                <Col md="6" className="summary-section-item-value"> {detail ? detail.lat + ", " + detail.long : "N/A"}    </Col>
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
                <Col md="3" className="summary-section-item-head"> <b> Mobile </b> </Col>
                <Col md="9" className="summary-section-item-value"> {detail && detail.phone}  </Col>
                <Col md="3" className="summary-section-item-head"> <b> Email </b> </Col>
                <Col md="9" className="summary-section-item-value"> {detail && detail.email}   </Col>
              </Row>
            }
          </Col>
        </Col>
      </Col>
    </Row>
  )
}
