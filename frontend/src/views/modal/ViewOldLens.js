import React from 'react';
import { Row, Col, NavLink, Label} from "reactstrap";
import { getNumberFormat, titleCase } from '../../utilities/methods';

export default ({lense}) =>{
    return(
        <div  style={{border:'1px solid #ccc'}} className="p-3 m-4">
        {
        lense.map((lens) =>
        <>
        <Row className="mt-2">
                <Col md="7" style={{color: 'orange'}}>
                    <h6>{lens.type && lens.type !== 'both' ? lens.type.toUpperCase() : lens.type ? 'RIGHT & LEFT' : ''}LENS</h6>
                </Col>
            </Row>
            <Row>
                <Col md="7">
                {lens.sku_code} ( {lens.name} - {lens.index_value} ) 
                </Col>
                <Col md="4">
                    {getNumberFormat(lens.retail_price) || 'Free'}
                </Col>
            </Row>
            <Row style={{backgroundColor:'#f0f5f5'}}>
            <Col md="10" >
                    <br/>
                <table width="100%" bgcolor="#f0f5f5" cellPadding="10%">
                    <tr>
                        <th>Prescription Type</th>
                        <th>Lens Type</th>
                        <th>Filter</th>
                    </tr>
                    <tr>
                        <td>{lens.prescription_name}</td>
                        <td>{lens.lense_type_name}</td>
                        <td>{lens.filter_name}</td>
                    </tr>
                </table>
                </Col>
            </Row>
            <Row className="mt-3 text-success">
                <Col md="7">
                    <strong>{titleCase(lens.discount_note || 'discount')} ( {lens.discount_amount ? ((Number(lens.discount_amount)*100)/lens.retail_price).toFixed(2) : '0'}% ) </strong>
                </Col>
                <Col md="4">
                    <strong>-{getNumberFormat(lens.discount_amount)} </strong>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                <input type="checkbox" id="is_sunwear" name="is_sunwear" checked={lens.is_sunwear} disabled/>
                <label className="ml-2 text-muted"> Tinted Lens</label>
                </Col>
            </Row>
            </>
            )
            }
            
            </div>
    )
}