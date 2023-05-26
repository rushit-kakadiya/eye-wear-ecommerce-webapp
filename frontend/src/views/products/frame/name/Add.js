import React, { useState, useEffect } from 'react';
import classnames from "classnames";
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import Form from 'react-validation/build/form';
import { toastAction } from '../../../../redux/ToastActions';
import PhoneInput from 'react-phone-input-2';
import AutoComplete from 'react-google-autocomplete';

import { storeTimings } from '../../../../utilities/constants';
import Message from '../../../../utilities/message';
import { splitAtFirstSpace, leadingZeros } from '../../../../utilities/methods';

import MultiSelect from 'react-multiple-select-dropdown-lite';
import SelectSearch, { useSelect, fuzzySearch } from 'react-select-search';

import 'react-multiple-select-dropdown-lite/dist/index.css';
import 'react-select-search/style.css'

import '../../products.scss';


export default ({
    history,
    options,
    loading,
    addFrameName
}) => {

    const { register, handleSubmit, errors, setError, setValue, getValues,  control, reset } = useForm();

    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
      } = useFieldArray({
        control,
        name: "fit"
      });

    const defaultValues = {
        frame_code: "",
        material: "",
        gender: "",
        fit: ""
    };

    const frameCode = new Array(10000).fill('ST');
    let frameCodeOptions = []

    const shapeOptions = [
        { label: 'Square', value: 'square' },
        { label: 'Round', value: 'round' },
        { label: 'Cateye', value: 'cateye' },
        { label: 'Aviator', value: 'aviator' },
    ]

    const [sizeOptionss, setSizeOptionss] = useState([
        { key: 'SZ01', value: 'Narrow', status: true },
        { key: 'SZ02', value: 'Medium', status: true },
        { key: 'SZ03', value: 'Wide', status: true },
        { key: 'SZ04', value: 'Extra Wide', status: true }
    ])

    const controlFit = (e,i) => {


        // let value = e.target.value;
        // let index = sizeOptionss.findIndex(x => x.key == value);

        // for (let i = 0; i < selects.length; i++) {
        //     if (index !== -1 && value != '' ) {
        //         console.log(sizeOptionss[index].status, sizeOptionss[index].value );
        //         if(sizeOptionss[index].status == false){
        //             alert('duplicate exists ' + value); 
        //             setValue(`size[${i}]`, '');
        //         }else{
        //             sizeOptionss[index].status = false;
        //             setSizeOptionss(sizeOptionss)
        //         }
        //     }
        //}

        let selects = document.getElementsByClassName('size');
        let values = []
        for (let i = 0; i < selects.length; i++) {
            let select = selects[i];
            console.log(select);
            if (values.indexOf(select.value) > -1 && select.value != '' ) {
                alert('duplicate exists ' + select.value); 
                setValue(`fit[${i}]size_code`, '');
            }else{
                values.push(select.value);
            }
        }
    }





    {
        frameCode.map((value, key) => {
            let code = leadingZeros(key, 4);
            frameCodeOptions.push({ name: `${value}${code}`, value: `${value}${code}` })
        })
    }



    const onSubmit = (data) => {
        const new_data = { ...data, frame_shape: data.frame_shape.split(',') }


        console.log(new_data);
        

        addFrameName(new_data, (message, error) => {
            if (error) {
                let messageData = splitAtFirstSpace(message.en);
                setError(messageData[0], { type: 'server', message: messageData[1] });
            } else {
                toastAction(true, "Frame Name added successfully.");
                // history.push(`/frame-name/${message.id}`);
            }
        })
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
                                        as={
                                            <SelectSearch
                                                options={frameCodeOptions}
                                                search
                                                placeholder="Select Frame Code"
                                                onChange={(e) => {return e.target.value}}
                                                filterOptions={(options) => {
                                                    const filter = fuzzySearch(options);
                                                    return (q) => filter(q).slice(100, 125);
                                                }}

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
                            {/* <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="fit">
                                        Fit
                                    </label>
                                    <Controller
                                        control={control}
                                        name="fit"
                                        rules={{ required: true }}
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
                                                <option key="extra_wide" value={"extra_wide"} > Extra Wide </option>
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.fit && Message.validateField(errors.fit.type, 'Fit')}</span>
                                </FormGroup>

                            </Col> */}
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="frame_description">
                                        Description
                                    </label>
                                    <div className="mb-2" >
                                        <textarea
                                            className={"form-control" + (errors.frame_description ? ' danger-border' : '')}
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
                        <Col md="12" className='summary-section-heading'> PRODUCT SIZING </Col>
                        <br></br>
                        <Row>
                            {fields.map((item, i) => {

                                return (
                                    <Col key={item.id} md={12}>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <label className="control-label" htmlFor="size_code">
                                                        Frame Size *
                                                    </label>
                                                    <select
                                                        name={`fit[${i}]size_code`}
                                                        className={"form-control size" + (errors.fit?.[i]?.size_code ? ' danger-border' : '')}
                                                        ref={register({
                                                            required: true
                                                        })}
                                                        onChange={(e) =>{return controlFit(e,i)}}
                                                    >
                                                        <option key="" value={""} > Select Fit</option>
                                                        {sizeOptionss.map((item) => {
                                                            return (<option key={item.key} value={item.key}>{item.value}</option>)
                                                        })}
                                                    </select>
                                                    <span className="text-danger">{errors.fit?.[i]?.size_code && Message.validateField(errors.fit?.[i]?.size_code?.type, 'Frame Size')}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <label className="control-label" htmlFor="description">
                                                    Remove
                                                </label>
                                                <FormGroup>
                                                    <Button type="button" onClick={() => remove(i)} color="danger" outline={true} style={{ width: "100%" }}>Remove</Button>
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <label className="control-label" htmlFor="lense_width">
                                                        Width
                                                    </label>
                                                    <div className="mb-2" >
                                                        <input
                                                            className={"form-control" + (errors.fit?.[i]?.lense_width ? ' danger-border' : '')}
                                                            type="number"
                                                            name={`fit[${i}]lense_width`}
                                                            placeholder="Width"
                                                            defaultValue={0}
                                                            ref={register({
                                                                required: true
                                                            })}
                                                        />
                                                    </div>
                                                    <span className="text-danger">{errors.fit?.[i]?.lense_width && Message.validateField(errors.fit?.[i]?.lense_width?.type, 'Lense Width')}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <label className="control-label" htmlFor="bridge">
                                                        Bridge
                                                    </label>
                                                    <div className="mb-2" >
                                                        <input
                                                            className={"form-control" + (errors.fit?.[i]?.bridge ? ' danger-border' : '')}
                                                            type="number"
                                                            name={`fit[${i}]bridge`}
                                                            placeholder="Bridge"
                                                            defaultValue={0}
                                                            ref={register({
                                                                required: true
                                                            })}
                                                        />
                                                    </div>
                                                    <span className="text-danger">{errors.fit?.[i]?.bridge && Message.validateField(errors.fit?.[i]?.bridge?.type, 'Bridge')}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <label className="control-label" htmlFor="temple_length">
                                                        Temple Length
                                                </label>
                                                    <div className="mb-2" >
                                                        <input
                                                            className={"form-control" + ( errors.fit?.[i]?.temple_length ? ' danger-border' : '')}
                                                            type="number"
                                                            name={`fit[${i}]temple_length`}
                                                            placeholder="Temple Length"
                                                            defaultValue={0}
                                                            ref={register({
                                                                required: true
                                                            })}
                                                        />
                                                    </div>
                                                    <span className="text-danger">{errors.fit?.[i]?.temple_length && Message.validateField(errors.fit?.[i]?.temple_length?.type, 'Temple Length')}</span>
                                                </FormGroup>
                                            </Col>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <label className="control-label" htmlFor="front_width">
                                                        Frame Width
                                                    </label>
                                                    <div className="mb-2" >
                                                        <input
                                                            className={"form-control" + (errors.fit?.[i]?.front_width ? ' danger-border' : '')}
                                                            type="number"
                                                            name={`fit[${i}]front_width`}
                                                            placeholder="Frame Width"
                                                            defaultValue={0}
                                                            ref={register({
                                                                required: true
                                                            })}
                                                        />
                                                    </div>
                                                    <span className="text-danger">{errors.fit?.[i]?.front_width && Message.validateField(errors.fit?.[i]?.front_width?.type, 'Frame Width')}</span>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                )
                            })
                            }
                            {fields.length < 4 &&
                                (<Col md={12} className={"text-center"}>
                                    <FormGroup>
                                        <Button type="button" disabled={loading} onClick={() => append()} color="primary" outline={true} style={{ width: "100%" }}>Add Size</Button>
                                    </FormGroup>
                                </Col>)
                            }
                            <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                                <FormGroup>
                                    <Button type="button" disabled={loading} onClick={() => reset(defaultValues)} color="danger" outline={true} style={{ width: "100%" }}>Cancel</Button>
                                </FormGroup>
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