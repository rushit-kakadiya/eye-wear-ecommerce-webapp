import React from 'react';
import {
    Row,
    Col,
    CardTitle,
    CardText,
    Card,
    CardBody,
    Button,
    FormGroup,
    Label
} from 'reactstrap';
import Switch from "react-switch";
import Autocomplete from '../../components/Autocomplete';
import {getNumberFormat} from '../../utilities/methods';

export default ({ data, frameDetail, loading, setLens, setInputValue, addToCartAddon, setLensLeft, lens, lensLeft, setLensSwitch, lensSwitch, editedLens, updateCartAddon, setIs_sunwear, is_sunwear, buttonLable = ''}) => {
    const hadnleSwitch = () => {
        if(!lensSwitch){
            setLensLeft(lens);
        } else {
            setLensLeft(lensLeft);
        }
        setLensSwitch(!lensSwitch);
    }
    const renderItems = (item, isHighlighted) => {
        return (
            <div key={Math.random(10)} style={{ background: isHighlighted ? 'lightgray' : 'white', border: '2px' }}>
                <CardBody>
                    <Row>
                        <Col md="8">
                            <strong>{item.sku_code}</strong> <br/>
                            {item.name+' - '+ item.index_value}
                        </Col>
                        <Col md="3">
                            <strong>{getNumberFormat(item.retail_price)} </strong>
                        </Col>
                    </Row>
                </CardBody>
            </div>
        );
    };

    const getValue = () => {
        if(lensSwitch){
            return lens.sku_code || editedLens[0].sku;
        } else if(editedLens && editedLens.length > 1){
            return editedLens[1].sku;
        } else {
            return '';
        }
    }; 
        return (
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody>
                        <Col md="8" sm={{ offset: 2 }}>
                        <Card body style={{width: '100%', marginLeft: '4.5%'}}>
                                {frameDetail && Object.keys(frameDetail).length > 0 && 
                                    <CardText>
                                        <Row>
                                            <Col md="3" sm={{offset: 1}}>
                                               {frameDetail.images && <img src={frameDetail.base_url+frameDetail.images[0].image_key} width="100%" alt={frameDetail.name}/>} 
                                            </Col>
                                            <Col md="3">
                                                <h6>{frameDetail.frame_name}</h6>
                                            </Col>
                                            <Col md="5">
                                                <h6>{getNumberFormat(frameDetail.retail_price)}</h6>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={{offset: 3}}>
                                                {frameDetail.variant_name} - {frameDetail.frame_size}
                                            </Col>
                                        </Row>
                                    </CardText>
                                }
                                <Row>
                                    <Col md="8" sm={{offset: 1}}>
                                        <h3>RIGHT</h3>
                                        <CardTitle>Lens Type: </CardTitle>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col md="10" sm={{offset: 1}}>
                                        <FormGroup>
                                        <Autocomplete
                                            items={data}
                                            name="lenses"
                                            className="form-control"
                                            label='sku_code'
                                            renderItems={renderItems.bind(null)}
                                            setObject={setLens}
                                            setInputValue={setInputValue}
                                            defaultValue={editedLens ? editedLens[0].sku : ''}
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="8" sm={{offset: 1}}>
                                        <h3>LEFT</h3>
                                            <Label for="InputType-switch" check> <Switch onChange={()=> hadnleSwitch()} checked={!!lensSwitch} height={20} width={40} disabled={!lens.id}/>  Same as Right</Label>
                                        <CardTitle>Lens Type: </CardTitle>
                                    </Col>
                                    </Row>
                                    <Row>
                                    <Col md="10" sm={{offset: 1}}>
                                        <FormGroup>
                                        <Autocomplete
                                            items={data}
                                            name="lenses"
                                            className="form-control"
                                            label='sku_code'
                                            renderItems={renderItems.bind(null)}
                                            setObject={setLensLeft}
                                            setInputValue={setInputValue}
                                            defaultValue={getValue()}
                                            disabled={lensSwitch}
                                        />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col  md="8" sm={{offset: 1}}>
                                    <input type="checkbox" id="is_sunwear" name="is_sunwear" checked={is_sunwear} onChange={()=>setIs_sunwear(!is_sunwear)}/>
                                    <label className="ml-2"> Tinted Lens</label>
                                    </Col>
                                </Row>
                            <Row>
                            <Col md="6" sm={{offset: 1}}>Grand Total: { lensSwitch ? getNumberFormat((lens.retail_price || 0) * 2) : getNumberFormat((lensLeft.retail_price || 0) + (lens.retail_price || 0))}</Col>
                                <Col md="5"><Button disabled={loading || !lens.id} color="primary" size="lg" onClick={() => {
                                    if(editedLens) {
                                        updateCartAddon()
                                    } else {
                                        addToCartAddon()
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

