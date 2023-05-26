import React from 'react';
import { Row, Col, Card, CardBody, Label, Button, FormGroup} from "reactstrap";
import { useForm } from 'react-hook-form';
import Form from 'react-validation/build/form';
import BackButton from '../buttons/BackButton';
import Message from '../../utilities/message';
import { NavLink } from 'react-router-dom';
import {toastAction} from '../../redux/ToastActions';
import TimePicker from 'react-time-picker';
import MultiSelect from  'react-multiple-select-dropdown-lite';
import  'react-multiple-select-dropdown-lite/dist/index.css';
import { avilabilty_type } from '../../utilities/constants';

export default ({history,
                 loading,
                 categories, 
                 skuList, 
                 state, 
                 handleStateChange, 
                 setItemCount, 
                 ItemCount, 
                 scheduleTime, 
                 selectedSku, 
                 handleProductChange, 
                 handleTimeChange, 
                 handleProductSelection,
                 handleSubmitData,
                 handleDelete,
                 setSlectedSku,
                 image,
                 setImage,
                 setImageData}) => { 
    const SubCategoryList = state.category ? categories.find(row=>row.name === state.category).options : [];
    const { register, handleSubmit, errors } = useForm(); // initialise the hook
                        
    const onSubmit = (data) => {
        if(data.discount_type === "percentage" && Number(data.discount_value) > 100)
        {
            toastAction(false, "Percentage cannot be more then 100%")
        } else if(!scheduleTime.schedule_end_time || !scheduleTime.schedule_start_time) {
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
                <h4> <BackButton history={history} path="/settings/discount" /> Add Discount</h4>
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
                            ref={register({
                            required: true
                            })}
                            />
                        </div>
                        <span className="text-danger">{errors.voucher_title && Message.validateField(errors.voucher_title.type, 'Discount Title')}</span>
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
                            style={{textTransform: "uppercase"}} 
                            ref={register({
                            required: true,
                            pattern: {
                                value:   /^[a-zA-Z0-9]*$/
                              }
                            })}
                            />
                        </div>
                        <span className="text-danger">{errors.voucher_code && Message.validateField(errors.voucher_code.type, 'Promo code')}</span>
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
                            ref={register({
                            required: "select one option"
                            })}
                            onChange={(e)=>handleStateChange("category",e.target.value)}
                        >
                        <option value="" >Categories</option>
                        {categories.map(row=>
                        <option value={row.name} key={row.id}>{row.name}</option>
                        )}
                        </select>
                        </div>
                        <span className="text-danger">{errors.discount_category && Message.validateField(errors.discount_category.type, 'Category')}</span>
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
                            required: "select one option"
                            })}
                            disabled={!state.category}
                        >
                        <option value="" >Sub Categories</option>
                        { SubCategoryList && SubCategoryList.map((row, index)=>
                            <option value={row.name} key={index}>{row.name}</option>
                            )}
                        </select>
                        </div>
                        <span className="text-danger">{errors.discount_sub_category && Message.validateField(errors.discount_sub_category.type, 'Subcategory')}</span>
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
                        onClick={()=>handleStateChange('discountType','percentage')}
                        ref={register({ required: true })}
                        /> Percentage </Label>
                    <Label>
                        <input
                        name="voucher_type"
                        type="radio"
                        value="2"
                        onClick={()=>handleStateChange('discountType','amount')}
                        ref={register({ required: true })}
                    /> Fixed amount</Label>
                </FormGroup>
                <span className="text-danger">{errors.voucher_type && Message.validateField(errors.voucher_type.type, 'Discount type')}</span>
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
                        placeholder={state.discountType === 'amount' ? 'Rp 0' : "0%"}
                        ref={register({
                        required: true
                        })}
                        />
                    </div>
                    <span className="text-danger">{errors.voucher_type_value && Message.validateField(errors.voucher_type_value.type, 'Discount value')}</span>
                </FormGroup>
                <FormGroup style={{marginBottom:'0rem'}}>
                <label className="control-label"><strong>Applies to</strong></label><br/>
                <Label>
                        <input
                        name="voucher_sku_mapping_type"
                        type="radio"
                        onClick={()=>{handleStateChange('appliesType','all'); setSlectedSku([])}}
                        value={!state.exclude_global_sku ? 2 : 1}
                        ref={register({ required: true })}
                        /> All Products </Label><br/>
                    <Label>
                           <input
                            name="voucher_sku_mapping_type"
                            type="radio"
                            value="specific_item"
                            onClick={()=>{handleStateChange("appliesType", 'specific'); setItemCount([{}])}}
                            ref={register({ required: true })}
                    /> Specific item</Label>
                </FormGroup>
                {
                    state.appliesType === 'specific' && 
                    <>
                    <FormGroup style={{width:"30%"}}>
                        <div className="mb-2" >
                        <select name="voucher_sku_mapping_type"  className="form-control"
                        ref={register({
                        required: false
                        })}
                        onChange={(event)=>{handleStateChange('specificItem', event.target.value)}}
                        >
                        <option value="" >Select</option>
                        <option value={!state.exclude_global_sku ? 2 : 1} >Exclude</option>
                        <option value="3" >Only for</option>
                        </select>
                        </div>
                    </FormGroup>
                    {ItemCount.map((row, index)=>
                    <Row key={index}>
                        <Col sm={4}>
                        <FormGroup >
                            <Label><strong>Product Category</strong></Label>
                            <div className="mb-2" >
                            <select 
                            // name={`${'product_category'+index}`} 
                             className="form-control"
                            ref={register({
                            required: false
                            })}
                            style={{borderRadius:'9px', height:'40px'}}
                            // value={selectedSku.length>0 && selectedSku.find(row=>row.id === index)['type']}
                            onChange={(event)=>{handleProductChange(event.target.value);  handleProductSelection(index,event.target.value,"")}}                            
                            >
                            <option value="" >Product Category</option>
                            <option value="frames" hidden={selectedSku.length>0 && selectedSku.find(row=>row.type === 'frames')}  >Frames</option> 
                            <option value="clipons" hidden={selectedSku.length>0 && selectedSku.find(row=>row.type === 'clipons')} >Clipons</option>
                            <option value="lens" hidden={selectedSku.length>0 && selectedSku.find(row=>row.type === 'lens')} >Lens</option>
                            </select>
                            </div>
                        </FormGroup>
                        </Col>
                        <Col sm={6}>
                        { state.specificItem &&
                        <FormGroup>
                            <Label><strong>Product</strong></Label>
                            <div className="mb-2" >
                            <MultiSelect
                                onChange={val=> handleProductSelection(index,"",val)}
                                options={selectedSku.length>index && skuList[selectedSku[index]['type']].map(row=>({label:row.DISTINCT, value:row.DISTINCT}))}
                                style={{width:"100%"}}
                                placeholder="Select Product"
                                defaultValue={selectedSku.length>index && selectedSku[index]['sku_code']}
                                disabled={!selectedSku.length>0 || !skuList}
                            />
                            </div>
                        </FormGroup>}
                        </Col>
                        {
                            index>0 && index === ItemCount.length-1 && state.specificItem &&
                        <Col className="mt-2">
                        <Label><strong></strong></Label>
                        <br/>
                        <i className="fas fa-trash-alt text-danger"  onClick={()=>handleDelete(index)}></i></Col>
                        }
                    </Row>)}
                    { ItemCount.length<3 &&
                    <Row>
                     <Col>
                     <NavLink  to="#"   style={{textDecoration: 'underline'}} onClick={()=>setItemCount([...ItemCount, {}])}><i className="fas fa-plus"></i>Add Category</NavLink>
                     </Col>
                    </Row>}
                    </>
                }
                <FormGroup style={{marginBottom:'0rem'}}>
                <Label> 
                    <input
                        name="exclude_global_sku"
                        type="checkbox"
                        ref={register({ required: false })}
                        onChange={(event)=>handleStateChange(event.target.name, !state.exclude_global_sku)}
                    /> Exclude Special Edition</Label> 
                </FormGroup>
                <span className="text-danger">{errors.voucher_sku_mapping_type && Message.validateField(errors.voucher_sku_mapping_type.type, 'This field')}</span>
                <hr/>
                <FormGroup style={{marginBottom:'0rem'}}>
                <label className="control-label"><strong>Minimum Requirements</strong></label><br/>
                <Label>
                    <input
                    name="requirements"
                    type="radio"
                    value="none"
                    onChange={()=>handleStateChange('minimumReq','')}
                    ref={register({ required: false })}
                    /> None</Label><br/>
                <Label>
                    <input
                    name="requirements"
                    type="radio"
                    value="amount"
                    onChange={()=>handleStateChange('minimumReq','amount')}
                    ref={register({ required: true })}
                /> Minimum Purchase Amount (Rp)</Label>
                </FormGroup> 
                { state.minimumReq === "amount" &&               
                <FormGroup> 
                    <Label><strong>Amount</strong></Label>                  
                    <input
                        className="form-control "
                        type="text"
                        name="minimum_cart_amount" 
                        placeholder="Rp 0" 
                        ref={register({
                        required: true
                        })}
                        />   
                          <span className="text-danger">{errors.minimum_cart_amount && Message.validateField(errors.minimum_cart_amount.type, 'Amount')}</span>                 
                </FormGroup>}
                <FormGroup style={{marginBottom:'0rem'}}>
                    <Label>
                    <input
                        name="requirements"
                        type="radio"
                        value="item"
                        onChange={()=>handleStateChange('minimumReq','item')}
                        ref={register({ required: true })}
                    /> Minimum Quantity of items</Label>                     
                </FormGroup>
                { state.minimumReq === 'item' &&                                
                <FormGroup>             
                    <Label><strong>Items</strong></Label>      
                    <input
                        className="form-control "
                        type="text"
                        name="min_cart_count" 
                        placeholder="Items" 
                        ref={register({
                        required: true
                        })}
                        />                    
                    <span className="text-danger">{errors.min_cart_count && Message.validateField(errors.min_cart_count, 'Items')}</span>
                </FormGroup>}
                <span className="text-danger">{errors.requirements && Message.validateField(errors.requirements.type, 'This field')}</span>               
                <hr/>                
                <FormGroup>
                    <Label className="control-label"><strong>Usage Limit</strong></Label><br/> 
                    <Label>Max. Voucher Amount can be used in total</Label><br/>
                    <input
                        name="max_count"
                        className="form-control"
                        type="number"
                        placeholder="Rp 0"
                        ref={register({ required: true })}
                    /> 
                     <span className="text-danger">{errors.max_count && Message.validateField(errors.max_count.type, 'This field')}</span>               
                    <br/>
                   <Label> Max. Discount</Label><br/>
                    <input
                        name="voucher_max_amount"
                        className="form-control"
                        type="number"
                        placeholder="Rp 0"
                        ref={register({ required: true })}
                    /> 
                    <span className="text-danger">{errors.voucher_max_amount && Message.validateField(errors.voucher_max_amount.type, 'This field')}</span>  
                    <br/>
                    <Label> 
                    <input
                        name="is_single_user"
                        type="checkbox"
                        value={true}
                        ref={register({ required: false })}
                    /> Limit to one use per customer</Label> 
                    <br/>
                    <Label> 
                    <input
                        name="first_order"
                        type="checkbox"
                        value={true}
                        ref={register({ required: false })}
                    /> First time purchase only</Label>                    
                </FormGroup> 
                <hr/>
                <Label className="control-label"><strong>Schedule</strong></Label><br/> 
                <Row>
                    <Col sm={5}>
                    Start Date
                    <input
                        name="schedule_start_date"
                        className="form-control"
                        type="date"
                        ref={register({ required: true })}
                        onChange={(e)=>handleTimeChange(e.target.name, e.target.value)}
                    />
                    </Col>
                    <Col>
                    Start Time(WIB)<br/>
                    <TimePicker
                        style={{width:'100%'}}
                        disableClock={true}
                        name="schedule_start_time"
                        onChange={(event)=>handleTimeChange("schedule_start_time", event)}
                        value={scheduleTime.schedule_start_time}
                        hourPlaceholder="hh"
                        minutePlaceholder="mm"
                        disabled={!scheduleTime.schedule_start_date}
                    />
                    </Col>
                </Row><br/>
                <Row >
                    <Col sm={5}>
                    End Date
                    <input
                        name="schedule_end_date"
                        className="form-control"
                        type="date"
                        min={scheduleTime.schedule_start_date}
                        ref={register({ required: true })}
                        onChange={(e)=>handleTimeChange(e.target.name, e.target.value)}
                    />
                    </Col>
                    <Col>
                    End Time(WIB)<br/>
                    <TimePicker
                        style={{width:'100%'}}
                        disableClock={true}
                        name="schedule_end_time"
                        onChange={(event)=>handleTimeChange('schedule_end_time', event)}
                        value={scheduleTime.schedule_End_time}
                        hourPlaceholder="hh"
                        minutePlaceholder="mm"
                        disabled={!scheduleTime.schedule_end_date}
                    />
                    </Col>
                </Row> 
                    <span className="text-danger">{(errors.schedule_start_date || errors.schedule_end_date)  && Message.validateField('required', 'Schedule Date & Time')}</span>     
                <hr/>
                <FormGroup>
                    <Label className="control-label"><strong>Avilabilty</strong></Label><br/> 
                    <Row>
                        {avilabilty_type?.map((row, index) =>
                            <Label key={index} className="col-sm-4 mb-2"> 
                                <input
                                    name="avilabilty_type"
                                    type="checkbox"
                                    value={row.code}
                                    onChange={(e) => row.code === 2 ? handleStateChange('avilabilty_type', !state.avilabilty_type) : e}
                                    ref={register({ required: true })}
                                /> &nbsp; {row.label}
                            </Label>
                        )}
                    </Row>
                </FormGroup> 
                <span className="text-danger">{errors.avilabilty_type && Message.validateField(errors.avilabilty_type.type, 'Avilabilty')}</span>               
                { state.avilabilty_type &&
                <>               
                <hr/>
                <FormGroup>
                    <Label className="control-label"><strong>Additional info for App</strong></Label><br/>
                    Terms and Conditions
                    <textarea 
                            className="form-control "
                            name="term_conditions" 
                            placeholder="Terms and Conditions" 
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
                            <Label>Voucher Preview Title</Label>                  
                            <input
                                className="form-control "
                                type="text"
                                name="sub_title" 
                                placeholder="Ex: 20%" 
                                ref={register({
                                required: true
                                })}
                                />   
                            <span className="text-danger">{errors.sub_title  && Message.validateField(errors.sub_title.type, 'Voucher Preview Title')}</span>                 
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Label className="mr-3">
                    <input
                        name="hide"
                        type="checkbox"
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
                        Save
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