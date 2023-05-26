import React, { useState, useEffect } from 'react';
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Dropzone from 'react-dropzone'


import Form from 'react-validation/build/form';

import { toastAction } from '../../../../redux/ToastActions';
import Message from '../../../../utilities/message';
import { splitAtFirstSpace, leadingZeros } from '../../../../utilities/methods';


import SelectSearch, { useSelect, fuzzySearch } from 'react-select-search';

import 'react-multiple-select-dropdown-lite/dist/index.css';
import 'react-select-search/style.css'
import '../../products.scss';

export default ({
    history,
    options,
    loading,
    addFrameSku,
    frameSizeAvialability,
    frameName,
    frameVariants,
    frameSizes
}) => {

    const { register, handleSubmit, errors, setError, setValue, control, reset, getValues } = useForm()


    const [isSunwear, setIsSunwear] = useState(false);
    const [framePrice, setFramePrice] = useState("");


    let frameCodeOptions = []
    let variantsCodeOptions = []

    {
        frameName && frameName.list && frameName.list.map((value, key) => {
            frameCodeOptions.push({ name: value.frame_code, value: value.frame_code, price: value.frame_price })
        })
    }

    {
        frameVariants && frameVariants.list && frameVariants.list.map((value, key) => {
            variantsCodeOptions.push({ name: value.variant_code, value: value.variant_code })
        })
    }

    const findFramePrice = (e) => {
        setFramePrice(e[1].price)
        let variant_code = getValues('variant_code')
        if (variant_code != undefined) {
            frameSizeAvialability({ frame_code: e[1].value, variant_code })
        }
        return e[0];
    }

    const findFrameSizes = (e) => {
        let frame_code = getValues('frame_code')
        if (frame_code != undefined) {
            frameSizeAvialability({ frame_code, variant_code: e[1].value })
        }
        return e[0];
    }

    const onSubmit = (data) => {
        addFrameSku(data, (message, error) => {
            if (error) {
                // let messageData = splitAtFirstSpace(message.en);
                // setError(messageData[0], { type: 'server', message: messageData[1] });
                toastAction(false, error);
            } else {
                toastAction(true, "Frame Sku added successfully.");
                history.push(`/products-list`);
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
                                    <Controller
                                        control={control}
                                        name="frame_code"
                                        id="frame_code"
                                        rules={{ required: true }}
                                        onChange={(e) => findFramePrice(e)}
                                        as={
                                            <SelectSearch
                                                options={frameCodeOptions}
                                                search
                                                placeholder="Select Color Code"
                                                filterOptions={fuzzySearch}
                                            />
                                        }
                                    />
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
                                            defaultValue={framePrice}
                                            ref={register({ required: true })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.retail_price && Message.validateField(errors.retail_price.type, 'Retail Price')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <label className="control-label" htmlFor="variant_code">
                                        Color
                                    </label>
                                    <Controller
                                        control={control}
                                        name="variant_code"
                                        rules={{ required: true }}
                                        onChange={(e) => findFrameSizes(e)}
                                        as={
                                            <SelectSearch
                                                options={variantsCodeOptions}
                                                search
                                                placeholder="Select Color Code"
                                                filterOptions={fuzzySearch}
                                            />
                                        }
                                    />
                                    <span className="text-danger">{errors.variant_code && Message.validateField(errors.variant_code.type, 'Variant Code')}</span>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                {!loading ?
                                    <FormGroup>
                                        <label className="control-label" htmlFor="variant_color_group">
                                            Size
                                        </label>
                                        {frameSizes.length > 0 ? frameSizes.map((item) => {
                                            return (
                                                <div key={item.size_code} className="mb-2" >
                                                    <input
                                                        type="checkbox"
                                                        id={item.size_code}
                                                        value={item.size_code}
                                                        name="size"
                                                        ref={register({required :true})}
                                                    /> <label htmlFor={item.size_code}>{item.size_code}</label>
                                                </div>
                                            )
                                        }): <div className="mb-2 mt-2">No more size avialable to create</div> }
                                        <span className="text-danger">{errors.size && Message.validateField(errors.size.type, 'Color Group')}</span>
                                    </FormGroup> : <span>Loading.....</span>
                                }
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <input
                                        type="checkbox"
                                        name="is_sunwear"
                                        id="is_sunwear"
                                        onChange={() => { return setIsSunwear(!isSunwear) }}
                                        ref={register({})}
                                    /> <label htmlFor="is_sunwear">Is Sunwear</label>
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
                        <Button type="submit" disabled={loading || frameSizes.length === 0} color="primary" style={{ width: "100%" }}>Upload</Button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}