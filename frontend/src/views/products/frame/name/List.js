import React, { useState } from "react";
import { Row, Col, Card, CardBody, Nav, NavLink, FormGroup, Input, Button } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { getNumberFormat, titleCase } from '../../../../utilities/methods';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import "react-datepicker/dist/react-datepicker.css";



export default ({ history, products, options, state, loading, handleFilterSubmit }) => {

	const [search, setSearch] = useState('');

	return (
		<Row>
			<Col md="12">
				<Row>
					<Col md="4">
						<FormGroup>
							<Input type="text" name="search" id="search" placeholder="Search" onKeyUp={event => { event.keyCode === 13 ? handleFilterSubmit(search) : setSearch(event.target.value) }} />
						</FormGroup>
					</Col>
					<Col md="8" style={{ textAlign: 'right' }}>
						<FormGroup>
							<Button type="button" color="primary" onClick={() => history.push('/frame-name/add')} >Add New Frame Name</Button>
						</FormGroup>
					</Col>
				</Row>
				<br />
				<BootstrapTable
					data={products.list}
					remote
					condensed
					striped hover pagination
					options={{ ...options }}
					fetchInfo={{ dataTotalSize: products.total_rows }}
					tableHeaderClass="mb-0"
				>
					<TableHeaderColumn width="130" isKey dataField="frame_code" dataFormat={(cell, row) =>
						<NavLink href="#"  className="name-defination"  active onClick={() => history.push(`/frame-name/${row.id}`)}>
							<strong>{row.frame_code}</strong>
						</NavLink>} >
						Frame Code
					</TableHeaderColumn>
					<TableHeaderColumn width="120" dataField="frame_name">
						Frame Name
					</TableHeaderColumn>
					<TableHeaderColumn width="200" dataField="material" dataFormat={(cell, row) =>
						<span>
							<strong>{titleCase(row.material)}</strong>
						</span>}
					>
						Material
					</TableHeaderColumn>
				</BootstrapTable>
			</Col>
		</Row>
	);
};

