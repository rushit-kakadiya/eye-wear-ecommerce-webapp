import React from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    Button,
    FormGroup,
    Input
} from 'reactstrap';
import Autocomplete from '../../components/Autocomplete';
import {getNumberFormat} from '../../utilities/methods';

export default ({ data, loading, setLens, title, type, category, setInputValue, addToCartContactLens,  lens, editedLens, updateToCartContactLens, contactLensQuantity, setContactLensQuantity, buttonLable = ''}) => {
    const renderItems = (item, isHighlighted) => {
        return (
            <div key={Math.random(10)} style={{ background: isHighlighted ? 'lightgray' : 'white', border: '2px' }}>
                <CardBody>
                    <Row>
                        <Col md="8">
                            <strong>{item.sku}</strong> <br/>
                            {item.name}
                        </Col>
                        <Col md="3">
                            <strong>{getNumberFormat(item.retail_price)} </strong>
                        </Col>
                    </Row>
                </CardBody>
            </div>
        );
    };
        return (
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                        <Col md="8" sm={{ offset: 2 }}>
                        <Card body style={{width: '100%', marginLeft: '4.5%'}}>
                        <Row>
                        <Col md="8" sm={{offset: 1}}>
                        <h3>{title}</h3>
                        </Col>
                        </Row>
                        <Row>
                        <Col md="11" sm={{offset: 1}}>
                            <FormGroup>
                            <Autocomplete
                                items={data}
                                name="lenses"
                                className="form-control"
                                label='sku'
                                renderItems={renderItems.bind(null)}
                                setObject={setLens}
                                setInputValue={setInputValue}
                                defaultValue={editedLens ? editedLens[0].sku : ''}
                            />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row style={{marginLeft:"9%"}}>
                        <Col sm={1}  style={{backgroundColor:"#e9ecef"}} >
                            <i className="fa fa-minus-circle mt-2" aria-hidden="true" onClick={()=> { contactLensQuantity > 1 && setContactLensQuantity(contactLensQuantity-1)}}></i>
                        </Col>
                        <Col sm={3} style={{backgroundColor:"#e9ecef"}}>
                            <Input type="number" value={contactLensQuantity}/>
                        </Col>
                        <Col sm={1}  style={{backgroundColor:"#e9ecef"}} className="pr-4 ml-0" >
                            <i className="fa fa-plus-circle mt-2" aria-hidden="true" onClick={()=>setContactLensQuantity( contactLensQuantity+1)} ></i>
                        </Col>
                    </Row>
                <Row className="mt-2">
                <Col md="6" sm={{offset: 1}}>Grand Total: {  getNumberFormat((lens.retail_price || 0) * contactLensQuantity)}</Col>
                    <Col md="5"><Button disabled={loading} color="primary" size="lg" onClick={() => {
                        if(editedLens) {
                            updateToCartContactLens(type, category)
                        } else {
                            addToCartContactLens(type, category)
                        }
                    }}>{editedLens ? 'Change Lens': buttonLable || 'Add to Cart'}</Button></Col>
                </Row>
                </Card>
                </Col>
            </CardBody>
            </Card>
            </Col>
        </Row>
        );
    }

