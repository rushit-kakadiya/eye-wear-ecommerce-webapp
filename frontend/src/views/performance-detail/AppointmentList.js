import React from 'react';
import { Row, Col, Table, NavLink } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { getDateFormat, getHTODateFormat, titleCase, replaceGlobal} from '../../utilities/methods';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export default ({ options, performanceDetail, history }) => {
    return (
        <Row>
            <Col>
                <BootstrapTable
                    data={performanceDetail.list}
                    remote
                    condensed
                    striped 
                    hover 
                    pagination
                    options={{ ...options }}
                    fetchInfo={{ dataTotalSize: performanceDetail.total_rows }}
                    tableHeaderClass="mb-0"

                >
                    <TableHeaderColumn width="180" dataField="appointment_no" isKey dataFormat={(cell, row) =>
                      <NavLink href="#" active onClick={() => history.push(`/hto/detail/${row.id}`)}>
                          {row.appointment_no}
                      </NavLink>}>
                        Order No
                    </TableHeaderColumn>
                    <TableHeaderColumn width="130" dataField="name">
                        Name
                      </TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField="appointment_date" dataFormat={(cell,row) => row.appointment_date ? `${getHTODateFormat(row.appointment_date)} , ${row.slot_start_time} - ${row.slot_end_time}` : ''}>
                        HTO Date Time
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="created_at" dataFormat={(cell,row) => getDateFormat(row.created_at)} >
                        Created At
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="notes">
                        Notes
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="address">
                        Location
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="appointment_status"  dataFormat={(cell,row) => row.appointment_status && titleCase(replaceGlobal(row.appointment_status || ''))}>
                        Status
                    </TableHeaderColumn>
                </BootstrapTable>
            </Col>
        </Row>
    )
}