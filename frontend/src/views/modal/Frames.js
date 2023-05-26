import React, {useState} from 'react';
import {
    Row,
    Col,
    CardTitle,
    CardText,
    Card,
    Input,
    CardBody,
    FormGroup,
    Label
} from 'reactstrap';
import FrameDetail from './FrameDetail';
import { getNumberFormat } from '../../utilities/methods';


export default ({ order, loading, frames,  searchFrames, handleSelecteFrame, getOrdersDetail, addCart, addFrameInWishlist}) => {
    const [step, setSteps] = useState(1);
    const {selected_frame, is_loading} = order;
    const {detail} = frames;
        return (
            <Row>
                <Col md="12">
                    {step === 1 &&
                    <Card>
                        <CardBody style={{textAlign: 'center'}}>
                        <Col md="6" sm={{ offset: 3 }}>
                           <div  className="text-dark">
                               <h5>Select Frame</h5>
                                <Input 
                                    type="text" 
                                    placeholder="Search frames"
                                    onKeyUp={e=> {
                                        searchFrames(e.target.value);
                                        if(e.keyCode === 13){
                                            searchFrames(e.target.value);
                                        }
                                    }}
                                />
                            </div>
                            </Col>
                            <Row className="mt-4">
                                {frames.list.map((row, index) => 
                                <Col md="3" key={index} sm={{ offset: frames.list.length === 1 ? 4 :  0}}>
                                <Card body style={{width: '100%', textAlign: 'center', cursor: 'pointer'}} onClick={() => {
                                    handleSelecteFrame(row);
                                    setSteps(2);
                                    getOrdersDetail({id: row.frame_code, product_category:1});
                                }}>
                                    <CardTitle> 
                                    {/* <img src={row.baseUrl+row.image_key_eyeglass} width="50%" alt={row.frame_name}/> */}
                                    <i className="mr-2 mdi mdi-sunglasses"></i>
                                        </CardTitle>
                                    <CardText><Label>
                                        {row.frame_name}
                                    </Label><br/>
                                    {row.sku_code}<br/>
                                    {getNumberFormat(row.retail_price)}<br/>
                                    {row.variant_name}
                                    </CardText>
                                </Card>
                                </Col>
                                )}
                                </Row>
                            <FormGroup>  
                        </FormGroup>
                        </CardBody>
                    </Card>
                    }
                   {step === 2 && <FrameDetail data={selected_frame} setSteps={setSteps} frameDetail={detail} addToCart={addCart} loading={loading || is_loading} addFrameInWishlist={addFrameInWishlist}/> }
                </Col>
            </Row>
        );
    }

