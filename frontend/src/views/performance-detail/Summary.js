import React, { useState, useEffect } from 'react';
import classnames from "classnames";
 
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Input, Button, Card, CardBody } from 'reactstrap';
import { getNumberFormat } from '../../utilities/methods';

import Sales  from './PerformanceGraphics/Sales';



export default ({
    options,
    performanceDetail,
    changeGraphPerformance,
    loading,
}) => {


    return (
        <Row className='summary' >
            <Col md="8" sm="12">
                <Col md="12" sm="12" className="summary-section">
                {loading ? 'loading...' :<>
                    <Col md="12" className='summary-section-heading'> PERFORMANCE SUMMARY </Col>
                        <Col md="12" sm="12">
                        <Row>
                            <Col md="12" className='summary-section-describe'>HTO </Col>
                            <Col md="6" className='summary-section-item-head'> Total Appointment  </Col>
                            <Col md="6" className="summary-section-item-value"> { performanceDetail.appointments  && performanceDetail.appointments.count }   </Col>
                            <Col md="6" className='summary-section-item-head'> Total Sales as Optician  </Col>
                            <Col md="6" className="summary-section-item-value"> { getNumberFormat(performanceDetail.revenueHTO && performanceDetail.revenueHTO.total_sale) }    </Col>  
                            <Col md="6" className='summary-section-item-head'> Total Sales Items as Optician </Col>
                            <Col md="6" className="summary-section-item-value"> { performanceDetail.revenueHTO && performanceDetail.revenueHTO.total_sale_items }    </Col>
                         
                        </Row>
                    </Col> 
                    <Col md="12" sm="12">
                        <Row>
                            <Col md="12" className='summary-section-describe'>STORE </Col>
                            <Col md="6" className='summary-section-item-head'> Total Sales  </Col>
                            <Col md="6" className="summary-section-item-value"> { getNumberFormat(performanceDetail.revenueStore && performanceDetail.revenueStore.total_sale) }    </Col>
                            <Col md="6" className='summary-section-item-head'> Total Sales Item  </Col>
                            <Col md="6" className="summary-section-item-value"> { performanceDetail.revenueStore && performanceDetail.revenueStore.total_sale_items }    </Col>
                        </Row>
                    </Col></>
                    }
                </Col>
                <Col md="12" sm="12" className="summary-section  mt-30">
                    <Col md="12" className='summary-section-heading'> PERFORMANCE GRAPHICS </Col>
                    <Row>
                        <Col className="ml-2">
                            <Nav pills className="custom-pills">
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.graphType === "bookings" })}
                                        onClick={() => changeGraphPerformance('bookings')}
                                    >
                                       Appointments
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.graphType === "htosales" })}
                                        onClick={() => changeGraphPerformance('htosales')}
                                    >
                                        HTO Sales
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.graphType === "htosalesitems" })}
                                        onClick={() => changeGraphPerformance('htosalesitems')}
                                    >
                                        HTO Sales Items
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.graphType === "opticiansales" })}
                                        onClick={() => changeGraphPerformance('opticiansales')}
                                    >
                                        Store Sales
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.graphType === "opticiansaleitems" })}
                                        onClick={() => changeGraphPerformance('opticiansaleitems')}
                                    >
                                        Store Sale Items
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.graphType === "staffsales" })}
                                        onClick={() => changeGraphPerformance('staffsales')}
                                    >
                                        Staff Sales
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.graphType === "staffsaleitems" })}
                                        onClick={() => changeGraphPerformance('staffsaleitems')}
                                    >
                                        Staff Sale Items
                                    </NavLink>
                                </NavItem> 
                            </Nav>
                        </Col>
                    </Row>
                    <Row >
                        <Col>
                            <TabContent activeTab={options.graphType} className="mt-3">
                                <TabPane tabId="bookings">
                                    <Sales options={options}  performanceDetail={performanceDetail} loading={performanceDetail.is_graph_loading} tab="bookings"/>
                                </TabPane>
                                <TabPane tabId="htosales">
                                    <Sales options={options}  performanceDetail={performanceDetail} loading={performanceDetail.is_graph_loading} tab="htosales"/>
                                </TabPane>
                                <TabPane tabId="htosalesitems">
                                    <Sales options={options}  performanceDetail={performanceDetail} loading={performanceDetail.is_graph_loading} tab="htosalesitems"/>
                                </TabPane>
                                <TabPane tabId="opticiansales">
                                    <Sales options={options}  performanceDetail={performanceDetail} loading={performanceDetail.is_graph_loading} tab="opticiansales"/>
                                </TabPane>
                                <TabPane tabId="opticiansaleitems">
                                    <Sales options={options}  performanceDetail={performanceDetail} loading={performanceDetail.is_graph_loading} tab="opticiansaleitems"/>
                                </TabPane>
                                <TabPane tabId="staffsales">
                                    <Sales options={options}  performanceDetail={performanceDetail} loading={performanceDetail.is_graph_loading} tab="staffsales"/>
                                </TabPane>
                                <TabPane tabId="staffsaleitems">
                                    <Sales options={options}  performanceDetail={performanceDetail} loading={performanceDetail.is_graph_loading} tab="staffsaleitems"/>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </Col>
            </Col>
            <Col md="4" sm="12" >
                <Col md="12" className="summary-section">
                    <Col md="12" className='summary-section-heading'> EMPLOY DETAILS</Col>
                    <Col md="12">
                    {loading ? 'loading...' :
                        <Row>
                            <Col md="6" className="summary-section-item-head"> <b> Name </b> </Col>
                            <Col md="6" className="summary-section-item-value"> {  performanceDetail.member && performanceDetail.member.name }  </Col>
                            <Col md="6" className="summary-section-item-head"> <b> Employee ID </b> </Col>
                            <Col md="6" className="summary-section-item-value"> { performanceDetail.member && performanceDetail.member.emp_ref_code }   </Col>
                            <Col md="6" className="summary-section-item-head"> <b> Role </b>  </Col>
                            <Col md="6" className="summary-section-item-value capitalise"> { options.member} </Col>
                            <Col md="6" className="summary-section-item-head"> <b> Location </b>  </Col>
                            <Col md="6" className="summary-section-item-value"> N/A  </Col>
                        </Row>
                    }
                    </Col>
                </Col>
                <Col md="12" className="summary-section mt-30">
                    <Col md="12" className='summary-section-heading'>HISTORY</Col>
                    <Col md="12">
                    {loading ? 'loading...' :
                        <Row>
                            <Col md="6" className="summary-section-item-head"> Created At </Col>
                            <Col md="6" className="summary-section-item-value"> { new Date(performanceDetail.member && performanceDetail.member.created_at).toLocaleDateString() }   </Col>
                        </Row>
                    }
                    </Col>
                </Col>
            </Col>
        </Row>
    )
}