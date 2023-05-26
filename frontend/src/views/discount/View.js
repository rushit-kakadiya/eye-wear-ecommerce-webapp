import React from 'react';
import { Row, Col, Card, CardBody, Badge, Label, NavLink} from "reactstrap";
import BackButton from '../buttons/BackButton';
import {getNumberFormat, getLocalTime, toDateFormat, checkRoleAccess} from '../../utilities/methods';
import TimePicker from 'react-time-picker';
import { avilabilty_type } from '../../utilities/constants';

export default ({history, detail, handelViewEvents, userData}) => {
    return(
        <Row>
        <Col md="8" sm={{offset: 1}}>
         <Card>
            <CardBody>
                <Row> 
                    <Col sm={6}>
                    <h4> <BackButton history={history} path="/settings/discount" /> {`${detail.voucher_title+" ("+detail.voucher_code.toUpperCase()+")"}`}</h4>
                    </Col>
                    <Col sm={3} >
                        { detail.discount_category && <>
                        <Badge color="primary" pill>{detail.discount_category}</Badge>
                        <Badge color="success"  className="ml-1" pill>{detail.discount_sub_category}</Badge>
                        </>}
                    </Col>
                    { !detail.is_expired && checkRoleAccess(userData.accessRole, userData.permissions, 'voucher', 'is_update') &&
                    <Col className="pr-0" style={{textAlign:"left"}}>
                    <NavLink  to="#"  className="text-info pr-2" disabled={detail.status === 2} style={{textDecoration: 'underline', display:'contents', cursor: "pointer"}} onClick={()=>handelViewEvents('edit')}><i className="fas fa-pencil-alt"></i>{' '}Edit</NavLink>{'   '}
                    <NavLink  to="#"  className="text-danger" disabled={detail.status === 2} style={{textDecoration: 'underline', display:'contents',  cursor: "pointer"}} onClick={()=>handelViewEvents('delete')}><i className="fa fa-ban" aria-hidden="true"></i>Inactive</NavLink>
                    </Col>}
                </Row><br/>             
                <Col sm={10} className="border">
                    <Row className="mt-2">
                        <Col>
                            <strong className="text-muted">DISCOUNT TYPE</strong>
                        </Col>
                    </Row>               
                    <Row className="mt-3">
                        <Col sm={9}>
                            {
                                detail.voucher_type === 1 ? " Percentage Discount" : "Amount Discount"
                            }
                        </Col>
                        <Col>
                            {
                                detail.voucher_type === 1 ? `${detail.voucher_percentage+'%'}` : getNumberFormat(detail.voucher_amount)
                            }
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col><strong>Applies to</strong></Col>
                    </Row>
                    {detail.voucher_sku_mapping_type !== 3 && (detail.excludesSku && detail.excludesSku.length === 0) &&
                    <Row className="mt-2">
                        <Col>All Products</Col>
                    </Row>}
                    {(detail.excludesSku && detail.excludesSku.length > 0) &&
                    <Row className="mt-2">
                        <Col sm={3}><strong className="text-danger"> Excludes </strong></Col>
                        <Col>
                            {detail.excludesSku && detail.excludesSku.map((row, index)=> <Badge key={index} color="secondary" className="mr-2" pill>{row.sku_code}</Badge>)}
                        </Col>
                    </Row>}
                    {detail.voucher_sku_mapping_type === 3 &&
                    <Row className="mt-2">
                        <Col sm={3}><strong className="text-success"> Includes </strong></Col>
                        <Col>
                            {detail.includesSku && detail.includesSku.map((row, index)=> <Badge key={index} color="secondary" className="mr-2" pill>{row.sku_code}</Badge>)}
                        </Col>
                    </Row>}
                    <Row className="mt-2">
                        <Col>
                            <input
                                name="exclude_global_sku"
                                type="checkbox"
                                disabled={true}
                                checked={detail.voucher_sku_mapping_type === 1}
                            /> Exclude Special Edition
                        </Col>
                    </Row>
                    <br/>
                </Col>
                <Col sm={10} className="border mt-2">
                    <Row className="mt-2">
                        <Col>
                            <strong className="text-muted">MINIMUM REQUIREMENTS</strong>
                        </Col>
                    </Row>
                    { detail.minimum_cart_amount > 1 &&
                        <Row className="mt-2">
                            <Col sm={10}>Minimum Purchase</Col>
                            <Col>{getNumberFormat(detail.minimum_cart_amount)}</Col>
                        </Row>
                    }                   
                    { detail.min_cart_count > 1 &&
                        <Row className="mt-2">
                            <Col sm={10}>Minimum Items</Col>
                            <Col>{detail.min_cart_count}</Col>
                        </Row>
                    }
                    <br/>
                </Col>                
                <Col sm={10} className="border mt-2">
                    <Row className="mt-2">
                        <Col>
                            <strong className="text-muted">USAGE LIMIT</strong>
                        </Col>
                    </Row>
                    { detail.max_count &&
                        <Row className="mt-2">
                            <Col sm={9}>Max. Voucher can be used in total</Col>
                            <Col>{detail.max_count +"X"}</Col>
                        </Row>
                    }  
                    { detail.voucher_max_amount &&
                        <Row className="mt-2">
                            <Col sm={9}>Max. Discount</Col>
                            <Col>{getNumberFormat(detail.voucher_max_amount)}</Col>
                        </Row>
                    }                      
                    <br/>
                    <Label> 
                    <input
                        name="is_single_user"
                        type="checkbox"
                        checked={detail.is_single_user}
                        disabled
                    /> Limit to one use per customer</Label> 
                    <br/>      
                    <Label> 
                    <input
                        name="first_order"
                        type="checkbox"
                        checked={detail.first_order}
                        disabled
                    /> First time purchase only</Label> 
                </Col>
                <Col sm={10} className="border mt-2">
                    <Row className="mt-2">
                        <Col>
                            <strong className="text-muted">SCHEDULE</strong>
                        </Col>
                    </Row>
                    <Row>
                    <Col sm={5}>
                    Start Date
                    <input
                    className="form-control"
                    type="date"
                    value={detail.start_at && toDateFormat(detail.start_at)}
                    disabled
                    />
                    </Col>
                    <Col>
                    Start Time(WIB)<br/>
                    <TimePicker
                        style={{width:'100%'}}
                        value={detail.start_at && getLocalTime(detail.start_at)}
                        hourPlaceholder="hh"
                        minutePlaceholder="mm"
                        disabled
                        clearIcon={false}
                    />
                    </Col>
                </Row><br/>
                <Row >
                    <Col sm={5}>
                    End Date
                    <input
                        name="schedule_end_date"
                        className="form-control"
                        type="date"
                        value={detail.expire_at &&  toDateFormat(detail.expire_at)}
                        disabled
                    />
                    </Col>
                    {detail.expire_at &&
                    <Col>
                    End Time(WIB)<br/>
                    <TimePicker
                        style={{width:'100%'}}
                        value={detail.expire_at && getLocalTime(detail.expire_at)}
                        disabled
                        clearIcon={false}
                    />
                    </Col>}
                </Row>                                     
                    <br/>
                </Col>
                <Col sm={10} className="border mt-2">
                    <Row className="mt-2">
                        <Col>
                            <strong className="text-muted">AVAILBILITY</strong>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        {avilabilty_type?.map((row, index) =>
                            <Label key={index} className="col-sm-4 mb-2"> 
                                <input
                                    name="avilabilty_type"
                                    type="checkbox"
                                    disabled
                                    checked={detail.avilabilty_type.includes(row.code)}
                                /> &nbsp; {row.label}
                            </Label>
                        )}
                    </Row> 
                { detail?.avilabilty_type?.includes(2) &&
                    <>              
                        <hr/>
                       <Row className="mt-2">                        
                            <Col><strong>APP's ADDITIONAL INFO</strong></Col>
                        </Row>
                        <Row className="mt-2">                        
                            <Col sm={12}>Term and Conditions</Col>
                            <Col className="ml-2 mt-1"><p>{detail.term_conditions}</p></Col>
                        </Row>
                        <Row className="mt-2">                        
                            <Col>Voucher image</Col> <br/>
                        </Row>
                        <Row className="mt-2">
                            <Col sm={3}>
                                <div className="border">
                                <img  src={ detail.voucher_image_key ? detail.base_url+detail.voucher_image_key : require('../../assets/images/dummy-image.png')} alt="image" width="100%" />
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-2">                        
                            <Col sm={12}>Voucher Perview Title</Col>
                            <Col className="ml-2 mt-1"><p>{detail.sub_title}</p></Col>
                        </Row>
                        <Row className="mt-2">
                            <Col className="text-muted">
                            <Label>
                            <input
                                name="hide"
                                type="checkbox"
                                disabled
                                checked={detail.hide}
                            /> Don't show voucher in Voucher page on app (but can be searched)</Label>
                            </Col>
                            </Row>
                     </>
                  }
                </Col>
            </CardBody>
        </Card>
        </Col>
        </Row>
                
    )
}