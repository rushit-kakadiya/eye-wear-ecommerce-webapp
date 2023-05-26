import React, { useState } from "react";
import { Row, Col, Card, CardBody, Nav, NavLink, FormGroup, Input, Button } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import { s3BucketProduction } from "../../../../utilities/constants";

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
							<Button type="button" color="primary" onClick={() => history.push('/frame-color/add')} >Add New Frame Color</Button>
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
					<TableHeaderColumn width="120" dataField="variant_code" isKey dataFormat={(cell, row) =>
						<NavLink href="#" className="name-defination" active onClick={() => history.push(`/frame-color/${row.id}`)}>
							<strong>{row.variant_code}</strong>
						</NavLink>}>
						Color Code
					</TableHeaderColumn>
					<TableHeaderColumn width="130" dataField="variant_name" >
						Color Name
					</TableHeaderColumn>
					<TableHeaderColumn width="120" dataField="icon_image_key" dataFormat={(cell, row) =>
						<strong>
							<a href={row && row.icon_image_key ? `${s3BucketProduction + row.icon_image_key}` : ""} target="_blank">
								<img style={{ width: '25px', borderRadius: '0px' }} src={row && row.icon_image_key ? `${s3BucketProduction + row.icon_image_key}` : `${s3BucketProduction + "variant-icon/icon_placeholder.png"}`} />
							</a>
						</strong>
					}>
						Color Icon
					</TableHeaderColumn>
					<TableHeaderColumn width="200" dataField="variant_color_group">
						Color Group
					</TableHeaderColumn>
				</BootstrapTable>
			</Col>
		</Row>
	);
};

