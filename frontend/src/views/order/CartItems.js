import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardText, Label, FormGroup, Button } from 'reactstrap';
import { NavLink } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Addons from './Addons';
import ContactLens from './ContactLens';
import Autocomplete from '../../components/Autocomplete';
import { getNumberFormat, titleCase } from '../../utilities/methods';
import { warrantyPrice } from '../../utilities/constants';

const CartItems = ({
  cart,
  order,
  deleteCart,
  deleteCartAddon,
  toggle,
  setSku,
  setEditedLens,
  setLens,
  setLensLeft,
  setLensSwitch,
  prescription,
  selectPrescription,
  setPreview,
  setItemWarranty,
  setDiscount,
  isView,
  border,
  removeDiscount,
  setSelectedClipon,
  setPackaging,
  setContactLensQuantity
}) => {
  // Confirm delete 
  const handleDelete = (data, isAddon = '') => {
    confirmAlert({
      title: isAddon ? `Delete ${titleCase(isAddon)}` : 'Delete Frame',
      message: isAddon ? `Are you sure to delete a ${titleCase(isAddon)}!` : 'Are you sure to delete a frame!',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            if (isAddon) {
              deleteCartAddon(data);
            } else {
              deleteCart({
                id: data.id
                // user_id: order.selected_user.id,
                // sku_code: data.sku_code,
                // product_category: data.product_category,
                // type: data.type
              });
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const renderItems = (item, isHighlighted) => {
    return (
      <div key={Math.random(10)} style={{ background: isHighlighted ? 'lightgray' : 'white', border: '2px' }}>
        <CardBody>
          <Row>
            <Col md="10">
              <strong>{item.label}</strong> <br />
              <strong>Single Vision</strong> <br />
              Right (OD): {item.spheris_r} | Left (OS): {item.spheris_l}<br />
            </Col>
          </Row>
          {!isView &&
            <Row>
              <Col md="3">
                <NavLink to="#" onClick={() => {
                  toggle('prescription');
                  setPreview(false);
                  selectPrescription(item);
                }} style={{ textDecoration: 'underline' }}>Edit</NavLink>
              </Col>
              <Col>
                <NavLink to="#" onClick={() => {
                  toggle('prescription');
                  setPreview(true);
                  selectPrescription(item);
                }} style={{ textDecoration: 'underline' }}>Preview</NavLink>
              </Col>
            </Row>
          }
        </CardBody>
      </div>
    );
  };

  const getCartList = () => {
    return cart.data && cart.data.list.filter(cart => cart.type === 1).map((row, index) =>
      <Row key={index}>
        <Col md="7" sm={{ offset: isView ? 0 : 1 }}>
          {order.selected_user &&
            <Card body style={{ width: '100%', marginLeft: '4.5%', border }}>
              <Row>
                <Col md="10">
                  <h4>Frame Details</h4>
                </Col>
                {!isView &&
                  <Col onClick={() => handleDelete(row)} md="1" style={{ cursor: 'pointer', color: 'red', marginLeft: "5%" }}>
                    <i className="fas fa-trash-alt"></i>
                  </Col>
                }
              </Row>
              <CardText>
                <Row>
                  <Col sm="2">
                    <img src={row.base_url + row.images[0].image_key} width="100%" alt={row.name} />
                  </Col>
                  <Col sm="5">
                    <h6>{row.sku_code} <br />{row.name}</h6>
                  </Col>
                  <Col sm="5">
                    <h6>{getNumberFormat(row.retail_price)}</h6>
                  </Col>
                </Row>
                <Row>
                  <Col md="5" sm={{ offset: 2 }}>
                    <strong>Frame Color:- </strong><br />
                    {row.variant_name}
                  </Col>
                  <Col md="5">
                    <strong>Frame Size:- </strong><br />
                    {row.frame_size}
                  </Col>
                </Row>
                {row.discount_type || isView ?
                  <Row>
                    <Col sm={8}>
                      <div>
                        {
                          !isView && <i class="fa fa-times-circle" aria-hidden="true" style={{ color: '#ff0000' }} onClick={() => removeDiscount('frame', row.id)}></i>
                        }

                        <span className="font-bold ml-1" style={{ color: '#00bfa5' }}>
                          {`Discount(${((row.discount_amount / row.retail_price) * 100).toFixed(2) + '%'})`}
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <span className="font-bold " style={{ color: '#00bfa5' }}>
                        {getNumberFormat(Number(row.discount_amount))}
                      </span>
                    </Col>
                  </Row> :
                  <Row>
                    <Col>
                      <div onClick={() => { setDiscount('frame', row.id, row.retail_price); toggle('discount'); }}>
                        <i className="fas fa-ticket-alt" style={{ color: '#00bfa5', cursor: 'pointer' }}></i>
                        <span className="font-bold ml-1" style={{ color: '#00bfa5', textDecoration: 'underLine', cursor: 'pointer' }}>
                          Add Discount
                        </span>
                      </div>
                    </Col>
                  </Row>}
                <hr />
                {row.addon_items.length === 0 ?
                  <Row className="mt-3">
                    <Col md="8">
                      <h5>LENS SELECTIONS</h5>
                    </Col>
                    <Col md="4">
                      <NavLink to="#" onClick={() => {
                        toggle('frameAddon');
                        setSku(row.sku_code);
                        setEditedLens(null);
                        setLens({});
                        setLensLeft({});
                        setLensSwitch(false)
                      }} style={{ marginLeft: '5%', textDecoration: 'underline' }}>Change</NavLink>
                    </Col>
                  </Row>
                  :
                  <Addons
                    addonList={row.addon_items}
                    toggle={toggle}
                    setSkuData={() => setSku(row.sku_code)}
                    setEditedLens={setEditedLens}
                    setLensSwitch={setLensSwitch}
                    handleDelete={handleDelete.bind(null)}
                    setDiscount={setDiscount.bind(null)}
                    isView={isView}
                    removeDiscount={removeDiscount.bind(null)}
                    order={order}
                    isFrame={true}
                  />
                }
                <Row className="mt-3">
                  <Col>
                    <h5>Prescription</h5>
                    <FormGroup>
                      {prescription.list.length > 0 &&
                        <Autocomplete
                          items={prescription.list}
                          name="prescription"
                          className="form-control"
                          label='label'
                          renderItems={(item, isHighlighted) => renderItems({ ...item, cart_id: row.id, type: 'cart' }, isHighlighted)}
                          setObject={i => selectPrescription({ ...i, cart_id: row.id, type: 'cart' })}
                          setInputValue={() => false}
                          placeholder="Choose Prescription"
                          defaultValue={row.prescription_details ? row.prescription_details.label : ''}
                        />
                      }
                      {!isView &&
                        <Button style={{ width: '100%' }} type="button" className="btn mt-2" outline color="primary" onClick={() => { setPreview(false); selectPrescription({ cart_id: row.id, type: 'cart' }); toggle('prescription'); }} disabled={!order.selected_user}>
                          {prescription.list.length > 0 ? 'Add More Prescription' : 'Add Prescription'}
                        </Button>
                      }
                    </FormGroup>
                  </Col>
                </Row>
                {!isView &&
                  <>
                    <h5>Warranty</h5>
                    <Row style={{ marginLeft: '0px', marginRight: '0px', padding: '5px' }}>
                      <Col sm="8">
                        {row.is_warranty === 1 ?
                          <Label>
                            <input type="radio" name={"warranty-" + row.id} checked={true} onClick={() => setItemWarranty({ id: row.id, is_warranty: 1 })} /> <strongEyewears Warranty</strong>
                          </Label>
                      :
                      <Label>
                        <input type="radio" name={"warranty-" + row.id} onClick={() => setItemWarranty({ id: row.id, is_warranty: 1 })} /> <strong>Eyewear Warranty</strong>
                      </Label>
                        }
                    </Col>
                    <Col sm="4" >
                      <Label>
                        {getNumberFormat(warrantyPrice)}
                      </Label>
                    </Col>
                    {/* <img src={require("../../assets/images/warranty.png")} width="100%" height="50px" alt="warranty"/> */}
                  </Row><br />
                <Row style={{ marginLeft: '0px', marginRight: '0px', padding: '5px' }}>
                  <Col sm="8">
                    {row.is_warranty === 2 ?
                      <Label>
                        <input type="radio" name={"warranty-" + row.id} checked={true} onClick={() => setItemWarranty({ id: row.id, is_warranty: 2 })} /> <strong>Free Warranty (App Register)</strong>
                      </Label>
                      :
                      <Label>
                        <input type="radio" name={"warranty-" + row.id} onClick={() => setItemWarranty({ id: row.id, is_warranty: 2 })} /> <strong>Free Warranty (App Register)</strong>
                      </Label>
                    }
                  </Col>
                  <Col sm="4" >
                    <Label>
                      {getNumberFormat(0)}
                    </Label>
                  </Col>
                  {/* <img src={require("../../assets/images/warranty.png")} width="100%" height="50px" alt="warranty"/> */}
                </Row><br />
                <Row style={{ marginLeft: '0px', marginRight: '0px', padding: '5px' }}>
                  <Col sm="8">
                    {row.is_warranty === 0 ?
                      <Label>
                        <input type="radio" name={"warranty-" + row.id} checked={true} onClick={() => setItemWarranty({ id: row.id, is_warranty: 0 })} /> <strong>No Warranty</strong>
                      </Label>
                      :
                      <Label>
                        <input type="radio" name={"warranty-" + row.id} onClick={() => setItemWarranty({ id: row.id, is_warranty: 0 })} /> <strong>No Warranty</strong>
                      </Label>
                    }
                  </Col>
                  <Col sm="4">
                    <Label>
                      {getNumberFormat(0)}
                    </Label>
                  </Col>
                  {/* <img src={require("../../assets/images/warranty.png")} width="100%" height="50px" alt="warranty"/> */}
                </Row>
              </>
                }
              {!isView &&
                <>
                  <hr />
                  <h5>Packaging</h5>
                  <Row>
                    {order.packages.map((pkg, i) =>
                      <Col md="5" className="ml-4" key={i}>
                        <Label>
                          <input type="checkbox" checked={row.packages && row.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} onClick={() => setPackaging({ id: row.id, sku: pkg.sku, type: 'frame' })} /> {pkg.name}
                        </Label>
                      </Col>
                    )}
                  </Row>
                </>
              }<hr />
              <Row>
                <Col md="8">
                  <Label>
                    <strong>Subtotal</strong>
                  </Label>
                </Col>
                <Col md="4">
                  <Label>
                    {getNumberFormat(row.product_total_price)}
                  </Label>
                </Col>
              </Row>
            </CardText>
            </Card>
          }
      </Col>
      </Row >
    )
  }

const getLensOnly = () => {
  return <Row>
    <Col md="7" sm={{ offset: isView ? 0 : 1 }}>
      {cart.lensesOnly && cart.lensesOnly.list.length > 0 && order.selected_user &&
        <Card body style={{ width: '100%', marginLeft: '4.5%', border }}>
          <CardTitle>
            <Row>
              <Col md="1">
                <i className="mr-2 mdi mdi-sunglasses"></i>
              </Col>
              <Col md="10">
                <h4>Lens Detail</h4>
              </Col>
            </Row>
          </CardTitle>
          <CardText>
            <Addons
              addonList={cart.lensesOnly.list}
              toggle={toggle}
              setSkuData={() => setSku(null)}
              setEditedLens={setEditedLens}
              setLensSwitch={setLensSwitch}
              text="LENS ONLY"
              renderItems={renderItems.bind(null)}
              isPrescription={true}
              prescription={prescription}
              selectPrescription={selectPrescription.bind(null)}
              order={order}
              handleDelete={handleDelete.bind(null)}
              setDiscount={setDiscount.bind(null)}
              isView={isView}
              removeDiscount={removeDiscount.bind(null)}
              setPackaging={setPackaging.bind(null)}
              isFrame={false}
            />
          </CardText>
        </Card>
      }
    </Col>
  </Row>
};

const getClipons = () => {
  return cart.clipons && cart.clipons.list.map((row, index) =>
    <Row key={index}>
      <Col md="7" sm={{ offset: isView ? 0 : 1 }}>
        <Card body style={{ width: '100%', marginLeft: '4.5%', border }}>
          <Row>
            <Col md="6">
              <h4>Clip-On Details</h4>
            </Col>
            {!isView &&
              <Col md="4">
                <NavLink to="#" onClick={() => {
                  toggle('clipon');
                  setSelectedClipon(row);
                }} style={{ marginLeft: '22%', textDecoration: 'underline' }}>Change
                </NavLink>
              </Col>
            }
            {!isView &&
              <Col onClick={() => handleDelete([row.id], 'clipon')} md="1" style={{ cursor: 'pointer', color: 'red', marginLeft: "5%" }}>
                <i className="fas fa-trash-alt"></i>
              </Col>
            }
          </Row>
          <CardText>
            <Row>
              <Col sm="2">
                <h1 className="ml-4"><i className="mr-2 mdi mdi-sunglasses"></i></h1>
              </Col>
              <Col sm="5">
                <h6>{row.sku} <br />{row.name}</h6>
              </Col>
              <Col sm="5">
                <h6>{getNumberFormat(row.retail_price)}</h6>
              </Col>
            </Row>
            <Row>
              <Col md="5" sm={{ offset: 2 }}>
                <strong> Color: </strong> <br />
                {row.color}
              </Col>
              <Col md="5">
                <strong> Size: </strong><br />
                {row.size}
              </Col>
            </Row>
            {row.discount_type || isView ?
              <Row>
                <Col sm={8}>
                  <div>
                    {
                      !isView && <i class="fa fa-times-circle" aria-hidden="true" style={{ color: '#ff0000' }} onClick={() => removeDiscount('addon', row.id)}></i>
                    }
                    <span className="font-bold ml-1" style={{ color: '#00bfa5' }}>
                      {`Discount(${((Number(row.discount_amount) / row.retail_price) * 100).toFixed(2) + '%'})`}
                    </span>
                  </div>
                </Col>
                <Col>
                  <span className="font-bold " style={{ color: '#00bfa5' }}>
                    {getNumberFormat(Number(row.discount_amount))}
                  </span>
                </Col>
              </Row> :
              <Row>
                <Col>
                  <div onClick={() => { setDiscount('addon', row.id, row.retail_price); toggle('discount'); }}>
                    <i className="fas fa-ticket-alt" style={{ color: '#00bfa5', cursor: 'pointer' }}></i>
                    <span className="font-bold ml-1" style={{ color: '#00bfa5', textDecoration: 'underLine', cursor: 'pointer' }}>
                      Add Discount
                    </span>
                  </div>
                </Col>
              </Row>}{!isView &&
                <>
                  <hr />
                  <h5>Packaging</h5>
                  <Row>
                    {order.packages.map((pkg, i) =>
                      <Col md="5" className="ml-4" key={i}>
                        <Label>
                          <input type="checkbox" checked={row.packages && row.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} onClick={() => setPackaging({ id: row.id, sku: pkg.sku, type: 'clipon' })} /> {pkg.name}
                        </Label>
                      </Col>
                    )}
                  </Row>
                </>
            }
            <hr />
            <Row>

              <Col md="8">
                <Label>
                  <strong>Subtotal</strong>
                </Label>
              </Col>
              <Col md="4">
                <Label>
                  {getNumberFormat(row.retail_price - Number(row.discount_amount))}
                </Label>
              </Col>
            </Row>
          </CardText>
        </Card>
      </Col>
    </Row>
  )
};

const getContactLens = () => {
  return <Row>
    <Col md="7" sm={{ offset: isView ? 0 : 1 }}>
      {cart.contactLens && cart.contactLens.list.length > 0 && order.selected_user &&
        <Card body style={{ width: '100%', marginLeft: '4.5%', border }}>
          <Row>
            <Col md="1" className="pr-0">
              <i className="fa fa-eye" aria-hidden="true"></i>
            </Col>
            <Col md="5" className="pl-0">
              <h5>Contact Lens Detail</h5>
            </Col>
          </Row>
          <ContactLens
            addonList={cart.contactLens.list}
            toggle={toggle}
            toggleType="contactLens"
            setSkuData={() => setSku(null)}
            setEditedLens={setEditedLens}
            setLensSwitch={setLensSwitch}
            text="CONTACT LENS"
            renderItems={renderItems.bind(null)}
            isPrescription={true}
            prescription={prescription}
            selectPrescription={selectPrescription.bind(null)}
            order={order}
            handleDelete={handleDelete.bind(null)}
            setDiscount={setDiscount.bind(null)}
            isView={isView}
            removeDiscount={removeDiscount.bind(null)}
            setPackaging={setPackaging.bind(null)}
            setContactLensQuantity={setContactLensQuantity}
          />
        </Card>
      }
    </Col>
  </Row>
}

const getOthersProduct = () => {
  return <Row>
    <Col md="7" sm={{ offset: isView ? 0 : 1 }}>
      {cart.othersProduct && cart.othersProduct.list.length > 0 && order.selected_user &&
        <Card body style={{ width: '100%', marginLeft: '4.5%', border }}>
          <Row>
            <Col md="1" className="pr-0">
              <i className="fa fa-eye" aria-hidden="true"></i>
            </Col>
            <Col md="5" className="pl-0">
              <h5>Other Products Detail</h5>
            </Col>
          </Row>
          <ContactLens
            addonList={cart.othersProduct.list}
            toggle={toggle}
            toggleType="otherProduct"
            setSkuData={() => setSku(null)}
            setEditedLens={setEditedLens}
            setLensSwitch={setLensSwitch}
            text="OTHERS"
            renderItems={renderItems.bind(null)}
            isPrescription={false}
            // prescription={prescription}
            // selectPrescription={selectPrescription.bind(null)}
            order={order}
            handleDelete={handleDelete.bind(null)}
            setDiscount={setDiscount.bind(null)}
            isView={isView}
            removeDiscount={removeDiscount.bind(null)}
            setPackaging={setPackaging.bind(null)}
            setContactLensQuantity={setContactLensQuantity}
          />
        </Card>
      }
    </Col>
  </Row>
}


return (
  <>
    {getCartList()}
    {cart.lensesOnly && getLensOnly()}
    {cart.clipons && getClipons()}
    {cart.contactLens && getContactLens()}
    {cart.othersProduct && getOthersProduct()}
  </>
)

}

CartItems.defaultProps = {
  deleteCart: () => false,
  deleteCartAddon: () => false,
  toggle: () => false,
  setSku: () => false,
  setEditedLens: () => false,
  setLens: () => false,
  setLensLeft: () => false,
  setLensSwitch: () => false,
  prescription: { list: [] },
  selectPrescription: () => false,
  setPreview: () => false,
  setItemWarranty: () => false,
  setDiscount: () => false,
  isView: false,
  border: 'none',
  removeDiscount: () => false,
  setSelectedClipon: () => false,
  setPackaging: () => false
}

export default CartItems;
