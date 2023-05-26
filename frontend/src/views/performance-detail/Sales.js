import React from 'react';
import { Row, Col, Table, NavLink } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { getNumberFormat, getDateFormat, getOrderStatus, getPaymentMethod } from '../../utilities/methods';
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
                    <TableHeaderColumn width="180" dataField="order_no" isKey dataFormat={(cell, row) => 
                      <NavLink href="#" active onClick={() => history.push(`/order-detail/${row.order_no.replace('/', '-')}`)}>
                          {row.order_no}
                      </NavLink>}>
                        Order No
                    </TableHeaderColumn>
                    <TableHeaderColumn width="130" dataField="name">
                        Name
                    </TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField="created_at" dataFormat={(cell,row) => getDateFormat(row.created_at)}>
                        Date Time
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="payment_amount" dataFormat={(cell, row) => getNumberFormat(row.payment_amount)}>
                        Total Payment
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="payment_status" dataFormat={(cell, row) => row.order_status && row.order_status  === 'order_confirmed' ? 'Payment confirmed' : ['payment_initiated', 'payment_pending','payment_confirmed','payment_failed', 'payment_cancelled'].includes(row.order_status) ? row.order_status.replace("_", " ") : '-'}>
                        Payment Status
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="payment_method"  dataFormat={(cell, row) => getPaymentMethod(row) }>
                        Payment Method
                    </TableHeaderColumn>
                    <TableHeaderColumn width="150" dataField="order_status" dataFormat={(cell, row) => row.order_status && row.order_status.replace("_", " ").toUpperCase() }>
                        Order Status
                    </TableHeaderColumn>
                </BootstrapTable>
            </Col>
        </Row>
    )
}