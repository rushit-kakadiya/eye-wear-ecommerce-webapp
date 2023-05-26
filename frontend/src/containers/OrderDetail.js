import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink, Modal, ModalHeader } from "reactstrap";
import BackButton from '../views/buttons/BackButton';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import PurchaseSummary from '../views/order/detail/PurchaseSummary';
import CustomerDetail from '../views/order/detail/CustomerDetail';
import PersonInCharge from '../views/order/detail/PersonInCharge';
import DeliveryDetail from '../views/order/detail/DeliveryDetail';
import ProductsDetail from '../views/order/detail/Products';
import Timeline from  '../views/order/detail/Timeline'
import { fetchOrdersDetail, downloadPDF, orderSuccess, cancelOrder, updateOrderStockStore, changeLens,changeOrderStatus, deleteOrder, addDeliveryAddress, checkSicepatAvialiblity, submitSicepatOrder, redeemCoffee } from '../redux/order/action';
import {fetchLenses} from '../redux/lenses/action';
import { fetchOrderHistory } from '../redux/order-history/action';
import {fetchStores} from '../redux/stores/action';
import AddPrescription from '../views/modal/AddPrescription';
import ClaimWarranty from '../views/modal/ClaimWarranty';
import FrameAddon from '../views/modal/FrameAddon';
import ViewOldLens from '../views/modal/ViewOldLens';
import ManuallyDeliveryAddress from '../views/modal/ManuallyDeliveryAddress';
import { checkRoleAccess } from '../utilities/methods';
import { roles_actions } from '../utilities/constants';
import RedeemedCoffee from '../views/order/detail/RedeemedCoffee';

export default (props) => {
    const [modal, setModal] =  useState({});
    const [downloading, setDownload] = useState(false);
    const [prescription, setPrescription] = useState({}); 
    const [lensLeft, setLensLeft] = useState({});   
    const [lens, setLens] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [lensSwitch, setLensSwitch] = useState(false);
    const [is_sunwear, setIs_sunwear] = useState(false);
    const [editLens, setEditLens] = useState({});
    const [oldLens, setOldLens] = useState({});
    const order_no = props.match.params ? props.match.params.id.replace('-', '/') : ''; 
    const dispatch = useDispatch();
    const {order, order_history, stores, lenses, user} = useSelector(state => state);
    const {is_loading, order_detail} = order;
    const userData = user.data;

    useEffect(() => {
        if(order_no){
            dispatch(fetchOrdersDetail({id: order_no}));
            dispatch(fetchOrderHistory({order_no}));            
            dispatch(fetchStores());
            dispatch(fetchLenses());
        }
        return () => dispatch(orderSuccess(null));
    }, [dispatch, order_no]);
    // Generate order pdf
    const generatePDF = () => {
        setDownload(true);
        dispatch(downloadPDF({order_no})).then(res=> {
            setDownload(false);
            res.map(row => window.open(row.href, 'Download'));
        });
    }
    
    // Togle modal states
    const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };

    //Cancel Order
    const orderCancel = () => {
        confirmAlert({
            title: 'Cancel Payment!',
            message: 'Are you sure to cancel Order Payment!',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                dispatch(cancelOrder({order_no}));
                }
            },
            {
                label: 'No'
            }
            ]
        });
    }
    
    // Change Store
    const updateStockStore = (row) => {
        dispatch(updateOrderStockStore({
            order_no,
            stock_store_id:row.toString()
        }));
    }
    
    //update order status
    const updateOrderStatus = (status) => {
        if(status !== order_detail.order_status)
        {
            if( status === 'order_cancelled'){
                confirmAlert({
                    title: 'Cancel Order!',
                    message: 'Are you sure to cancel this Order!',
                    buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            dispatch(changeOrderStatus({order_no, order_status:status}))
                        }
                    },
                    {
                        label: 'No'
                    }
                    ]
                    });
            } else {
            dispatch(changeOrderStatus({order_no, order_status:status}));
            }
        }
    }
    // Add cart addon
    const updateCartAddon = () => {
        setModal({...modal, modalLoading: true});
        const payload = {
            old_lens_sku:editLens && editLens.lens.sku_code,
            order_no: order_no,
            order_item_id: editLens && editLens.frame_id ,
            new_lens_sku: lensSwitch && Object.values(lensLeft).length > 0 ? [lens.sku_code] : [lens.sku_code, lensLeft.sku_code],
            type:  lensSwitch && Object.values(lensLeft).length > 0 ? ['both'] : ['right', 'left'],
            is_sunwear,
            addon_item_count:  lensSwitch && Object.values(lensLeft).length > 0 ? '2' : '1',
            is_update: editLens && editLens.lens.is_lens_change  
        }
        dispatch(changeLens(payload)).then(() => {
            dispatch(fetchOrdersDetail({id: order_no}));
            setModal({...modal, frameAddon: false, modalLoading: false});
            setLensSwitch(false);
            setLensLeft({});
            setLens({});
        }).catch(() => setModal({...modal, modalLoading: false}));
    }

    const deleteOrderpemanently = () => {
        confirmAlert({
        title: 'Delete Order!',
        message: 'Are you sure to Delete this Order!',
        buttons: [
        {
            label: 'Yes',
            onClick: () => {
                dispatch(deleteOrder(props.match.params.id)).then(()=>props.history.push('/order'))
                }
        },
        {
            label: 'No'
        }
        ]
        });
    }

    const addManuallyDeliveryAddress = (data) => {
        const params = {...data, order_no, airway_bill_no: data.airway_bill_no || ""}
        dispatch(addDeliveryAddress(params)).then(() => toggle('inputDeliveryManually') );
    }
    
    const validateSicepatAvialiblity = () => {
        dispatch(checkSicepatAvialiblity({zip_code: order_detail.addressDetails ? order_detail.addressDetails.zip_code : ''}))
        .then(() => dispatch(submitSicepatOrder({order_no})))
        .catch(error => console.log("error", error));
    }

     //Select Payment methods
     const selectPaymentMethod =  (data) => {
        dispatch(orderSuccess(data));
        props.history.push('/order/success');
    };

    //Redeem free coffee
    const redeemedCoffee = (data) => {
        dispatch(redeemCoffee({order_no, store_name: data.store_name, store_id: data.store_id}));
    }

    if(is_loading) return(<div style={{textAlign: 'center'}} className="mt-5"><h5>loading ...</h5></div>)
    if(!order_detail) return(<div style={{textAlign: 'center'}} className="mt-5"><h3>Order Not Found!</h3></div>)
    return(
        <Row>
            <Col md="12">
                <Card>
                    <CardBody>
                        <Row> 
                            <Col md="5">
                                <h6> <BackButton  history={props.history} path="/order"/> Order ID: {order_no}</h6> 
                            </Col>
                            <Col md="3">
                                <Nav>
                                    <NavItem>
                                        <NavLink disabled={downloading} href="#" active onClick={() => generatePDF()} style={{textDecoration: 'overline'}}>
                                            Download PDF
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                            { checkRoleAccess(userData.accessRole, userData.permissions, 'order', roles_actions.is_delete) &&
                            <Col >
                                <Nav >
                                    <NavItem>
                                        <NavLink href="#" className="text-danger" active onClick={() => deleteOrderpemanently()} style={{textDecoration: 'underline'}}>                                           
                                            <i className="fa fa-trash" aria-hidden="true"></i><span className="ml-2">Delete order permanently</span> 
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>}
                            {/* <Col>
                                <Nav>
                                    <NavItem>
                                        <NavLink href="#" active onClick={() => false} style={{textDecoration: 'overline'}}>
                                            Print Delivery Detail
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col> */}
                        </Row>
                        <Row> 
                            <Col md="7" sm={{ offset: 1 }}>
                                <PurchaseSummary 
                                    detail={order_detail}
                                    stores={stores}
                                    orderCancel={orderCancel.bind(null)}
                                    updateStockStore={updateStockStore.bind(null)}
                                    userData={user.data}
                                    selectPaymentMethod={selectPaymentMethod.bind(null)}
                                />
                                <DeliveryDetail 
                                    detail={order_detail} 
                                    updateOrderStatus={updateOrderStatus.bind(null)}
                                    toggle={toggle.bind(null)}
                                    validateSicepatAvialiblity={validateSicepatAvialiblity.bind(null)}
                                    userData={user.data}
                                />
                                <ProductsDetail 
                                    cart={order_detail.frames}
                                    lensesOnly={order_detail.addOnsOnly}
                                    contactLens={order_detail.orderItemContactLens}
                                    otherProduct={order_detail.orderItemOthers}
                                    order={order} 
                                    toggle={toggle.bind(null)}
                                    setPrescription={setPrescription.bind(null)}
                                    clipons={order_detail.clipons}
                                    setEditLens={setEditLens.bind(null)}
                                    setOldLens={setOldLens.bind(null)}
                                    userData={user.data}
                                />
                                {order_history.length > 0 &&
                                <Timeline orderHistory={order_history} userData={user.data}/>
                                }
                            </Col>
                            <Col md="3" className="ml-4">
                                <CustomerDetail detail={{...order_detail.user, email: order_detail.email_id}} history={props.history}/>
                                <PersonInCharge detail={order_detail}/>
                                {order_detail.frames && order_detail.frames.length > 0 && <RedeemedCoffee detail={order_detail} stores={stores} redeemedCoffee={redeemedCoffee.bind(null)} userData={user.data}/>}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                {/* prescription Modal */}
                <Modal
                    isOpen={modal.prescription}
                    toggle={() => toggle('prescription')}
                    size="xl"
                >
                    <ModalHeader toggle={() => toggle('prescription')}> Add Prescription</ModalHeader>
                    <AddPrescription 
                        selectedPrescription={{
                            label: prescription.prescription_label,
                            spheris_l: prescription.prescription_spheris_l,
                            spheris_r: prescription.prescription_spheris_r,
                            cylinder_l: prescription.prescription_cylinder_l,
                            cylinder_r: prescription.prescription_cylinder_r,
                            axis_l: prescription.prescription_axis_l,
                            axis_r: prescription.prescription_axis_r,
                            addition_l: prescription.prescription_addition_l,
                            addition_r: prescription.prescription_addition_l,
                            pupilary_distance: prescription.prescription_pupilary_distance
                        }}
                        isPreview={true}
                    />
                </Modal>
             {/* claim warranty modal*/}
                <Modal
                isOpen={modal.claimWarranty}
                toggle={() => toggle('claimWarranty')}
                size="l"
                >
                    <ModalHeader toggle={() => toggle('claimWarranty')}> Claim Warranty</ModalHeader>
                    <ClaimWarranty/>
                </Modal>
                        
                <Modal
                    isOpen={modal.frameAddon}
                    toggle={() => toggle('frameAddon')}
                    size="xl"
                >
                    <ModalHeader toggle={() => toggle('frameAddon')}></ModalHeader>
                    <FrameAddon 
                        data={lenses} 
                        toggle={() => toggle('frameAddon')} 
                        loading={modal.modalLoading}
                        setLens={setLens.bind(null)}
                        lens={lens}
                        lensLeft={lensLeft}
                        setInputValue={setInputValue.bind(null)}
                        inputValue={inputValue}
                        addToCartAddon={updateCartAddon.bind(null)}
                        setLensLeft={setLensLeft.bind(null)}
                        setLensSwitch={setLensSwitch.bind(null)}
                        lensSwitch={lensSwitch}
                        setIs_sunwear={setIs_sunwear.bind(null)}
                        is_sunwear={is_sunwear}
                        buttonLable={'Update to Cart'}
                    />
                    </Modal>
                    <Modal
                    isOpen={modal.viewOldLens}
                    toggle={() => toggle('viewOldLens')}
                    size="lg"
                    >
                    <ModalHeader toggle={() => toggle('viewOldLens')}>Old Lens</ModalHeader>
                        <ViewOldLens lense={oldLens || []}/>
                    </Modal>

                    <Modal
                    isOpen={modal.inputDeliveryManually}
                    toggle={() => toggle('inputDeliveryManually')}
                    size="md"
                    >
                    <ModalHeader toggle={() => toggle('inputDeliveryManually')}>Delivery Frames</ModalHeader>
                        <ManuallyDeliveryAddress
                        addManuallyDeliveryAddress={addManuallyDeliveryAddress.bind(null)}
                        />
                    </Modal>
            </Col>
        </Row>   
            
    )
}