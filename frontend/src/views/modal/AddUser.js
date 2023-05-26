import React, {useState, useEffect} from 'react';
import {
    Row,
    Col,
    Button,
    FormGroup,
    Card,
    CardBody,
    Label
} from 'reactstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useForm } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Autocomplete from '../../components/Autocomplete';
import Regex from '../../utilities/regex'; 
import Message from '../../utilities/message';


const AddUser = ({userList, loading, toggle, addUserInOrder, searchUser, selectedUser, isEdit}) => {
    const [userData, setUserData] = useState({name: '', email: '', mobile: '', dob: '', gender: '', country_code:'62'});
    const [username, setUsernameError] = useState('');
    const { register, handleSubmit, errors } = useForm(); // initialise the hook
    const [user, setUser] = useState({});
    const [inputValue, setInputValue] = useState('');
    useEffect(()=> {
        if(Object.values(user).length){
            const dob = user.dob ? user.dob.split("T")[0] : '';
            const mobile = user.country_code ? user.country_code+user.mobile : '62'+user.mobile;
            setUserData({...user, dob, mobile, country_code: user.country_code || '62' });
        } else if(!isEdit) {
            setUserData({});
        }
    },[user]);

    useEffect(() => {
        if(Object.values(user).length === 0){
            const dob = selectedUser.dob ? selectedUser.dob.split("T")[0] : '';
            setUser({...selectedUser, dob});
            setInputValue(selectedUser.name || '');
        }
    }, [selectedUser]);

    const onSubmit = (data) => {
        if(!inputValue){
            setUsernameError('error');
            return;
        } 
        if(user['id']){
            addUserInOrder({...user, ...data, name: inputValue, mobile:userData.mobile.slice(userData.country_code.length), country_code:userData.country_code});
        } else {
            addUserInOrder({...data,  name: inputValue, mobile:userData.mobile.slice(userData.country_code.length), country_code:userData.country_code});
        }
    };

    const renderItems = (item, isHighlighted) => {
        return (
            <div key={Math.random(10)} style={{ background: isHighlighted ? 'lightgray' : 'white', border: '2px' }}>
                {item.name}
            </div>
        );
    };
    
 

        return (
            <Row>
                <Col sm="12">
                    <Card>
                        <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <label className="control-label" htmlFor="name">
                                Name *
                            </label>
                            <div className="mb-2">
                            <Autocomplete
                                items={userList}
                                name="name"
                                className="form-control"
                                label='name'
                                label2='mobile'
                                renderItems={renderItems.bind(null)}
                                setObject={setUser.bind(null)}
                                setInputValue={setInputValue.bind(null)}
                                handleSearch={searchUser}
                                placeholder="Search user by name or mobile no."
                                defaultValue={selectedUser.name || ''}
                            />
                            </div>
                            <span className="text-danger">{username && 'Name is required.'}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="email">
                                Email *
                            </label>
                            <div className="mb-2">
                                <input
                                    value={userData['email'] || ''}
                                    type="text"
                                    name="email" 
                                    placeholder="Enter email address"
                                    onChange={e=> setUserData({...userData, email: e.target.value})}
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
                            {/* <Controller
                                as={
                                    <PhoneInput
                                    inputStyle={{width:'100%'}}
                                    country={'id'}  
                                    value={userData['mobile'] || ''}
                                    onChange={(value, data)=> setUserData({...userData, mobile: value, country_code:data.dialCode})}
                                    inputProps={{
                                        name: 'mobile',
                                        required: true
                                    }}
                                />}
                                control={control}
                                value={userData['mobile']}
                                valueName={userData['mobile']}
                                name="mobile"
                                rules={{ required: true,  maxLength: 13, minLength: 11, pattern: Regex.validateMobile  }}
                                /> */}

                            <PhoneInput
                                inputStyle={{width:'100%'}}
                                country={'id'}  
                                value={userData['mobile'] || ''}
                                onChange={(value, data)=> setUserData({...userData, mobile: value, country_code:data.dialCode})}
                                inputProps={{
                                    name: 'mobile',
                                    required: true
                                }}
                                disabled={ !!selectedUser.name }
                            />
                            </div>
                            <span className="text-danger">{errors.mobile && Message.validateField(errors.mobile.type, 'Mobile no')}</span>
                        </FormGroup>
                        <FormGroup>
                            <label className="control-label" htmlFor="age">
                                Birth Date
                            </label>
                            <div className="mb-2">
                                <input
                                    value={userData['dob'] || ''}
                                    type="date"
                                    name="dob" 
                                    onChange={e=> setUserData({...userData, dob: e.target.value})}
                                    ref={register({ required: true })}
                                    className="form-control"
                                />
                            </div>
                            <span className="text-danger">{errors.dob && Message.validateField(errors.dob.type, 'Birth date')}</span>
                        </FormGroup>
                        <FormGroup>
                        <label>Gender</label><br/>
                        <FormGroup className="mb-0">
                             <Label>
                                 {userData.gender === 1 ?
                                 <input
                                    name="gender"
                                    type="radio"
                                    value="1"
                                    checked
                                    ref={register({ required: true })}
                                 />
                                 :
                                 <input
                                    name="gender"
                                    type="radio"
                                    value="1"
                                    onClick={e=> setUserData({...userData, gender: e.target.value})}
                                    ref={register({ required: true })}
                                />
                                }  Male </Label>
                        
                            <Label className="ml-3">
                            { userData.gender === 2 ?
                                 <input
                                    name="gender"
                                    type="radio"
                                    value="2"
                                    checked
                                    ref={register({ required: true })}
                                 />
                                 :
                                 <input
                                    name="gender"
                                    type="radio"
                                    value="2"
                                    ref={register({ required: true })}
                            />} Female</Label>
                        </FormGroup>
                        <span className="text-danger">{errors.gender && Message.validateField(errors.gender.type, 'Gender')}</span>
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
                               { selectedUser.name ? 'Update Customer' : 'Add Customer' }
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

    AddUser.defaultProps = {
        selectedUser: {},
        isEdit: false
    }
        
    export default AddUser;  

