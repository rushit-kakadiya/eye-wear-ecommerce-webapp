import React from 'react';
import { Row, Form, FormGroup, NavLink } from "reactstrap";

export default ({detail, history, user_id=''}) => {
    const dob = detail.dob && detail.dob ? new Date(detail.dob).toDateString().split(" ") : null;
    return(
        <Row style={{border:'1px solid #ccc'}} className="p-2">
            <Form>
                <FormGroup><h5>Customer Detail: </h5></FormGroup>
                    <FormGroup>
                    <i className="mr-2 mdi mdi-account-circle"></i> 
                    <NavLink href="#" className="p-0" active onClick={() => history.push(`/customer/detail/${user_id || detail.id}`)} style={{display:'contents'}}>
                        {detail.name}
                    </NavLink>
                    </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Email: </strong>
                    </label>
                    <div className="mb-2">
                        {detail.email}
                    </div>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Phone: </strong>
                    </label>
                    <div className="mb-2">
                    0{detail.mobile} <i className="fab fa-whatsapp text-success ml-2" ></i>
                    </div>
                </FormGroup>
                {/* <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Address: </strong>
                    </label>
                    <div className="mb-2">
                        ---
                    </div>
                </FormGroup> */}
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Birth Date: </strong>
                    </label>
                    <div className="mb-2">
                    { dob ? `${dob[1]} ${dob[2]} ${dob[3]}` : '---'}
                    </div>
                </FormGroup>
                <FormGroup>
                    <label className="control-label" htmlFor="email">
                        <strong>Gender: </strong>
                    </label>
                    <div className="mb-2">
                    {detail.gender === 1 ? 'Male' : 'Female'}
                    </div>
                </FormGroup>
            </Form>
        </Row>
    )
}
