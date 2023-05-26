import React from 'react';
import {
    Row,
    Col,
    CardTitle,
    CardText,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Button,
    Label
} from 'reactstrap';
import { NavLink } from "react-router-dom";


const AddressList = ({ toggle, list, selectedAddress, getSelectedAddress, setEditedValue, isPreview, handleDelete}) => {
        return (
            <Row>
                <Col sm="12">
                    <Card>
                        <CardBody>
                            {
                                list.map((row,index)=>
                                <Card key={index} style={{width: '100%'}}>
                                <CardHeader style={{backgroundColor:'#fff'}}>
                                    <Row>
                                        <Col sm={10}>
                                        <b>{row.label_address}</b>
                                        </Col>
                                        {isPreview && 
                                        <Col sm={2}>
                                            <i className=" fas fa-pencil-alt text-success" onClick={()=> {setEditedValue(row); toggle('addAddress');}} style={{cursor: "pointer"}}></i>
                                            <i className="fas fa-trash text-danger ml-2" onClick={()=>{toggle('addressList'); handleDelete(row, true)}}  style={{cursor: "pointer"}}></i>
                                            </Col>
                                        }
                                    </Row>
                                    </CardHeader>
                                   <CardText className="ml-4"><Label>
                                      { !isPreview ? selectedAddress && selectedAddress.id === row.id   ?
                                       <>
                                       <input
                                            name="address"
                                            type="radio"
                                            value={row.id}
                                            checked
                                            onChange={() => getSelectedAddress(row)}
                                        /> {row.address} <br/>
                                            {row.province}, {row.city}, {row.country} ({row.zip_code})
                                        </>:
                                        <>
                                        <input
                                            name="address"
                                            type="radio"
                                            value={row.id}
                                            onChange={() => { getSelectedAddress(row); toggle('addressList');}}
                                        /> {row.address} <br/>
                                            {row.province}, {row.city}, {row.country} ({row.zip_code})
                                        </> :
                                        <Row >
                                            <Col sm={12}>
                                            {row.address} 
                                            </Col>
                                            <Col>
                                            {row.province}, {row.city}, {row.country} ({row.zip_code}
                                            </Col>
                                         </Row>
                                         }
                                       
                                </Label>
                                </CardText>
                            {!isPreview &&
                                    <CardTitle className="ml-4 mt-0"> <NavLink to="#" onClick={() => {
                                        setEditedValue(row);
                                        toggle('addAddress');
                                    }} style={{textDecoration: 'underline'}}><i className="mdi mdi-pencil">Edit</i> </NavLink></CardTitle>
                                    }
                                </Card>
                                )
                            }
                            <FormGroup>            
                        <Row>
                        <Col md="6">
                            <Button style={{width: '100%'}} color="primary" onClick={() => {
                                setEditedValue(null);
                                toggle('addAddress')
                            }}>
                                Add New Address
                            </Button>
                        </Col> 
                        </Row>
                        </FormGroup>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

AddressList.defaultProps = {
    isPreview: false
}
    
export default AddressList;    

