import React, {useState} from 'react';
import Select from 'react-select';
import { Row, Col, Form, FormGroup, Table, NavLink, Modal, ModalHeader } from "reactstrap";
import FeatherIcon from "feather-icons-react";
import { getDateFormat, getNumberFormat, titleCase} from "../../../utilities/methods";
import NotesModal from "../../modal/Notes";

export default ({detail, stores, orderCancel, updateStockStore, userData, selectPaymentMethod}) => {
    const [modal, setModal] =  useState({notes: '', status: false});
    const selectedStore = stores.find((row)=> row.id.toString() === detail.stock_store_id);
    const selectedValue = selectedStore ? {value: selectedStore.id, label: selectedStore.name} : {label:"Select Stock Channel", value:""};
    const amount = detail.paymentDetails ? detail.paymentDetails.reduce((amount, row)  => {
        amount+=row.amount;
        return amount;
    },  0) : 0;
    return(
        <Row style={{border:'1px solid #ccc'}} className="p-3">
            <Col sm="4"><h5>Purchase Summary</h5></Col>
            <Col sm="3">
            { 
            ["payment_pending", "payment_initiated"].includes(detail.order_status) &&
            <NavLink to="#"  className="text-danger align-items-end " style={{ display: "contents", textDecoration:"underLine", cursor: "pointer"}} onClick={()=> orderCancel() }>Cancel Payment</NavLink>
            }
            </Col>
            <Col sm="5">
                { 
                detail.payment_category === 1 &&
                <NavLink to="#"  className="text-success align-items-end text-left" style={{ display: "contents", textDecoration:"underLine", cursor: "pointer"}} onClick={()=> selectPaymentMethod({order_no: detail.order_no, payment_amount: detail.payment_amount, paid_amount: amount, payment_req_id: detail.payment_req_id, name: detail.receiver_name, payment_category: detail.payment_category}) }>Continue Payment</NavLink>
                }
                <span className=" badge badge-success badge-pill ml-2">{titleCase(detail.payment_status ? detail.payment_status.replaceAll("_"," ") : '')}</span>
            </Col>
            <Form style={{width:'100%'}}>
                <FormGroup>
                <Table responsive>
                            <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th>Total Purchase</th>
                                    {detail.payment_category === 1 &&
                                    <th className="text-orange">Payment Remaining</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{getDateFormat(detail.created_at, true, true, userData.time_zone)}</td>
                                    <td>{getNumberFormat(detail.payment_amount, detail.currency_code)}</td>
                                    {detail.payment_category === 1 &&
                                        <td className="text-orange">{getNumberFormat(Number(detail.payment_amount) - amount)}</td>
                                    }
                                    </tr>
                            </tbody>
                        </Table>
                </FormGroup>
                <hr/>
                <Col sm="4"><strong>Payment Timeline: </strong></Col>
                    <FormGroup>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th>Payment Date</th>
                                    <th>Paid Amount</th>
                                    <th>Payment Method</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detail.paymentDetails && detail.paymentDetails.map((row, index) =>
                                    <tr key={index}>
                                        <td>{getDateFormat(row.created_at, true, true, userData.time_zone)}</td>
                                        <td>{getNumberFormat(row.amount, detail.currency_code)}</td>
                                        <td>{row.payment_method ===  "VA" ? `VA - ${row.account_number}` : row.payment_method}</td>
                                        <td className="text-orange" style={{cursor: 'pointer'}} onClick={() => setModal({status: true, notes: row.notes})} ><FeatherIcon icon="menu" /></td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </FormGroup>
                <Row>
                    <Col sm="5" className="ml-3">
                    <strong>Sales Channel:</strong><br/> 
                    {detail.sales_channel && detail.sales_channel === 'store' ? detail.sales_channel.replace(/^./, detail.sales_channel[0].toUpperCase())+" - "+detail.store.name : (detail.sales_channel && detail.sales_channel.replace(/^./, detail.sales_channel[0].toUpperCase()))}
                    </Col> 
                    <Col >
                    <strong>Store in Charge:</strong><br/> 
                    <Select
                        placeholder="Select Stock Channel"
                        isDisabled={['order_confirmed', 'order_completed', 'order_delivered'].includes(detail.order_status)}
                        options={stores.map(row => ({value: row.id, label: row.name}))}
                        value={selectedValue}
                        onChange={(row) => updateStockStore(row.value)}
                    />
                    </Col>
                </Row>
            </Form>
            <Modal
                isOpen={modal.status}
                toggle={() => setModal({status: false})}
                size="md"
            >
                <ModalHeader toggle={() => setModal({status: false})}> Notes </ModalHeader>
                <NotesModal 
                    notes={modal.notes}
                />
            </Modal>
        </Row>
    )
}
