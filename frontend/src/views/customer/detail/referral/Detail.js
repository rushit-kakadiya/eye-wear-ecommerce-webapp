import React, { useState } from 'react';
import classnames from "classnames";
import { 
    Row,
    Col, 
    Card, 
    CardBody,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
    } from 'reactstrap';
import List from './List';
import {getNumberFormat, addDayDate} from '../../../../utilities/methods';


export default ({loading, history, referralDetail}) => {
    const [type, setType] =  useState('ALL');
    return(
        <>
        <Row className="mt-2 ml-2"> 
            <Col sm="5">
                <Card>
                    <CardBody  style={{backgroundColor:'#F5F5F5'}}>
                        <Row>
                            <Col sm="1">  
                                <i className="fas fa-dollar-sign" ></i>
                            </Col>
                            <Col sm="10">
                                <h4>Referral Credit</h4>
                            </Col>
                            <Col sm="10" className="ml-4">
                                <span className="text-success font-bold ml-2"> {referralDetail.credits || 0}</span>
                                <span className="ml-2">({getNumberFormat(referralDetail.credits)})</span>
                            </Col>
                           { referralDetail.credits > 0 && referralDetail.expiration_date &&
                            <Col className="ml-4 text-muted mt-2">
                             * 250.000 Will expired in {addDayDate(referralDetail.expiration_date)}
                            </Col>
                            }
                        </Row>                        
                    </CardBody>
                </Card>
            </Col>
            <Col sm="5">
                <Card  className="bg-muted">
                    <CardBody style={{backgroundColor:'#F5F5F5'}}>
                        <Row>
                        <Col sm="1">  
                                <i className="fas fa-ticket-alt" ></i>
                            </Col>
                            <Col sm="10">
                                <h4>Referral Code</h4>
                            </Col>
                            { referralDetail.referralCode &&
                                <Col sm="10" className="ml-4">
                                <span className="text-primary font-bold ml-2">{referralDetail.referralCode['referral_code']}</span>
                                <span className="ml-2"><i className="fas fa-clone text-success" ></i></span>
                                </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row  className="ml-2"> 
            <Col sm="10">
            <Card  className="bg-muted">
                <CardBody  style={{backgroundColor:'#F5F5F5'}}>
                <Nav pills className="custom-pills">
                <NavItem>
                    <NavLink
                    className={classnames({ active: type === "ALL" })}
                    onClick={()=> setType("ALL")}>
                    All HIstory
                    </NavLink>
                </NavItem> 
                <NavItem>
                    <NavLink
                    className={classnames({ active: type === "PENDING" })}
                    onClick={()=> setType("PENDING")}
                     >
                    Pending 
                    </NavLink>
                </NavItem> 
                <NavItem>
                    <NavLink  
                    className={classnames({ active: type === "CREDIT" })}
                    onClick={()=> setType("CREDIT")}>
                    Earned
                    </NavLink>
                </NavItem> 
                <NavItem>
                    <NavLink   
                    className={classnames({ active: type === "DEBIT" })}
                    onClick={()=> setType("DEBIT")}>
                    Redeemed
                    </NavLink>
                </NavItem> 
                </Nav>
                <TabContent activeTab={type} className="mt-3">
                    <TabPane tabId="ALL" >
                        <List detail={referralDetail.creditHistory || []} loading={loading} type={type} history={history}/>
                    </TabPane>
                    <TabPane tabId="PENDING" >
                        <List  detail={referralDetail.creditHistory || []}  loading={loading} type={type} history={history}/>
                    </TabPane>
                    <TabPane tabId="CREDIT" >
                        <List detail={referralDetail.creditHistory || []}  loading={loading} type={type} history={history}/>
                    </TabPane> 
                    <TabPane tabId="DEBIT">
                        <List  detail={referralDetail.creditHistory || []}  loading={loading} type={type} history={history}/>
                    </TabPane>
                </TabContent>
                </CardBody>
            </Card>
            </Col>
        </Row>
        </>
    )
}