import React, {useState, useEffect} from "react";
import {
  Col,
  Row,
  ModalBody,
  Button
} from "reactstrap";
import ToggleButton from 'react-toggle-button';

export default ({ history, toggle, detail = {}, gallery, s3BucketProduction, showFramesOnApp, loading}) => {
    const [showOnApp, setShowOnApp] = useState({optical: false, sunwear: false});
    const opticalImages = gallery.filter(g => g.image_category.toLocaleLowerCase() === 'optical');
    const sunwearImages = gallery.filter(g => g.image_category.toLocaleLowerCase() === 'sunwear');
  
    useEffect(() => {
        setShowOnApp({optical: detail.show_on_app, sunwear: detail.show_sunwear_on_app});
    },[setShowOnApp, detail.show_on_app]);

    const setShowOption = (category, value) => {
        if((opticalImages.length > 0 && category === 'optical') || (sunwearImages.length > 0 && category === 'sunwear')){
            showFramesOnApp({sku_code:detail.sku, category, status: !value}, (status) => {
                if(status){
                    setShowOnApp({...showOnApp, [category]: !value});
                }
            });
        }
    }
  return (
        <ModalBody>
            <Row>
                <Col sm={5} className="mt-2 ml-4">
                    <div className="border">
                    <img  src={ opticalImages.length > 0 ? s3BucketProduction+opticalImages[0].image_key : require('../../assets/images/dummy-image.png')} alt="image" width="100%" />
                    </div>
                    <br/>
                    <Row>
                        <Col sm="4">
                            <ToggleButton
                                value={showOnApp.optical}
                                onToggle={(value) => setShowOption('optical', value)}
                                activeLabel=""
                                inactiveLabel=""
                            />
                        </Col>
                        <Col sm="4"><h5>EyeGlasses</h5></Col><br/>
                        {opticalImages.length === 0 &&
                            <span className="ml-3 text-danger">Image is not availble, Contact Creative/Product team to provide images</span>
                        }
                    </Row>
                </Col>
                <Col sm={5} className="mt-2 ml-4">
                    <div className="border">
                    <img  src={ sunwearImages.length > 0 ? s3BucketProduction+sunwearImages[0].image_key : require('../../assets/images/dummy-image.png')} alt="image" width="100%" />
                    </div><br/>
                    <Row>
                        <Col sm="4">
                            <ToggleButton
                                value={showOnApp.sunwear}
                                onToggle={(value) => setShowOption('sunwear', value)}
                                activeLabel=""
                                inactiveLabel=""
                            />
                        </Col>
                        <Col sm="4"><h5>SunGlasses</h5></Col><br/>
                        {sunwearImages.length === 0 &&
                            <span className="ml-3 text-danger">Image is not availble, Contact Creative/Product team to provide images</span>
                        }
                    </Row>
                </Col>
            </Row>
            <Row className="m-4">
                <Col md="6">
                   <Button style={{ width: '100%'}} disabled={loading} className="btn" outline color="danger" type="button" onClick={() => toggle(false)}>
                        Cancel
                    </Button>
                </Col>
                <Col md="6">
                    <Button style={{width: '100%'}} disabled={loading} color="primary" type="button" onClick={()=> history.push(`/frame/${detail.sku}`)}>
                        Upload
                    </Button>
                </Col> 
                </Row>
        </ModalBody>
  );
};


