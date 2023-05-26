import React from 'react';
import {Row, Col, NavLink, Badge} from 'reactstrap';
import { refferalType } from '../../../../utilities/constants';
import { getNumberFormat, addDayDate } from '../../../../utilities/methods';

export default ({history, detail, loading, type}) => {
    const filterData = type === 'ALL' ? detail : detail.filter(row => row.transaction_type === type);
    if(loading) return <h4 style={{paddingLeft: '30%', backgroundColor:'#F5F5F5'}}>loading...</h4>
    if(detail && filterData.length === 0) return <h4 style={{paddingLeft: '30%', backgroundColor:'#F5F5F5'}}>No Refferal data!</h4>
       
    return filterData.map((row, index) =>
         <Row style={{backgroundColor:'#F5F5F5'}}>
            { row.transaction_type === 'DEBIT' ?
            <Col sm="7">
                    {refferalType[row.transaction_type]} <br/>
                    <NavLink to="#" className="text-info p-0" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => history.push(`/order-detail/${row.order_no.replace('/', '-')}`)}> {row.order_no}</NavLink>
                    <br/> <span className="text-muted"><i class="fas fa-clock" ></i> {addDayDate(row.created_at)}</span>
            </Col> :
            <Col sm="7">
                <NavLink to="#" className="text-info p-0" style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={() => row.customer_id && history.push(`/customer/detail/${row.customer_id}`)}> {row.name}</NavLink>
                    {refferalType[row.transaction_type]}<br/><br/>
                    <span className="text-muted"><i class="fas fa-clock" ></i> {addDayDate(row.created_at)}</span>
                </Col>
            }
            { row.transaction_type === 'PENDING' ?
            <Col sm="5">
                <Badge color="secondary" pill>{row.transaction_type}</Badge>
            </Col> :
            <Col sm="5">
                <span className={row.transaction_type === 'CREDIT' ?'text-success' :'text-danger'}>{row.transaction_type === 'CREDIT' ? getNumberFormat(row.credit_amount,  "+") : getNumberFormat(row.credit_amount,  "-")}</span><br/>
                {getNumberFormat(row.credit_amount)}
            </Col>
            }
            {index < filterData.length-1 &&
            <Col>
                <hr/>
            </Col> }
        </Row>      
    )
}