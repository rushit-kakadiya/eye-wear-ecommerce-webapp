import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Row, Col, Card, CardBody, FormGroup, Label, Button } from "reactstrap";
import { useForm, Controller  } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Regex from '../../utilities/regex'; 
import Message from '../../utilities/message';

export default ({addCustomer, loading, history, mobile, setMobileNo, setCountryCode}) => {
    const { register, handleSubmit, errors, control  } = useForm(); // initialise the hook
    
    const onSubmit = (data) => {
        addCustomer(data)
    };

    const setMobileInfo = (value, data) =>{
        setMobileNo(value); 
        setCountryCode(data.dialCode);
    }

    return(
        <Row>
        <Col md="7" sm={{offset: 1}}>
          <Card>
            <CardBody >
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                    <label className="control-label" htmlFor="name">
                        Name *
                    </label>
                    <div className="mb-2" >
                    <input
                        className="form-control "
                        type="text"
                        name="name" 
                        placeholder="Name" 
                        ref={register({
                        required: true
                        })}
                        />
                    </div>
                    <span className="text-danger">{errors.name && Message.validateField(errors.name.type, 'Name')}</span>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        Email *
                    </label>
                    <div className="mb-2">
                        <input
                            type="text"
                            name="email" 
                            placeholder="Enter email address"
                            ref={register({
                                required: true,
                                pattern: Regex.validateEmail
                                })}
                            className="form-control"
                        />
                    </div>
                    <span className="text-danger">{errors.email && Message.validateField(errors.email.type, 'Email')}</span>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="mobile">
                        Mobile No *
                    </label>
                    <div className="mb-2">
                    <Controller
                        as={<PhoneInput
                        inputStyle={{width:'100%'}}
                        country={'id'} 
                        value={mobile}
                        onChange={(value, data) =>setMobileInfo(value, data) }
                        inputProps={{
                            name: 'mobile',
                            required: true
                         }}
                    />}
                    control={control}
                    name="mobile"
                    rules={{ required: true,  maxLength: 14, minLength: 9, pattern: Regex.validateMobile }}
                    />
                    <span className="text-danger">{errors.mobile && Message.validateField(errors.mobile.type, 'Mobile No')}</span>
                    </div>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="age">
                        Birth Date
                    </label>
                    <div className="mb-2">
                    <input
                    type="date"
                    name="dob" 
                    ref={register({ required: true })}
                    className="form-control "
                    />
                    </div>
                    <span className="text-danger">{errors.dob && Message.validateField(errors.dob.type, 'Birth date')}</span>
                </FormGroup>
                <FormGroup>
                <label>Gender</label><br/>
                <FormGroup className="mb-0">
                    <Label>
                        <input
                        name="gender"
                        type="radio"
                        value="1"
                        ref={register({ required: true })}
                        /> Male </Label>
                    <Label className="ml-3">
                           <input
                            name="gender"
                            type="radio"
                            value="2"
                            ref={register({ required: true })}
                    /> Female</Label>
                </FormGroup>
                    <span className="text-danger">{errors.gender && Message.validateField(errors.gender.type, 'Gender')}</span>
                </FormGroup>    
                <FormGroup>
                <Row>
                <Col md="6">
                    <Button style={{ width: '100%'}} className="btn mt-2" outline color="danger" type="button" onClick={()=>history.goBack()} >
                        Cancel
                    </Button>
                </Col>
                <Col md="6">
                    <Button style={{width: '100%'}} color="primary mt-2" type="submitt" disabled={loading}>
                        Next
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