import React, {useState, useEffect} from 'react';
import { Row, Col,Form, FormGroup, Card, CardBody, Button, Label } from "reactstrap";
import {getNumberFormat} from '../../utilities/methods';


export default ({loading, toggle, discountItem, discountPrice, setDiscountPrice, applyDicountValue, checked, setChecked, setDiscountNote, setTotalDiscount, discoutNote}) =>{
    const [perError, setPerError] = useState(false);
    const [noteError, setNoteError] = useState(false);
    const [discountValue, setDiscountValue] = useState(0);
    
    useEffect(() => {
        calculate();
    },[checked]);

    const calculate = () => {
        if(checked === 'amount')
        {
            if(Number(discountItem['price']) < Number(discountValue))
            {
            setPerError(true);
            return (false);
            }else {
            setPerError(false);
            setTotalDiscount(Number(discountValue))
            setDiscountPrice(Number(discountItem['price'])- Number(discountValue));
            }
        } else if(checked === 'percent' && discountValue > 100){
            setPerError(true);
            return(false);
        }else{
            setPerError(false);
            const per = ((Number(discountValue) /100)*discountItem['price']);
            setTotalDiscount(per)
            setDiscountPrice(Number(discountItem['price'])-per);
        } 
    }

    // Apply Discount
    const applyDicount = () => {
        if(!discoutNote){
            setNoteError(true);
        } else if(!perError){
            setNoteError(false);
            applyDicountValue()
        }
    }

    return(
        <Row>
        <Col sm="12">
            <Card>
                <CardBody>
                <Form >
                <FormGroup >
                    <Label className="control-label" htmlFor="originPrice">
                        <strong>Origin Price</strong>
                    </Label>
                    <div className="mb-2">
                    <input
                        defaultValue={discountItem['price'] || ''}
                        type="text"
                        name="originPrice" 
                        placeholder="Origin Price"
                        className="form-control"
                    />
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label className="control-label" htmlFor="ype">
                        <strong>Type</strong> 
                    </Label><br/>
                    <Label>
                    <input
                        name="Type"
                        type="radio"
                        value="amount"
                        defaultChecked
                        onChange={(e)=> setChecked(e.target.value)}
                    /> Amount </Label><br/>
                    <Label> 
                    <input
                        name="Type"
                        type="radio"
                        value="percent"
                        onChange={(e)=> setChecked(e.target.value)}
                    /> Percent </Label><br/>
                </FormGroup>
                <FormGroup>
                    <div className="mb-2" style={{width:'30%'}}>
                        <input
                            disabled={!checked}
                            type="number"
                            name="Value" 
                            className="form-control"
                            placeholder={checked === 'amount' ? '0' : '%'}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            onBlur={()=> calculate()}
                        />
                    </div>
                </FormGroup>
                <span className="text-danger">{ perError && checked === 'percent' ? 'Discount not be greater than 100%!' : perError && checked === 'amount' ? `Discount not be greater than ${discountItem['price']}` : ''}</span>
                <FormGroup >
                <Label className='ml-1'> <strong> Note </strong> </Label><br/>
                    <div className="mb-2" >
                        <textarea
                            type="text"
                            name="Description" 
                            className="form-control"
                            placeholder=" Discription"
                            onChange={(e)=>setDiscountNote(e.target.value)}
                        />
                    </div>
                    <span className="text-danger">{ noteError ? 'This field is required' : ''}</span>
                </FormGroup>
                <FormGroup >
                    <Row>
                        <Col sm={6} className="ml-2 text-bold">Final Price </Col>
                        <Col sm={4}>{getNumberFormat(discountPrice)} </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                <Row>
                <Col md="6">
                   <Button style={{ width: '100%'}} className="btn" outline color="danger" type="button" onClick={toggle}>
                        Cancel
                    </Button>
                </Col>
                <Col md="6">
                    <Button style={{width: '100%'}} color="primary" type="button" onClick={()=> applyDicount()} disabled={loading}>
                        Add
                    </Button>
                </Col> 
                </Row>
                </FormGroup>
                </Form> 
                </CardBody>
            </Card>
        </Col>
    </Row>

    )
}