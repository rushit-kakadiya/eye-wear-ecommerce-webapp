import React from 'react';
import {
    Row,
    Col,
    Card,
    CardBody, 
    Button,
    Label,
    Form
} from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { toastAction } from '../../redux/ToastActions';
import { getNumberFormat, titleCase } from '../../utilities/methods';

export default ({accountNo, paymentAmount, resetOrderDetail, loading, opticianList, inputPersonList, paymentType, inStorePayment}) => {
    const { handleSubmit, register, control } = useForm(); // initialise the hook
    const onSubmit = (value) => {
        if((value.created_by_staff && value.created_by_staff.value) || (value.optician && value.optician.value)) {
            if([ "BCA-COMPLETED" ,  "MANDIRI-COMPLETED", "xendit_debit_credit_card"].includes(paymentType.type))
            {
                inStorePayment({
                    ...value,
                    created_by_staff: value.created_by_staff ? value.created_by_staff.value : undefined,
                    optician: value.optician ? value.optician.value : undefined,
                    payment_method: paymentType.method,
                    payment_type: paymentType.type.split("-")[0],
                    bank_code: paymentType.type.split("-")[0]
                });
            } else {
                resetOrderDetail({
                    ...value,
                    created_by_staff: value.created_by_staff ? value.created_by_staff.value : undefined,
                    optician: value.optician ? value.optician.value : undefined
                });
            }
        } else {
            toastAction(false, 'Please Select staff or optician!');
        }
    }
    return (
        <Row>
            <Col sm="12">
                <Form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardBody>
                            <Row>
                                <Col>
                                    <strong>Payment status: </strong> {[ "BCA-COMPLETED", "MANDIRI-COMPLETED", "xendit_debit_credit_card" ].includes(paymentType.type) ? "Completed" : "Initiated"}
                                </Col>
                            </Row> 
                            <Row>
                                <Col>
                                    <strong>Payment Amount: </strong> {getNumberFormat(paymentAmount)}
                                </Col>
                            </Row>
                             { (paymentType.type === 'MANDIRI' || paymentType.type === 'BCA' ) &&
                                <Row>
                                <Col>
                                    <strong>VA Account: </strong> {accountNo} <CopyToClipboard text={accountNo}
                                    onCopy={() => toastAction(true, 'Copied!')}>
                                    <span><i className="fas fa-copy"></i> Copy </span> 
                                    </CopyToClipboard>
                                </Col>
                          </Row> }
                            <Row className="mt-4">
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
                            <Row style={{textAlign: 'center'}} className="mt-4">
                                <Col>
                                  { (paymentType.type === 'MANDIRI' || paymentType.type === 'BCA' ) &&
                                    <><span>Please complete the payment in</span><br/>
                                    <strong>23 : 59 : 59 </strong> <br/>
                                    </>
                                    }
                                    <Button color="info" className="mt-3" type="submit" disabled={loading}>Save & Back to Order List</Button>
                                </Col>
                            </Row>
                    </CardBody>
                </Card>
                </Form>
            </Col>       
        </Row> 
    )            
}   