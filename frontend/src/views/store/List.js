import React, { useState } from "react";
import { Row, Col, Card, CardBody, Nav, NavLink, FormGroup, Input, Button } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { checkRoleAccess, titleCase} from '../../utilities/methods';
import {roles_actions} from '../../utilities/constants';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import "react-datepicker/dist/react-datepicker.css";


export default ({ history, store, options, userData, handleFilterSubmit }) => {
	const [search, setSearch] = useState('');

	return (
		<Row>
			<Col md="12">
				<Card>
					<CardBody>
						<Nav>
							<h3>Stores</h3>
						</Nav>
						<Row>
							<Col md="3">
								<FormGroup>
									<Input type="text" name="search" id="search" placeholder="Search" onKeyUp={event => { event.keyCode === 13 ? handleFilterSubmit(search) : setSearch(event.target.value) }} />
								</FormGroup>
							</Col>
							<Col md="1">
								<FormGroup><Button type="button" color="primary" onClick={()=>handleFilterSubmit(search)}>Filter</Button></FormGroup>
							</Col>
							<Col md="8" style={{ textAlign: 'right' }}>
							{ checkRoleAccess(userData.accessRole, userData.permissions, 'employee', roles_actions.is_add) &&
								<FormGroup>
									<Button type="button" color="primary" onClick={() => history.push('/add-store')} >Add New Store</Button>
								</FormGroup>
							}
							</Col>
						</Row>
						<br/>
						<BootstrapTable
							data={store.list}
							remote
							condensed
							striped hover pagination
							options={{ ...options }}
							fetchInfo={{ dataTotalSize: store.total_rows }}
							tableHeaderClass="mb-0"
						>
							<TableHeaderColumn width="150" dataField="name" isKey dataFormat={(cell, row) =>
								<NavLink href="#" className="name-defination" active onClick={() => history.push(`/store-detail/${row.id}`)}>
									<strong>{titleCase(row.name)}</strong>
								</NavLink>}>
								Name
              				</TableHeaderColumn>
							<TableHeaderColumn width="130" dataField="store_code" >
								Code
               				</TableHeaderColumn>
							<TableHeaderColumn width="120" dataField="store_region">
								Region
              				</TableHeaderColumn>
							<TableHeaderColumn width="200" dataField="email">
								Email
              				</TableHeaderColumn>
							<TableHeaderColumn width="150" dataField="phone" dataFormat={(cell, row) => {return row.phone} }>
								Phone
              				</TableHeaderColumn>
							<TableHeaderColumn width="100" dataFormat={(cell, row) => {
								return row && row.active  ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-danger">InActive</span>'
							}}>
								Status
              				</TableHeaderColumn>
						</BootstrapTable>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

