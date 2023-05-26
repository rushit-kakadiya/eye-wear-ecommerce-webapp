import React from 'react';
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
import Message from '../../utilities/message';
import Regex from '../../utilities/regex';

export default ({toggle, onChangePassword}) => {
    const { register, handleSubmit, errors} = useForm();
    return(
        <Row>
        <Col md="12">
            <Card>
                <CardBody >
                    <Row style={{textAlign: 'center'}}>
                        <Col className="text-primary"><strong><h4>Input password to reset <br/>Operation Team password</h4></strong></Col>
                    </Row> 
                    <Form onSubmit={handleSubmit(onChangePassword)}> 
                    <Row> 
                    <Col>  
                    <FormGroup>
                            <label className="control-label" htmlFor="email">
                                Password *
                            </label>
                            <div className={"mb-2" + (errors.password ? 'mb-2 danger-border' : '')}>
                                <input
                                    type="password"
                                    name="password" 
                                    placeholder="Password"
                                    ref={register({
                                        required: true,
                                        pattern: Regex.validatePassword
                                    })}
                                    className="form-control"
                                />
                            </div>
                            <span className="text-danger">{errors.password && Message.validateField(errors.password.type, 'Password')}</span>
                        </FormGroup>
                    </Col>  
                    </Row>
                    <Row className="ml-5">
                        <Col md="4">
                           <Button style={{ width: '100%'}} className="btn" outline color="danger" type="button" onClick={toggle}>
                                Cancel
                            </Button>
                        </Col>
                        <Col md="6">
                            <Button style={{width: '100%'}} color="primary" type="submit" >
                              Reset Password
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