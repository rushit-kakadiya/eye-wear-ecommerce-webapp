import React, {useEffect} from 'react';
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
import {splitAtFirstSpace} from '../../utilities/methods';

export default ({toggle, onSubmit, text, error, loading}) => {
    const { register, handleSubmit, errors, setError} = useForm();
    useEffect(()=>{
        const messageData = splitAtFirstSpace(error.en);
        setError(messageData[0], {type :'server',  message : messageData[1]});
    }, [setError, error])
    return(
        <Row>
        <Col md="12">
            <Card>
                <CardBody >
                    <Row style={{textAlign: 'center'}}>
                        <Col className={`text-${text}`}><strong><h4>Are you sure you want to {text === 'danger' ? 'deactivate': 'activate'} this user?</h4></strong></Col>
                    </Row> 
                    <Row style={{textAlign: 'center'}}>
                        <Col><h5>Input your password to {text === 'danger' ? 'deactivate': 'activate'} this user</h5></Col>
                    </Row>
                    <Form onSubmit={handleSubmit(onSubmit)}> 
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
                            <span className="text-danger">{errors.password && Message.validateField(errors.password.type, 'Password', errors.password.types)}</span>
                        </FormGroup>
                    </Col>  
                    </Row>
                    <Row className="ml-5">
                        <Col md="5">
                            <Button style={{width: '100%'}} color={text === 'danger' ? 'danger' : 'primary' } type="submit" disabled={loading}>
                              Yes, {text === 'danger' ? 'De-activet' : 'Active'}
                            </Button>
                        </Col> 
                        <Col md="5">
                           <Button style={{ width: '100%'}} className="btn" outline color="primary" type="button" onClick={toggle} disabled={loading}>
                               No, Cancel
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