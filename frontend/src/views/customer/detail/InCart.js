import React from 'react';
import {Row, Col, FormGroup, Button} from 'reactstrap';
import CartItems from '../../order/CartItems';
import {getDateFormat} from '../../../utilities/methods';

export default ({cart, order, loading, history}) => {
    let date = null;
    if(cart.data.list.length){
        const cartList = cart.data.list.filter(c => c.type === 1);
        date = cartList.length > 0 ? cartList[0].created_at : null;
    }
    if(cart.lensesOnly.list.length){
        date = cart.lensesOnly.list[0].created_at;
    }
    if(loading) return <h4 style={{marginLeft: '30%'}}>loading...</h4>
    if(!date) return <h4 style={{marginLeft: '20%'}}>Cart is empty!</h4>
    return(
        <>
            <CartItems 
                cart={cart} 
                order={order}
                isView={true}
                border={'2px solid #ccc'}
            />
            {date && 
                <Row className="mt-2 ml-4">
                    <Col md="3">
                        <i className="fas fa-clock text-muted"></i>
                        <span className="text-muted">  Added on {getDateFormat(date)}</span> 
                    </Col>
                    <Col md="3" sm={{ offset: 1 }}>
                        <FormGroup><Button style={{width: '100%', marginLeft: '4.5%'}} type="button" color="primary" onClick={()  =>  history.push('/order/add')}><i className="fas fa-cart-plus"></i> Checkout Item </Button></FormGroup>
                    </Col>
                </Row>
            }
        </>
    )
}