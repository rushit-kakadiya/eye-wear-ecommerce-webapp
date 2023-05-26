import React from 'react';
import { Row, Col, Table, NavLink } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { getNumberFormat } from '../../utilities/methods';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export default ({ options, history, analytics }) => {


    return (
        <Row>
            <Col>
                <BootstrapTable
                    data={analytics.list}
                    remote
                    condensed
                    striped hover pagination
                    options={{ ...options }}
                    fetchInfo={{ dataTotalSize: analytics.total_rows }}
                    tableHeaderClass="mb-0"
                >
                    {/* <TableHeaderColumn width="180" dataField="created_by_staff" isKey>
                        Employee ID
                    </TableHeaderColumn> */}
                    <TableHeaderColumn width="180" dataField="emp_ref_code" isKey>
                        Employ Id
                    </TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField="name" dataFormat={(cell, row) => 
                        <NavLink href="#" active onClick={() => history.push(`/performance-detail/${options.type}/${row.id}`)}> {row.name} </NavLink>} >
                        Name
                    </TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField="total_sales_as_staff" dataFormat={(cell, row) => getNumberFormat(row.total_sales_as_staff)}>
                        Total Sales as Staff
                    </TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField="total_sales_items_as_staff" >
                        Total Sales items as Staff
                    </TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField="total_sales_as_optician" dataFormat={(cell, row) => getNumberFormat(row.total_sales_as_optician)}>
                        Total Sales as Optician
                    </TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField="total_sales_items_as_optician" >
                        Total Sales items as Optician
                    </TableHeaderColumn>
                </BootstrapTable>
            </Col>
        </Row>
    )
}