import React, {useState} from "react";
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink, FormGroup, Input, Button} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getDateFormat, titleCase, replaceGlobal, checkRoleAccess} from '../../utilities/methods';
import { appointment_status_list, roles_actions } from '../../utilities/constants';

const OrdersList = ({
  order, 
  order_status, 
  options, 
  history, 
  handleFilter, 
  loading, 
  exportOrdersData, 
  start_date, 
  end_date,
  handleFilterSubmit,
  draftTypeHto,
  clearHtoInformation,
  showFilter,
  setShowFilter, 
  resetFilter,
  state,
  userData
}) => {
  const [search, setSearch] = useState('');

  return (
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
                <Row>
                  <Col sm="11">
                    <Nav>
                        <NavItem>
                            <NavLink href="#" active onClick={() => handleFilter('order_status', 'all')} style={{textDecoration: order_status === 'all' ? 'overline' : 'none'}}>
                                <h6>All</h6>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#" onClick={() => handleFilter('order_status', '2')} style={{textDecoration: order_status === '2' ? 'overline' : 'none'}}>
                                <h6>Draft</h6>
                            </NavLink>
                        </NavItem> 
                    </Nav>
                    </Col>
                    <Col>
                      <i className="fas fa-calendar-alt fa-2x" style={{cursor: 'pointer'}} aria-hidden="true" onClick={()=> history.push('/hto/optician-calendar')}></i>
                    </Col>
                  </Row>
                    <Row>
                        <Col md="3">
                            <FormGroup>
                                <Input type="text" name="search" id="search" placeholder="Search by order no." onKeyUp={event=>{event.keyCode === 13 ? handleFilterSubmit(search) : setSearch(event.target.value) }} />
                            </FormGroup>
                        </Col>
                        <Col md="2" className="pl-0"> 
                            <FormGroup><Button type="button" color="primary" onClick={() => setShowFilter(!showFilter)}>{showFilter ? 'Hide Filter' : 'More Filter'}</Button></FormGroup>
                        </Col>
                        <Col md="2"></Col>
                        <Col md="2" className="pl-0">
                          {checkRoleAccess(userData.accessRole, userData.permissions, 'export', roles_actions.is_get) &&
                            <FormGroup>
                              <Button type="button" color="primary" disabled={loading} onClick={() => exportOrdersData()}><i className="fas fa-file-excel"></i> Export</Button>
                            </FormGroup>
                          }
                        </Col>
                        <Col md="3" className="text-right">
                        {checkRoleAccess(userData.accessRole, userData.permissions, 'hto', roles_actions.is_add) &&
                            <FormGroup>
                              <Button type="button" color="primary" id={`Popover-1`} onClick={()  =>  {
                                  clearHtoInformation();
                                  history.push('/hto/add');
                                }
                              }>Add HTO Appointment</Button>
                            </FormGroup>
                        }
                        </Col>
                        </Row>
                      {
                        showFilter && 
                        <Row className="ml-0 mr-1" style={{backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
                          {order_status !== '2' && 
                            <Col md="2" className="mt-2 pr-0">
                              <Input type="select" className="custom-select" onChange={event => handleFilter('order_status', event.target.value)} value={state.order_status}>
                                <option value="all" key="empty">Order Status</option>
                                  { appointment_status_list.map((row, index) =>
                                      <option key={index} value={row.value}>{row.label}</option>
                                    )}
                                </Input>
                            </Col>
                          }
                          <Col md="2" className="mt-2 pr-0">
                           <Input type="select" className="custom-select" onChange={ event => handleFilter('date_search', event.target.value)} value={state.date_search}>
                             <option value="">Select Type</option>
                             <option value="createdby">Created Date</option>
                             <option value="htoby">Appointment Date</option>
                            </Input>
                          </Col>
                          <Col md="2" className="mt-2 pr-0">
                            <Input type="select" className="custom-select" onChange={event => handleFilter('sales_channel', event.target.value)} value={state.sales_channel}>
                              <option value="">Sale Channel</option>
                              <option value="store">Store</option>
                              <option value="app">App</option>
                              </Input>
                          </Col>
                        <Col md="2"  className="mt-2 pr-0"> 
                          <DatePicker  selected={start_date} onChange={date => handleFilter('start_date', date)}  className="form-control" placeholderText="Start Date"  maxDate={ end_date || new Date() } isClearable={true}/>
                        </Col>
                        <Col md="2"  className="mt-2 pr-0">
                            <DatePicker  selected={end_date} disabled={!start_date} onChange={date => handleFilter('end_date', date)}  className="form-control"  placeholderText="End Date" maxDate={new Date()} minDate={start_date} isClearable={true}/>
                        </Col>
                        <Col md="2" className="mt-2 pr-0">
                          <NavLink  className="font-bold" href="#" disabled={loading} active style={{textDecoration: 'underline'}} onClick={()=>resetFilter()}> Reset Filter</NavLink>
                        </Col>
                        <Col className="mt-2 ml-3 pl-0" >
                        <FormGroup><Button type="button" color="primary" disabled={loading} onClick={()=>handleFilterSubmit(search)}>Filter Search</Button></FormGroup>
                        </Col>
                        </Row>
                      }
                      <br/>
                    <BootstrapTable
                      data={order.list}
                      remote
                      condensed
                      striped hover pagination
                      options={{ ...options }}
                      fetchInfo={{ dataTotalSize: order.total_rows }}
                      tableHeaderClass="mb-0"
                      
                    >
                      <TableHeaderColumn width="180" dataField="appointment_no" isKey dataFormat={(cell, row) =>
                      <NavLink href="#" active onClick={() => 
                        row.status === 2 ? 
                          draftTypeHto(row) 
                        : 
                          //history.push(`/hto/detail/${row.id}`)
                          window.open(`/hto/detail/${row.id}`, '_blank')
                      }>
                          {row.appointment_no}
                      </NavLink>}>
                        Order No
                      </TableHeaderColumn>
                      <TableHeaderColumn width="130" dataField="name" dataFormat={(cell, row) => titleCase(row.name)}>
                        Name
                      </TableHeaderColumn>
                      <TableHeaderColumn width="210" dataField="appointment_date" dataFormat={(cell,row) => row.appointment_date ? `${getDateFormat(row.appointment_date, false, false)} , ${row.slot_start_time}` : ''}>
                        HTO Date Time
                      </TableHeaderColumn>
                      <TableHeaderColumn width="150" dataField="created_at" dataFormat={(cell,row) => getDateFormat(row.created_at, false, true, userData.time_zone)}>
                        Created At
                      </TableHeaderColumn>
                      <TableHeaderColumn width="150" dataField="opt_name" dataFormat={(cell, row) => titleCase(row.opt_name)}>
                        Optician
                      </TableHeaderColumn>
                      <TableHeaderColumn width="150" dataField="address" dataFormat={(cell, row) => row.address || row.address_details}>
                        Location
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataField="sales_channel" dataFormat={(cell, row) => row.sales_channel && row.sales_channel.replace(/^./, row.sales_channel[0].toUpperCase())}>
                        Booking Channel
                      </TableHeaderColumn>
                      <TableHeaderColumn width="180" dataField="appointment_status" dataFormat={(cell,row) => row.appointment_status && titleCase(replaceGlobal(row.appointment_status || ''))}>
                        Status
                      </TableHeaderColumn>
                    </BootstrapTable>
              </CardBody>
            </Card>
        </Col>
      </Row>
  );
};

OrdersList.defaultProps = {
  isHto: true, 
  draftOrder: () => false,
  loading: false,
  exportOrdersData: () => false,
  start_date: null, 
  end_date: null,
  handleFilterSubmit: () => false,
  clearHtoInformation: () => false
}

export default OrdersList;

