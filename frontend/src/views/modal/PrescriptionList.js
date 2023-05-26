import React from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Badge
} from 'reactstrap';
import {addDayDate} from '../../utilities/methods';


export default ({list, toggle,setSelectPrescription,handleDelete}) => {
        return (
            <Row>
                <Col sm="12"  >
                    <Card>
                        <CardBody>
                        { list.map(row=>
                        <div  style={{border:'2px solid #ccc', width:'60%'}} className="mb-2 ml-4">
                            <Row className="p-3 pb-0">  
                                <Col sm={5} >
                                    {row.label}
                                </Col>
                                <Col sm={4}>
                                    {
                                    row.is_primary &&
                                    <Badge color="light" className="border border-info" pill>
                                    <i className="fas fa-star text-info"></i> Primary              
                                    </Badge>
                                    }
                                </Col>
                                <Col className="pr-0">
                                    <i className=" fas fa-pencil-alt text-success" onClick={()=>{ setSelectPrescription(row); toggle('prescription')}} ></i>
                                    <i className="fas fa-trash text-danger ml-2" onClick={()=>{ toggle('prescriptionList');handleDelete(row);}}></i>
                                </Col>
                            </Row>
                            <Row className="p-3 ">
                                <Col>
                                    (Right (OD): {row.spheris_r} | Left (OS): {row.spheris_l})
                                </Col>
                            </Row>
                            <Row  className="pl-3 pt-2">
                                <Col>
                                <i class="fas fa-clock text-muted"></i> <span className="ml-1 text-muted">{`${'last updated ' + addDayDate(row.updated_at)}` }</span></Col>
                            </Row>
                        </div>)}
                        <Row className="ml-4">
                            <Col sm={5}>
                            <Button style={{width: '100%'}} color="primary mt-2" type="button" onClick={()=>{ setSelectPrescription({});toggle('prescription')}} >
                                    + Add New Prescription
                            </Button>
                            </Col>
                        </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

