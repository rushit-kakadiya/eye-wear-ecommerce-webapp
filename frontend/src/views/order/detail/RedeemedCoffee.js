import React, {useState} from 'react';
import { Row, Form, FormGroup, Modal, ModalHeader } from 'reactstrap';
//import FeatherIcon from "feather-icons-react";
import StoreList from '../../modal/StoreList';
import { getDateFormat, calculateDates } from '../../../utilities/methods';

export default ({userData, detail, stores, redeemedCoffee}) => {
    const [modal, setModal] =  useState({});
     // Togle modal states
     const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };

    const hadnleStoreSelection = data => {
        redeemedCoffee({store_name: data.label, store_id: data.value})
    }; 
    return(
        <>
        <Row style={{border:'1px solid #ccc'}} className="p-2 mt-3">
            <Form>
                <FormGroup><h5>Free Coffee: </h5></FormGroup>
                <FormGroup><input type="checkbox" disabled={
                    (detail.redeemedCoffee && detail.redeemedCoffee.name) || 
                    (['app', 'website', 'whatsapp'].includes(detail.sales_channel)) ||
                    (detail.sales_channel === 'store' && detail.store ? !detail.store.is_cafe : false) ||
                    (Math.ceil(calculateDates(new Date(detail.created_at))) >= 30)
                    } 
                    checked={modal.store || (detail.redeemedCoffee && detail.redeemedCoffee.name)} onClick={(e) => toggle('store')}/> {detail.redeemedCoffee && detail.redeemedCoffee.name ? 'Free Coffee Redeemed' : 'Redeem Free Coffee'} :</FormGroup>
                {detail.redeemedCoffee && detail.redeemedCoffee.name &&
                    <>
                    <FormGroup>
                        <label className="control-label" htmlFor="email">
                            <strong>Date and Time: </strong>
                        </label>
                        <div className="mb-2">
                        {getDateFormat(detail.redeemedCoffee.created_at, true, true, userData.time_zone)}
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <label className="control-label" htmlFor="email">
                            <strong>Store Name: </strong>
                        </label>
                        <div className="mb-2">
                        {detail.redeemedCoffee.name}
                        </div>
                    </FormGroup>
                    </>
                }
            </Form>
        </Row>
        <Modal
                    isOpen={modal.store}
                    toggle={() => toggle('store')}
                    size="md"
                    >
                <ModalHeader toggle={() => toggle('store')}>Redeem Free Coffee</ModalHeader>
                    <StoreList 
                        history={null} 
                        stores={stores} 
                        hadnleStoreSelection={hadnleStoreSelection.bind(null)} 
                        toggle={toggle.bind(null)}
                        buttonText="Redeem"
                        title="Where is coffee redeemed?"
                    />
                </Modal>
        </>
    )
}
