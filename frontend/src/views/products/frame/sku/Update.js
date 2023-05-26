import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Dropzone from 'react-dropzone'


import Form from 'react-validation/build/form';

import { toastAction } from '../../../../redux/ToastActions';
import Message from '../../../../utilities/message';

import 'react-multiple-select-dropdown-lite/dist/index.css';
import 'react-select-search/style.css'
import '../../products.scss';

export default ({
    history,
    loading,
    editFrameSku,
    detail
}) => {

    const { register, handleSubmit, errors, setError, setValue, control, reset, getValues } = useForm({
        defaultValues : {
            frame_code : detail.frame_code,
            retail_price : detail.retail_price,
            variant_code : detail.variant_code,
            size_code : detail.size_code,
            is_sunwear : detail.is_sunwear,
            show_on_app : detail.show_on_app
        }
    })



    const onSubmit = (data) => {
        editFrameSku(data, (message, error) => {
            if (error) {
                // let messageData = splitAtFirstSpace(message.en);
                // setError(messageData[0], { type: 'server', message: messageData[1] });
                toastAction(false, error);
            } else {
                toastAction(true, "Frame Sku updated successfully.");
                // history.push(`/frame-sku/${detail.sku}`);
            }
        })
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='summary'>
                <Col md="12" sm="12">
                    <Col md="12" sm="12" className="summary-section">
                        <Col md="12" className='summary-section-heading'> PRODUCT DETAIL </Col>
                        <br></br>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <label className="control-label" htmlFor="frame_code">
                                        Frame Name
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.retail_price ? ' danger-border' : '')}
                                            type="text"
                                            name="frame_code"
                                            id="frame_code"
                                            placeholder="Frame"
                                            disabled={true}
                                            ref={register({ required: true })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.frame_code && Message.validateField(errors.frame_code.type, 'Frame Code')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label className="control-label" htmlFor="retail_price">
                                        Retail Price
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.retail_price ? ' danger-border' : '')}
                                            type="text"
                                            name="retail_price"
                                            id="retail_price"
                                            placeholder="Retail Price"
                                            defaultValue={detail && detail.retail_price}
                                            disabled={true}
                                            ref={register({ required: true })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.retail_price && Message.validateField(errors.retail_price.type, 'Retail Price')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label className="control-label" htmlFor="variant_code">
                                        Color
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.retail_price ? ' danger-border' : '')}
                                            type="text"
                                            name="variant_code"
                                            id="variant_code"
                                            placeholder="Color"
                                            disabled={true}
                                            ref={register({ required: true })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.variant_code && Message.validateField(errors.variant_code.type, 'Color')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label className="control-label" htmlFor="size_code">
                                        Size
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.retail_price ? ' danger-border' : '')}
                                            type="text"
                                            name="size_code"
                                            id="size_code"
                                            placeholder="Size"
                                            disabled={true}
                                            ref={register({ required: true })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.variant_code && Message.validateField(errors.variant_code.type, 'Size Code')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <input
                                        type="checkbox"
                                        name="is_sunwear"
                                        id="is_sunwear"
                                        ref={register({})}
                                    /> <label htmlFor="is_sunwear">Is Sunwear</label>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <input
                                        type="checkbox"
                                        name="show_on_app"
                                        id="show_on_app"
                                        ref={register({})}
                                    /> <label htmlFor="show_on_app">Show on App</label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
            <Row>
                <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                    <FormGroup>
                        <Button type="button" disabled={loading} onClick={() => reset()} color="danger" outline={true} style={{ width: "100%" }}>Cancel</Button>
                    </FormGroup>
                </Col>
                <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                    <FormGroup>
                        <Button type="submit" disabled={loading} color="primary" style={{ width: "100%" }}>Update</Button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}