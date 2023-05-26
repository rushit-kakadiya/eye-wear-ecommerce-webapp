import React from 'react';
import { Row, Col, Card, CardBody, Label, Button } from "reactstrap";
import BackButton from '../../views/buttons/BackButton';
import Select from 'react-select';
import {payment } from '../../utilities/constants';

export default ({history, loading, toggle, setPaymentType, handleXenditpayment, paymentType, setPaymentCategory, paymentCategory, orderDetail}) => {

  return(
        <Card>
            <CardBody>
                <Row> 
                    <Col md="5">
                        <h4> <BackButton path="/order" history={history}/> Select Payment Method</h4> 
                    </Col>
                </Row>
                {orderDetail && !orderDetail.payment_category &&
                  <Row className="ml-4">
                    <Col  sm="6" >
                      <Button color={paymentCategory === 3 ? "btn btn-success" : "btn btn-outline-success"} style={{width: "100%", textAlign: 'center'}} onClick={() => setPaymentCategory(3) }
                          disabled={loading}><i className="fas fa-database mr-1" ></i> Full Payment </Button>
                    </Col>
                    <Col  sm="6" >
                      <Button color={paymentCategory === 1 ? "btn btn-success" : "btn btn-outline-success"} style={{width: "100%", textAlign: 'center'}} onClick={() => setPaymentCategory(1) }
                          disabled={loading}><i className="fas fa-database mr-1" ></i><i className="fa fa-mobile-alt"></i> Partial Payment </Button>
                    </Col>
                </Row>
                }
                <br/>
                <Row className="ml-4"> 
                    <Col md="6">
                      <h4><b>Online Payment</b></h4>
                      <Row>
                          <Col sm="12">
                          <Select
                            onChange={(event)=>{
                              if(paymentCategory !== 3) {
                                setPaymentType({method: event.type, type :event.value});
                                toggle('partialPayment');
                              } else {
                                handleXenditpayment(event.type, event.value)
                              }
                            }}
                            value={payment.xendit.find(row=>row.value === paymentType.type) || {label:<><i className="fa fa-shopping-cart"></i><span className="ml-2">Xendit/Virtual Account</span></>, value:''}}
                            options={payment.xendit}
                          />
                          </Col>
                          <Col  sm="12" className="mt-3">
                          <Select
                            onChange={(event) => { 
                              setPaymentType({method:7, type :event.value});
                              if(paymentCategory !== 3) {
                                toggle('partialPayment');
                              } else {
                                toggle('cashEDCPayment');
                              }
                            }}
                            value={payment.insurance.find(row=>row.value === paymentType.type) || {label:<><i className="fas fa-shield-alt"></i><span className="ml-2">Insurance</span></>, value:''}}
                             options={payment.insurance}
                          />
                          </Col>
                          <Col  sm="12" className="mt-3">
                          <Select
                            onChange={(event)=> { 
                              setPaymentType({method:6, type :event.value}); 
                              if(paymentCategory !== 3) {
                                toggle('partialPayment');
                              } else {
                                toggle('cashEDCPayment'); 
                              }
                            }}
                            value={payment.bank.find(row=>row.value === paymentType.type) || {label:<><i className="fa fa-university"></i><span className="ml-2">Bank Transfer</span></>, value:''}}
                            options={payment.bank}
                          />
                          </Col>
                          <Col  sm="12" className="mt-3">
                          <Select
                            onChange={(event)=> { 
                              setPaymentType({method:event.type, type :event.value}); 
                              if(paymentCategory !== 3) {
                                toggle('partialPayment');
                              } else {
                                toggle('cashEDCPayment');
                              }
                            }}
                            value={paymentType.type && payment.other.find(row=>row.value === paymentType.type) || {label:<><i className="fas fa-ellipsis-h"></i><span className="ml-2">Other</span></>, value:''}}
                            options={payment.other}
                          />
                          </Col>
                          <Col className="mt-4" style={{ textAlign: 'center'}}>
                          <Button color="info" disabled={loading} onClick={() => history.push('/order')} style={{width:"100%"}}> Go to Order List </Button>
                          </Col>
                      </Row>
                    </Col>
                    <Col md="6">
                      <h4><b>Offline Payment</b></h4>
                      <Row>
                        <Col  sm="12" >
                        <Button outline color="info" style={{width: "100%", textAlign: 'center'}} onClick={() =>{  
                          setPaymentType({method:0, type:"cash"}); 
                          if(paymentCategory !== 3) {
                            toggle('partialPayment');
                          } else {
                            toggle('cashEDCPayment');
                          }
                        } }
                             disabled={loading}><i className="fas fa-database mr-1" ></i> Cash </Button>
                        </Col>
                        <Col  sm="12" className="mt-3">
                          <Select
                            onChange={(event)=> { 
                              setPaymentType({method:5, type:event.value}); 
                              if(paymentCategory !== 3) {
                                toggle('partialPayment');
                              } else {
                                toggle('cashEDCPayment');
                              }
                            }}
                            value={payment.edc.find(row=>row.value === paymentType.type) || {label:<><i className="fa fa-mobile-alt"></i> <span className="ml-2">EDC</span></>, value:''}}
                            options={payment.edc}
                          />
                          </Col>
                          <Col  sm="12" className="mt-3">
                          <Select
                            onChange={(event)=> { 
                              setPaymentType({method:21, type:event.value}); 
                              if(paymentCategory !== 3) {
                                toggle('partialPayment');
                              } else {
                                toggle('cashEDCPayment');
                              }
                            }}
                            value={payment.warranty.find(row=>row.value === paymentType.type) || {label:<><i className="fa fa-newspaper"></i> <span className="ml-2">Warranty</span></>, value:''}}
                            options={payment.warranty}
                          />
                          </Col>
                      </Row>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}