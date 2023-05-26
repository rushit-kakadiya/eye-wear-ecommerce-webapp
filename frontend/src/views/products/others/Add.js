import React from 'react';
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Message from '../../../utilities/message';
import '../products.scss';

export default ({ loading, handleAddOthers }) => {
    const { register, handleSubmit, errors, control, reset } = useForm();
    // Lens Brands
   
    return (
        <Form onSubmit={handleSubmit(handleAddOthers)}>
            <Row className='summary'>
                <Col sm="12">
                    <Col md="12" sm="12" className="summary-section">
                        <Col md="12" className='summary-section-heading'> PRODUCT DETAILS </Col>
                        <br></br>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="sku">
                                        SKU *
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.sku ? ' danger-border' : '')}
                                            type="text"
                                            name="sku"
                                            placeholder="SKU"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.sku && Message.validateField(errors.sku.type, 'SKU')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="name">
                                        Name *
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.name ? ' danger-border' : '')}
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
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="price">
                                        Price *
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.amount ? ' danger-border' : '')}
                                            type="number"
                                            name="price"
                                            placeholder="Price"
                                            step="0.01"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.price && Message.validateField(errors.price.type, 'Price')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="description">
                                        Description *
                                    </label>
                                    <div className="mb-2" >
                                        <textarea
                                            className={"form-control" + (errors.description ? ' danger-border' : '')}
                                            name="description"
                                            placeholder="Decription"
                                            step="0.01"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.description && Message.validateField(errors.description.type, 'Description')}</span>
                                </FormGroup>
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
                                    <Button type="submit" disabled={loading} color="primary" style={{ width: "100%" }}>Add New Lens</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </Form>
    )
}