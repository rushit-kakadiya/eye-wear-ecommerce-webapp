import React, {useState} from 'react';
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
import { getNumberFormat } from '../../utilities/methods';


export default ({ data, setSteps, frameDetail, addToCart, loading, addFrameInWishlist}) => {
    const [variant, setVariant] = useState(data.variant_code);
    const [selected, setSelection] = useState({}); 
        const variants = frameDetail ? frameDetail.variants.find(row => row.variant_code === variant) : {};
        
        return (
            <Row>
                <Col md="12">
                    <Card>
                        <CardBody style={{textAlign: 'center'}}>
                        <Col md="6" sm={{ offset: 3 }}>
                                    <CardTitle> 
                                        {variants && variants.base_url ? 
                                            <img src={variants.base_url+variants.frame_default_image_key} width="60%" alt={data.frame_name}/>
                                            : <i class="mr-2 mdi mdi-sunglasses"></i>
                                        }
                                        </CardTitle>
                                    <CardText><Label>
                                        {data.frame_name}
                                    </Label>
                                    <br/>
                                    {getNumberFormat(data.retail_price)}<br/>
                                    </CardText>
                                    <p>
                                    <select className="form-control" sm={{ offset: 3 }} onChange={(e) => setVariant(e.target.value)} defaultValue={data.variant_code}>
                                        {frameDetail && frameDetail.variants && frameDetail.variants.map(row=>
                                            <option key={row.variant_code} value={row.variant_code}>{row.variant_name} - ({row.variant_code})</option>
                                        )}
                                    </select>
                                    </p>
                                    <p>
                                    Size
                                    </p>
                                    <div className="button-group">
                                        {variants && variants.sizeVariants && variants.sizeVariants.map(row => 
                                         <Button key={row.size_code} outline active={row.sku_code === selected.sku_code} color="success" onClick={() => setSelection(row)}>{row.size_label}</Button>
                                        )}
                                    </div>
                            </Col>
                            <div className="button-group mt-2">
                            <Button color="primary" size="lg" onClick={() => setSteps(1)}>Back</Button>
                            <Button className="ml-3" disabled={loading} color="primary" size="lg" onClick={() => addToCart(selected)}>Add to Cart & Next</Button>
                            <Button className="ml-3" disabled={loading || selected.is_wishlisted} color="primary" size="lg" onClick={() => addFrameInWishlist({sku_code: selected.sku_code, product_id: selected.turboly_id})}>{selected.is_wishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}</Button>
                        </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }

