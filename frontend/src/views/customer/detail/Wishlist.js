import React from 'react';
import { Row, Col } from 'reactstrap';
import { getNumberFormat, getDateFormat, titleCase} from '../../../utilities/methods';

export default ({data, loading}) => {
    let date = null;
    if(data.length){
        date = data[0].created_at;
    }
    if(loading) return <h4 style={{marginLeft: '30%'}}>loading...</h4>
    if(data.length === 0) return <h4 style={{marginLeft: '30%'}}>Wishlist is empty!</h4>
    return(
        <div  style={{border:'2px solid #ccc'}} className="p-3">
            {data.map((row, index) =>
            <React.Fragment key={index}>
                 <Row>
                <Col sm="1" className="mr-4">
                    <h2><i className="mdi mdi-sunglasses"></i></h2>
                </Col>
                <Col sm="4">
                    <strong>{row.sku_code}</strong> <br/>
                    <strong>{titleCase(row.frame_name || '')}</strong>
                </Col>
                <Col sm="4">
                <strong>{getNumberFormat(row.retail_price)}</strong>
                </Col>
                <Col sm="2">
                {/* <i className="fas fa-trash-alt text-danger"></i> */}
                </Col>
            </Row>
            <Row>
                <Col sm={{offset: 2}} className="text-muted" >
                Frame Color
                </Col>
                <Col sm={{offset: 2}} className="text-muted">
                Frame Size
                </Col>
            </Row>
            <Row>
                <Col sm={{offset: 2}} >
                {titleCase(row.variant_name || '')}
                </Col>
                <Col sm={{offset: 2}}>
                {titleCase(row.fit || '')}
                </Col>
            </Row>
            <hr/>
            </React.Fragment> 
            )}
            <div className="mt-2">
            <i className="fas fa-clock text-muted"></i>
            <span className="text-muted">  Added on {getDateFormat(date)}</span> 
            </div>
        </div>
        )
}