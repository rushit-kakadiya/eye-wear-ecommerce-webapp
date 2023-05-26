import React from 'react';
import { Row, Col, Card, CardBody, Label, Button, FormGroup} from "reactstrap";
import { useForm } from 'react-hook-form';
import Form from 'react-validation/build/form';
import BackButton from '../buttons/BackButton';
import Message from '../../utilities/message';
import {toastAction} from '../../redux/ToastActions';
import TimePicker from 'react-time-picker';
import MultiSelect from  'react-multiple-select-dropdown-lite';
import  'react-multiple-select-dropdown-lite/dist/index.css';
import { avilabilty_type } from '../../utilities/constants';

export default ({history,
                 detail,
                 loading,
                 categories, 
                 skuList,
                 scheduleTime, 
                 selectedSku, 
                 handleTimeChange, 
                 handleSubmitData,
                 image,
                 setImage,
                 setImageData}) => { 
    const category = detail.discount_category && categories ? categories.find(row=>row.name === detail.discount_category) : null;
    const SubCategoryList = category ? category.options : [];
    const { register, handleSubmit, errors } = useForm(); // initialise the hook
   
    const onSubmit = (data) => {
        if(!scheduleTime.end_time || !scheduleTime.start_time) {
            toastAction(false, "Please enter schedule Time & Date!")
        } else {
            handleSubmitData(data)
        }    
    };

    const handleImageUpload = (data) =>{
        setImage(URL.createObjectURL(data));
          setImageData(data)
    }
    
    return(
        <Row>
        <Col md="7" sm={{offset: 1}}>
         <Card>
            <CardBody>
            <Row> 
                <Col>
                <h4> <BackButton history={history} path="/settings/discount" /> Edit Discount</h4>
                </Col>
            </Row>            
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <FormGroup>
                        <label className="control-label" >
                         <strong> Discount Title </strong>      
                        </label>
                        <div className="mb-2" >
                        <input
                            className="form-control "
                            type="text"
                            name="voucher_title" 
                            placeholder="Discount Title" 
                            value={detail.voucher_title}
                            ref={register({
                                required: false
                                })}
                            disabled
                            />
                        </div>
                        </FormGroup>
                    </Col>
                    <Col>
                    <FormGroup>
                        <label className="control-label" >
                        <strong>Promo Code</strong>
                        </label>
                        <div className="mb-2" >
                        <input
                            className="form-control "
                            type="text"
                            name="voucher_code" 
                            placeholder="Promo Code"                            
                            value={detail.voucher_code}
                            disabled
                            style={{textTransform: "uppercase"}}                             
                            ref={register({
                                required: false
                                })}
                            />
                        </div>
                    </FormGroup>    
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <FormGroup>
                        <label className="control-label" >
                        <strong>Discount Category</strong>
                        </label>
                        <div className="mb-2" >
                        <select 
                            name="discount_category"  
                            className="form-control"
                            disabled
                            defaultValue={detail.discount_category}
                        >
                        <option value="" >Categories</option>
                        {categories.map(row=>
                        <option value={row.name} key={row.id}>{row.name}</option>
                        )}
                        </select>
                        </div>
                    </FormGroup>
                    </Col>
                    <Col>
                    <FormGroup>
                        <label className="control-label" >
                        <strong>Discount SubCategory</strong>
                        </label>
                        <div className="mb-2" >
                        <select 
                            name="discount_sub_category"  
                            className="form-control"
                            ref={register({
                            required: false
                            })}
                            disabled
                            defaultValue={detail.discount_sub_category}
                        >
                        <option value="" >Sub Categories</option>
                        { SubCategoryList && SubCategoryList.map(row=>
                            <option value={row.name} key={row.id}>{row.name}</option>
                            )}
                        </select>
                        </div>
                    </FormGroup>
                    </Col>
                </Row>
               
                <hr/>
                <FormGroup>
                <label className="control-label"><strong>Discount Type</strong></label><br/>
                    <Label className="mr-4">
                        <input
                        name="voucher_type"
                        type="radio"
                        value="1"
                        checked={detail.voucher_type === 1}
                        disabled
                        /> Percentage </Label>
                    <Label>
                        <input
                        name="voucher_type"
                        type="radio"
                        value="2"
                        checked={detail.voucher_type === 2}
                        disabled
                    /> Fixed amount</Label>
                </FormGroup>
                <hr/>
                <FormGroup>
                    <label className="control-label" >
                    <strong>Discount Value</strong>
                    </label>
                    <div className="mb-2" >
                    <input
                        className="form-control "
                        type="number"
                        name="voucher_type_value" 
                        value={detail.voucher_type === 1 ? detail.voucher_percentage : detail.voucher_amount}
                        placeholder={'Rp 0'}
                        disabled
                        ref={register({
                            required: false
                            })}
                        />
                    </div>
                </FormGroup>
                <FormGroup>
                <label className="control-label"><strong>Applies to</strong></label><br/>
                <Label>
                        <input
                        name="voucher_sku_mapping_type"
                        type="radio"
                        checked={detail.excludesSku && detail.excludesSku.length === 0 && detail.voucher_sku_mapping_type !== 3 }
                        disabled
                        ref={register({
                            required: false
                            })}
                        /> All Products </Label><br/>
                    <Label>
                        <input
                        name="voucher_sku_mapping_type"
                        type="radio"
                        value="specific_item"
                        disabled
                        ref={register({
                            required: false
                            })}
                        checked={ detail.excludesSku && (detail.voucher_sku_mapping_type === 3 || detail.excludesSku.length > 0)}
                        /> Specific item</Label>
                </FormGroup>
                { detail.excludesSku && (detail.voucher_sku_mapping_type === 3 || detail.excludesSku.length > 0) && 
                    <>
                    <FormGroup style={{width:"30%"}}>
                        <div className="mb-2" >
                        <select name="voucher_sku_mapping_type"  className="form-control"
                        value={ detail.voucher_sku_mapping_type}
                        disabled
                         >
                        <option value="" >Select</option>
                        <option value={1 || 2}  >Exclude</option>
                        <option value="3" >Only for</option>
                        </select>
                        </div>
                    </FormGroup>
                    {selectedSku && selectedSku.map((row, index)=>
                    <Row key={index}>
                        <Col sm={4}>
                        <FormGroup >
                            <Label><strong>Product Category</strong></Label>
                            <div className="mb-2" >
                            <select  
                             className="form-control"
                            style={{borderRadius:'9px', height:'40px'}}  
                            value={row.type}   
                            disabled                       
                            >
                            <option value="" >Product Category</option>
                            <option value="frames" >Frames</option> 
                            <option value="clipons" >Clipons</option>
                            <option value="lens" >Lens</option>
                            </select>
                            </div>
                        </FormGroup>
                        </Col>
                        <Col sm={6}>
                        <FormGroup >
                            <Label><strong>Product</strong></Label>
                            <div className="mb-2" >
                            <MultiSelect
                                options={selectedSku.length>index && skuList[row.type].map(row=>({label:row.DISTINCT, value:row.DISTINCT}))}
                                style={{width:"100%"}}
                                placeholder="Select Product"
                                defaultValue={row.sku}
                                disabled
                            />
                            </div>
                        </FormGroup>
                        </Col>
                        </Row>)}
                    </>
                }
                <span className="text-danger">{errors.voucher_sku_mapping_type && Message.validateField(errors.voucher_sku_mapping_type.type, 'This field')}</span>
                <hr/>
                <FormGroup style={{marginBottom:'0rem'}}>
                <label className="control-label"><strong>Minimum Requirements</strong></label><br/>
                <Label>
                    <input
                    name="requirements"
                    type="radio"
                    value="none"
                    checked={detail.minimum_cart_amount === 1 && detail.min_cart_count === 1 }
                    disabled
                    /> None</Label><br/>
                <Label>
                    <input
                    name="requirements"
                    type="radio"
                    value="amount"
                    disabled
                    checked={detail.minimum_cart_amount > 1}
                /> Minimum Purchase Amount (Rp)</Label>
                </FormGroup> 
                { detail.minimum_cart_amount > 1 &&               
                <FormGroup> 
                    <Label><strong>Amount</strong></Label>                  
                    <input
                        className="form-control "
                        type="text"
                        name="minimum_cart_amount" 
                        placeholder="Rp 0" 
                        disabled
                        value={detail.minimum_cart_amount}
                        />   
                </FormGroup>}
                <FormGroup style={{marginBottom:'0rem'}}>
                    <Label>
                    <input
                        name="requirements"
                        type="radio"
                        value="item"
                        disabled
                        ref={register({
                            required: false
                            })}
                        value={detail.min_cart_count > 1}
                    /> Minimum Quantity of items</Label>                     
                </FormGroup>
                { detail.min_cart_count > 1 &&                                
                <FormGroup>             
                    <Label><strong>Items</strong></Label>      
                    <input
                        className="form-control "
                        type="text"
                        name="min_cart_count" 
                        placeholder="Items" 
                        value={detail.min_cart_count}
                        disabled
                        />                    
                </FormGroup>}               
                <hr/>                
                <FormGroup>
                    <Label className="control-label"><strong>Usage Limit</strong></Label><br/> 
                    <Label>Max. Voucher Amount can be used in total</Label><br/>
                    <input
                        name="max_count"
                        className="form-control"
                        type="number"
                        placeholder="Rp 0"
                        value={detail.max_count}
                        disabled
                    /> 
                    <br/>
                   <Label> Max. Discount</Label><br/>
                    <input
                        name="voucher_max_amount"
                        className="form-control"
                        type="number"
                        value={detail.voucher_max_amount}
                        disabled
                        placeholder="Rp 0"
                        ref={register({
                            required: false
                            })}
                    /> 
                    <br/>
                    <Label> 
                    <input
                        name="is_single_user"
                        type="checkbox"
                        checked={detail.is_single_user}
                        disabled
                        ref={register({ required: false })}
                    /> Limit to one use per customer</Label> 
                    <br/>      
                    <Label> 
                    <input
                        name="first_order"
                        type="checkbox"
                        checked={detail.first_order}
                        disabled
                        ref={register({ required: false })}
                    /> First time purchase only</Label>               
                </FormGroup> 
                <hr/>
                <Label className="control-label"><strong>Schedule</strong></Label><br/> 
                <Row>
                    <Col sm={5}>
                    Start Date
                    <input
                        name="start_date"
                        className="form-control"
                        type="date"
                        ref={register({ required: true })}
                        disabled={new Date(scheduleTime.start_date) <= new Date()}
                        value={scheduleTime.start_date}
                        ref={register({
                            required: true
                            })}
                        onChange={(e)=>handleTimeChange(e.target.name, e.target.value)}
                    />
                    </Col>
                    <Col>
                    Start Time(WIB)<br/>
                    <TimePicker
                        style={{width:'100%'}}
                        disableClock={true}
                        name="start_time"                        
                        onChange={(event)=>handleTimeChange("start_time", event)}
                        value={scheduleTime.start_time}
                        disabled={new Date(scheduleTime.start_date) <= new Date()}
                        hourPlaceholder="hh"
                        minutePlaceholder="mm"
                        ref={register({
                            required: true
                            })}
                    />
                    </Col>
                </Row><br/>
                <Row >
                    <Col sm={5}>
                    End Date
                    <input
                        name="end_date"
                        className="form-control"
                        type="date"
                        value={scheduleTime.end_date}
                        min={scheduleTime.start_date}    
                        disabled={!new Date(scheduleTime.end_date) >= new Date()}
                        ref={register({ required: true })}
                        onChange={(e)=>handleTimeChange(e.target.name, e.target.value)}
                    />
                    </Col>
                    <Col>
                    End Time(WIB)<br/>
                    <TimePicker
                        style={{width:'100%'}}
                        disableClock={true}
                        name="end_time"
                        onChange={(event)=>handleTimeChange('end_time', event)}
                        value={scheduleTime.end_time}
                        disabled={!new Date(scheduleTime.end_date) >= new Date()}
                        hourPlaceholder="hh"
                        minutePlaceholder="mm"
                        ref={register({
                            required: true
                            })}
                    />
                    </Col>
                </Row> 
                    <span className="text-danger">{(errors.schedule_start_date || errors.schedule_end_date)  && Message.validateField('required', 'Schedule Date & Time')}</span>     
                <hr/>
                <FormGroup>
                    <Label className="control-label"><strong>Avilabilty</strong></Label><br/> 
                    {avilabilty_type?.map((row, index) =>
                        <Label key={index} className="col-sm-4 mb-2"> 
                            <input
                                name="avilabilty_type"
                                type="checkbox"
                                value={row.code}
                                checked={detail.avilabilty_type.includes(row.code)}
                            /> &nbsp; {row.label}
                        </Label>
                    )}              
                </FormGroup> 
                {detail?.avilabilty_type.includes(2) &&
                <>               
                <hr/>
                <FormGroup>
                    <Label className="control-label"><strong>Additional info for App</strong></Label><br/>
                    Terms and Conditions
                    <textarea 
                            className="form-control "
                            name="term_conditions" 
                            placeholder="Terms and Conditions"
                            defaultValue={detail.term_conditions} 
                            ref={register({
                            required: false
                            })}
                            />
                </FormGroup>
                Upload Voucher image
                <Row>
                    <Col sm={3}>
                        <div className="border">
                        <img src={image || require('../../assets/images/dummy-image.png')} alt="image" width="100%" />
                         </div>
                    </Col>
                    <Col  sm={5}>
                        <span>
                            Size:360 X 200<br/>
                            Format: .Jpg, .png, .webp
                        </span><br/>
                        <input
                        type="file"
                        name="coupon_image"
                        id="coupon_image"
                        accept="image/*"
                        onChange={(event)=>handleImageUpload(event.target.files[0])}
                        hidden
                        />
                        <Button className="btn mt-2" disabled={loading} color="primary" size="sm" onClick={()=>document.getElementById('coupon_image').click()} disabled={loading}>
                            Browse
                        </Button>
                    </Col>                
                </Row>
                <Row>
                    <Col sm={8}>
                        <FormGroup> 
                            <Label>Voucher Perview Title</Label>                  
                            <input
                                className="form-control "
                                type="text"
                                name="sub_title" 
                                placeholder="Ex: 20%" 
                                defaultValue={detail.sub_title}
                                ref={register({
                                required: false
                                })}
                                /> 
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Label>
                    <input
                        name="hide"
                        type="checkbox"
                        defaultChecked={detail.hide}
                        ref={register({ required: false })}
                    /> Don't show voucher in Voucher page on app (but can be searched)</Label>
                    </Col>
                </Row>
                </>
                }
                <Row>
                <Col md="6">
                    <Button style={{ width: '100%'}} className="btn mt-2" outline color="danger" type="button" onClick={()=>history.goBack()}>
                        Cancel
                    </Button>
                </Col>
                <Col md="6">
                    <Button style={{width: '100%'}} color="primary mt-2" type="submit" disabled={loading}>
                        Update
                    </Button>
                </Col> 
                </Row>
                </Form>
            </CardBody>
        </Card>
        </Col>
        </Row>
    )
}