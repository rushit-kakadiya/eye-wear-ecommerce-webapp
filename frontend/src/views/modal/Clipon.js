import React, {useState, useEffect} from 'react';
import {
    Row,
    Col,
    CardTitle,
    CardText,
    Card,
    CardBody,
    Label,
    Button
} from 'reactstrap';
import Autocomplete from '../../components/Autocomplete';
import {getNumberFormat} from '../../utilities/methods';

const ClipOn = ({setModal, loading, clipons, addToCartAddon, selectedClipon, setSelectedClipon, updateCartClipon}) => {
    const [selected, setSelection] = useState({});

    const addToCart = () => {
        const payload = {
            addon_product_id: [selected.id],
            addon_item_count: 1,
            cart_id: null,
            addon_product_sku: [selected.sku],
            type: ['clipon']
        }
        if(selectedClipon && selectedClipon.id){
            updateCartClipon(payload);
        } else {
            addToCartAddon(payload);
        }
    };
        const renderItems = (item, isHighlighted) => {
            return (
                <div key={Math.random(10)} style={{ background: isHighlighted ? 'lightgray' : 'white', border: '2px' }}>
                    <CardBody>
                        <Row>
                            <Col md="8" style={{textAlign: 'left'}}>
                                <strong>SKU:- {item.sku}<br/>
                                Name:- Clip-on {item.name} <br/>
                                Color:- {item.color} <br/>
                                Size:- {item.size} </strong> 
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
                        <CardBody style={{textAlign: 'center'}}>
                            <Row>
                            <Col md="6" sm={{ offset: 3 }}>
                                <Autocomplete
                                    items={clipons}
                                    name="name"
                                    className="form-control"
                                    label='sku'
                                    label2='name'
                                    renderItems={renderItems.bind(null)}
                                    setObject={setSelection.bind(null)}
                                    placeholder="Search Clipon by name or sku"
                                    defaultValue={selectedClipon.addon_product_sku}
                                />
                                {/* <div className="button-group">
                                    {['Black', 'Brown'].map(row => 
                                        <Button key={row} outline active={false} color="success" onClick={() => false}>{row}</Button>
                                    )}
                                </div> */}
                            </Col>
                            </Row>
                            {Object.keys(selected).length > 0 &&
                             <Row className="mt-4">
                                <Col md="4" sm={{ offset: 4}}>
                                <Card body style={{width: '100%', textAlign: 'center'}}>
                                    <CardTitle> 
                                    {/* <img src={row.baseUrl+row.image_key_eyeglass} width="50%" alt={row.frame_name}/> */}
                                    <i class="mr-2 mdi mdi-sunglasses"></i>
                                        </CardTitle>
                                    <CardText><Label>
                                        Clip-on {selected.name} - {selected.color} ( {selected.size} )
                                    </Label><br/>
                                    {selected.sku}<br/>
                                    {getNumberFormat(selected.retail_price)}<br/>
                                    </CardText>
                                </Card>
                                </Col>
                            </Row>
                            }
                               
                                <div className="button-group mt-4">
                                    <Button color="primary" size="lg" onClick={() => {
                                        setModal({clipon: false, itemType: true});
                                        setSelectedClipon({});
                                    }}>Back</Button>
                                    <Button disabled={loading || !selected.id} color="primary" size="lg" onClick={() => addToCart()}>{selectedClipon && selectedClipon.id ? 'Update to Cart Clipon' : 'Add to Cart'}</Button>
                                </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
}

ClipOn.defaultProps = {
    selectedClipon: {}
}

export default ClipOn;

