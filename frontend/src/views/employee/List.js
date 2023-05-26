import React, {useState} from 'react';
import { Row, Col, Card, CardBody, Nav, Button, Input, FormGroup } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {checkRoleAccess, titleCase} from '../../utilities/methods';
import {roles_actions} from '../../utilities/constants';

export default ({options, user, history, setState, handleFilterSubmit, handleDelete, userData, stores, loading, resetFilter, roles, state}) => {
    const [isFilter, showFilter] = useState(false);
    // list for tooltip
    const listAction = (row) =>{
        return(
                <Col className="text-left">
                    <i className="fas fa-edit text-success p-1" style={{cursor: "pointer"}} onClick={() => { history.push(`/update-employee/${row.id}`); }}> </i> &nbsp;
                    <i className="fas fa-trash text-danger p-1" style={{cursor: "pointer"}} onClick={()=> handleDelete(row.id) }> </i>
                </Col>
        )
    };

    return(
        <Row>
        <Col md="12">
          <Card>
            <CardBody>
                    <Nav>
                        <h3>Employee</h3>
                    </Nav>
                    <Row>
                        <Col md="4">
                        <FormGroup>
                            <Input type="text" name="search" id="search" placeholder="Search" onKeyUp={event=>{event.keyCode === 13 ? handleFilterSubmit() : setState({...state, search: event.target.value}) }}/>
                        </FormGroup>
                        </Col>
                        <Col md="2">
                          <FormGroup><Button type="button" color="primary" onClick={() => showFilter(!isFilter)}>{isFilter ? 'Hide Filter' : 'More Filter'}</Button></FormGroup>
                        </Col>
                        {checkRoleAccess(userData.accessRole, userData.permissions, 'employee', roles_actions.is_add) &&
                            <Col md="6" className="text-right">
                                <FormGroup><Button type="button"  color="primary" onClick={() => history.push('/add-employee')} >Add New Employee</Button>
                                </FormGroup>
                            </Col>
                        }
                        </Row>  
                        {
                        isFilter && 
                        <Row className="ml-0 mr-1" style={{backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
                            <Col md="2" className="mt-2">
                             <Input type="select" className="custom-select" value={state.role}  onChange={(e) => setState({...state, role: e.target.value})}>
                                <option value="">All Role</option>
                                {roles.filter(r => ['store-staff', 'customer-services', 'optician', 'hto-staff'].includes(r.role)).map(row => <option value={row.role} key={row.role}> {titleCase(row.name)} </option>)}
                             </Input>
                            </Col> 
                            <Col md="3" className="mt-2">
                            <Input type="select" className="custom-select" value={state.store_id} onChange={(e) => setState({...state, store_id: e.target.value})}>
                              <option value="" key="empty">All Store</option>
                                { stores.map((row, index) =>
                                    <option value={row.id} key={index}>{row.name}</option>
                                  )}
                              </Input>
                          </Col> 
                            <Col md="2" className="mt-2 text-right"> 
                                <FormGroup><Button type="button" color="primary" disabled={loading} onClick={()=>handleFilterSubmit()}>Filter Search</Button></FormGroup>
                            </Col>
                            <Col md="2" className="mt-2">
                            <FormGroup><Button type="button" outline color="warning" onClick={()=>resetFilter()}>Reset Filter</Button></FormGroup>
                            </Col>
                        </Row>
                        }
                        <br/>
                        <BootstrapTable
                            data={[...user.list]}
                            remote
                            condensed
                            striped hover pagination
                            options={{ ...options }}
                            fetchInfo={{ dataTotalSize: user.total_rows }}
                            tableHeaderClass="mb-0"
                        >  
                        <TableHeaderColumn  dataField="emp_ref_code" isKey>
                            Employee ID
                        </TableHeaderColumn>
                        <TableHeaderColumn  dataField="city" >
                            Location
                        </TableHeaderColumn>
                        <TableHeaderColumn  dataField="store_name" >
                            Store
                        </TableHeaderColumn>
                        <TableHeaderColumn  dataField="name" dataFormat={(cell, row)=> titleCase(row.name) }>
                            Name
                        </TableHeaderColumn>
                        <TableHeaderColumn width="150" dataField="role">
                            Role
                        </TableHeaderColumn>
                        { checkRoleAccess(userData.accessRole, userData.permissions, 'employee', roles_actions.is_update) &&
                            <TableHeaderColumn width="120" dataField="role" dataFormat={(cell, row)=> listAction(row) }>
                                Action
                            </TableHeaderColumn>
                        }
                        </BootstrapTable>
              </CardBody>
            </Card>
        </Col>
      </Row>
     )
}