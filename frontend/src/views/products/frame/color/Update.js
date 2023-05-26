import React, { useState, useEffect } from 'react';
import classnames from "classnames";
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';

import Form from 'react-validation/build/form';

import { toastAction } from '../../../../redux/ToastActions';
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
    editFrameColor,
    detail
}) => {

    const { register, handleSubmit, errors, setError, setValue, control, reset } = useForm()

    var colorCode = new Array(1000).fill('VR');
    let colorCodeOptions = []
    {colorCode.map((value, key) => {
        let code = leadingZeros(key, 3);
        colorCodeOptions.push( { name:  `${value}${code}`, value:  `${value}${code}`  })
    })}

    useEffect(() => {
        setValue('variant_color_group',  detail.variant_color_group.join(","));
    }, [setValue, detail] );
    

    const  groupOptions  = [
        { value:  'clear', label:  'Clear'  },
        { value:  'two_tone', label:  'Two Tone'  },
        { value:  'grey', label:  'Grey'  },
        { value:  'black', label:  'Black'  },
        { value:  'gold', label:  'Gold'  },
        { value:  'silver', label:  'Silver'  },
        { value:  'tortoise', label:  'Tortoise'  }
    ]


    const onSubmit = (data) => {
        const new_data =  {...data, variant_color_group: data.variant_color_group.split(',') }
        editFrameColor(new_data)
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
                                    <label className="control-label" htmlFor="id">
                                        Color Code
                                    </label>
                                    <Controller
                                        control={control}
                                        name="variant_code"
                                        rules={{ required: true }}
                                        defaultValue={detail && detail.variant_code}
                                        as={
                                            <SelectSearch
                                                options={colorCodeOptions}
                                                search
                                                placeholder="Select Color Code"
                                                disabled={true}
                                            />
                                        }
                                    />
                                    <span className="text-danger">{errors.variant_code && Message.validateField(errors.variant_code.type, 'Code', errors.variant_code.types)}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label className="control-label" htmlFor="variant_name">
                                        Color Name
                                    </label>
                                    <Controller
                                        control={control}
                                        name="variant_name"
                                        rules={{ required: true }}
                                        as={
                                            <input
                                                className={"form-control" + (errors.variant_name ? ' danger-border' : '')}
                                                defaultValue={detail && detail.variant_name}
                                                type="text"
                                                name="variant_name"
                                                placeholder="Color Group"
                                                ref={register({  required: true  })}
                                            />
                                        }
                                    />
                                    <span className="text-danger">{errors.variant_name && Message.validateField(errors.variant_name.type, 'Name')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <label className="control-label" htmlFor="variant_color_group">
                                        Color Group
                                    </label>
                                    <Controller
                                        control={control}
                                        name="variant_color_group"
                                        rules={{ required: true }}
                                        as={
                                            <MultiSelect
                                                onChange={val => { }}
                                                options={groupOptions}
                                                style={{ width: "100%" }}
                                                placeholder="Select Color Group"
                                                defaultValue={detail && detail.variant_color_group}
                                            />
                                        }
                                    />
                                    <span className="text-danger">{errors.variant_color_group && Message.validateField(errors.variant_color_group.type, 'Color Group')}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
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
        </Form>
    )
}