import React from 'react';
import { Row, Form, FormGroup } from "reactstrap";
import {getDateFormat, titleCase} from '../../utilities/methods';

export default ({detail, userData}) => {
    return(
        <Row style={{border:'1px solid #ccc'}} className="p-2 mt-3">
            <Form>
                <FormGroup><h5>Booking Detail: </h5></FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Created Date: </strong>
                    </label>
                    <div className="mb-2">
                    {getDateFormat(detail['created_at'],false, true, userData.time_zone)}
                    </div>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Booking Channel: </strong>
                    </label>
                    <div className="mb-2">
                       {titleCase(detail['sales_channel'] || '') || '------'}
                    </div>
                </FormGroup>
            </Form>
        </Row>
    )
}
