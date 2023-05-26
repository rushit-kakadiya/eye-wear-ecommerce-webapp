import React, { useState, useEffect } from 'react';
import classnames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Input, Button, Card, CardBody } from 'reactstrap';
import BackButton from '../../views/buttons/BackButton';
import Summary from './Summary';
import AppointmentList from './AppointmentList';
import Sales from './Sales';

import './PerformanceDetail.scss';

export default ({ 
    options, 
    performanceDetail, 
    changePerformance , 
    changeGraphPerformance,
    start_date, 
    end_date,
    handleFilter,
    handleFilterSubmit,
    showFilter,
    setShowFilter,
    loading, 
    resetFilter,
    history
}) => {
    
    const [search, setSearch] = useState('');

    return (
        <>
            <Card>
                <CardBody>
                    <Row className="ml-3">
                        <h3>  <BackButton  history={history}/> Performance</h3>
                    </Row>
                    <Row>
                        <Col className="ml-2">
                            <Nav pills className="custom-pills">
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.type === "summary" })}
                                        onClick={() => changePerformance('summary')}
                                    >
                                        Summary
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.type === "appointments" })}
                                        onClick={() => changePerformance('appointments')}
                                    >
                                        HTO Appointment                                  
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.type === "optician_hto_sales" })}
                                        onClick={() => changePerformance('optician_hto_sales')}
                                    >
                                        HTO Sales                                  
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.type === "optician_store_sales" })}
                                        onClick={() => changePerformance('optician_store_sales')}
                                    >
                                        Store Sales                                 
                                    </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: options.type === "staff_store_sales" })}
                                        onClick={() => changePerformance('staff_store_sales')}
                                    >
                                        Sales                                 
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col md="7">
                            {/* <FormGroup>
                                <Input type="text" name="search" id="search" placeholder="Search" />
                            </FormGroup> */}
                            <FormGroup><Button type="button" color="primary"  onClick={() => setShowFilter(!showFilter)}>{showFilter ? 'Hide Filter' : 'More Filter'}</Button></FormGroup>
                        </Col>
                        <Col md="5" className="mt-2 pl-0 text-right">
                            <NavLink  className="font-bold" href="#" disabled={loading} active style={{textDecoration: 'underline', padding:'0px'}} onClick={()=>resetFilter()}> Reset Filter</NavLink>
                        </Col>
                        {/* <Col md="5" className="pl-0 text-right">
                            <FormGroup>
                                <Button type="button" color="primary" ><i className="fa fa-download" aria-hidden="true"></i> Download CSV</Button>
                            </FormGroup>
                        </Col> */}
                    </Row>
                    {
                        showFilter &&
                        <Row className="ml-0 mr-1 row" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                            <Col md="2" className="mt-2  pl-2 pr-0">
                                <DatePicker selected={start_date} onChange={date => handleFilter('start_date', date)} className="form-control" placeholderText="Start Date" style={{width: "100%"}} maxDate={end_date || new Date()} isClearable={true} />
                            </Col>
                            <Col md="2" className="mt-2  pl-2 pr-0">
                                <DatePicker selected={end_date} disabled={!start_date} onChange={date => handleFilter('end_date', date)} className="form-control" style={{width: "100%"}} placeholderText="End Date" maxDate={new Date()} minDate={start_date} isClearable={true} />
                            </Col>
                            <Col md="8" className="mt-2  pr-2 text-right" >
                                <FormGroup className="mb-2"><Button type="button" color="primary" onClick={() => handleFilterSubmit(search)}>Filter Search</Button></FormGroup>
                            </Col>
                        </Row>
                    }
                    <Row >
                        <Col>
                            <TabContent activeTab={options.type} className="mt-3">
                                <TabPane tabId="summary">
                                    <Summary options={options} performanceDetail={performanceDetail} history={history} changeGraphPerformance={changeGraphPerformance} loading={loading} />
                                </TabPane>
                                <TabPane tabId="appointments">
                                    <AppointmentList options={options} performanceDetail={performanceDetail} history={history} loading={loading} />
                                </TabPane>
                                <TabPane tabId="optician_hto_sales">
                                    <Sales options={options} performanceDetail={performanceDetail} history={history} loading={loading}  />
                                </TabPane>
                                <TabPane tabId="optician_store_sales">
                                    <Sales options={options} performanceDetail={performanceDetail} history={history} loading={loading} />
                                </TabPane>
                                <TabPane tabId="staff_store_sales">
                                    <Sales options={options} performanceDetail={performanceDetail} history={history} loading={loading} />
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}