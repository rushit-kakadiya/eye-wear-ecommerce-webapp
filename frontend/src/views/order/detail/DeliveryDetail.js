import React, {useState, useEffect} from 'react';
import { Row, Col, NavLink, FormGroup, Popover, PopoverBody, Button} from "reactstrap";
import Select from 'react-select';
import { getDateFormat, titleCase } from "../../../utilities/methods";
import { orderStatus } from "../../../utilities/constants";

export default ({detail, updateOrderStatus, toggle, validateSicepatAvialiblity ,userData}) => {
    const [status, setStatus] = useState({value: '', label: ''});
    const [popoverOpen, setPopoverOpen] = useState(false);
    useEffect(() => {
        const row = orderStatus.find(item => item.value === detail.order_status);
        if(!status.value && row){
            setStatus(row);
        }
    },[detail, status]);
    
    const getOrderStatus = () => {
       if(detail.order_status === 'payment_failed') {
        return([
            {value: 'payment_confirmed', label: 'Payment Confirmed'},
            {value: 'order_cancelled', label: 'Order Cancelled'}
        ])
       } else if(detail.order_status === 'order_confirmed'){
           return([
                {value: 'ready_to_collect', label: 'Ready to Collect'},
                {value: 'ready_for_delivery', label: 'Ready for Delivery'},
                {value: 'order_returned', label: 'Order Returned'}
            ]
           )
       } else if(detail.order_status === 'ready_to_collect'){
        return([
                {value: 'ready_for_delivery', label: 'Ready for Delivery'},
                {value: 'order_completed', label: 'Order Completed'},
                {value: 'order_returned', label: 'Order Returned'}
            ]
            )
        } else if( ['ready_for_delivery'].includes(detail.order_status)){
        return ( [
            {value: 'in_transit', label: 'In Transit'},
            {value: 'order_completed', label: 'Order Completed'},
            {value: 'order_returned', label: 'Order Returned'}
        ])
       } else if( ['in_transit'].includes(detail.order_status)){
        return ( [
            {value: 'order_delivered', label: 'Order Delivered'},
            {value: 'order_completed', label: 'Order Completed'},
            {value: 'order_returned', label: 'Order Returned'}
        ])
       } else if( ['order_delivered','order_completed'].includes(detail.order_status)){
        return ( [
            {value: 'order_completed', label: 'Order Completed'},
            {value: 'order_returned', label: 'Order Returned'}
        ])
       } else {
           return ( [
            {value: 'payment_initiated', label : 'Payment Initiated'},
            {value: 'payment_pending', label: 'Payment Pending'},
            {value: 'payment_confirmed', label: 'Payment Confirmed'},
            {value: 'payment_failed', label: 'Payment Failed'},
            {value: 'payment_cancelled', label: 'Payment Cancelled'},
            {value: 'order_cancelled', label: 'Order Cancelled'},
            {value: 'order_confirmed', label: 'Order Confirmed'}
        ])
       }
    }

    return(
        <Row style={{border:'1px solid #ccc'}} className="p-3 mt-3">
            <Col sm="12"><h5>Delivery Detail</h5></Col>
            <Col sm="6"><strong>Delivery Type</strong><br/>
                <Select
                    placeholder="Select a store"
                    value={{value: detail.fulfillment_type, label: detail.fulfillment_type === 0 ? `Pick up at ${detail['store_name'] || 'store'}` : 'Delivery'}}
                    options={[{value: 0, label: `Pick up at ${detail['store_name'] || 'store'}`}, {value: 1, label: 'Delivery'}]}
                    isDisabled={true}
                />
            </Col>
            <Col sm="6">
                <strong>Delivery Date</strong><br/>
                {detail.scheduled_delivery_date ? getDateFormat(detail.scheduled_delivery_date, true, false, userData.time_zone) : '------'}
            </Col>
            <Col sm="6" className="mt-3"><strong>Delivery Status</strong><br/>
                <Select
                    placeholder="Select a store"
                    value={status}
                    options={getOrderStatus()}
                    isDisabled={['payment_initiated', 'payment_pending', 'payment_confirmed', 'order_pending', 'order_cancelled', 'order_returned'].includes(detail.order_status)}
                    onChange={(slectedOption) => {updateOrderStatus(slectedOption.value); setStatus(slectedOption)}}
                />
            </Col>           
            <Col sm="6" className="mt-3"><strong>{ detail.fulfillment_type === 1  ? 'Delivery Address' : 'Pick up at Store Address'}</strong><br/> 
            { detail.fulfillment_type === 1 ? detail.addressDetails && Object.keys(detail.addressDetails).length > 0 && detail.addressDetails['address_details'] === detail.addressDetails['address'] ? detail.addressDetails['address'] : `${detail.addressDetails['address_details']}, ` + detail.addressDetails['address'] : detail.pick_up_store_id && detail.pick_up_store_id.address}
            </Col>
            {detail.fulfillment_type === 1 && 
                <>
                <Col sm="6" className="mt-3"><strong>Airway Bill</strong><br/>
                {detail.order_status === 'ready_for_delivery' || detail.airway_bill_no ?                     
                <FormGroup>
                    {detail.airway_bill_no ? detail.airway_bill_no : 
                    <>
                        <NavLink className="p-0" href="#" id={`Popover-1`} onClick={()  => setPopoverOpen(!popoverOpen)} active style={{textDecoration: 'underline', width:'50%'}}>
                            Input airway bill
                        </NavLink> 
                        <Popover placement="bottom" isOpen={popoverOpen} target="Popover-1" >
                            <PopoverBody style={{width:"700px"}} >
                            <FormGroup className="mb-0">
                                <Button color="primary" type="button" style={{padding: "6px"}} onClick={()=> {setPopoverOpen(!popoverOpen); validateSicepatAvialiblity()}}>Input Automatically</Button>
                                <Button color="primary" className="ml-1" type="button" style={{padding: "6px"}} onClick={()=>{ setPopoverOpen(!popoverOpen);toggle('inputDeliveryManually')}}>
                                    Input Manually
                                </Button>
                            </FormGroup>
                            <FormGroup className="mb-0">
                                <span style={{marginRight:"10%"}} > *with Sicepat</span>
                                <span > *other services</span> 
                            </FormGroup>
                                            
                            </PopoverBody>
                        </Popover>
                        </>
                    }
                </FormGroup>
                    :'------' 
                }</Col>
                <Col sm="6" className="mt-3"><strong>Delivery Service</strong><br/> {detail.delivery_partner ? titleCase(detail.delivery_partner) : '------'}</Col>
                {/* {detail.pick_up_store_id &&
                <Col sm="6" className="mt-3"><strong>Pick up at Store Address</strong><br/>
                    {detail.pick_up_store_id.address}
                </Col>
                } */}
                </>
            }
           
        </Row>
    )
}
