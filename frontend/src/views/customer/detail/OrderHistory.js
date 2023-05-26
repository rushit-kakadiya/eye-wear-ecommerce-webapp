import React from  'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { NavLink } from "reactstrap";
import {getDateFormat, getNumberFormat, titleCase} from  '../../../utilities/methods';


export default ({orderList, options, history, userData}) =>{
      return(
        <BootstrapTable
        data={orderList }
        remote
        condensed
        striped hover 
        // pagination
        options={{ ...options }}
        //fetchInfo={{ dataTotalSize: orderList.total_rows }}
        tableHeaderClass="mb-0"
        
      >
        <TableHeaderColumn width="200" dataField="order_no" isKey dataFormat={(cell, row) => 
            <NavLink href="#" active onClick={() => history.push(`/order-detail/${row.order_no.replace('/', '-')}`)}>
                  {row.order_no}
            </NavLink> 
        }>
          Order NO
        </TableHeaderColumn>
        <TableHeaderColumn width="130" dataField="name" >
          Name
        </TableHeaderColumn>
        <TableHeaderColumn width="160" dataFormat={(cell,row) => getDateFormat(row.created_at, false, true, userData.time_zone)}>
          Date
        </TableHeaderColumn>
        <TableHeaderColumn width="120" dataFormat={(cell,row)=> getNumberFormat(row.payment_amount, row.currency_code)}>
          Total  Payment
        </TableHeaderColumn>
        {/* <TableHeaderColumn width="150" >
          Payment Status
        </TableHeaderColumn> */}
        <TableHeaderColumn width="150" dataFormat={(cell,row)=> titleCase(row.order_status.replace("_"," "))}>
          Order Status
        </TableHeaderColumn>
        {/* <TableHeaderColumn width="100">
          Qty
        </TableHeaderColumn> */}
        <TableHeaderColumn  width="120" dataFormat={(cell, row) => row.fulfillment_type === 1 ? 'Delivery' : 'Pick up at store' }>
          Delivery Type
        </TableHeaderColumn>
        <TableHeaderColumn width="120" dataFormat={(cell,row)=>titleCase(row.sales_channel)}>
          Sales Channel
        </TableHeaderColumn>
        <TableHeaderColumn width="130" dataField="admin_name">
          Created By
        </TableHeaderColumn>
      </BootstrapTable>
    )
}