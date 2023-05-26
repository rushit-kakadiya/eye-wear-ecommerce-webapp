import React, {useState} from 'react';
import { Row, Col, Card, CardBody, Nav, Button, Input, FormGroup, Tooltip} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import {checkRoleAccess, titleCase} from '../../utilities/methods';
import {roles_actions} from '../../utilities/constants';

export default ({options, user, history, setSearch, handleFilterSubmit, toggle, setUserId, userData, setStatus}) => {
    const [tooltipOpen, setTooltipOpen] = useState(''); 
    // Toggle tooltip
    const toggleTooltip = (id) => {
        if(id === tooltipOpen){
            setTooltipOpen('');
        } else {
            setUserId(id);
            setTooltipOpen(id);
        }
    };
    // list for tooltip
    const listAction = (row) =>{
        return(
            <i className="fa fa-ellipsis-h" aria-hidden="true" style={{cursor: "pointer"}} onClick={() => toggleTooltip(row.id)} id="TooltipExample">
                <Tooltip placement="bottom" isOpen={tooltipOpen === row.id} target="TooltipExample" style={{backgroundColor:"#e9ecef"}}>
                <Col className="text-left">
                    <i className="fas fa-edit text-success p-1" > </i> <span style={{cursor: "pointer"}}  className="text-dark" onClick={() => history.push(`/update-admin/${row.id}`) }>Edit </span><br/>
                    <i className="fas fa-lock text-success p-1" > </i> <span style={{cursor: "pointer"}}  className="text-dark" onClick={()=>toggle('resetPassword')}>Reset Password </span><br/>
                    <i className={`fas ${row.status === 1 ? 'fa-trash text-danger' : 'fa-unlock text-success'} p-1`}> </i> <span style={{cursor: "pointer"}}  className={row.status === 1 ? "text-danger" : "text-success"} onClick={()  => {
                        setUserId(row.id);
                        toggle('updateStatus');
                        setStatus(row.status);
                    }}>{row.status === 1 ? 'De-activate' : 'Activate'} </span>
                </Col>
                </Tooltip> 
            </i>
        )
    };

    return(
        <Row>
        <Col md="12">
          <Card>
            <CardBody>
                    <Nav>
                        <h3>Users</h3>
                    </Nav>
                    <Row>
                        <Col md="4">
                        <FormGroup>
                            <Input type="text" name="search" id="search" placeholder="Search"  onKeyUp={event=>{event.keyCode === 13 ? handleFilterSubmit() : setSearch(event.target.value) }}/>
                        </FormGroup>
                        </Col>
                        <Col md="1">
                          <FormGroup><Button type="button" color="primary" onClick={()=>handleFilterSubmit()}>Filter</Button></FormGroup>
                        </Col>
                        {checkRoleAccess(userData.accessRole, userData.permissions, 'admin', roles_actions.is_add) &&
                            <Col md="7" style={{textAlign: 'right'}}>
                                <FormGroup><Button type="button"  color="primary" onClick={() => history.push('/add-admin')} >Add New User</Button>
                                </FormGroup>
                            </Col>
                        }
                        </Row>    
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
                        <TableHeaderColumn  dataField="name" isKey  dataFormat={(cell, row)=> titleCase(row.name) }>
                            User Name
                        </TableHeaderColumn>
                        <TableHeaderColumn  dataField="email" >
                            Email
                        </TableHeaderColumn>
                        <TableHeaderColumn width="150" dataField="role" >
                            Role
                        </TableHeaderColumn>
                        <TableHeaderColumn width="150" dataField="role" dataFormat={(cell, row)=> row.status === 1 ? <span className="text-success"> Active </span> : <span className="text-danger"> De-active </span> }>
                            Status
                        </TableHeaderColumn>
                        { checkRoleAccess(userData.accessRole, userData.permissions, 'admin', roles_actions.is_add) &&
                            <TableHeaderColumn width="150" dataField="role" dataFormat={(cell, row)=>listAction(row)}>
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