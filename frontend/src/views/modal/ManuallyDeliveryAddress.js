import React from 'react';
import {
    Row,
    Col,
    FormGroup,
    Button
} from 'reactstrap';
import { useForm} from 'react-hook-form';
import Form from 'react-validation/build/form';
import {deliveryCompanyList} from '../../utilities/constants';
import Message from '../../utilities/message';

export default ({addManuallyDeliveryAddress}) =>{
    const { register, handleSubmit, errors } = useForm(); 
    const onSubmit = (data) => {
        addManuallyDeliveryAddress(data)
    }
    return(
        <Col sm="11" className="mt-2 ml-4">
            <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
                <label className="control-label">
                    Delivery Company
                </label>
                <div className="mb-2">
                    <select
                        name="delivery_partner" 
                        className="form-control"
                        ref={register({
                            required: true
                          })}
                    >{deliveryCompanyList.map((row, index) => <option key={index} value={row.value}>{row.label}</option>)}</select>
                </div>
                <span className="text-danger">{errors.delivery_partner && Message.validateField(errors.delivery_partner.type, 'Delivery Company')}</span>
            </FormGroup>
            <FormGroup>
                <label className="control-label">
                   Delivery Date
                </label>
                <div className="mb-2">
                    <input
                        type="date"
                        name="scheduled_delivery_date" 
                        placeholder=" Delivery Date"
                        className="form-control"
                        ref={register({
                            required: true
                        })}
                        min={new Date().toLocaleString().split(',')[0].split('/').slice(0,3).reverse().join("-")}
                    />
                </div>
                <span className="text-danger">{errors.scheduled_delivery_date && Message.validateField(errors.scheduled_delivery_date.type, 'Delivery Date')}</span>
            </FormGroup>
            <FormGroup>
                <label className="control-label">
                   Airway Bills
                </label>
                <div className="mb-2">
                    <input
                        type="text"
                        name="airway_bill_no" 
                        placeholder="Airway Bills"
                        className="form-control"
                        ref={register({
                            required: false
                        })}
                    />
                </div>
                <span className="text-danger">{errors.airway_bill_no && Message.validateField(errors.airway_bill_no.type, 'Airway Bills')}</span>
            </FormGroup>
            <FormGroup></FormGroup>
            <FormGroup>
            <Row>
            <Col md="6">
                <Button style={{width: '100%'}} color="primary" type="submit" >
                    Submit
                </Button>
            </Col> 
            </Row>
            </FormGroup>
            </Form>
        </Col>
    )
}