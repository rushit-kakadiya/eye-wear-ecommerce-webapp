import React, { useEffect } from 'react';
import { Row, Col, FormGroup, Button } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Form from 'react-validation/build/form';
import Message from '../../../utilities/message';
import { titleCase } from '../../../utilities/methods';
import '../products.scss';

export default ({ products, handleEditLens, history }) => {
  const { is_loading, product_detail } = products;

  const { register, handleSubmit, errors, control, reset, setValue } = useForm({
    defaultValues: {
      sku_code: product_detail.sku,
      name: product_detail.name,
      brand: product_detail.brand,
      retail_price: product_detail.price,
      lense_type_name: product_detail.lense_type_name,
      prescription_name: product_detail.prescription_name,
      filter_type_name: product_detail.filter_type_name,
      index_value: product_detail.index_value,
      category_name: product_detail.category_name
    }
  });
  // Lens Brands
  const brands = [
    { label: 'Leinz', value: 'Leinz' },
    { label: 'Nikkei', value: 'Nikkei' },
    { label: 'Essilor', value: 'Essilor' },
    { label: 'Zeiss', value: 'Zeiss' },
    { label: 'EYEWEAR', value: 'EyeweaEyewear
  ];

  // Lens types
  const lensTypes = [
    { label: 'Classic', value: 'Classic' },
    { label: 'Blue Light', value: 'Blue Light' },
    { label: 'High Index 1.67', value: 'High Index 1.67' },
    { label: 'High Index 1.74', value: 'High Index 1.74' },
    { label: 'Mirror', value: 'Mirror' },
  ];

  // Lens Filter
  const filters = [
    { label: 'Transition', value: 'Transition' },
    { label: 'Blue Light', value: 'Blue Light' },
    { label: 'Tinted', value: 'Tinted' },
    { label: 'Polarized', value: 'Polarized' }
  ];

  // Prescriptions types
  const prescriptionsTypes = [
    { label: 'Single Vision', value: 'Single Vision' },
    { label: 'Bifocal', value: 'Bifocal' },
    { label: 'Progressive', value: 'Progressive' }
  ];


  return (
    <Form onSubmit={handleSubmit(handleEditLens)}>
      <Row className='summary'>
        <Col sm="12">
          <Col md="12" sm="12" className="summary-section">
            <Col md="12" className='summary-section-heading'> PRODUCT DETAILS </Col>
            <br></br>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="sku_code">
                    Lens SKU *
                  </label>
                  <div className="mb-2" >
                    <input
                      className={"form-control" + (errors.sku_code ? ' danger-border' : '')}
                      type="text"
                      name="sku_code"
                      placeholder="Lens SKU"
                      ref={register({
                        required: true
                      })}
                      disabled={true}
                    />
                  </div>
                  <span className="text-danger">{errors.sku_code && Message.validateField(errors.sku_code.type, 'Lens SKU')}</span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="name">
                    Lens Name *
                  </label>
                  <div className="mb-2" >
                    <input
                      className={"form-control" + (errors.name ? ' danger-border' : '')}
                      type="text"
                      name="name"
                      placeholder="Lens Name"
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
                  <label className="control-label" htmlFor="lense_type_name">
                    Lense Type Name *
                  </label>
                  <Controller
                    control={control}
                    name="lense_type_name"
                    rules={{ required: true }}
                    as={
                      <select
                        className={"form-control" + (errors.lense_type_name ? ' danger-border' : '')}
                        id="lense_type_name"
                        onChange={e => { }}
                      >
                        <option key="" value={""} > Select Lense Type Name</option>
                        {lensTypes.map(row => <option key={row.value} value={row.value} > {row.label}</option>)}
                      </select>
                    }
                  />
                  <span className="text-danger">{errors.lense_type_name && Message.validateField(errors.lense_type_name.type, 'Lense Type Name')}</span>
                </FormGroup>

              </Col>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="prescription_name">
                    Prescription Name *
                  </label>
                  <Controller
                    control={control}
                    name="prescription_name"
                    rules={{ required: true }}
                    as={
                      <select
                        className={"form-control" + (errors.prescription_name ? ' danger-border' : '')}
                        id="prescription_name"
                        onChange={e => { }}
                      >
                        <option key="" value={""} > Select Prescription Name</option>
                        {prescriptionsTypes.map(row => <option key={row.value} value={row.value} > {row.label} </option>)}
                      </select>
                    }
                  />
                  <span className="text-danger">{errors.prescription_name && Message.validateField(errors.prescription_name.type, 'Prescription Name')}</span>
                </FormGroup>

              </Col>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="filter_type_name">
                    Filter Name
                  </label>
                  <Controller
                    control={control}
                    name="filter_type_name"
                    rules={{ required: false }}
                    as={
                      <select
                        className={"form-control" + (errors.filter_type_name ? ' danger-border' : '')}
                        id="filter_type_name"
                        onChange={e => { }}
                      >
                        <option key="" value={""} > Select filter Name</option>
                        {filters.map(row => <option key={row.value} value={row.value} > {row.label} </option>)}
                      </select>
                    }
                  />
                  <span className="text-danger">{errors.filter_type_name && Message.validateField(errors.filter_type_name.type, 'Filter Name')}</span>
                </FormGroup>

              </Col>

              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="index_value">
                    Index Value *
                  </label>
                  <div className="mb-2" >
                    <input
                      className={"form-control" + (errors.index_value ? ' danger-border' : '')}
                      type="number"
                      name="index_value"
                      step="0.01"
                      placeholder="Index Value"
                      ref={register({
                        required: true
                      })}
                    />
                  </div>
                  <span className="text-danger">{errors.index_value && Message.validateField(errors.index_value.type, 'Index Value')}</span>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <label className="control-label" htmlFor="category_name">
                    Category Name *
                  </label>
                  <Controller
                    control={control}
                    name="category_name"
                    rules={{ required: true }}
                    as={
                      <select
                        className={"form-control" + (errors.category_name ? ' danger-border' : '')}
                        id="category_name"
                        onChange={e => { }}
                      >
                        <option key="" value={""} > Select Category</option>
                        <option key="Optical" value={"Optical"} > Optical </option>
                        <option key="Sunwear" value={"Sunwear"}> Sunwear </option>
                      </select>
                    }
                  />
                  <span className="text-danger">{errors.category_name && Message.validateField(errors.category_name.type, 'Category')}</span>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                <FormGroup>
                  <Button type="button" disabled={is_loading} onClick={() => reset()} color="danger" outline={true} style={{ width: "100%" }}>Reset</Button>
                </FormGroup>
              </Col>
              <Col md='6' sm="12" xs="12" style={{ marginTop: "25px" }}>
                <FormGroup>
                  <Button type="submit" disabled={is_loading} color="primary" style={{ width: "100%" }}>Update</Button>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
    </Form>
  )
}
