import React, { useState, useEffect } from 'react';
import classnames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, FormGroup, Input, Button, Card, CardBody } from 'reactstrap';
import List from './List';
import './analytics.scss'

export default ({
    options,
    analytics,
    changeAnalytics,
    start_date,
    end_date,
    handleFilter,
    handleFilterSubmit,
    showFilter,
    setShowFilter,
    loading,
    resetFilter,
    inputPersonList,
    opticianList, 
    history
}) => {

    const [search, setSearch] = useState('');

    return (
        <>
            <Card>
                <CardBody>
                    <Row className="ml-0">
                        <h3>Employee Analytics</h3>
                    </Row>
                    <Row>
                        <Col className="ml-2">
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col md="4">
                            <FormGroup>
                            <Input type="text" name="search" id="search" placeholder="Search"  onKeyUp={event=>{event.keyCode === 13 ? handleFilterSubmit(search) : setSearch(event.target.value) }}/>
                            </FormGroup>
                        </Col>
                        <Col md="4" className="mt-2 pl-0 text-right">
                        </Col>
                        <Col md="4" className="mt-2 pl-0 text-right">
                            <FormGroup>
                                <NavLink className="font-bold" href="#" disabled={loading} active style={{ textDecoration: 'underline', display : 'inline-block',padding: '0px' }} onClick={() => resetFilter()}> Reset Filter</NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="button" color="primary" onClick={() => setShowFilter(!showFilter)}>{showFilter ? 'Hide Filter' : 'More Filter'}</Button> 
                            </FormGroup>
                        </Col>
                    </Row>
                    {
                        showFilter &&
                        <Row className="ml-0 mr-1 row" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                            <Col md="2" className="mt-2  pl-2 pr-0">
                                <DatePicker selected={start_date} onChange={date => handleFilter('start_date', date)} className="form-control" placeholderText="Start Date" style={{ width: "100%" }} maxDate={end_date || new Date()} isClearable={true} />
                            </Col>
                            <Col md="2" className="mt-2  pl-2 pr-0">
                                <DatePicker selected={end_date} disabled={!start_date} onChange={date => handleFilter('end_date', date)} className="form-control" style={{ width: "100%" }} placeholderText="End Date" maxDate={new Date()} minDate={start_date} isClearable={true} />
                            </Col>
                            <Col md="8" className="mt-2  pr-2 text-right" >
                                <FormGroup className="mb-2"><Button type="button" color="primary" onClick={() => handleFilterSubmit(search)}>Filter Search</Button></FormGroup>
                            </Col>
                        </Row>
                    }
                    <Row >
                        <Col>
                            <List options={options} analytics={analytics} history={history} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </>
    )
}