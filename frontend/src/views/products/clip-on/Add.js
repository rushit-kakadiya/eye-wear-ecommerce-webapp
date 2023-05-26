import React, {useState} from 'react';
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-validation/build/form';
import SelectSearch from 'react-select-search';
import 'react-multiple-select-dropdown-lite/dist/index.css';
import 'react-select-search/style.css'
import Message from '../../../utilities/message';
import env from '../../../environment';
import '../products.scss';

export default ({ loading, handleAddClipOn, frames }) => {
    const { register, handleSubmit, errors, control, reset } = useForm();
    const [search, setSearch] =  useState(null);
    // Clip-on sizes
    const  sizes  = [
        { label:  'Medium', value:  'Medium'  },
        { label:  'Wide', value:  'Wide'  }
    ];

    // Clip-on colors
    const  colors  = [
        { label:  'Grey', value:  'Grey'  },
        { label:  'Brown', value:  'Brown'  }
    ];

    //Reset Form values
    const resetForm = () => {
        reset();
        setSearch('');
    }

    const searchFrames = (query) => {
        return new Promise((resolve, reject) => {
            if(query){
                fetch(`${env.apiUrl}/admin/search?text=${query}`)
                .then(response => response.json())
                .then(({ data }) => {
                    resolve(data.product ? data.product.data.map(({ frame_name, sku_code, variant_name }) => ({ value: sku_code, name: `${frame_name} ${variant_name}(${sku_code})`})) : [])
                })
                .catch(reject);
            } else{
                resolve([])
            }
        });
    }

    return (
        <Form onSubmit={handleSubmit(handleAddClipOn)}>
            <Row className='summary'>
                <Col sm="12">
                    <Col md="12" sm="12" className="summary-section">
                        <Col md="12" className='summary-section-heading'> PRODUCT DETAILS </Col>
                        <br></br>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="sku_code">
                                        Clip-On SKU *
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.sku_code ? ' danger-border' : '')}
                                            type="text"
                                            name="sku_code"
                                            placeholder="Clip-On SKU"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.sku_code && Message.validateField(errors.sku_code.type, 'Lens SKU')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="retail_price">
                                        Price *
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.retail_price ? ' danger-border' : '')}
                                            type="number"
                                            name="retail_price"
                                            placeholder="Price"
                                            step="0.01"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.retail_price && Message.validateField(errors.retail_price.type, 'Price')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="name">
                                        Clip-On Name *
                                    </label>
                                    <div className="mb-2" >
                                        <input
                                            className={"form-control" + (errors.name ? ' danger-border' : '')}
                                            type="text"
                                            name="name"
                                            placeholder="Clip-On Name"
                                            ref={register({
                                                required: true
                                            })}
                                        />
                                    </div>
                                    <span className="text-danger">{errors.name && Message.validateField(errors.name.type, 'Lens Name')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="frame_sku">
                                        Clip-On Frame
                                    </label>
                                    {!search ?
                                        <Controller
                                        control={control}
                                        name="frame_sku"
                                        rules={{ required: false }}
                                        onChange={(value) => setSearch(value[0])}
                                        defaultValue={search}
                                        as={
                                            <SelectSearch
                                                options={frames.list.map(({ frame_name, sku_code, variant_name }) => ({ value: sku_code, name: `${frame_name} ${variant_name}(${sku_code})`}))}
                                                autoFocus={search !== null}
                                                getOptions={(query) => searchFrames(query)}
                                                search
                                                name="frame_sku" placeholder="Search your frames"
                                            />
                                        }
                                        />
                                    :
                                    <input
                                        className={"form-control" + (errors.frame_sku ? ' danger-border' : '')}
                                        type="text"
                                        name="frame_sku"
                                        placeholder="Search your frames"
                                        onChange={(e) => setSearch(e.target.value)}
                                        ref={register({
                                            required: false
                                        })}
                                        defaultValue={search}
                                    />
                                    }
                                    
                                    <span className="text-danger">{errors.frame_sku && Message.validateField(errors.frame_sku.type, 'Clip-On Frame')}</span>
                                </FormGroup>

                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="color">
                                        Clip-On Color *
                                    </label>
                                    <Controller
                                        control={control}
                                        name="color"
                                        rules={{ required: true }}
                                        as={
                                            <select
                                                className={"form-control" + (errors.color ? ' danger-border' : '')}
                                                id="color"
                                                onChange={e => { }}
                                            >
                                                <option key="" value={""} > Select Color</option>
                                                {colors.map(row => <option key={row.value} value={row.value} > {row.label} </option>)}
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.color && Message.validateField(errors.color.type, 'Clip-On Color')}</span>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <label className="control-label" htmlFor="size">
                                        Clip-On Size *
                                    </label>
                                    <Controller
                                        control={control}
                                        name="size"
                                        rules={{ required: true }}
                                        as={
                                            <select
                                                className={"form-control" + (errors.size ? ' danger-border' : '')}
                                                id="size"
                                                onChange={e => { }}
                                            >
                                                <option key="" value={""} > Select Size</option>
                                                {sizes.map(row => <option key={row.value} value={row.value} > {row.label} </option>)}
                                            </select>
                                        }
                                    />
                                    <span className="text-danger">{errors.size && Message.validateField(errors.size.type, 'Clip-On Size')}</span>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                                <FormGroup>
                                    <Button type="button" disabled={loading} onClick={() => resetForm()} color="danger" outline={true} style={{ width: "100%" }}>Cancel</Button>
                                </FormGroup>
                            </Col>
                            <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                                <FormGroup>
                                    <Button type="submit" disabled={loading} color="primary" style={{ width: "100%" }}>Add Clip-On</Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </Form>
    )
}