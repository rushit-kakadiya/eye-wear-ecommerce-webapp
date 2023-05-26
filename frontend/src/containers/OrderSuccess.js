import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Row, Col, Modal, ModalHeader } from "reactstrap";
import OnlinePaymentAccount from '../views/modal/OnlinePaymentAccount';
import OrderSuccess from '../views/order/OrderSuccess';
import { createVAPayment, orderSuccess, createInStorePament, updateOrderStaffOptician, createXenditInvoice } from '../redux/order/action';
import CashEDCPayment from '../views/modal/CashEDCPayment';
import PartialPayment from '../views/modal/PartialPayment';
import {fetchBankList} from '../redux/banks/action';
import {getOpticianList, getInputPersonList} from  '../redux/hto/action';

export default (props) => {
    const [modal, setModal] =  useState({});
    const [paymentType, setPaymentType] =  useState({});
    const [paymentCategory, setPaymentCategory] =  useState(3); // Full Payment, Partial Payment
    const [accountNo, setAccountNo] = useState('');
    const dispatch = useDispatch();
    const {order, banks, hto} = useSelector(state => state);

    useEffect(() => {
        if(!order.order_detail){
            props.history.push('/order');
        }
        dispatch(fetchBankList());
        // dispatch(getOpticianList({}));
        dispatch(getInputPersonList({}));
        setPaymentCategory(order.order_detail && order.order_detail.payment_category === 1 ? 2 : 3 );
    }, [dispatch, props.history, order.order_detail]);

    // Togle modal states
    const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };
    // Make online payment
    const onlinePayment = (code, partialAmount = null) => {
        dispatch(createVAPayment({
            bank_code: code,
            name: order.order_detail.name || 'Admin',
            amount: partialAmount || order.order_detail.payment_amount.toString(),
            external_id: order.order_detail.payment_req_id,
            payment_category: paymentCategory
        }))
        .then((res) => {
                toggle('onlinePayment')
                setAccountNo(res.account_number);
        });
    };
    // Reset order detail
    const resetOrderDetail = (value) => {
        dispatch(updateOrderStaffOptician({...value, external_id: order.order_detail.payment_req_id, payment_category: paymentCategory}))
        .then(() => {
            dispatch(orderSuccess(null));
            props.history.push('/order') 
        });
    };
    // Handle In store payment request
    const inStorePayment = (data) => {
        dispatch(createInStorePament({
            external_id: order.order_detail.payment_req_id,
            name: order.order_detail.name || 'Admin',
            amount: order.order_detail.payment_amount.toString(),
            payment_category: paymentCategory,
            ...data
        })).then((id) => {
            props.history.push(`/order-detail/${id.replace('/','-')}`);
        });
    }

    const handleXenditpayment = (method, type) => {
        setPaymentType({method:method, type:type});
            if(type === 'MANDIRI' || type === 'BCA'){
                onlinePayment(type)
            } if(type === 'INVOICE'){
                xenditInvoicePayment(true, null);
            } else {
                toggle('onlinePayment')
            }
    }

    const  handlePartialPayment  = (data) => {
        if((data.payment_type === 'MANDIRI' || data.payment_type === 'BCA') && data.payment_method !== 5){
            onlinePayment(data.payment_type, data.amount);
        } else if(data.payment_type === 'INVOICE'){
            xenditInvoicePayment(false, data);
        } else {
            dispatch(createInStorePament({
                external_id: order.order_detail.payment_req_id,
                name: order.order_detail.name || 'Admin',
                payment_category: paymentCategory,
                ...data
            })).then((id) => {
                props.history.push(`/order-detail/${id.replace('/','-')}`);
            });
        } 
    }

    // Make online payment
    const xenditInvoicePayment = (isToggle, data) => {
        if(data){
            delete data.auth_id;
        }
        dispatch(createXenditInvoice({
            ...data,
            amount: data ? data.amount : order.order_detail.payment_amount,
            order_no: order.order_detail.order_no,
            payment_category: paymentCategory || ''
        }))
        .then((res) => {
            if(isToggle){
                toggle('onlinePayment');
                setAccountNo(res.account_number);
            } else {
                props.history.push(`/order-detail/${order.order_detail.order_no.replace('/','-')}`);
            }
        });
    };

    return (
        <Row>
            <Col md="10">
                <OrderSuccess 
                    {...props} 
                    toggle={toggle.bind(null)}
                    onlinePayment={onlinePayment.bind(null)}
                    loading={order.is_loading}
                    setPaymentType={setPaymentType.bind(null)}
                    handleXenditpayment={handleXenditpayment.bind(null)}
                    paymentType={paymentType}
                    setPaymentCategory={setPaymentCategory.bind(null)}
                    paymentCategory={paymentCategory}
                    orderDetail={order.order_detail}
                />
            </Col>
            <Modal
                isOpen={modal.onlinePayment}
                toggle={() => toggle('onlinePayment')}
                size="md"
            >
                <ModalHeader toggle={() => {
                    toggle('onlinePayment');
                    props.history.push('/order');
                }}> Online Account</ModalHeader>
                <OnlinePaymentAccount
                    accountNo={accountNo} 
                    paymentAmount={order.order_detail ? order.order_detail.payment_amount : 0 }
                    resetOrderDetail={resetOrderDetail.bind(null)}
                    loading={order.is_loading}
                    opticianList={hto.optician_list}
                    inputPersonList={hto.input_person_list}
                    paymentType={paymentType}
                    inStorePayment={inStorePayment.bind(null)}
                />
            </Modal>
            <Modal
                isOpen={modal.cashEDCPayment}
                toggle={() => toggle('cashEDCPayment')}
                size="md"
            >
                <ModalHeader toggle={() => toggle('cashEDCPayment')}> In Store Payment </ModalHeader>
                <CashEDCPayment
                    paymentType={paymentType}
                    banks={banks}
                    inStorePayment={inStorePayment.bind(null)}
                    loading={order.is_loading}
                    orderDetail={order.order_detail}
                    toggle={toggle.bind(null)}
                    opticianList={hto.optician_list}
                    inputPersonList={hto.input_person_list}
                />
            </Modal>
            <Modal
                isOpen={modal.partialPayment}
                toggle={() => toggle('partialPayment')}
                size="md"
            >
                <ModalHeader toggle={() => toggle('partialPayment')}> In Store Payment </ModalHeader>
                <PartialPayment
                    paymentType={paymentType}
                    banks={banks}
                    handlePartialPayment={handlePartialPayment.bind(null)}
                    loading={order.is_loading}
                    orderDetail={order.order_detail}
                    toggle={toggle.bind(null)}
                    opticianList={hto.optician_list}
                    inputPersonList={hto.input_person_list}
                />
            </Modal>
        </Row>  
    )
};