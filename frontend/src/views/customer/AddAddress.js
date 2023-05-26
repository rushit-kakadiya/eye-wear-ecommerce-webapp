import React, {useEffect, useState} from 'react';
import { Row, Col, Card, CardBody, FormGroup, Button,NavLink } from "reactstrap";
import { useForm } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Regex from '../../utilities/regex'; 
import Message from '../../utilities/message';
import Address from '../../components/Address';

export default ({ loading, history, addAddress}) => {
    const [addressError, setAddressError] = useState('');
    const [address, setAddress] = useState();
    const [zipCode, setZipCode] = useState();
    const { register, handleSubmit, errors } = useForm(); // initialise the hook

    useEffect(()=> {
         setZipCode(address ? address['zip_code'] : '');
    },[address]);

    const onSubmit = (data) => {
        if(!address){
        setAddressError('error');
        return;
    } 
        addAddress({...address, ...data})
    };

    return(
        <Row>
        <Col md="7" sm={{offset: 1}}>
          <Card>
            <CardBody >
            <Form  onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                    <label className="control-label" htmlFor="name">
                        Address Lable *
                    </label>
                    <div className="mb-2" >
                    <input
                        className="form-control "
                        type="text"
                        name="label_address" 
                        placeholder="Home" 
                        ref={register({
                        required: true
                        })}
                        />
                    </div>
                    <span className="text-danger">{errors.label_address && Message.validateField(errors.label_address.type, 'Name')}</span>
                </FormGroup>
                <Row>
                    <Col sm={7}>
                    <FormGroup>
                        <label className="control-label" htmlFor="email">
                           Address *
                        </label>
                        <div className="mb-2">
                        <Address setAddress={setAddress}/>
                        </div>
                        <span className="text-danger">{addressError && 'Please enter address.'}</span>
                    </FormGroup>
                    </Col>
                    <Col sm={5} >
                    <FormGroup>
                        <label className="control-label" htmlFor="email">
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
                        <span className="text-danger">{errors.zip_code && Message.validateField(errors.zip_code.type, 'Zip Code')}</span>
                    </FormGroup>
                    </Col>
                </Row>
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
                <Row>
                    <Col sm={6}>
                    <FormGroup>
                        <label className="control-label" htmlFor="email">
                            Receiver Name *
                        </label>
                        <div className="mb-2">
                            <input
                                type="text"
                                name="receiver_name" 
                                placeholder="John Doe"
                                ref={register({
                                    required: true
                                    })}
                                className="form-control"
                            />
                        </div>
                        <span className="text-danger">{errors.receiver_name && Message.validateField(errors.receiver_name.type, 'Reciver Name')}</span>
                    </FormGroup>
                    </Col>
                    <Col sm={6} >
                    <FormGroup>
                        <label className="control-label" htmlFor="email">
                            Phone Number *
                        </label>
                        <div className="mb-2">
                            <input
                                type="Number"
                                name="phone_number" 
                                placeholder="0812 1233 1233 "
                                ref={register({
                                    required: true,
                                    maxLength: 11, 
                                    minLength: 8, 
                                    pattern: Regex.validateMobile 
                                    })}
                                className="form-control"
                            />
                        </div>
                        <span className="text-danger">{errors.phone_number && Message.validateField(errors.phone_number.type, 'Phone Number')}</span>
                    </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                <Row>
                <Col sm="6">
                    <Button style={{ width: '100%'}} className="btn mt-2" outline color="danger" type="button" onClick={()=> history.push('/customer')} >
                        Cancel
                    </Button>
                </Col>
                <Col sm="6">
                    <Button style={{width: '100%'}} color="primary mt-2" type="submitt" disabled={loading}>
                        Save
                    </Button>
                </Col> 
                </Row>
                </FormGroup>
                <Row>
                    <Col sm="3" ></Col>
                    <Col sm="6" className="ml-5">
                    <NavLink to="#"  className="text-primary align-items-end " style={{ display: "contents", textDecoration:"underLine", cursor: "pointer"}} onClick={()=>history.push('/customer')}>Fill Address Later</NavLink>
                    </Col>
                </Row>
                </Form> 
            </CardBody>
          </Card>
        </Col>
        </Row>
    )
}