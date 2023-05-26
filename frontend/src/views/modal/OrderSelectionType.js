import React from 'react';
import {
    Row,
    Col,
    CardTitle,
    Card,
    CardBody
} from 'reactstrap';

export default ({toggle, setSku, setEditedLens, setClipon, getClipon}) => {
        return (
            <>
            <Row className="pl-4 pr-4 pt-4">
                <Col md="6">
                    <Card style={{alignItems: 'center', cursor: 'pointer'}} onClick={()  => toggle({itemType: false, frames: true})}>
                        <CardBody>
                            <img width="100%" src={require('../../assets/images/frame.png')} alt="frame"/>
                        </CardBody>
                        <CardTitle>Frame</CardTitle>
                    </Card>
                </Col> 
                <Col md="6">
                    <Card style={{alignItems: 'center', cursor: 'pointer'}} onClick={()  => {
                        setSku(null);
                        toggle({itemType: false, frameAddon: true});
                        setEditedLens(null);
                        setClipon(false);
                    }}>
                        <CardBody>
                            <img width="100%" src={require('../../assets/images/lenses.png')} alt="lense"/>
                        </CardBody>
                        <CardTitle>Lens Only</CardTitle>
                    </Card>
                </Col> 
            </Row>
            <Row  className="pl-4 pr-4">
                <Col md="6">
                    <Card style={{alignItems: 'center', cursor: 'pointer'}} onClick={()  => {
                        setSku(null);
                        toggle({itemType: false, clipon: true});
                        setEditedLens(null);
                        getClipon();
                    }}>
                        <CardBody>
                            <img width="100%" src={require('../../assets/images/clipon.png')} alt="lense"/>
                        </CardBody>
                        <CardTitle>Clip On</CardTitle>
                    </Card>
                </Col> 
                <Col md="6">
                    <Card style={{alignItems: 'center', cursor: 'pointer'}} onClick={()  => {
                        setSku(null);
                        toggle({itemType: false, contactLens: true});
                        setEditedLens(null);
                        getClipon();
                    }}>
                        <CardBody>
                            <img width="100%" src={require('../../assets/images/contact-lens.jpeg')} alt="lense"/>
                        </CardBody>
                        <CardTitle>Contact Lens</CardTitle>
                    </Card>
                </Col> 
            </Row>  
            <Row  className="pl-4 pr-4">
                <Col>
                <Card style={{alignItems: 'center', cursor: 'pointer'}} onClick={()=>
                        toggle({itemType: false, otherProduct: true})}>     
                        <CardBody>                   
                             <h3 style={{marginLeft:"30%"}}>Other</h3>
                            <CardTitle>(Merch, Contact lens solution, etc)</CardTitle>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            </>
        );
    }

