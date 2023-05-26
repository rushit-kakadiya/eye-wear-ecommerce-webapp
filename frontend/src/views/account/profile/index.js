import React, { useState, useEffect } from 'react';
import { Row, Col, Label, Button, FormGroup } from "reactstrap";
import TimezoneSelect from "react-timezone-select"  
import Form from 'react-validation/build/form';

import { useForm, Controller } from 'react-hook-form';

import { toastAction } from '../../../redux/ToastActions';
import Message from '../../../utilities/message';
import Regex from '../../../utilities/regex';

export default ({ resetTimezone, loading, time_zone}) => {

    const { register, handleSubmit, errors, setError, watch, reset,  control } = useForm(); // initialise the hook

    const [selectedTimezone, setSelectedTimezone] = useState(time_zone)
    const [timezoneError, setTimezoneError] = useState('');
    
    
    const onSubmit = () => {
        if(selectedTimezone != ''){
            resetTimezone({time_zone : selectedTimezone})
        }else{
            setTimezoneError("Please select a valid timezone")
        }
    };

    
    const setTimezone = (data) => {
        setSelectedTimezone(data.value)
        setTimezoneError("")
    };

    return (
        <Col md="6" sm="12" xs="12" >
            <Row>
                <Col>
                    <h4> Account Setting </h4>
                </Col>
            </Row><br></br>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md='12' sm="12" xs="12">
                        <FormGroup>
                            <Label> Time Zone </Label>
                            <TimezoneSelect
                                value={selectedTimezone}
                                onChange={(data) =>{ setTimezone(data) }}
                            />
                            <span className="text-danger">{errors.timezoneError != '' && errors.timezoneError }</span>
                        </FormGroup>
                    </Col>
                    <Col md={{size: 5, offset: 7}} sm="12" xs="12" style={{ marginTop :"25px"}}>
                        <FormGroup>
                            <Button type="submit" disabled={loading} color="primary" style={{width  : "100%"}}>Update</Button>
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </Col>
    )
}