import React from 'react';
import { Row, Col, FormGroup, Button, Label } from 'reactstrap';
import { NavLink } from "react-router-dom";
import Autocomplete from '../../components/Autocomplete';
import { getNumberFormat } from '../../utilities/methods';

const Address = ({
    addonList, 
    toggle, 
    setSkuData, 
    setEditedLens, 
    setLensSwitch, 
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
    isFrame
}) => {
    return addonList.map((item, index) => 
        <React.Fragment key={item.id}>
            {(index%2 === 0 || item.type === 'both') &&
                <Row style={{marginTop: '5%'}}>
                    <Col md="6">
                        <h5>{text}</h5>
                    </Col>
                    {!isView &&
                        <Col md="4">
                            <NavLink to="#" onClick={() => {
                                toggle('frameAddon');
                                setSkuData();
                                setEditedLens(
                                    item.type === 'both' ? 
                                    [item] :
                                    [item, {...addonList[index+1]}]
                                )
                                setLensSwitch(item.type === 'both');
                            }} style={{marginLeft: '22%', textDecoration: 'underline'}}>Change
                            </NavLink>
                        </Col>
                    }
                    { isPrescription && !isView &&
                        <Col md="1" onClick={() => handleDelete(item.type === 'both' ? 
                            [item.id] :
                            [item.id, addonList[index+1].id], 'addon')} style={{cursor: 'pointer', color: 'red', marginLeft: "5%"}}>
                            <i class="fas fa-trash-alt"></i>
                        </Col>  
                    }
                </Row>
            }
            <Row>
                <Col md="8" style={{color: 'orange'}}><h5>{item.type && item.type !== 'both' ? item.type.toUpperCase() : 'RIGHT & LEFT'} LENS</h5></Col>
            </Row>
            <Row>
                <Col md="8">
                    {item.sku} ({item.name+' - '+item.index_value}) 
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
            <hr/>
            <Row style={{backgroundColor:'#f0f5f5'}}>
            <Col md="10" >
                    <br/>
                <table width="100%" bgColor="#f0f5f5" cellPadding="10%">
                    <tr>
                        <th>Prescription Type</th>
                        <th>Lens Type</th>
                        <th>Filter</th>
                    </tr>
                    <tr>
                        <td>{item.prescription_name}</td>
                        <td>{item.lense_type_name}</td>
                        <td>{item.filter_type_name}</td>
                    </tr>
                </table>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col >
                <input type="checkbox"  name="is_sunwear" checked={item.is_sunwear} disabled/>
                <label className="ml-2"> Tinted Lens</label>
                </Col>
            </Row>
            { !isView && !isFrame &&
                <>
                <hr/>
                <h5>Packaging</h5>
                <Row>
                    {order.packages.map((pkg, i) => 
                        <Col md="5" className="ml-4" key={i}>
                            <Label>
                                <input type="checkbox" checked={item.packages && item.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} onClick={()  => setPackaging({id: item.id, sku: pkg.sku, type:'addon'})}/> {pkg.name}
                            </Label>
                        </Col>
                    )}
                </Row>
                </>
            }
            <hr/>
            {(index%2 === 1 || item.type === 'both') && isPrescription && 
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
            {text === "LENS ONLY" &&
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
                </>
            }
            
        </React.Fragment>
    )
}

Address.defaultProps = {
    text: "LENS SELECTIONS",
    isPrescription: false
}

export default Address;