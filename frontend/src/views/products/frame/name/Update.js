import React, { useState, useEffect } from 'react';
import classnames from "classnames";
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';

import Form from 'react-validation/build/form';
import { toastAction } from '../../../../redux/ToastActions';
import PhoneInput from 'react-phone-input-2';
import AutoComplete from 'react-google-autocomplete';

import { storeTimings } from '../../../../utilities/constants';
import Message from '../../../../utilities/message';
import { splitAtFirstSpace, leadingZeros } from '../../../../utilities/methods';

import MultiSelect from 'react-multiple-select-dropdown-lite';
import SelectSearch ,{ useSelect, fuzzySearch } from 'react-select-search';

import 'react-multiple-select-dropdown-lite/dist/index.css';
import 'react-select-search/style.css'

import '../../products.scss';


export default ({
    history,
    options,
    loading,
    editFrameName,
    detail
}) => {

    const { register, handleSubmit, errors, setError, setValue, control, reset } = useForm();

    const frameCode = new Array(10000).fill('ST');
    let frameCodeOptions = []

    const  shapeOptions  = [
        { label:  'Square', value:  'square'  },
        { label:  'Round', value:  'round'  },
        { label:  'Cateye', value:  'cateye'  },
        { label:  'Aviator', value:  'aviator'  },
    ]



    {frameCode.map((value, key) => {
        let code = leadingZeros(key, 4);
        frameCodeOptions.push( { name:  `${value}${code}`, value:  `${value}${code}`  })
    })}

    useEffect(() => {
        setValue('frame_shape',  detail.frame_shape.join(","));
    }, [setValue, detail] );


    const onSubmit = (data) => {
        const new_data =  {...data, frame_shape: data.frame_shape.split(',') }
        editFrameName(new_data)
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className='summary'>
                <Col sm="12">
                    <Col md="12" sm="12" className="summary-section">
                        <Col md="12" className='summary-section-heading'> PRODUCT DETAILS </Col>
                        <br></br>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="id">
                                        Frame Code
                                    </label>
                                    <Controller
                                        control={control}
                                        name="frame_code"
                                        rules={{ required: true }}
                                        defaultValue={detail && detail.frame_code}
                                        as={
                                            <SelectSearch
                                                options={frameCodeOptions}
                                                search
                                                placeholder="Select Frame Code"
                                                disabled={true}
                                                
                                            />
                                        }
                                    />
                                    <span className="text-danger">{errors.frame_code && Message.validateField(errors.frame_code.type, 'Code', errors.frame_code.types)}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="id">
                                        Frame Name
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.frame_name ? ' danger-border' : '')}
                                            type="text"
                                            name="frame_name"
                                            placeholder="Frame Name"
                                            defaultValue={detail && detail.frame_name}
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.frame_name && Message.validateField(errors.frame_name.type, 'Name')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="id">
                                        Matrerial
                                    </label>
                                    <Controller
                                        control={control}
                                        name="material"
                                        rules={{ required: true }}
                                        defaultValue={detail && detail.material}
                                        as={
                                            <select
                                                className={"form-control" + (errors.material ? ' danger-border' : '')}
                                                id="gender"
                                                onChange={e => { }}
                                            >
                                                <option key="" value={""} > Select Material</option>
                                                <option key="titanium" value={"titanium"} > Titanium </option>
                                                <option key="mixed" value={"mixed"}> Mixed </option>
                                                <option key="metal" value={"metal"} > Metal </option>
                                                <option key="acetate" value={"acetate"} > Acetate </option>
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.material && Message.validateField(errors.material.type, 'Material')}</span>
                                </FormGroup>

                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="frame_price">
                                        Price
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.frame_price ? ' danger-border' : '')}
                                            type="number"
                                            name="frame_price"
                                            defaultValue={detail && detail.frame_price}
                                            placeholder="Price"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.frame_price && Message.validateField(errors.frame_price.type, 'Price')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="frame_shape">
                                        Model Shape
                                    </label>
                                    <Controller
                                        control={control}
                                        name="frame_shape"
                                        rules={{ required: true }}
                                        as={
                                            <MultiSelect
                                            onChange={val => { }}
                                            defaultValue={detail && detail.frame_shape}
                                                name="frame_shape"
                                                options={shapeOptions}
                                                style={{ width: "100%" }}
                                                placeholder="Select Shape"
                                            />
                                        }
                                    />
                                    <span className="text-danger">{errors.frame_shape && Message.validateField(errors.frame_shape.type, 'Shape')}</span>
                                </FormGroup>

                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="gender">
                                        Gender
                                    </label>
                                    <Controller
                                        control={control}
                                        name="gender"
                                        rules={{ required: true }}
                                        defaultValue={detail && detail.gender}
                                        as={
                                            <select
                                                className={"form-control" + (errors.gender ? ' danger-border' : '')}
                                                id="gender"
                                                name="gender"
                                                onChange={e => { }}
                                            >
                                                <option key="" value={""} > Select Gender</option>
                                                <option key="female" value={"female"} > Female </option>
                                                <option key="male" value={"male"}> Male </option>
                                                <option key="unisex" value={"unisex"} > Unisex </option>
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.gender && Message.validateField(errors.gender.type, 'Gender')}</span>
                                </FormGroup>

                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="fit">
                                        Fit
                                    </label>
                                    <Controller
                                        control={control}
                                        name="fit"
                                        rules={{ required: true }}
                                        defaultValue={detail && detail.fit}
                                        as={
                                            <select
                                                className={"form-control" + (errors.fit ? ' danger-border' : '')}
                                                id="fit"
                                                name="fit"
                                                onChange={e => { }}
                                            >
                                                <option key="" value={""} > Select Fit</option>
                                                <option key="narrow" value={"narrow"}>Narrow</option>                                              
                                                <option key="medium" value={"medium"}> Medium </option>
                                                <option key="wide" value={"wide"} > Wide </option>
                                                <option key="wide" value={"extra_wide"} > Extra Wide </option>
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.fit && Message.validateField(errors.fit.type, 'Fit')}</span>
                                </FormGroup>

                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="frame_description">
                                        Description
                                    </label>
                                    <div className="mb-2" >
                                        <textarea
                                            className={"form-control" + (errors.frame_description ? ' danger-border' : '')}
                                            defaultValue={detail && detail.frame_description}
                                            type="text"
                                            name="frame_description"
                                            placeholder="Description"
                                            rows="4"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.frame_description && Message.validateField(errors.frame_description.type, 'Description')}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                                {/* <FormGroup>
                                    <Button type="button" disabled={loading} onClick={() => reset()} color="danger" outline={true} style={{ width: "100%" }}>Cancel</Button>
                                </FormGroup> */}
                            </Col>
                            <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                                <FormGroup>
                                    <Button type="submit" disabled={loading} color="primary" style={{ width: "100%" }}>Upload</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </Form>
    )
}