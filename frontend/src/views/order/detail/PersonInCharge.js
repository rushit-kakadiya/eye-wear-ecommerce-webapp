import React from 'react';
import { Row, Form, FormGroup } from "reactstrap";

export default ({detail}) => {
    return(
        <Row style={{border:'1px solid #ccc'}} className="p-2 mt-3">
            <Form>
                <FormGroup><h5>Person In Charge: </h5></FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Input By: </strong>
                    </label>
                    <div className="mb-2">
                    {detail['created_by_staff'] || '------'}
                    </div>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Optician: </strong>
                    </label>
                    <div className="mb-2">
                       {detail['optician'] || '------'}
                    </div>
                </FormGroup>
            </Form>
        </Row>
    )
}
