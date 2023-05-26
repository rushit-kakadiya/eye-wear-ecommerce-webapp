import React, {useState} from "react";
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink, FormGroup, Input, Button, Modal, ModalHeader, Popover, PopoverHeader, PopoverBody} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classnames from "classnames";
import Select from 'react-select';
import StoreListModal from "../modal/StoreList";
import {getDateFormat, getNumberFormat, getPaymentMethod, replaceGlobal, checkRoleAccess, titleCase} from '../../utilities/methods';
import { orderStatus, paymentStatus, paymentMethod, roles_actions } from '../../utilities/constants';
import './order.scss';

const OrdersList = ({
  order, 
  order_status, 
  selectOrderType, 
  options, 
  history, 
  stores, 
  hadnleStoreSelection, 
  handleFilter, 
  draftOrder, 
  clearUserInfo, 
  isHto, 
  orderProcess, 
  loading, 
  selectPaymentMethod, 
  exportOrdersData, 
  storeId,
  time_zone,
  start_date, 
  end_date,
  handleFilterSubmit,
  showFilter,
  setShowFilter,
  state,
  resetFilter,
  inputPersonList,
  opticianList, 
  hadnleFilterStore,
  userData
}) => {
  const [search, setSearch] = useState('');
  const [modal, setModal] =  useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const store = stores.find(s => s.id == storeId);
  const toggle = () => {
    setModal(!modal);
  };

  // Order status
  const getOrderStatus = status  => {
    if(status === 'payment_confirmed'){
      return 'Mark as Completed';
    } else if(status === 'order_pending'){
      return `Order Pending`;
    } else {
      return '__';
    }
  };

  return (
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
                    <Nav>
                        <NavItem>
                            <NavLink href="#" className={classnames({ active: order_status === 'all' })} onClick={() => handleFilter('order_status', 'all')} style={{textDecoration: order_status === 'all' ? 'overline' : 'none'}}>
                                <h6>All</h6>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#" className={classnames({ active: order_status === 'unprocessed' })} onClick={() => handleFilter('order_status', 'unprocessed')} style={{textDecoration: order_status === 'unprocessed' ? 'overline' : 'none'}}>
                                <h6>Unprocessed</h6>
                            </NavLink>
                        </NavItem> 
                        {!isHto &&
                        <>
                        <NavItem>   
                            <NavLink href="#" className={classnames({ active: order_status === 'unpaid' })} onClick={() => handleFilter('order_status', 'unpaid')} style={{textDecoration: order_status === 'unpaid' ? 'overline' : 'none'}}>
                                <h6>Unpaid</h6>
                            </NavLink>
                        </NavItem>
                        
                        <NavItem>   
                            <NavLink href="#" className={classnames({ active: order_status === 'draft' })} onClick={() => handleFilter('order_status', 'draft')} style={{textDecoration: order_status === 'draft' ? 'overline' : 'none'}}>
                                <h6>Draft</h6>
                            </NavLink>
                        </NavItem>
                        </>
                        }
                    </Nav>
                    <br/>
                    <Row>
                        <Col md="3">
                            <Input type="text" name="search" id="search" placeholder="Search by order no." onKeyUp={event=>{event.keyCode === 13 ? handleFilterSubmit(search) : setSearch(event.target.value) }} />
                        </Col>
                        <Col md={order_status !== 'draft' ? "5" : "3"}>
                          <FormGroup><Button type="button" color="primary" onClick={() => setShowFilter(!showFilter)}>{showFilter ? 'Hide Filter' : 'More Filter'}</Button></FormGroup>
                        </Col>
                          <Col md={isHto ? "4" : "2"} style={{textAlign: 'right'}}>
                            { order_status !== 'draft' && !isHto && !storeId && checkRoleAccess(userData.accessRole, userData.permissions, 'export', roles_actions.is_get) && 
                              <FormGroup>
                                <Button type="button" color="primary" disabled={loading} onClick={() => exportOrdersData()}><i className="fas fa-file-excel"></i> Export</Button>
                              </FormGroup>
                            }
                          </Col>
                        {!isHto &&
                        <Col md={order_status !== 'draft' ? '2' : '4'} style={{textAlign: 'right'}}>
                          <Modal
                              isOpen={modal}
                              toggle={toggle.bind(null)}
                              className={null}
                              size="md"
                          >
                            <ModalHeader toggle={toggle.bind(null)}>Select Store</ModalHeader>
                            <StoreListModal history={history} stores={stores} hadnleStoreSelection={hadnleStoreSelection} toggle={toggle.bind(null)} storeId={storeId}/>
                          </Modal>
                          {checkRoleAccess(userData.accessRole, userData.permissions, 'order', roles_actions.is_add) &&
                            <FormGroup>
                            <Button type="button" color="primary" id={`Popover-1`} onClick={()  => {
                                if(userData.accessRole === 'store-account'){
                                  selectOrderType('store');
                                  hadnleStoreSelection({value: store.id, label: store.name});
                                  history.push('/order/add');
                                } else {
                                  setPopoverOpen(!popoverOpen)
                                }
                              }
                            }>Add New Order</Button>
                            <Popover placement="bottom" isOpen={popoverOpen} target="Popover-1" toggle={toggle.bind(null)}>
                              <PopoverHeader>Select Order Channel</PopoverHeader>
                              <PopoverBody style={{width:"200px"}} >
                                <FormGroup>
                                  <Button color="primary" type="button" onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    setModal(true);
                                    selectOrderType('store');
                                    clearUserInfo();
                                  }}>In Store</Button>
                                  <Button color="primary" className="ml-1" type="button" onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('whatsapp');
                                    clearUserInfo();
                                    history.push('/order/add')
                                  }}>
                                  Whatsapp
                                </Button>
                                  <Button color="primary" className="mt-1" type="button" style={{width:'42%'}} onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('hto');
                                    clearUserInfo();
                                    history.push('/order/add')
                                  }}>
                                  Hto
                                </Button>
                                  <Button color="primary" className="mt-1  ml-1" type="button" style={{width:'53%'}} onClick={() => {
                                    setPopoverOpen(!popoverOpen);
                                    hadnleStoreSelection(null);
                                    selectOrderType('website');
                                    clearUserInfo();
                                    history.push('/order/add')
                                  }}>
                                  Website
                                </Button>
                                </FormGroup>
                              </PopoverBody>
                          </Popover>
                          </FormGroup>
                        }
                        </Col>
                        }
                        </Row>
                    {/* </Form>  */}
                    {
                      showFilter && 
                      <Row className="ml-0 mr-1" style={{backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
                        <Col md="2" className="mt-2 pr-0">
                            <Select
                                onChange={event => handleFilter('sales_channel', event ? event.value : '')}
                                placeholder="Sales Channel"
                                options={[{id: 'store', name: 'Store'}, {id: 'app', name: 'App'}, {id: 'hto', name: 'HTO'}, {id: 'whatsapp', name: 'Whatsapp'}, {id: 'website', name: 'Website'}].map(row => ({value: row.id, label: titleCase(row.name)}))}
                                isClearable={true}
                            />
                        </Col>
                        {/* <Col md="2" className="mt-2 pr-0">
                            <Select
                                onChange={event => handleFilter('delivery_type', event.value)}
                                placeholder="Delivery Type"
                                options={[{id: 'store', name: 'Store'}, {id: 'whatsapp', name: 'Whatsapp'}].map(row => ({value: row.id, label: titleCase(row.name)}))}
                            />
                        </Col> */}
                        <Col md="2" className="mt-2 pr-0">
                              <Select
                                onChange={event => handleFilter('payment_method', event ? event.value : undefined)}
                                placeholder="Payment Type"
                                options={Object.keys(paymentMethod).filter(row=>row !== "4").map(row => ({value: row, label: paymentMethod[row]}))}
                                isClearable={true}
                              />
                        </Col>
                        <Col md="2" className="mt-2 pr-0">
                            <Select
                                onChange={event => handleFilter('date_search', event ? event.value : '')}
                                placeholder="Select Sort Type"
                                options={[{id: 'createdby', name: 'Created Date Asc'}, {id: 'completedby', name: 'Created Date Desc'}].map(row => ({value: row.id, label: titleCase(row.name)}))}
                                isClearable={true}
                            />
                        </Col>
                        <Col md="2" className="mt-2 pr-0">
                            <Select
                                onChange={event => handleFilter('sales_person', event ? event.value : '')}
                                placeholder="Select Staff"
                                options={[...inputPersonList, ...opticianList].map(row => ({value: row.id, label: titleCase(row.name)}))}
                                isClearable={true}
                            />
                        </Col>  
                        <Col md="2" className="mt-2 pr-0">
                            <Select
                                onChange={event => handleFilter('optician', event ? event.value : '')}
                                placeholder="Select Optician"
                                options={[...inputPersonList, ...opticianList].map(row => ({value: row.id, label: titleCase(row.name)}))}
                                isClearable={true}
                            />
                        </Col>
                        <Col md="2" className="mt-2">
                        <NavLink  className="font-bold" href="#" disabled={loading} active style={{textDecoration: 'underline', padding:'0px'}} onClick={()=>resetFilter()}> Reset Filter</NavLink>
                        </Col>
                        {order_status !== 'draft' && 
                          <>
                          <Col md="2" className="mt-2 pr-0">
                              <Select
                                onChange={event => handleFilter('order_status', event ? event.value : 'all')}
                                placeholder="Order Status"
                                options={orderStatus}
                                isClearable={true}
                              />
                          </Col>
                          <Col md="2" className="mt-2 pr-0">
                              <Select
                                onChange={event => handleFilter('payment_status', event ? event.value : '')}
                                placeholder="Payment Status"
                                options={paymentStatus}
                                isClearable={true}
                              />
                          </Col> {console.log('state.payment_status', state.payment_status)}
                          </>
                        }
                        { !storeId &&
                         <Col md="2" className="mt-2 pr-0">
                              <Select
                                onChange={event => hadnleFilterStore(event ? event.value : '')}
                                placeholder="Select Store"
                                options={stores.map(row => ({value: row.id, label: titleCase(row.name)}))}
                                isClearable={true}
                              />
                          </Col>
                        }
                        <Col md="2"  className="mt-2 pr-0">
                        <DatePicker  selected={start_date} onChange={date => handleFilter('start_date', date)}  className="form-control" placeholderText="Start Date"  maxDate={ end_date || new Date() } isClearable={true}/>
                        </Col>
                        <Col md="2"  className="mt-2 pr-0">
                        <DatePicker  selected={end_date} disabled={!start_date} onChange={date => handleFilter('end_date', date)}  className="form-control"  placeholderText="End Date" maxDate={new Date()} minDate={start_date} isClearable={true}/>
                        </Col>
                        <Col md={order_status !== 'draft' ? '2' :  '2'} className="mt-2 " >
                        <FormGroup><Button type="button" color="primary" onClick={()=>handleFilterSubmit(search)}>Filter Search</Button></FormGroup>
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
                      <TableHeaderColumn width="180" dataField="order_no" isKey dataFormat={(cell, row) => order_status !== 'draft' ? 
                      <NavLink href="#" active onClick={() => 
                        //history.push(`/order-detail/${row.order_no.replace('/', '-')}`)
                        window.open(`/order-detail/${row.order_no.replace('/', '-')}`, '_blank')
                      }>
                          {row.order_no}
                      </NavLink> : row.order_no}>
                        Order No
                      </TableHeaderColumn>
                      <TableHeaderColumn width="130" dataField="name">
                        Name
                      </TableHeaderColumn>
                      <TableHeaderColumn width="180" dataField="created_at" dataFormat={(cell,row) => getDateFormat(row.created_at, true, true, time_zone)}>
                        Date Time
                      </TableHeaderColumn>
                      <TableHeaderColumn width="130" dataField="total" dataFormat={(cell, row) => order_status === 'draft' ? '-' : getNumberFormat(row.payment_amount, row.currency_code)}>
                        Total Payment
                      </TableHeaderColumn>
                      <TableHeaderColumn width="150" dataField="order_status" dataFormat={(cell, row) => order_status === 'draft' ?  '-' :  ['payment_initiated', 'payment_pending'].includes(row.payment_status) && row.payment_category !== 0 ? 'Waiting Payment' : replaceGlobal(row.payment_status)}>
                        Payment Status
                      </TableHeaderColumn>
                      <TableHeaderColumn width="160" dataField="order_status" dataFormat={(cell, row) => order_status === 'draft' ?  '-' : 
                        row.payment_status !== 'partial_paid' && row.payment_category !== 0 ? getPaymentMethod(row) : 
                        <NavLink href="#" disabled={loading} active onClick={() => selectPaymentMethod({order_no: row.order_no, payment_amount: row.payment_amount, paid_amount: row.amount, payment_req_id: row.payment_req_id, name: row.name, payment_category: row.payment_category})} style={{textDecoration: 'underline'}}>
                          <h6 style={{textAlign:'center'}}>{ row.payment_category === 1 ? 'Continue Payment' : 'Choose Method' }</h6>
                        </NavLink>
                      }>
                        Payment Method
                      </TableHeaderColumn>
                      <TableHeaderColumn width="170" dataField="order_status" dataFormat={(cell, row) => order_status === 'draft' ? 
                      <NavLink href="#" active onClick={() => draftOrder(row)} style={{textDecoration: 'underline'}}>
                          <h6>Draft</h6>
                      </NavLink> : 
                      row.order_status && !['payment_initiated', 'payment_pending','payment_confirmed','payment_failed', 'payment_cancelled', 'order_pending'].includes(row.order_status) ? replaceGlobal(row.order_status) : 
                      <NavLink href="#" disabled={loading ||  !['payment_confirmed', 'order_pending'].includes(row.order_status) || ((row.store_id === "6598" || row.store_id === null) && !row.stock_store_id) } active onClick={() => orderProcess(row.order_no, row.order_status)} style={{textDecoration: 'underline'}}>
                        <h6 style={{textAlign:'center'}}>{getOrderStatus(row.order_status)}</h6>
                      </NavLink>
                      }>
                        Order Status
                      </TableHeaderColumn>
                      <TableHeaderColumn width="130" dataField="sales_channel" dataFormat={(cell, row) => row.sales_channel && row.sales_channel.replace(/^./, row.sales_channel[0].toUpperCase())}>
                        Sales Channel
                      </TableHeaderColumn>
                      <TableHeaderColumn width="150" dataField="stock_store_id" dataFormat={(cell, row) => row.store_name ? row.store_name : '-'}>
                        Store in Charge 
                      </TableHeaderColumn>
                      <TableHeaderColumn width="130" dataField="admin_name">
                        Created By
                      </TableHeaderColumn>
                    </BootstrapTable>
              </CardBody>
            </Card>
        </Col>
      </Row>
  );
};

OrdersList.defaultProps = {
  isHto: false, 
  stores: [],
  hadnleStoreSelection: () => false, 
  selectOrderType: () => false, 
  draftOrder: () => false, 
  clearUserInfo: () => false,
  orderProcess:() => false,
  loading: false,
  selectPaymentMethod: () => false,
  exportOrdersData: () => false,
  storeId: '',
  start_date: null, 
  end_date: null,
  handleFilterSubmit: () => false,
  resetFilter: () => false
}

export default OrdersList;

