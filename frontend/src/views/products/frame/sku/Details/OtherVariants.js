import React, { useState } from "react";
import { Row, Col, Card, CardBody, Nav, NavLink, FormGroup, Input, Button, Badge } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import ToggleButton from 'react-toggle-button';

import { getNumberFormat, titleCase } from '../../../../../utilities/methods';

import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import "react-datepicker/dist/react-datepicker.css";


export default ({ history, options, products, state, loading, handleFilterSubmit }) => {

	const [toggle, setToggle] = useState({ status: false, id: '' });



	const handleToggle = (status, id) => {
		setToggle({ status, id });
	  };
	
	  const handleRedirection = (sku) => {
		  window.open(`/frame/${sku}`)
	  }

	return (
		<Row>
			<Col md="12">
				<BootstrapTable
					data={products.list}
					remote
					condensed
					striped 
					hover 
					pagination
					options={{ ...options }}
					tableHeaderClass="mb-0"

				>
					<TableHeaderColumn isKey width="100" dataField="sku" dataFormat={(cell, row) =>
						<NavLink href="#" active onClick={() => handleRedirection(row.sku)}>
							{row.sku}
						</NavLink>
					}>
						SKU
					</TableHeaderColumn>
					<TableHeaderColumn width="130" dataField="name" dataFormat={(cell, row) => titleCase(row.name)}>
						Product Name
					</TableHeaderColumn>
					<TableHeaderColumn width="100" dataField="price" dataFormat={(cell, row) => getNumberFormat(row.price)}>
						Price
					</TableHeaderColumn>
					<TableHeaderColumn width="70" dataField="status" dataFormat={(cell, row) =>
						<ToggleButton
							value={toggle.status && toggle.id === row.id}
							onToggle={(value) => handleToggle(!value, row.id)}
							activeLabel="Show"
							inactiveLabel="Hide"
						/>
					}>
						Show on App
					</TableHeaderColumn>
					<TableHeaderColumn width="70" dataField="status" dataFormat={(cell, row) =>
						<Badge color={row.status ? "success" : "danger"} className="mr-2" pill> {row.status ? 'Active' : 'De-Activate'} </Badge>
					}>
						Status
					</TableHeaderColumn>
				</BootstrapTable>
			</Col>
		</Row>
	);
};

