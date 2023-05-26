import React from 'react';
import { Row, Col, NavLink, Button, Badge, Table } from "reactstrap";
import {addDayDate} from '../../../../utilities/methods';

export default ({list, toggle, setSelectPrescription, handleDelete}) =>{
    return(
        <div className="p-3">
            <span className="text-muted"><h4>PRESCRIPTION LIST</h4></span><br/>
            {list && list.length> 0 ? list.slice(0,2).map((row, index)=>
            <div key={index} style={{border:'2px solid #ccc', width:'90%'}} className="mb-2">
                <Row className="pt-3 pl-3">
                    <Col sm={6} >
                        {row.label}
                    </Col>
                    <Col sm={3}>
                        {
                        row.is_primary &&
                        <Badge color="light" className="border border-info" pill>
                        <i className="fas fa-star text-info"></i> Primary              
                        </Badge>
                        }
                    </Col>
                    <Col className="pr-0 text-center">
                        <i className=" fas fa-pencil-alt text-success" onClick={()=>{ setSelectPrescription(row); toggle('prescription')}}></i>
                        <i className="fas fa-trash text-danger ml-2" onClick={()=>handleDelete(row)}></i>
                    </Col>
                </Row>
                <Row className="p-3">
                    <Col>
                     <Table responsive bordered>
                     <thead>
                        <tr>
                            <th></th>
                            <th>SPH</th>
                            <th>CYL</th>
                            <th>AXIS</th>
                            <th>ADD</th>
                            <th>PD</th>
                        </tr>
                        </thead>
                        <tbody>
                            {[{side: "Right", spheris: row.spheris_r, cylinder: row.cylinder_r, axis: row.axis_r, addition: row.addition_r}, {side: "Left", spheris: row.spheris_l, cylinder: row.cylinder_l, axis: row.axis_l, addition: row.addition_l}].map((r, i) => 
                                <tr key={i}>
                                    <td>{r.side}</td>
                                    <td>{r.spheris}</td>
                                    <td>{r.cylinder}</td>
                                    <td>{r.axis}</td>
                                    <td>{r.addition}</td>
                                    {i===0 && <td rowSpan="2" className="text-center pt-5">{row.pupilary_distance}</td>}
                                </tr>
                            )}
                        </tbody>
                     </Table>
                    </Col>
                </Row>
                <Row  className="pl-3 pt-2">
                <Col>
                <i className="fas fa-clock text-muted"></i> <span className="ml-1 text-muted">{`${'last updated ' + addDayDate(row.updated_at)}` }</span></Col>
                </Row>
            </div>) : <h4 className="ml-2">No Prescription!</h4>}
            <br/>
            { list && list.length > 2 ?
            <NavLink to="#"  className="text-info align-items-end " style={{ display: "contents", textDecoration:"underLine", cursor: "pointer"}} onClick={()=>toggle('prescriptionList')}>{ `View ${list.length-2} More`}</NavLink>:
            <Row>
                <Col sm={5}>
                <Button style={{width: '100%'}} color="primary mt-2" type="button" onClick={()=>{ setSelectPrescription({});toggle('prescription')}} >
                        + Add New Prescription
                </Button>
                </Col>
            </Row>
            }
        </div>
        )
}