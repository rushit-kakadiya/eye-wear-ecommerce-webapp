import React, {useEffect, useState} from 'react';
import { Row, Col, Card, CardBody, Label, FormGroup, Button } from "reactstrap";
import { useForm, Controller  } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Regex from '../../utilities/regex'; 
import Message from '../../utilities/message';
import {titleCase, splitAtFirstSpace} from '../../utilities/methods';

export default ({updateEmployee, user_management, history, error, roles, selectedUserId, stores}) => {
    const [role, setRole] = useState('');
    const { register, handleSubmit, errors, control, watch, setValue, setError  } = useForm(); // initialise the hook
    const {is_loading, list} = user_management;
    const user = list.find(row => row.id === selectedUserId);
    
    useEffect(() => {
        if(!user){
            history.push('/admin');
        } else {
            setValue('name',  user.name); 
            setValue('email',  user.email);
            setValue('role_name',  user.roleid);
            setValue('store_id', user.store_id);
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
            <Label className="text-primary"><h4>PROFILE</h4></Label><hr/>
            <Form onSubmit={handleSubmit(updateEmployee)}>
                <FormGroup>
                    <label className="control-label" htmlFor="name">
                        User Name *
                    </label>
                    <div className={errors.name ? 'mb-2 danger-border' : 'mb-2'}>
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
                    <div className={errors.email ? 'mb-2 danger-border' : 'mb-2'}>
                        <input
                            type="text"
                            name="email" 
                            placeholder="Enter email address"
                            ref={register({
                                required: true,
                                pattern: Regex.validateEmail
                                })}
                            className="form-control"
                            disabled={true}
                        />
                    </div>
                    <span className="text-danger">{errors.email && Message.validateField(errors.email.type, 'Email')}</span>
                </FormGroup>   
                <FormGroup>
                    <label className="control-label" htmlFor="role">
                        Role *
                    </label>
                    <div className="mb-2">
                     <select 
                        name="role_name" 
                        className={errors.role_name ? 'form-control danger-border' : 'form-control'} 
                        onChange={e => setRole(e.target.value)}
                        ref={register({
                            required: true
                        })}
                     >
                            <option value="" key="empty"> --- Select Role --- </option>
                            {roles.filter(r => !['store-staff', 'optician', 'hto-staff'].includes(r.role)).map(row => <option value={row.role} key={row.role}> {titleCase(row.name)} </option>)}
                        </select>
                    <span className="text-danger">{errors.role_name && Message.validateField(errors.role_name.type, 'Role')}</span>
                    </div>
                </FormGroup>
                {(role === 'store-account' || user.roleid === 'store-account') && 
                <FormGroup>
                    <label className="control-label" htmlFor="store_id">
                        Store *
                    </label>
                    <div className="mb-2">
                    <Controller
                        as={<select className={errors.role ? 'form-control danger-border' : 'form-control'}>
                            <option value="" key="empty"> --- Select Store --- </option>
                            {stores.map(row => <option value={row.id} key={row.id}> {titleCase(row.name)} </option>)}
                            </select>}
                        control={control}
                        name="store_id"
                        rules={{ required: role === 'store-account' || user.roleid === 'store-account' }}
                    />
                    <span className="text-danger">{errors.store_id && Message.validateField(errors.store_id.type, 'Store')}</span>
                    </div>
                </FormGroup>
                }
                <br/>
                <Label className="text-primary"><h4>CHANGE PASSWORD</h4></Label><hr/>
                <FormGroup>
                    <label className="control-label" htmlFor="old password">
                        Old Password *
                    </label>
                    <div className={errors.name ? 'mb-2 danger-border' : 'mb-2'}>
                    <input
                        className="form-control "
                        type="password"
                        name="old_password" 
                        placeholder="Old Password" 
                        ref={register({
                            required: watch('password')
                        })}
                        />
                    </div>
                    <span className="text-danger">{errors.old_password && Message.validateField(errors.old_password.type, 'Old Password', errors.old_password.types)}</span>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="password">
                        New Password *
                    </label>
                    <div className={errors.name ? 'mb-2 danger-border' : 'mb-2'}>
                    <input
                        className="form-control "
                        type="password"
                        name="password" 
                        placeholder="New Password" 
                        ref={register({
                            required: false,
                            pattern: Regex.validatePassword
                        })}
                        />
                    </div>
                    <span className="help-block">Password length must be of Minimum eight characters, at least one letter, one number and one special character .</span>
                    <span className="text-danger">{errors.password && Message.validateField(errors.password.type, 'New Password')}</span>
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
                            required: watch('password'),
                            pattern: Regex.validatePassword,
                            validate: (value) => value === watch('password')
                        })}
                        />
                    </div>
                    <span className="text-danger">{errors.confirm_password && Message.validateField(errors.confirm_password.type, 'Confirm Password')}</span>
                </FormGroup>
                <FormGroup>
                <Row>
                <Col md="6">
                    <Button style={{ width: '100%'}} className="btn mt-2" outline color="danger" type="button" onClick={()=> history.goBack()} disabled={is_loading}>
                        Cancel Update
                    </Button>
                </Col>
                <Col md="6">
                    <Button style={{width: '100%'}} color="primary mt-2" type="submitt" disabled={is_loading}>
                        Update Admin User
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