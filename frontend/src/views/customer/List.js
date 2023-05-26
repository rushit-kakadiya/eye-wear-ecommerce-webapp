import React, {useState} from "react";
import { Row, Col, Card, CardBody, Nav, NavLink, FormGroup, Input, Button} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getNumberFormat, titleCase, getDateFormat, checkRoleAccess} from  '../../utilities/methods';
import {customerType, roles_actions} from '../../utilities/constants'

export default ({history, users, options, state, exportCustomersData, loading, showFilter, setShowFilter, resetFilter, handleFilterSubmit, handleFilter, userData}) => {
 const [search, setSearch] = useState('');


 const resetAllFilter = () =>{
  setSearch("")
  resetFilter()
 }


  return (
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
                    <Nav>
                        <h3>Customer</h3>
                    </Nav>
                    <Row>
                        <Col md="4">
                        <FormGroup>
                            <Input type="text" name="search" id="search" placeholder="Search"  onKeyUp={event=>{event.keyCode === 13 ? handleFilterSubmit(search) : setSearch(event.target.value) }}/>
                        </FormGroup>
                        </Col>
                        <Col md="3">
                            <FormGroup><Button type="button" color="primary" onClick={() => setShowFilter(!showFilter)}>{showFilter ? "Hide Filter" : "Show Filter"}</Button></FormGroup>
                        </Col>
                        <Col md="2" style={{textAlign: 'right'}}>
                          {
                            checkRoleAccess(userData.accessRole, userData.permissions, 'export', roles_actions.is_get) &&
                            <FormGroup>
                              <Button type="button" color="primary" disabled={loading} onClick={() => exportCustomersData()}><i className="fas fa-file-excel"></i> Export</Button>
                            </FormGroup>
                          }
                        </Col>
                        <Col md="3" style={{textAlign: 'right'}}>
                        {checkRoleAccess(userData.accessRole, userData.permissions, 'customer', roles_actions.is_add) &&
                            <FormGroup><Button type="button"  color="primary" onClick={() => history.push('/customer/add')} >Add New Customer</Button>
                          </FormGroup>
                        }
                        </Col>
                        </Row>      
                         {
                        showFilter && 
                        <Row className="ml-0 mr-1" style={{backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
                          <Col md="2" className="mt-2 pr-0">
                            <Input type="select" className="custom-select"  onChange={event => handleFilter('channel', event.target.value )} value={state.channel}>
                              {customerType.map((row, index)=>
                              <option value={row.value} key={index}>{row.label}</option>)}
                              </Input>
                          </Col>
                          <Col md="2"  className="mt-2 pr-0">
                          <DatePicker showYearDropdown="true" className="form-control"  placeholderText="Created date" maxDate={new Date()} isClearable={true} onChange={date => handleFilter('created_at', date)} selected={state.created_at}/>
                          </Col>
                          <Col md="2"  className="mt-2 pr-0">
                          <DatePicker showYearDropdown="true" className="form-control"  placeholderText="Brithday" maxDate={new Date()} isClearable={true} onChange={date => handleFilter('dob', date)} selected={state.dob}/>
                          </Col>
                          <Col md="2"  className="mt-2 pr-0">
                          </Col>
                          <Col md="2" className="mt-2 pr-0">
                          <NavLink  className="font-bold" href="#" disabled={loading} active style={{textDecoration: 'underline', padding:'0px'}} onClick={()=>resetAllFilter()}> Reset Filter</NavLink>
                          </Col>
                          <Col  className="mt-2 " >
                          <FormGroup><Button type="button" color="primary" onClick={()=>handleFilterSubmit(search)}>Filter Search</Button></FormGroup>
                          </Col>
                        </Row>
                      }
                    <br/>
                    <BootstrapTable
                      data={users.list}
                      remote
                      condensed
                      striped hover pagination
                      options={{ ...options }}
                      fetchInfo={{ dataTotalSize: users.total_rows }}
                      tableHeaderClass="mb-0"
                    >
                      <TableHeaderColumn width="120" dataField="name" isKey dataFormat={(cell, row) => 
                      <NavLink href="#" active onClick={() => 
                        //history.push(`/customer/detail/${row.id}`)
                        window.open(`/customer/detail/${row.id}`, '_blank')
                      }>
                          <strong>{titleCase(row.name)}</strong>
                      </NavLink> }>
                        Name
                      </TableHeaderColumn>
                      <TableHeaderColumn width="130" dataField="email" >
                        Email
                      </TableHeaderColumn>
                      <TableHeaderColumn width="120" dataFormat={(cell,row) => row.country_code+row.mobile}>
                        Phone
                      </TableHeaderColumn>
                      <TableHeaderColumn width="200" dataFormat={(cell,row) => row.address_details === row.address ? row.address : row.address_details + ", " +  row.address }>
                        Address
                      </TableHeaderColumn>
                      <TableHeaderColumn width="150" dataFormat={(cell,row) => getDateFormat(row.dob, true, false) }>
                        DOB
                      </TableHeaderColumn>
                      <TableHeaderColumn width="150" dataFormat={(cell,row) => getDateFormat(row.created_at, true, false, userData.time_zone) }>
                        Created At
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataFormat={(cell,row) => titleCase(row.channel, true, false) }>
                        Channel
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataField="totalOrders" >
                        Total Orders
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataField="totalFrames" >
                        Total Frames
                      </TableHeaderColumn>
                      <TableHeaderColumn width="120" dataField="totalPayment" dataFormat={(cell, row)  => getNumberFormat(row.totalPayment)}>
                        Total Payment
                      </TableHeaderColumn>
                    </BootstrapTable>
              </CardBody>
            </Card>
        </Col>
      </Row>
  );
};

