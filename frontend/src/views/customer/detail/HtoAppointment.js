import React from  'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { NavLink } from "reactstrap";
import {getDateFormat, getNumberFormat, titleCase, replaceGlobal} from  '../../../utilities/methods';


export default ({htoAppointment, options, history,  userData}) =>{
      return(       
            <BootstrapTable
            data={htoAppointment.list}
            remote
            condensed
            striped hover 
            // pagination
            options={{ ...options }}
            // fetchInfo={{ dataTotalSize: order.total_rows }}
            tableHeaderClass="mb-0"        
                >
                <TableHeaderColumn width="180" dataField="appointment_no" isKey dataFormat={(cell, row) =>
                <NavLink href="#" active onClick={()=>history.push(`/hto/detail/${row.id}`)} >
                    {row.appointment_no}
                </NavLink>}>
                    Order No
                </TableHeaderColumn>
                <TableHeaderColumn width="130"  dataField="name" dataFormat={(cell, row) => titleCase(row.name)}>
                    Name
                </TableHeaderColumn>
                <TableHeaderColumn width="170" dataField="appointment_date" dataFormat={(cell,row) => row.appointment_date ? `${getDateFormat(row.appointment_date, false, false)} , ${row.slot_start_time}` : ''}>
                    HTO Date Time
                </TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="created_at" dataFormat={(cell,row) => getDateFormat(row.created_at, false, true, userData.time_zone)}>
                    Created At
                </TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="opt_name" dataFormat={(cell, row) => titleCase(row.opt_name)}>
                    Optician
                </TableHeaderColumn>
                <TableHeaderColumn width="150" dataField="address" dataFormat={(cell, row) => row.address || row.address_details}>
                    Location
                </TableHeaderColumn>
                <TableHeaderColumn width="130" dataField="sales_channel" dataFormat={(cell, row) => row.sales_channel && row.sales_channel.replace(/^./, row.sales_channel[0].toUpperCase())}>
                    Sales Channel
                </TableHeaderColumn>
                {/* <TableHeaderColumn width="180" dataField="appointment_status" dataFormat={(cell,row) => row.appointment_status && titleCase(replaceGlobal(row.appointment_status || ''))}>
                    Status
                </TableHeaderColumn> */}
            </BootstrapTable>
    )
}