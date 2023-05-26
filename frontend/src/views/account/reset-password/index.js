import React from 'react';
import { Row, Col, Label, Button, FormGroup } from "reactstrap";
import { useForm } from 'react-hook-form';
import Form from 'react-validation/build/form';
import { toastAction } from '../../../redux/ToastActions';


import { splitAtFirstSpace } from '../../../utilities/methods';
import 'react-multiple-select-dropdown-lite/dist/index.css';

import Message from '../../../utilities/message';
import Regex from '../../../utilities/regex';


export default ({ resetPassword, loading }) => {

    const { register, handleSubmit, errors, setError, watch, reset } = useForm(); // initialise the hook

    const onSubmit = (data) => {
        resetPassword(data,(message, error)=>{
            if(error){
                let messageData = splitAtFirstSpace(message.en);
                setError(messageData[0], {type :'server',  message : messageData[1]});
            }else{
                toastAction(true, message);
                reset()
            }
        })
    };


    return (
        <Col md="6" sm="12" xs="12" >
            <Row>
                <Col>
                    <h4> Change Password </h4>
                </Col>
            </Row><br></br>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md='12' sm="12" xs="12">
                        <FormGroup>
                            <Label >Old Password</Label>
                            <input className={"form-control" + (errors.old_password ? ' danger-border' : '')} type="password" name="old_password" id="old_password" placeholder="Old Password" ref={register({ required: true })} />
                            <span className="text-danger">{errors.old_password && Message.validateField(errors.old_password.type, 'Old Password', errors.old_password.types)}</span>
                        </FormGroup>
                    </Col>
                    <Col md='12' sm="12" xs="12">
                        <FormGroup>
                            <Label for="new_password">New Password</Label>
                            <input className={"form-control" + (errors.new_password ? ' danger-border' : '')} type="password" name="new_password" id="new_password" placeholder="New Password" ref={register({ required: true, pattern: Regex.validatePassword })} />
                            <span className="help-block">Password length must be of Minimum eight characters, at least one letter, one number and one special character .</span>
                            <span className="text-danger">{errors.new_password && Message.validateField(errors.new_password.type, 'New Password')}</span>
                        </FormGroup>
                    </Col>
                    <Col md='12' sm="12" xs="12">
                        <FormGroup>
                            <Label for="confirm_password">Confirm Password</Label>
                            <input className={"form-control" + (errors.confirm_password ? ' danger-border' : '')} type="password" name="confirm_password" id="confirm_password" placeholder="Confirm Password" ref={register({ required: true, validate: (value) => value === watch('new_password') })} />
                            <span className="text-danger">{errors.confirm_password && Message.validateField(errors.confirm_password.type, 'Confirm Password')}</span>
                        </FormGroup>
                    </Col>                  
                    <Col md='7' sm="12" xs="12" style={{ marginTop :"25px"}}>
                        <FormGroup>
                            <Button type="submit" disabled={loading} color="primary" style={{width  : "100%"}}>Update</Button>
                        </FormGroup>
                    </Col>
                    <Col md='5' sm="12" xs="12" style={{ marginTop :"25px"}}>
                        <FormGroup>
                            <Button type="button" disabled={loading} onClick={() => reset()} color="danger" outline={true} style={{width  : "100%"}}>Cancel Edit</Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </Col>
    )
}