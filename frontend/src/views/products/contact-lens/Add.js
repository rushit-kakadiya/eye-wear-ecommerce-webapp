import React from 'react';
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Message from '../../../utilities/message';
import '../products.scss';

export default ({ loading, handleAddContactLens }) => {
  const { register, handleSubmit, errors, control, reset } = useForm();
  // Contact-Lens Brands
  const brands = [
    { label: 'Eyewears Contact Lens', value: 'Eyewear Contact Lens' },
    { label: 'Air Optix Aqua', value: 'Air Optix Aqua' },
    { label: 'Freshlook Colorblends', value: 'Freshlook Colorblends' },
    { label: 'Dailies AquaComfort Plus', value: 'Dailies AquaComfort Plus' },
  ];

  return (
    <Form onSubmit={handleSubmit(handleAddContactLens)}>
      <Row className='summary'>
        <Col sm="12">
          <Col md="12" sm="12" className="summary-section">
            <Col md="12" className='summary-section-heading'> PRODUCT DETAILS </Col>
            <br></br>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="sku_code">
                    Contact-Lens SKU *
                  </label>
                  <div className="mb-2" >
                    <input
                      className={"form-control" + (errors.sku_code ? ' danger-border' : '')}
                      type="text"
                      name="sku_code"
                      placeholder="Contact-Lens SKU"
                      ref={register({
                        required: true
                      })}
                    />
                  </div>
                  <span className="text-danger">{errors.sku_code && Message.validateField(errors.sku_code.type, 'Contact-Lens SKU')}</span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="brand">
                    Brand *
                  </label>
                  <Controller
                    control={control}
                    name="brand"
                    rules={{ required: true }}
                    as={
                      <select
                        className={"form-control" + (errors.brand ? ' danger-border' : '')}
                        id="brand"
                        onChange={e => { }}
                      >
                        <option key="" value={""} > Select brand</option>
                        {brands.map(row => <option key={row.value} value={row.value} > {row.label} </option>)}
                      </select>
                    }
                  />
                  <span className="text-danger">{errors.brand && Message.validateField(errors.brand.type, 'Brand')}</span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="name">
                    Contact-Lens Name *
                  </label>
                  <div className="mb-2" >
                    <input
                      className={"form-control" + (errors.name ? ' danger-border' : '')}
                      type="text"
                      name="name"
                      placeholder="Contact-Lens Name"
                      ref={register({
                        required: true
                      })}
                    />
                  </div>
                  <span className="text-danger">{errors.name && Message.validateField(errors.name.type, 'Contact-Lens Name')}</span>
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
                  <label className="control-label" htmlFor="description">
                    Description
                  </label>
                  <div className="mb-2" >
                    <textarea
                      className={"form-control" + (errors.description ? ' danger-border' : '')}
                      type="text"
                      name="description"
                      placeholder="Description"
                      rows="4"
                      ref={register({
                        required: false
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
                  <Button type="submit" disabled={loading} color="primary" style={{ width: "100%" }}>Add New Contact-Lens</Button>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </Form>
  )
}
