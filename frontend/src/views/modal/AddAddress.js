import React, {useState, useEffect} from 'react';
import {
    Row,
    Col,
    Button,
    FormGroup,
    Card,
    CardBody
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Address from '../../components/Address';
import Message from '../../utilities/message';


const AddAddress = ({loading, toggle, addUserAddress, editedAddressValue}) => {
    const [addressError, setAddressError] = useState('');
    const { register, handleSubmit, errors } = useForm({defaultValues: editedAddressValue || {}}); // initialise the hook
    const [address, setAddress] = useState(editedAddressValue);
    const [zipCode, setZipCode] = useState(editedAddressValue ? editedAddressValue.zip_code : '');
    
    useEffect(()=> {
        setZipCode(address ? address['zip_code'] : '');
    },[address]);

    const onSubmit = (data) => {
        if(!address){
            setAddressError('error');
            return;
        } 
        addUserAddress({...address, ...data, id: editedAddressValue ? editedAddressValue.id : null, zip_code: zipCode});
    };
   
        return (
            <Row>
                <Col sm="12">
                    <Card>
                        <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <label className="control-label" htmlFor="label_address">
                                Address Label *
                            </label>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    name="label_address" 
                                    placeholder="Home"
                                    ref={register({
                                        required: true
                                      })}
                                    className="form-control"
                                />
                            </div>
                            <span className="text-danger">{errors.label_address && Message.required}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="age">
                                Address *
                            </label>
                            <div className="mb-2">
                                <Address setAddress={setAddress} 
                                 intialValue={editedAddressValue ? editedAddressValue.address: null}
                                 />
                            </div>
                            <span className="text-danger">{addressError && 'Please enter address.'}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="zip_code">
                                Zip Code *
                            </label>
                            <div className="mb-2">
                                <input
                                    value={zipCode}
                                    type="text"
                                    name="zip_code" 
                                    placeholder="Zip Code"
                                    onChange={(e)=>setZipCode(e.target.value)}
                                    ref={register({ required: true, maxLength: 6, minLength: 4 })}
                                    className="form-control"
                                />
                            </div>
                            <span className="text-danger">{errors.zip_code && Message.required}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="mobile">
                                Address Detail *
                            </label>
                            <div className="mb-2">
                                <textarea
                                    name="address_details" 
                                    placeholder="eg: Floor/House/Block Number, RT/RW"
                                    ref={register({ required: true})}
                                    className="form-control "
                                />
                            </div>
                            <span className="text-danger">{errors.address_detail && Message.validateField(errors.address_detail.type, 'Address Detail')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="receiver_name">
                                Receiver Name *
                            </label>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    name="receiver_name" 
                                    placeholder="John Doe"
                                    ref={register({ required: true })}
                                    className="form-control"
                                />
                            </div>
                            <span className="text-danger">{errors.receiver_name && Message.required}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="phone_number">
                                Phone Number *
                            </label>
                            <div className="mb-2">
                                <input
                                    type="number"
                                    name="phone_number" 
                                    placeholder="0812 1233 1233"
                                    ref={register({ required: true })}
                                    className="form-control"
                                />
                            </div>
                            <span className="text-danger">{errors.phone_number && Message.required}</span>
                        </FormGroup> 
                        <FormGroup>            
                        <Row>
                        <Col md="6">
                           <Button style={{ width: '100%'}} className="btn" outline color="danger" type="button" onClick={toggle}>
                                Cancel
                            </Button>
                        </Col>
                        <Col md="6">
                            <Button style={{width: '100%'}} color="primary" type="submit" disabled={loading}>
                                {editedAddressValue && editedAddressValue.id ? 'Update Address' : 'Add New Address' }
                            </Button>
                        </Col> 
                        </Row>
                        </FormGroup>
                        </Form> 
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

AddAddress.defaultProps = {
    editedAddressValue: null
}
    
export default AddAddress;