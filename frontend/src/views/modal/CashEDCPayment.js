import React, {useState} from 'react';
import {
    Row,
    Col,
    Button,
    Card,
    CardBody,
    Label,
    Form
} from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import {getNumberFormat, replaceGlobal, titleCase} from '../../utilities/methods';
import {validateField} from '../../utilities/message';
import { toastAction } from '../../redux/ToastActions';


export default ({paymentType, loading, banks, inStorePayment, orderDetail, toggle, opticianList, inputPersonList}) => {
    const [bank, setBank] = useState('');
    const [cardType, setCardType] = useState('');
    const { register, handleSubmit, errors, control } = useForm(); // initialise the hook

    const onSubmit = (value) => {
        if((value.created_by_staff && value.created_by_staff.value) || (value.optician && value.optician.value)) {
            inStorePayment({
                ...value,
                created_by_staff: value.created_by_staff ? value.created_by_staff.value : undefined,
                optician: value.optician ? value.optician.value : undefined,
                auth_id: value.auth_id || (paymentType.type === 'cash' ? 'cash-payment' : 'transfer'),
                payment_type: paymentType.type,
                payment_method: paymentType.method,
                bank_code: bank || '', 
                card_type: cardType,
                expiration_time: value.expiration_time || '',
                notes: value.auth_id
            });
        } else {
            toastAction(false, 'Please select staff or optician!');
        }
    }

    return (
        <Row>
            <Col sm="12">
                <Card>
                    <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col>
                                    <h3>Payment </h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm="8">
                                    <strong>Transaction ID: </strong> {orderDetail? orderDetail.order_no : '---'}
                                </Col>
                                <Col sm="4">
                                    <strong>{orderDetail? getNumberFormat(orderDetail.payment_amount): 'Rp 0'} </strong>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Payment Method: </strong> {replaceGlobal(paymentType.type).toUpperCase()}
                                </Col>
                            </Row>
                            {(paymentType.method === 5) && 
                                <Row className="mt-3">
                                    <Col sm="6">
                                        <Label>
                                            <input
                                                name="paymentType"
                                                type="radio"
                                                value="1"
                                                onClick={() => setCardType('CREDIT')}
                                            /> Credit Card </Label>
                                    </Col> 
                                    <Col sm="6">
                                        <Label>
                                            <input
                                                name="paymentType"
                                                type="radio"
                                                value="1"
                                                onClick={() => setCardType('DEBIT')}
                                            /> Debit </Label>
                                    </Col>    
                                </Row>
                            }
                            <hr/> 
                            <Row className="mt-3">
                                <Col>
                                    <Label>Note</Label>
                                    <input 
                                        name="auth_id" 
                                        type="text"
                                        ref={register({
                                            required: false
                                        })}
                                        className="form-control"
                                        placeholder= 'Note'
                                    />
                                    <span className="text-danger">{errors.auth_id && validateField( errors.auth_id.type, 'Reference Number' )}</span>
                                </Col> 
                            </Row> 
                            <Row className="mt-2">
                                <Col sm="6">
                                    <Label>
                                    <strong>Input by</strong>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="created_by_staff"
                                        rules={{ required: false }}
                                        as={
                                            <Select
                                                options={[...inputPersonList, ...opticianList].map(row => ({value: row.id, label: titleCase(row.name)}))}
                                            />
                                        }
                                    />
                                </Col>
                                <Col sm="6">
                                    <Label>
                                    <strong>Optician</strong>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="optician"
                                        rules={{ required: false }}
                                        as={
                                            <Select
                                                options={[...inputPersonList, ...opticianList].map(row => ({value: row.id, label: titleCase(row.name)}))}
                                            />
                                        }
                                    />
                                </Col>
                            </Row> 
                            <Row className="mt-4">
                                <Col sm={{offset: 3}}>
                                    <Button color="danger" onClick={()=>toggle('cashEDCPayment')}>Decline</Button>
                                </Col>
                                <Col sm={{offset: 2}}>
                                    <Button color="info" type="submit" disabled={loading}>Approved</Button>
                                </Col> 
                            </Row> 
                        </Form>        
                    </CardBody>
                </Card>
            </Col>
        </Row>                        
    )
}