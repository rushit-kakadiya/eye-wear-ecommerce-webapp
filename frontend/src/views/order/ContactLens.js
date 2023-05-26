import React from 'react';
import { Row, Col, FormGroup, Button, Label, Input } from 'reactstrap';
import { NavLink } from "react-router-dom";
import Autocomplete from '../../components/Autocomplete';
import { getNumberFormat } from '../../utilities/methods';

const Contactlens = ({
    addonList, 
    toggle, 
    toggleType,
    setSkuData, 
    setEditedLens, 
    text,
    isPrescription,
    prescription,
    renderItems,
    selectPrescription,
    order,
    handleDelete,
    setDiscount,
    isView,
    removeDiscount,
    setPackaging,
    isPackaging,
    setContactLensQuantity
}) => {
    return addonList.map((item, index) => 
    <React.Fragment key={item.id}>
         <br/>
            <Row>
                <Col md="6" className="ml-1">
                <h6>{text}</h6>
                </Col>
                {!isView &&
                    <Col md="4">
                        <NavLink to="#" onClick={() => {
                            toggle(toggleType);
                            setSkuData();
                            setEditedLens([item])
                            setContactLensQuantity(item.addon_item_count)
                        }} style={{marginLeft: '22%', textDecoration: 'underline'}}>Change
                        </NavLink>
                    </Col>}
                { !isView &&
                    <Col md="1" onClick={() => handleDelete([item.id] , text)} style={{cursor: 'pointer', color: 'red', marginLeft: "5%"}}>
                        <i class="fas fa-trash-alt"></i>
                    </Col>  
                }
            </Row>
        <Row>
            <Col sm="2">
                <h1 className="ml-4"><i className={text === "CONTACT LENS" ? "mr-2 mdi mdi-sunglasses" : "mr-2 mdi mdi-film"}></i></h1>
            </Col>
            <Col md="6">
                {item.sku} ({item.name}) 
            </Col>
            <Col md="4">
                {getNumberFormat(item.retail_price * item.addon_item_count) || 'Free'}
            </Col>
        </Row>
        {item.discount_type || isView  ?
        <Row>
            <Col sm={8}>
            <div>
                {
                    !isView && <i class="fa fa-times-circle" aria-hidden="true" style={{color:'#ff0000'}} onClick={()=>removeDiscount('addon',item.id)}></i>
                }
            
            <span className="font-bold ml-1" style={{color:'#00bfa5'}}>
            {`Discount(${((Number(item.discount_amount)/(item.retail_price*item.addon_item_count)*100)).toFixed(2)+'%'})`} 
              </span>
            </div>
            </Col>
            <Col>
            <span className="font-bold "  style={{color:'#00bfa5'}}>
                {getNumberFormat(Number(item.discount_amount))}
            </span>
            </Col>
        </Row>:
        <Row>
            <Col>
            <div  onClick={() => { setDiscount('addon',item.id,item.retail_price*item.addon_item_count); toggle('discount');}}>
            <i className="fas fa-ticket-alt" style={{color:'#00bfa5',cursor:'pointer' }}></i>
            <span className="font-bold ml-1" style={{color:'#00bfa5', textDecoration:'underLine', cursor:'pointer'}}>
                Add Discount
            </span>
            </div>
            </Col>
        </Row>}
        <br/>
        <Row >
            <Col sm={1}  >
                <i className="fa fa-minus-circle mt-2" aria-hidden="true"></i>
            </Col>
            <Col sm={3} >
                <Input type="number" defaultValue={item.addon_item_count}/>
            </Col>
            <Col sm={1} className="pr-4 ml-0">
                <i className="fa fa-plus-circle mt-2" aria-hidden="true"></i>
            </Col>
        </Row>
        <br/>
        <>
        <hr/>
        <h5>Packaging</h5>
        <Row>
            {order.packages.map((pkg, i) => 
                <Col md="5" className="ml-4" key={i}>
                    <Label>
                        <input type="checkbox" checked={item.packages && item.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} onClick={()  => setPackaging({id: item.id, sku: pkg.sku, type:'contactLens'})}/> {pkg.name}
                    </Label>
                </Col>
            )}
        </Row>
        </>
        <hr/>
        {isPrescription && 
            <Row style={{marginTop: '5%'}}>
            <Col>
                <h5>Prescription</h5>
                <FormGroup>
                    {prescription.list.length > 0 &&
                        <Autocomplete
                            items={prescription.list}
                            name="prescription"
                            className="form-control"
                            label='label'
                            renderItems={(i, isHighlighted) => renderItems({...i, cart_id: item.id, type: 'addon'}, isHighlighted)}
                            setObject={i => selectPrescription({...i, cart_id: item.id, type: 'addon'})}
                            setInputValue={() => false}
                            placeholder="Choose Prescription"
                            defaultValue={item.prescription_details ? item.prescription_details.label : ''}
                        />
                    }
                    {!isView &&
                        <Button style={{width: '100%'}} type="button" className="btn mt-1" outline color="primary" onClick={()  =>{ selectPrescription({cart_id: item.id, type: 'addon'}); toggle('prescription')}} disabled={!order.selected_user}>
                            { prescription.list.length > 0 ? 'Add More Prescription' : 'Add Prescription' }
                        </Button>
                    }
                </FormGroup>
            </Col>
        </Row>
        }
        <>
            <Row>
                <Col md="8">
                    <Label>
                        <strong>Subtotal</strong>
                    </Label>
                </Col>
                <Col md="4">
                    <Label>
                        {getNumberFormat((item.retail_price*item.addon_item_count)-Number(item.discount_amount))}
                    </Label>
                </Col>
            </Row>
            {index>0 &&
            <hr/>}
        </>
        
    </React.Fragment>
)
}

Contactlens.defaultProps = {
    text: "CONTACT LENS",
    isPrescription: false,
    isPackaging: false
}

export default Contactlens;