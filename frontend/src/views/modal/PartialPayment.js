import React,{useEffect} from 'react';
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


export default ({paymentType, loading, handlePartialPayment, orderDetail, toggle, opticianList, inputPersonList}) => {
    const { register, handleSubmit, errors, setValue, setError, control } = useForm(); // initialise the hook

    useEffect(() => {
        setValue('amount',  orderDetail ? orderDetail.payment_category === 0 ? orderDetail.payment_amount*50/100 : Number(orderDetail.payment_amount)-Number(orderDetail.paid_amount) : 0);
    }, [setValue, orderDetail] );

    const onSubmit = (value) => {
        if(orderDetail && orderDetail.payment_amount*50/100 > Number(value.amount) && orderDetail.payment_category === 0){
            toastAction(false, 'Minimum amount should be 50% from total amount.');
        } else if(orderDetail && orderDetail.payment_amount*95/100 < Number(value.amount) && orderDetail.payment_category === 0){
            toastAction(false, 'Maximum amount should not be more than 95% from total amount.');
        } else if(paymentType.type === 'MANDIRI' || paymentType.type === 'BCA' || (value.created_by_staff && value.created_by_staff.value) || (value.optician && value.optician.value)) {
            handlePartialPayment({
                ...value,
                created_by_staff: value.created_by_staff ? value.created_by_staff.value : undefined,
                optician: value.optician ? value.optician.value : undefined,
                auth_id: paymentType.type === 'cash' ? 'cash-payment' : 'transfer',
                payment_type: paymentType.type,
                payment_method: paymentType.method
            });
        } else {
            toastAction(false, 'Please select staff or optician!');
            //setError('amount', { type: 'valueAsNumber', message: "invalid payment" });
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
                                    <strong>{orderDetail ? getNumberFormat(orderDetail.payment_category === 0 ? orderDetail.payment_amount : Number(orderDetail.payment_amount)-Number(orderDetail.paid_amount)): 'Rp 0'} </strong><br/>
                                    { orderDetail && orderDetail.payment_category === 1 && <span className="text-orange">(Remaining Amount) </span>}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <strong>Payment Method: </strong> {replaceGlobal(paymentType.type).toUpperCase()}
                                </Col>
                            </Row>
                            <hr/> 
                            <Row className="mt-3">
                                <Col>
                                    {orderDetail && orderDetail.payment_category === 0 && <Label>First Payment *</Label>}
                                    <input 
                                        name="amount" 
                                        type="number"
                                        ref={register({
                                            required: true,
                                            valueAsNumber: (value) => value < orderDetail.payment_amount*50/100
                                        })}
                                        className="form-control"
                                        placeholder= 'First Payment Amount'
                                        hidden={orderDetail && orderDetail.payment_category === 1}
                                    />
                                    {orderDetail && orderDetail.payment_category === 0 && <span className={errors.amount ? "text-danger" : ""}>{errors.amount ? validateField( errors.amount.type, 'First payment amount' ) : 'Minimum amount should be 50% from total amount.'}</span>}
                                </Col> 
                            </Row> 
                            {((paymentType.type !== 'MANDIRI' && paymentType.type !== 'BCA') || paymentType.method === 5) &&
                            <>
                            <Row className="mt-3">
                                <Col>
                                    <Label>Note</Label>
                                    <input 
                                        name="notes" 
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
                            </>}
                            
                            <Row className="mt-4">
                                <Col sm={{offset: 3}}>
                                    <Button color="danger" onClick={()=>toggle('partialPayment')}>Decline</Button>
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