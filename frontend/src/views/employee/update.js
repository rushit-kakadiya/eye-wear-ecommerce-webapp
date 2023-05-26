import React, {useEffect} from 'react';
import { Row, Col, Card, CardBody, Label, FormGroup, Button } from "reactstrap";
import { useForm, Controller  } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Regex from '../../utilities/regex'; 
import Message from '../../utilities/message';
import {titleCase, splitAtFirstSpace} from '../../utilities/methods';

export default ({updateEmployee, employees, history, error, roles, stores, selectedEmpId}) => {
    const {is_loading, list} = employees;
    const user = list.find(row => row.id === selectedEmpId);
    const { register, handleSubmit, errors, control, watch, setValue, setError  } = useForm({
        defaultValues: {
            emp_ref_code: user.emp_ref_code,
            name: user.name,
            email: user.email,
            role_name: user.role_id,
            store_id: user.store_id || ''
        }
    }); // initialise the hook

    useEffect(() => {
        if(!user) {
            history.push('/employee');
        }
    }, [setValue, user]);

    useEffect(()=>{
        const messageData = splitAtFirstSpace(error.en);
        setError(messageData[0], {type :'server',  message : messageData[1]});
    }, [setError, error])

    return(
        <Row>
        <Col md="7" sm={{offset: 1}}>
          <Card>
            <CardBody >
                <Label className="text-primary"><h4>Update Employee</h4></Label><hr/>
                <Form onSubmit={handleSubmit(updateEmployee)}>
                <FormGroup>
                    <label className="control-label" htmlFor="emp_ref_code">
                        Employee ID *
                    </label>
                    <div className={errors.emp_ref_code ? 'mb-2 danger-border' : 'mb-2'}>
                    <input
                        className="form-control "
                        type="text"
                        name="emp_ref_code" 
                        placeholder="Employee ID" 
                        ref={register({
                            required: true,
                            pattern: Regex.validId
                        })}
                    />
                    </div>
                    <span className="text-danger">{errors.emp_ref_code && Message.validateField(errors.emp_ref_code.type, 'Employee ID')}</span>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="name">
                        Employee Name *
                    </label>
                    <div className={errors.name ? 'mb-2 danger-border' : 'mb-2'}>
                    <input
                        className="form-control "
                        type="text"
                        name="name" 
                        placeholder="Employee Name" 
                        ref={register({
                            required: true
                        })}
                        />
                    </div>
                    <span className="text-danger">{errors.name && Message.validateField(errors.name.type, 'Name')}</span>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        Email
                    </label>
                    <div className={errors.email ? 'mb-2 danger-border' : 'mb-2'}>
                        <input
                            type="text"
                            name="email" 
                            placeholder="Enter email address"
                            ref={register({
                                required: false,
                                pattern: Regex.validateEmail
                                })}
                            className="form-control"
                        />
                    </div>
                    <span className="text-danger">{errors.email && Message.validateField(errors.email.type, 'Email')}</span>
                </FormGroup>   
                <FormGroup>
                    <label className="control-label" htmlFor="role">
                        Role *
                    </label>
                    <div className="mb-2">
                    <Controller
                        as={<select className={errors.role ? 'form-control danger-border' : 'form-control'}>
                            <option value="" key="empty"> --- Select Role --- </option>
                            {roles.filter(r => ['store-staff', 'customer-services', 'optician', 'hto-staff'].includes(r.role)).map(row => <option value={row.role} key={row.role}> {titleCase(row.name)} </option>)}
                            </select>}
                        control={control}
                        name="role_name"
                        rules={{ required: true }}
                    />
                    <span className="text-danger">{errors.role_name && Message.validateField(errors.role_name.type, 'Role')}</span>
                    </div>
                </FormGroup>
                {/* <FormGroup>
                    <label className="control-label" htmlFor="password">
                        Password *
                    </label>
                    <div className={errors.name ? 'mb-2 danger-border' : 'mb-2'}>
                    <input
                        className="form-control "
                        type="password"
                        name="password" 
                        placeholder="Password" 
                        ref={register({
                            required: true,
                            pattern: Regex.validatePassword
                        })}
                        />
                    </div>
                    <span className="help-block">Password length must be of Minimum eight characters, at least one letter, one number and one special character .</span>
                    <span className="text-danger">{errors.password && Message.validateField(errors.password.type, 'Password')}</span>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="confirm-password">
                        Confirm Password *
                    </label>
                    <div className={errors.name ? 'mb-2 danger-border' : 'mb-2'}>
                    <input
                        className="form-control "
                        type="password"
                        name="confirm_password" 
                        placeholder="Confirm Password" 
                        ref={register({
                            required: true,
                            pattern: Regex.validatePassword,
                            validate: (value) => value === watch('password')
                        })}
                        />
                    </div>
                    <span className="text-danger">{errors.confirm_password && Message.validateField(errors.confirm_password.type, 'Confirm Password')}</span>
                </FormGroup> */}
                <FormGroup>
                    <label className="control-label" htmlFor="store_id">
                        Store
                    </label>
                    <div className="mb-2">
                    <Controller
                        as={<select className={errors.role ? 'form-control danger-border' : 'form-control'}>
                            <option value="" key="empty"> --- Select Store --- </option>
                            {stores.map(row => <option value={row.id} key={row.id}> {titleCase(row.name)} </option>)}
                            </select>}
                        control={control}
                        name="store_id"
                        rules={{ required: false }}
                    />
                    <span className="text-danger">{errors.store_id && Message.validateField(errors.store_id.type, 'Store')}</span>
                    </div>
                </FormGroup>
                <FormGroup>
                <Row>
                <Col md="6">
                    <Button style={{ width: '100%'}} className="btn mt-2" outline color="danger" type="button" onClick={()=>history.goBack()} disabled={is_loading}>
                        Back
                    </Button>
                </Col>
                <Col md="6">
                    <Button style={{width: '100%'}} color="primary mt-2" type="submitt" disabled={is_loading}>
                        Update Employee
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