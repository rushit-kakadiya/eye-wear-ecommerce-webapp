import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardText, Label, FormGroup, Button} from 'reactstrap';
import { NavLink } from "react-router-dom";
import BackButton from '../buttons/BackButton';
import CartItems from './CartItems';
import { getNumberFormat, titleCase } from '../../utilities/methods';

export default ({
        order,
        user, 
        cart,
        history,  
        toggle, 
        setDeliveryType,
        setSku,
        deleteCart,
        createDraftOrder,
        setEditedLens,
        deleteCartAddon,
        setLens,
        setLensLeft,
        setLensSwitch,
        prescription,
        selectPrescription,
        setPreview,
        makeOrder,
        setItemWarranty, 
        setDiscount,
        dispatch,
        pickUpStore,
        removeDiscount,
        setSelectedClipon,
        setPackaging,
        removeDiscountCoupon,
        setContactLensQuantity
    }) => {
    const grandTotal = (cart.lensesOnly ? cart.lensesOnly['grand_total'] : 0 ) + (cart.data ? cart.data.grand_total['purchase'] : 0) + (cart.clipons ? cart.clipons['grand_total'] : 0 ) + (cart.contactLens ? cart.contactLens['grand_total'] : 0 ) + (cart.othersProduct ? cart.othersProduct['grand_total'] : 0 );    
    return (
        <Row>
            <Col md="12">
            <Card>
                <CardBody>
                    <Row> 
                    <Col sm={{ offset: 1 }}>
                    <h4> <BackButton history={history} path="/order" action={createDraftOrder}/></h4>
                    </Col>
                    <Col md="10">
                    <h4> New Order @{order.selected_store ? order.selected_store.label : titleCase(order.sales_channel || 'Whatsapp')}</h4>
                    </Col>
                    </Row>
                    <Row>
                    <Col md="7" sm={{ offset: 1 }}>
                        {order.selected_user ?
                            <Card body style={{width: '100%', marginLeft: '4.5%'}}>
                                <CardTitle><i className="mdi mdi-account"></i> Customer Detail <NavLink to="#" onClick={() => toggle('addUser')} style={{marginLeft: '5%', textDecoration: 'underline'}}>Change</NavLink></CardTitle>
                                <CardText>
                                <span>
                                    {order.selected_user.name} (0{order.selected_user.mobile})<br/>
                                    {order.selected_user.email}
                                </span>
                                </CardText>
                            </Card>
                        :
                        <FormGroup><Button style={{width: '100%', marginLeft: '4.5%'}} type="button" className="btn" outline color="primary" onClick={() => toggle('addUser')}> <i className="mdi mdi-account-star-variant"></i> Add Customer</Button></FormGroup>
                        }
                    </Col>
                    </Row>
                    {order.selected_user && 
                    <Row>
                    <Col md="7" sm={{ offset: 1 }}>
                        <Card body style={{width: '100%', marginLeft: '4.5%'}}>
                            <CardTitle><i className="mdi mdi-map-marker"></i> Delivery Detail</CardTitle>
                            <CardText>
                            <Col sm="10">
                            <Label>
                            {order.delivery_type === 'store' && order.selected_store ?
                                <><input
                                    name="delivery_type"
                                    type="radio"
                                    value="store"
                                    checked
                                    onChange={() => setDeliveryType('store')}
                                /> Pickup at Store </> :
                                <><input
                                    name="delivery_type"
                                    type="radio"
                                    value="store"
                                    onChange={() => {setDeliveryType('store'); toggle('store')}}
                                /> Pickup at Store </>
                            }
                                </Label><br/>
                                <Label>
                                {order.delivery_type === 'delivery' ? <>
                                <input
                                    name="delivery_type"
                                    type="radio"
                                    value="delivery"
                                    checked
                                    onChange={() => setDeliveryType('delivery')}
                                /> Delivery </>
                                : <>
                                <input
                                    name="delivery_type"
                                    type="radio"
                                    value="delivery"
                                    onChange={() => {setDeliveryType('delivery'); dispatch(pickUpStore(null));}}
                                /> Delivery
                                </>
                                }
                                </Label>
                                {order.delivery_type === 'delivery' && order.selected_user_address && 
                                    <fieldset>
                                        {order.selected_user_address.address}<br/>
                                        {order.selected_user_address.province}, {order.selected_user_address.city}, {order.selected_user_address.country} ({order.selected_user_address.zip_code})
                                    </fieldset>
                                }
                                </Col>
                            </CardText>
                            {order.delivery_type === 'delivery' &&
                                <Button style={{ width: '60%', }} type="button" color="primary" onClick={() => toggle(user.users_address.length ? 'addressList' : 'addAddress')}>{ user.users_address.length ? order.selected_user_address ? 'Change Address' : 'Select Address' : 'Add New Address'}</Button>
                            }
                        </Card>
                    </Col>
                    </Row>
                    }
                    {cart.data && 
                        <CartItems 
                            cart={cart}
                            order={order}
                            deleteCart={deleteCart.bind(null)}
                            toggle={toggle.bind(null)}
                            setSku={setSku.bind(null)}
                            setEditedLens={setEditedLens}
                            deleteCartAddon={deleteCartAddon.bind(null)}
                            setLens={setLens}
                            setLensLeft={setLensLeft}
                            setLensSwitch={setLensSwitch}
                            prescription={prescription}
                            selectPrescription={selectPrescription}
                            setPreview={setPreview}
                            setItemWarranty={setItemWarranty}
                            setDiscount={setDiscount.bind(null)}
                            removeDiscount={removeDiscount.bind(null)}
                            setSelectedClipon={setSelectedClipon.bind(null)}
                            setPackaging={setPackaging.bind(null)}
                            setContactLensQuantity={setContactLensQuantity.bind(null)}
                        />
                    }
                    <Row>
                    <Col md="7" sm={{ offset: 1 }}>
                    <FormGroup><Button style={{width: '100%', marginLeft: '4.5%'}} type="button" className="btn" outline color="primary" onClick={()  =>  toggle('itemType')} disabled={!order.selected_user}>
                        {cart.data  && cart.data.list.length > 0 ? 
                            <><i className="mdi mdi-plus"></i> Add More Items</>
                        : 
                            <><i className="mdi mdi-sunglasses"></i> Select Frames</>
                        }    
                        </Button></FormGroup>
                    </Col>
                    </Row>
                {((cart.data  &&  cart.data.list.filter(c => c.type === 1).length > 0) || (cart.lensesOnly && cart.lensesOnly.list.length > 0) || (cart.clipons && cart.clipons.list.length > 0)  || (cart.contactLens && cart.contactLens.list.length > 0) || (cart.othersProduct && cart.othersProduct.list.length > 0) ) && 
                    <Row >
                    <Col md="7" sm={{ offset: 1 }}>
                        <Card body style={{width: '100%', marginLeft: '4.5%'}}>
                            <CardTitle>Payment Detail</CardTitle>
                            <CardText>
                            { order.applied_discount_voucher ?
                            <>
                            <Row>
                            <Col sm={12}>
                                <strong className="text-success">Discount Applied</strong>
                            </Col>
                            <Col className="border p-2 ml-3" sm={10}>
                                <Row>
                                    <Col>
                            <strong>{`${order.applied_discount_voucher.voucher_title+' '+order.applied_discount_voucher.voucher_code }`}</strong>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={10}>
                                        { order.applied_discount_voucher.voucher_sku_mapping_type === 3  ? order.applied_discount_voucher.voucher_type === 1 ? 
                                            `${order.applied_discount_voucher.voucher_percentage+'% off of all products'}` : `${getNumberFormat(order.applied_discount_voucher.voucher_amount)+ ' off for all products'}` : order.applied_discount_voucher.voucher_type === 1 ? 
                                            `${order.applied_discount_voucher.voucher_percentage+'% off of specific products'}` : `${getNumberFormat(order.applied_discount_voucher.voucher_amount)+ ' off for specific products'}`    
                                        }
                                     </Col>
                                    <Col>
                                    <i className="fa fa-times fa-lg text-danger" aria-hidden="true" style={{cursor: "pointer"}} onClick={()=>removeDiscountCoupon()}></i>
                                    </Col>
                                </Row>
                             </Col>
                           </Row>
                           <Row className="mt-2">
                            <Col sm={6}>
                                Total
                            </Col>
                            <Col sm={6}>
                            <span className="text-dark font-bold">
                            {getNumberFormat(grandTotal) }
                            </span>
                            </Col>  
                            </Row>
                            <Row>
                            <Col sm={6}>
                                Shipping Fee
                            </Col>
                            <Col sm={6}>
                                <span className="text-dark font-bold">{getNumberFormat(0)}</span>
                            </Col>
                            </Row>
                            <Row>
                            <Col sm={6}>
                                Discount
                            </Col>
                            <Col sm={6}>
                                <span className="text-dark font-bold">
                                {order.discounted_amount && getNumberFormat(order.discounted_amount.voucherDiscountAmount)}
                                </span>
                            </Col>
                            </Row> 
                            <hr className="text-dark font-bold"/>
                            <Row>
                            <Col sm={6}>
                                Grand Total
                            </Col>
                            <Col sm={6}>
                                <span className=" font-bold">
                                    {getNumberFormat(( grandTotal - (order.discounted_amount ? order.discounted_amount.voucherDiscountAmount : 0)))}
                                </span>
                            </Col>
                            </Row></> 
                            :<>
                            <Row>
                                <Col>
                                    <FormGroup>
                                    <Button style={{width: '100%'}} type="button" className="btn" outline color="success" onClick={()=>toggle('discountList')}>
                                    <><i className="fas fa-ticket-alt" style={{color:'success'}}></i> Add Discount Coupon </>
                                    </Button></FormGroup>
                                </Col>
                            </Row> 
                            <hr className="text-dark font-bold"/>
                            <Row>
                            <Col sm={6}>
                                Grand Total
                            </Col>
                            <Col sm={6}>
                            <span className=" font-bold">
                                {getNumberFormat(grandTotal)}
                            </span>
                            </Col>
                            </Row>
                            </>}
                            </CardText>
                        </Card>
                    </Col>
                    </Row>}
                    <Row className="mt-4">
                    <Col md="7" sm={{ offset: 1 }}>
                    <FormGroup><Button style={{width: '100%', marginLeft: '4.5%'}} type="button" color="primary" onClick={()  =>  makeOrder()} disabled={order.is_loading || (((cart.data && cart.data.list.filter(c => c.type === 1).length) || (cart.lensesOnly && cart.lensesOnly.list.length) || (cart.clipons && cart.clipons.list.length) || (cart.contactLens && cart.contactLens.list.length) || (cart.othersProduct && cart.othersProduct.list.length)) ? false : true)}>Make Order</Button></FormGroup>
                    </Col>
                    </Row>
                </CardBody>
            </Card>
            </Col>
        </Row>
    )
}