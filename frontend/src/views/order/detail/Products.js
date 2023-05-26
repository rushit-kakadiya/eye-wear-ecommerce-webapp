import React from 'react';
import { Row, Col, NavLink, Label } from "reactstrap";
import { addDayDate, getNumberFormat, getDateDiff, titleCase } from '../../../utilities/methods';
import { orderStatus, warrantyPrice } from '../../../utilities/constants';

export default ({ cart, order, toggle, setPrescription, lensesOnly, clipons, contactLens, setEditLens, otherProduct, setOldLens }) => {
  const dayDiffrance = getDateDiff(addDayDate(order.order_detail.created_at, 30));
  const yearDiffrance = getDateDiff(addDayDate(order.order_detail.created_at, 365));
  const order_status = order.order_detail.order_status;

  const getCartList = () => {
    return cart && cart.map((row, index) =>
      <div key={index} style={{ border: '1px solid #ccc' }} className="p-3 mt-3">
        <Col sm="12">
          <Row>
            <Col sm="2">
              <img src={row.base_url + row.image_url} width="100%" alt={row.frame_name} />
            </Col>
            <Col sm="5">
              <h6>{row.frame_name}<br />{row.sku_code} </h6>
            </Col>
            <Col sm="5">
              <h6>{getNumberFormat(row.retail_price, order.order_detail.currency_code)}</h6>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md="5" sm={{ offset: 2 }}>
              <strong>Frame Color: </strong><br />
              {row.variant_name}
            </Col>
            <Col md="4">
              <strong>Frame Size: </strong><br />
              {row.frame_size}
            </Col>
          </Row>
          <Row className="mt-3 text-success">
            <Col md="7">
              <strong>{titleCase(row.discount_note || 'discount')} ( {row.discount_amount ? ((Number(row.discount_amount) * 100) / row.retail_price).toFixed(2) : '0'}% ) </strong>
            </Col>
            <Col md="3">
              <strong>-{getNumberFormat(row.discount_amount, order.order_detail.currency_code)} </strong>
            </Col>
          </Row>
          <hr />
          {row.lense_details.length > 0 &&
            <>
              <Row className="mt-3">
                <Col md="11">
                  <h5>LENS SELECTIONS</h5>
                </Col>
              </Row>
              {getCartLenses(row.lense_details.filter(row => !row.is_lens_change), row, false)}
              {getCartLenses(row.changed_lense_details || [], row, true)}
            </>
          }
          {
            row.prescription_label &&
            <>
              <Row className="mt-3">
                <Col>
                  <h5>Prescription</h5>
                </Col>
              </Row>
              <Row>
                <Col sm={9}>
                  {row.prescription_label} (Right (OD): {row.prescription_spheris_r} | Left (OS): {row.prescription_spheris_l})
                </Col>
                <Col sm={3}>
                  <NavLink to="#"
                    onClick={() => {
                      setPrescription(row);
                      toggle('prescription');
                    }}
                    style={{
                      display: "contents",
                      textDecoration: "underLine",
                      color: "#5e72e4", cursor: "pointer"
                    }}>Detail</NavLink>
                </Col>
              </Row>
            </>
          }
          <Row className="mt-3">
            <Col sm="5" className="ml-3 p-3" style={{ border: '1px solid #ccc' }}>
              <strong>Satisfaction Warranty</strong><br />
              {(dayDiffrance <= 30 && !orderStatus.includes(order.order_detail.order_status)) ?
                <>
                  <span className="badge badge-success badge-pill">{dayDiffrance} Days</span><br />
                  <strong style={{ color: '#9db1c7' }}>{order.order_detail && `until ${addDayDate(order.order_detail.payment_date, 30)}`}</strong>
                </> :
                <>
                  <span className="badge badge-danger badge-pill">No Warrany</span><br />
                </>
              }
            </Col>
            <Col sm="6" className="ml-3 p-3" style={{ border: '1px solid #ccc' }}>
              {([1, 2].includes(row.is_warranty) && yearDiffrance <= 365 && !orderStatus.includes(order.order_detail.order_status)) ?
                <>
                  <strong>1 Year Warranty  ( {row.is_warranty === 1 ? getNumberFormat(warrantyPrice) : 'Free'} )</strong><br />
                  <span className="badge badge-success badge-pill">{yearDiffrance} Days</span><br />
                  <strong style={{ color: '#9db1c7' }}>{`until ${addDayDate(order.order_detail.payment_date, 365)}`}</strong>
                </> :
                <>
                  <strong>1 Year Warranty</strong><br />
                  <span className="badge badge-danger badge-pill">No Warranty</span><br />
                </>
              }
            </Col>
          </Row>
          <hr />
          <h5>Packaging</h5>
          <Row>

            {order.packages.map((pkg, i) =>
              <Col md="5" className="ml-2" key={i}>
                <Label className="text-muted">
                  <input type="checkbox" checked={row.packages && row.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} disabled={true} /> {pkg.name}
                </Label>
              </Col>
            )}
          </Row>
          <hr />
          <Row>
            <Col md="8">
              <Label>
                <strong>Subtotal</strong>
              </Label>
            </Col>
            <Col md="4">
              <Label>
                <strong>{getNumberFormat(row.frame_total_price, order.order_detail.currency_code)}</strong>
              </Label>
            </Col>
          </Row>
        </Col>
      </div>
    )
  }

  const getCartLenses = (lense, row, canUpdate) => {
    return lense.map((lens, index) =>
      <React.Fragment key={index}>
        <Row className="mt-2">
          <Col md="7" style={{ color: 'orange' }}>
            <h6>{lens.type && lens.type !== 'both' ? lens.type.toUpperCase() : lens.type ? 'RIGHT & LEFT' : ''} LENS</h6>
          </Col>
          {canUpdate ?
            <Col sm="5">
              <NavLink to="#"
                style={{ display: "contents", textDecoration: "underLine", color: "#5e72e4", cursor: "pointer", textAlign: 'right' }} onClick={() => { toggle('viewOldLens'); setOldLens(row.lense_details); }}><b>click to see old lens</b></NavLink>
            </Col> :
            (order.order_detail['sales_channel'] && order.order_detail['sales_channel'].toLowerCase() === 'app' && !['order_confirmed', 'ready_to_collect', 'order_delivered'].includes(order_status) && !canUpdate) &&
            <>
              <Col sm="1"></Col>
              <Col sm="4" onClick={() => { setEditLens({ frame_id: row.order_item_id, lens: lens }); toggle('frameAddon') }} style={{ cursor: "pointer", textDecoration: "underLine" }}>
                <i className="fas fa-pencil-alt text-primary" ></i>
                <span className="ml-1 text-primary" ><b>Edit Lens</b></span>
              </Col>
            </>
          }
        </Row>
        <Row>
          <Col md="7">
            {lens.sku_code} ( {lens.name} - {lens.index_value} )
          </Col>
          <Col md="4">
            {getNumberFormat(lens.retail_price, order.order_detail.currency_code) || 'Free'}
          </Col>
        </Row>
        <Row style={{ backgroundColor: '#f0f5f5' }}>
          <Col md="10" >
            <br />
            <table width="100%" cellPadding="10%">
              <tr>
                <th>Prescription Type</th>
                <th>Lens Type</th>
                <th>Filter</th>
                {lens.lense_color_code && <th>Lens Color</th>}

              </tr>
              <tr>
                <td>{lens.prescription_name}</td>
                <td>{lens.lense_type_name}</td>
                <td>{lens.filter_name}</td>
                {lens.lense_color_code && <td>{lens.lense_color_code}</td>}
              </tr>
            </table>
          </Col>
        </Row>
        <Row className="mt-3 text-success">
          <Col md="7">
            <strong>{titleCase(lens.discount_note || 'discount')} ( {lens.discount_amount ? ((Number(lens.discount_amount) * 100) / lens.retail_price).toFixed(2) : '0'}% ) </strong>
          </Col>
          <Col md="4">
            <strong>-{getNumberFormat(lens.discount_amount, order.order_detail.currency_code)} </strong>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <input type="checkbox" id="is_sunwear" name="is_sunwear" checked={lens.is_sunwear} disabled />
            <label className="ml-2 text-muted"> Tinted Lens</label>
          </Col>
        </Row>
        <hr />
      </React.Fragment>
    )
  }
  const getLensesOnly = () => {
    return lensesOnly && lensesOnly.map((lens, index) =>
      <div key={index} style={{ border: '1px solid #ccc' }} className="p-3 mt-3">
        <React.Fragment key={index}>
          <Row className="mt-2">
            <Col md="8" style={{ color: 'orange' }}>
              <h6>{lens.type && lens.type !== 'both' ? lens.type.toUpperCase() : 'RIGHT & LEFT'} LENS</h6>
            </Col>
          </Row>
          <Row>
            <Col md="8">
              {lens.sku_code} ( {lens.name} - {lens.index_value} )
            </Col>
            <Col md="3">
              {getNumberFormat(lens.retail_price, order.order_detail.currency_code) || 'Free'}
            </Col>
          </Row>
          <Row style={{ backgroundColor: '#f0f5f5', marginLeft: '.5%', marginRight: '.5%' }}>
            <Col md="10" >
              <br />
              <table width="100%" cellPadding="10%">
                <tr>
                  <th>Prescription Type</th>
                  <th>Lens Type</th>
                  <th>Filter</th>
                  {lens.lense_color_code && <th>Lens Color</th>}
                </tr>
                <tr>
                  <td>{lens.prescription_name}</td>
                  <td>{lens.lense_type_name}</td>
                  {lens.lense_color_code && <td>{lens.lense_color_code}</td>}
                </tr>
              </table>
            </Col>
          </Row>
          <Row className="mt-3 text-success">
            <Col md="8">
              <strong>{titleCase(lens.discount_note || 'discount')} ( {lens.discount_amount ? ((Number(lens.discount_amount) * 100) / lens.retail_price).toFixed(2) : '0'}% ) </strong>
            </Col>
            <Col md="4">
              <strong>-{getNumberFormat(lens.discount_amount, order.order_detail.currency_code)} </strong>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <input type="checkbox" id="is_sunwear" name="is_sunwear" checked={lens.is_sunwear} disabled />
              <label className="ml-2 text-muted"> Tinted Lens</label>
            </Col>
          </Row>
          <hr />
        </React.Fragment>
        {
          lens.prescription_label ?
            <>
              <Row className="mt-3">
                <Col>
                  <h5>Prescription</h5>
                </Col>
              </Row>
              <Row>
                <Col sm={9}>
                  {lens.prescription_label} (Right (OD): {lens.prescription_spheris_r} | Left (OS): {lens.prescription_spheris_l})
                </Col>
                <Col sm={3}>
                  <NavLink to="#"
                    onClick={() => {
                      setPrescription(lens);
                      toggle('prescription');
                    }}
                    style={{
                      display: "contents",
                      textDecoration: "underLine",
                      color: "#5e72e4", cursor: "pointer"
                    }}>Detail</NavLink>
                </Col>
              </Row>
            </>
            : <h5>No Prescription</h5>
        }
        <hr />
        <h5>Packaging</h5>
        <Row>
          {order.packages.map((pkg, i) =>
            <Col md="5" className="ml-2" key={i}>
              <Label className="text-muted">
                <input type="checkbox" checked={lens.packages && lens.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} disabled={true} /> {pkg.name}
              </Label>
            </Col>
          )}
        </Row>
        <hr />
        <Row>
          <Col md="8">
            <Label>
              <strong>Subtotal</strong>
            </Label>
          </Col>
          <Col md="4">
            <Label>
              <strong>{getNumberFormat(lens.retail_price - lens.discount_amount, order.order_detail.currency_code)}</strong>
            </Label>
          </Col>
        </Row>
      </div>
    )
  }

  const getClipons = () => {
    return clipons && clipons.map((row, index) =>
      <div key={index} style={{ border: '1px solid #ccc' }} className="p-3 mt-3">
        <Col sm="12">
          <Row>
            <Col sm="2">
              <h1 className="ml-2"><i className="mdi mdi-sunglasses"></i></h1>
            </Col>
            <Col sm="5">
              <h6>Clip-on {row.name}<br />{row.sku_code} </h6>
            </Col>
            <Col sm="5">
              <h6>{getNumberFormat(row.retail_price, order.order_detail.currency_code)}</h6>
            </Col>
          </Row>
          <Row className="mt-1">
            <Col md="5" sm={{ offset: 2 }}>
              <strong>Color: </strong><br />
              {row.color}
            </Col>
            <Col md="4">
              <strong>Size: </strong><br />
              {row.size}
            </Col>
          </Row>
          <Row className="mt-3 text-success">
            <Col md="7">
              <strong>{titleCase(row.discount_note || 'discount')} ( {row.discount_amount ? ((Number(row.discount_amount) * 100) / row.retail_price).toFixed(2) : '0'}% ) </strong>
            </Col>
            <Col md="3">
              <strong>-{getNumberFormat(row.discount_amount, order.order_detail.currency_code)} </strong>
            </Col>
          </Row>
          <hr />
          <h5>Packaging</h5>
          <Row>
            {order.packages.map((pkg, i) =>
              <Col md="5" className="ml-2" key={i}>
                <Label className="text-muted">
                  <input type="checkbox" checked={row.packages && row.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} disabled={true} /> {pkg.name}
                </Label>
              </Col>
            )}
          </Row>
          <hr />
          <Row>
            <Col md="8">
              <Label>
                <strong>Subtotal</strong>
              </Label>
            </Col>
            <Col md="4">
              <Label>
                <strong>{getNumberFormat(row.retail_price - row.discount_amount, order.order_detail.currency_code)}</strong>
              </Label>
            </Col>
          </Row>
        </Col>
      </div>
    )
  }

  const getContactLens = () => {
    return contactLens && contactLens.map((row, index) =>
      <div key={index} style={{ border: '1px solid #ccc' }} className="p-3 mt-3">
        <Col sm="12">
          <Row>
            <Col sm="2">
              <h1 className="ml-2"><i className="mdi mdi-sunglasses"></i></h1>
            </Col>
            <Col sm="6">
              <h6>Clip-on {row.name}<br />{row.sku_code} </h6>
            </Col>
            <Col sm="4">
              <h6>{getNumberFormat(row.retail_price, order.order_detail.currency_code)}</h6>
            </Col>
          </Row>
          <Row className="mt-3 text-success">
            <Col md="8">
              <strong>{titleCase(row.discount_note || 'discount')} ( {row.discount_amount ? ((Number(row.discount_amount) * 100) / row.retail_price).toFixed(2) : '0'}% ) </strong>
            </Col>
            <Col md="3">
              <strong>-{getNumberFormat(row.discount_amount, order.order_detail.currency_code)} </strong>
            </Col>
          </Row>
          <hr />
          {
            row.prescription_label ?
              <>
                <Row className="mt-3">
                  <Col>
                    <h5>Prescription</h5>
                  </Col>
                </Row>
                <Row>
                  <Col sm={9}>
                    {row.prescription_label} (Right (OD): {row.prescription_spheris_r} | Left (OS): {row.prescription_spheris_l})
                  </Col>
                  <Col sm={3}>
                    <NavLink to="#"
                      onClick={() => {
                        setPrescription(row);
                        toggle('prescription');
                      }}
                      style={{
                        display: "contents",
                        textDecoration: "underLine",
                        color: "#5e72e4", cursor: "pointer"
                      }}>Detail</NavLink>
                  </Col>
                </Row>
              </>
              : <h5>No Prescription</h5>
          }
          <hr />
          <h5>Packaging</h5>
          <Row>
            {order.packages.map((pkg, i) =>
              <Col md="5" className="ml-2" key={i}>
                <Label className="text-muted">
                  <input type="checkbox" checked={row.packages && row.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} disabled={true} /> {pkg.name}
                </Label>
              </Col>
            )}
          </Row>
          <hr />
          <Row>
            <Col md="8">
              <Label>
                <strong>Subtotal</strong>
              </Label>
            </Col>
            <Col md="4">
              <Label>
                <strong>{getNumberFormat(row.retail_price - row.discount_amount, order.order_detail.currency_code)}</strong>
              </Label>
            </Col>
          </Row>
        </Col>
      </div>
    )
  }


  const getOtherProduct = () => {
    return otherProduct && otherProduct.map((row, index) =>
      <div key={index} style={{ border: '1px solid #ccc' }} className="p-3 mt-3">
        <Col sm="12">
          <Row>
            <Col sm="2">
              <h1 className="ml-2"><i className="mr-2 mdi mdi-film"></i></h1>
            </Col>
            <Col sm="6">
              <h6>{row.name}<br />{row.sku_code} </h6>
            </Col>
            <Col sm="4">
              <h6>{getNumberFormat(row.retail_price, order.order_detail.currency_code)}</h6>
            </Col>
          </Row>
          <Row className="mt-3 text-success">
            <Col md="8">
              <strong>{titleCase(row.discount_note || 'discount')} ( {row.discount_amount ? ((Number(row.discount_amount) * 100) / row.retail_price).toFixed(2) : '0'}% ) </strong>
            </Col>
            <Col md="3">
              <strong>-{getNumberFormat(row.discount_amount, order.order_detail.currency_code)} </strong>
            </Col>
          </Row>
          <hr />
          <h5>Packaging</h5>
          <Row>
            {order.packages.map((pkg, i) =>
              <Col md="5" className="ml-2" key={i}>
                <Label className="text-muted">
                  <input type="checkbox" checked={row.packages && row.packages.split(',').includes(pkg.sku)} name={pkg.name.replace(" ", "_")} disabled={true} /> {pkg.name}
                </Label>
              </Col>
            )}
          </Row>
          <hr />
          <Row>
            <Col md="8">
              <Label>
                <strong>Subtotal</strong>
              </Label>
            </Col>
            <Col md="4">
              <Label>
                <strong>{getNumberFormat(row.retail_price - row.discount_amount, order.order_detail.currency_code)}</strong>
              </Label>
            </Col>
          </Row>
        </Col>
      </div>
    )
  }

  return (
    <>
      <Row style={{ border: '1px solid #ccc' }} className="p-3 mt-3">

        <Col sm="12">
          <Col sm="12"><h5>Purchased Detail</h5></Col>
          {cart && cart.length > 0 && <Col sm="12" className="mt-2"><h6>Frames Selections</h6></Col>}
          {getCartList()}
          {lensesOnly && lensesOnly.length > 0 && <Col sm="12" className="mt-2"><h6>Lenses Selections</h6></Col>}
          {getLensesOnly()}
          {clipons && clipons.length > 0 && <Col sm="12" className="mt-2"><h6>Clip-on Selections</h6></Col>}
          {getClipons()}
          {contactLens && contactLens.length > 0 && <Col sm="12" className="mt-2"><h6>Contact Lens Selections</h6></Col>}
          {getContactLens()}
          {otherProduct && otherProduct.length > 0 && <Col sm="12" className="mt-2"><h6>Other Products Selections</h6></Col>}
          {getOtherProduct()}
          <Row className="mt-3">
            <Col sm="8"> Total </Col>
            <Col sm="4"> <strong>{getNumberFormat(order.order_detail.order_amount, order.order_detail.currency_code)}</strong> </Col>
          </Row>
          <Row>
            <Col sm="8"> Shipping Fee </Col>
            <Col sm="4"> <strong>{getNumberFormat(0, order.order_detail.currency_code)}</strong> </Col>
          </Row>
          <Row className="text-success">
            <Col sm="8"> Discount <br />{order.order_detail.voucher_code && order.order_detail.voucher_code !== 'NA' ? `(${order.order_detail.voucher_code})` : ''}</Col>
            <Col sm="4"> <strong>- {getNumberFormat(order.order_detail.order_discount_amount, order.order_detail.currency_code)}</strong> </Col>
          </Row>
          {
            order.order_detail.user_credit_amount > 0 &&
            <Row className="text-success">
              <Col sm="8"> Discount <br />{`(Referral Code)`}</Col>
              <Col sm="4"> <strong>- {getNumberFormat(order.order_detail.user_credit_amount, order.order_detail.currency_code)}</strong> </Col>
            </Row>
          }
          {
            order.order_detail.eyewear_points_credit > 0 &&
            <Row className="text-success">
              <Col sm="8"> Discount <br />{`(EYEWEARPoint)`}</Col>
              <Col sm="4"> <strong>- {getNumberFormat(order.order_detail.eyewear_points_credit, order.order_detail.currency_code)}</strong> </Col>
            </Row>
          }
          <hr />
          <Row>
            <Col sm="8"> Grand Total </Col>
            <Col sm="4"> <strong>{getNumberFormat(order.order_detail.payment_amount, order.order_detail.currency_code)}</strong> </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
