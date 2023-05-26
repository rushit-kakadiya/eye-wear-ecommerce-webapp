import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import AddOrder from '../views/order/AddOrder';
import AddUser from '../views/modal/AddUser';
import AddAddress from '../views/modal/AddAddress';
import AddressList from '../views/modal/AddressList';
import Frames from '../views/modal/Frames';
import FrameAddon from '../views/modal/FrameAddon';
import OrderSelectionType from '../views/modal/OrderSelectionType';
import {addUser, selectUserAddress, setDeliveryType, selectFrame, addDraftOrder, createOrder, pickUpStore, addWishlist, setHtoAppointment, appliedDiscountVoucher, checkDiscountVoucher, fetchPackaging} from '../redux/order/action';
import {fetchUser, fetchUserAddress, addUserAddress, updateUserAddress} from  '../redux/user/action';
import {fetchFrames, fetchOrdersDetail} from '../redux/frames/action';
import {fetchCart, addToCart, removeCart, addCartAddon, removeCartAddon, editCartAddon, addPrescriptionToCart, itemWarranty, applyDiscount, deleteDiscount, emptyCart, updateCartPackages} from '../redux/cart/action';
import {fetchLenses} from '../redux/lenses/action';
import {discountCategoryList, fecthDiscountList, getVoucherList} from '../redux/discount/action';
import AddPrescription from '../views/modal/AddPrescription';
import Clipon from '../views/modal/Clipon';
import Discount from '../views/modal/Discount';
import DiscountList from '../views/modal/DiscountList';
import StoreListModal from "../views/modal/StoreList";
import ContactLens from '../views/modal/ContactLens';
import {addPrescription, fetchPrescription, updatePrescription} from '../redux/prescription/action';
import { toastAction } from '../redux/ToastActions';
import {fetchClipOns} from '../redux/clipons/action';
import {fetchContactLenses} from '../redux/contact-lens/action';
import {fetchOtherProduct} from '../redux/other-product/action';
import {fetchStores} from '../redux/stores/action';
import {avilabilty_type} from '../utilities/constants';

export default (props) => {
    const [modal, setModal] =  useState({});
    const [discountItem, setDiscountItem] =  useState({});
    const [discountPrice, setDiscountPrice] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [checked, setChecked] = useState('amount');
    const [discoutNote, setDiscountNote] = useState('');
    const [editedAddressValue, setEditedValue] = useState({});
    const [sku, setSku] = useState(null);
    const [editedLens, setEditedLens] = useState(null);
    const [lens, setLens] = useState({});
    const [lensLeft, setLensLeft] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [lensSwitch, setLensSwitch] = useState(false);
    const [selectedPrescription, selectPrescription] = useState({});
    const [isPreview, setPreview] = useState(false);
    const [is_sunwear, setIs_sunwear] = useState(false);
    const [isClipon, setClipon] = useState(false);
    const [selectedClipon, setSelectedClipon] = useState({});
    const [discountCategory, setDiscountCategory] = useState('');
    const [discountSubCategory, setDiscountSubCategory] = useState('');
    const [search, setSearch] = useState('');
    const [contactLensQuantity, setContactLensQuantity] = useState(1);

    const dispatch = useDispatch();
    const {order, user, frames, cart, lenses, prescription, stores, clipons, discount, contact_lens, other_product} = useSelector(state => state);
    const cartDetail = cart.data ? cart.data.list.find(row => row.sku_code === sku) : {};
   
    // Use Effects set is_sunwear for addon
    useEffect(() => {
        if(cartDetail && cartDetail.addon_item && cartDetail.addon_item.length){
            setIs_sunwear(cartDetail.addon_item[0].is_sunwear);
        }
    },[cartDetail]);
    // Use Effects function for component
    useEffect(() => {
        if(order.selected_user){
            dispatch(fetchUserAddress({user_id: order.selected_user.id}));
            dispatch(fetchLenses());
            dispatch(fetchContactLenses());
            dispatch(fetchOtherProduct());
            dispatch(fetchCart({user_id: order.selected_user.id}));
            const orderDetail = order.list.find(row => row.user_id === order.selected_user.id && !row.order_status);
            if(orderDetail && !order.selected_user_address){
                const address = user.users_address.find(row => row.id === orderDetail.address_id);
                dispatch(selectUserAddress(address || null));
            }
            dispatch(fetchPrescription({user_id: order.selected_user.id}));
            dispatch(discountCategoryList());
        }
        return() => { 
                dispatch(emptyCart());
                dispatch(setHtoAppointment(null));
            };
    },[dispatch, order.selected_user]);
   
    // Use effect for prescription
    useEffect(() => {
        if(selectedPrescription && selectedPrescription.id){
            dispatch(addPrescriptionToCart({
                id: selectedPrescription.id,
                cart_id: selectedPrescription.cart_id,
                type: selectedPrescription.type
            }));
        }
    }, [dispatch, selectedPrescription]);

    //use Effect for discount list
    useEffect(()=>{
        if(search || discountCategory || discountSubCategory)
        {
        dispatch(fecthDiscountList({status:'active', search, page:1, limit:100, discount_category:discountCategory, discount_sub_category:discountSubCategory}))
        }
    },[search, discountCategory, discountSubCategory])

    // UseEffetcs for fetching stores
    useEffect(()  => {
        dispatch(fetchStores());
        dispatch(fetchPackaging());
    }, [dispatch]);

    // Set get clipons
    const getClipons = () =>  {
        setClipon(!isClipon);
        dispatch(fetchClipOns());
    };

    // Search users
    const searchUser = text => {
        dispatch(fetchUser({text}));
    };
    // Togle modal states
    const toggle = (key) => {
        setModal({...modal, [key]: !modal[key]});
    };

    //Apply discount 
    const setDiscount = (type, id, price) => {
       setDiscountItem({...discountItem, type, id, price});
    } 

    const applyDicountValue = () =>{
            dispatch(applyDiscount({
                id:discountItem.id, 
                type:discountItem.type, 
                discount_amount:totalDiscount,
                discount_type:checked === 'amount' ? 1 : 2,
                discount_note:discoutNote || '' 
                }))
                setDiscountNote('');
                toggle('discount')
    }
    // Add user in order
    const addUserInOrder = (params) => {
        dispatch(addUser(params))
        .then(() => {
            dispatch(selectUserAddress(null));
            toggle('addUser');
        });
    };
    // Add address of selected user in order
    const addSelectedUserAddress = (params) => {
        if(params.id){
            dispatch(updateUserAddress({email: order.selected_user.email, address_details: params.address, ...params}))
            .then(() => toggle('addAddress'));
        } else {
            delete params.id;
            dispatch(addUserAddress({user_id: order.selected_user.id, email: order.selected_user.email, address_details: params.address, ...params}))
            .then(() => toggle('addAddress'));
        }        
    };
    // Get user address
    const getSelectedAddress = address => {
        dispatch(selectUserAddress(address));
    }
    // Set order type to be create
    const setOrderDeliveryType = type => {
        if(type === 'store') {
            dispatch(selectUserAddress(null));
        }
        dispatch(setDeliveryType(type));
    }
    // Search frames
    const searchFrames = text => {
        dispatch(fetchFrames({text}));
    };
    // Hanlde frame selection
    const handleSelecteFrame = data => {
        dispatch(selectFrame(data));
    };
    // Get orders detail
    const getOrdersDetail = (data) => {
        const payload = data;
        if(order.delivery_type === 'store' && order.selected_store){
            payload.store_id = order.selected_store && order.selected_store['value'];
        }
        dispatch(fetchOrdersDetail(payload));
    }
    // Add frame into cart
    const addCart = (data) => {
        setSku(data.sku_code);
        dispatch(addToCart({
            user_id: order.selected_user.id,
            product_id: data.turboly_id,
            item_count: 1,
            sku_code: data.sku_code
        })).then(() => {
            setModal({...modal, frames: !modal.frames, frameAddon: !modal.frameAddon});
        })
    }
    // Delete frame from cart
    const deleteCart = (data) => {
        dispatch(removeCart({...data, user_id: order.selected_user.id}));
    }
    // Delete Addon 
    const deleteCartAddon = (data) => {
        dispatch(removeCartAddon({id: data, user_id: order.selected_user.id}));
    }

    // process to create new order
    const hadnleStoreSelection  = (data) => {
        dispatch(pickUpStore(data));
    }

    // Create draft orders
    const createDraftOrder = () => {
        if(order.selected_user){
            dispatch(addDraftOrder({
                user_id: order.selected_user.id,
                address_id: order.selected_user_address ? order.selected_user_address.id : null,
                store_id: order.selected_store ? order.selected_store.value.toString() : null
            }));
        }
    }

    // Add cart addon
    const addToCartAddon = (values = null) => {
        console.log(values)
        let payload = {
            addon_product_id: [lens.id],
            addon_item_count: 2,
            cart_id: cartDetail ? cartDetail['id'] : null,
            addon_product_sku: [lens.sku_code],
            user_id: order.selected_user.id,
            type: ['both'],
            is_sunwear
        };
        
        if(isClipon && values){
            payload = {
                ...values,
                user_id: order.selected_user.id,
                category:2
            };
        } else if(!lensSwitch && Object.values(lensLeft).length > 0){
            payload = {
                addon_product_id: [lens.id, lensLeft.id],
                addon_item_count: 1,
                cart_id: cartDetail ? cartDetail['id'] : null,
                addon_product_sku: [lens.sku_code, lensLeft.sku_code],
                user_id: order.selected_user.id,
                type: lensSwitch && Object.values(lensLeft).length === 1 ? ['both'] : ['right', 'left'],
                is_sunwear
            }
        }
        dispatch(addCartAddon(payload)).then((res) => {
            if(res){
                setModal({...modal, frameAddon: false, clipon: false});
                setLensSwitch(false);
            }
        })
    }
    // Update addon/lens
    const updateCartAddon = () => {
        let payload = {
            addon_product_id: [lens.id],
            addon_item_count: 2,
            cart_id: cartDetail ? cartDetail['id'] : null,
            addon_product_sku: [lens.sku_code],
            user_id: order.selected_user.id,
            type: ['both'],
            is_sunwear
        };
        if(!lensSwitch && Object.values(lensLeft).length > 0){
            payload = {
                addon_product_id: [lens.id, lensLeft.id],
                addon_item_count: 1,
                cart_id: cartDetail ? cartDetail['id'] : null,
                addon_product_sku: [lens.sku_code, lensLeft.sku_code],
                user_id: order.selected_user.id,
                type: ['right', 'left'],
                is_sunwear
            }
        }

        dispatch(editCartAddon({
            ...payload,
            current_addon_product_sku: editedLens.map(row => row.addon_product_sku)
        })).then(() => {
            setModal({...modal, frameAddon: !modal.frameAddon});
            setEditedLens(null);
        });
    }
    // Update cart clipon
    const updateCartClipon = (values) => {
        const payload = {
            ...values,
            category: 2,
            user_id: order.selected_user.id
        };

        dispatch(editCartAddon({
            ...payload,
            current_addon_product_sku: [selectedClipon.addon_product_sku]
        })).then(() => {
            setModal({...modal, clipon: false});
            setEditedLens(null);
        });
    }
    // Create user prescription
    const createPrescription = (params) => {
        if(selectedPrescription && selectedPrescription.id) {
            dispatch(updatePrescription({...params, id: selectedPrescription.id, user_id: order.selected_user.id})).then(() => {
                selectPrescription({...selectedPrescription, id: selectedPrescription.id});
                toggle('prescription'); 
            });
        } else {
            dispatch(addPrescription({...params, user_id: order.selected_user.id})).then((res) => {
                selectPrescription({...selectedPrescription, id: res.id});
                toggle('prescription'); 
            });
        }
    }

    // add contact lens in cart
    const addToCartContactLens = (type, category) => {
        let payload = {
            addon_product_id: [lens.id],
            addon_item_count: contactLensQuantity,
            cart_id: null,
            addon_product_sku: [lens.sku],
            user_id: order.selected_user.id,
            type: [type],
            category
        };
       dispatch(addCartAddon(payload)).then((res) => {
            if(res){
                setModal({...modal, frameAddon: false, contactLens: false,  otherProduct: false});
                setContactLensQuantity(1)
            }
        })
    }
    
    // update contact lens in cart
    const updateToCartContactLens = (type, category) => {
        let payload = {
            addon_product_id: [lens.id],
            addon_item_count: contactLensQuantity,
            cart_id: null,
            addon_product_sku: [lens.sku],
            user_id: order.selected_user.id,
            type: [type],
            category
        };
        dispatch(editCartAddon({
            ...payload,
            current_addon_product_sku: editedLens.map(row => row.addon_product_sku)
        })).then(() => {
            setModal({...modal,  contactLens: false,  otherProduct: false});
            setEditedLens(null);
        });
    }
    
    

    // Make user order
    const makeOrder = () => {
        const payload = {
            fulfillment_type: order.delivery_type === 'store' ? 0 : 1,
            user_id: order.selected_user.id,
            sales_channel: order.sales_channel,
            hto_appointment_no: order.hto_appointment_no,
            voucher_id: order.applied_discount_voucher ? order.applied_discount_voucher.id : undefined,
            voucher_code: order.applied_discount_voucher ? order.applied_discount_voucher.voucher_code : undefined,
            store_id: user.data.store_id ? Number(user.data.store_id) : undefined
        };
        if(order.selected_store && order.selected_store['value']){
            payload.store_id = order.selected_store['value'];
        }
        if(order.delivery_type === 'store' && order.pick_up_store_id && order.pick_up_store_id['value']){
            payload.pick_up_store_id = order.pick_up_store_id['value'];
            payload.store_id = payload.store_id || order.pick_up_store_id['value'];
        } else {
            payload.address_id = order.selected_user_address ? order.selected_user_address['id'] : undefined;
        }        
        if(payload.pick_up_store_id || payload.address_id || order.selected_store){
            dispatch(createOrder({...payload, name: order.selected_user.name})).then(() => {
                props.history.push('/order/success');
            });
        } else {
            toastAction(false, 'Please Select user address or store!');
        }

    }

    // Set Order item warranty
    const setItemWarranty = (data) => {
        dispatch(itemWarranty(data));
    }

    //Remove discount 
    const removeDiscount = (type, id) => {
            confirmAlert({
            title: 'Remove Discount',
            message:  'Are you sure to want remove discount on this Item!',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    dispatch(deleteDiscount({type, id}))
                }
            },
            {
                label: 'No'
            }
            ]
        });
    };
    
    //Add frame into wishlist
    const addFrameInWishlist = (data) => {
        dispatch(addWishlist({...data, user_id: order.selected_user.id}));
    };

    //Set Packaging for order
    const setPackaging = (data) => {
        dispatch(updateCartPackages(data));
    };

    //apply discount on order
    const applyDiscountCoupon = (row) => {
       const voucher = avilabilty_type.find(v => v.name === order.sales_channel);
       if(voucher && !row.avilabilty_type.includes(voucher.code)) {
            toastAction(false, 'This voucher is not available for '+order.sales_channel);
        } else {
            dispatch(checkDiscountVoucher({user_id:order.selected_user.id,voucher_id:row.id})).then(()=> {
                dispatch(appliedDiscountVoucher(row))
                toggle('discountList');
            });
        }
    }

    //remove discount on order
    const removeDiscountCoupon = () => {
        confirmAlert({
            title: 'Remove Discount',
            message:  'Are you sure to want remove discount on this Order!',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    dispatch(appliedDiscountVoucher(null))
                }
            },
            {
                label: 'No'
            }
            ]
        });
    }


    return(
     <>
        <AddOrder 
                {...props} 
                order={order} 
                user={user}
                toggle={toggle.bind(null)}
                setDeliveryType={setOrderDeliveryType.bind(null)}
                cart={cart}
                setSku={setSku}
                deleteCart={deleteCart.bind(null)}
                createDraftOrder={createDraftOrder.bind(null)}
                setEditedLens={setEditedLens.bind(null)}
                deleteCartAddon={deleteCartAddon.bind(null)}
                setLens={setLens.bind(null)}
                setLensLeft={setLensLeft.bind(null)}
                setLensSwitch={setLensSwitch.bind(null)}
                prescription={prescription}
                selectPrescription={selectPrescription.bind(null)}
                setPreview={setPreview.bind(null)}
                makeOrder={makeOrder.bind(null)}
                setItemWarranty={setItemWarranty.bind(null)}
                setDiscount={setDiscount.bind(null)}
                dispatch={dispatch}
                pickUpStore={pickUpStore.bind(null)}
                removeDiscount={removeDiscount.bind(null)}
                setSelectedClipon={setSelectedClipon.bind(null)}
                setPackaging={setPackaging.bind(this)}
                removeDiscountCoupon={removeDiscountCoupon.bind(null)}
                setContactLensQuantity={setContactLensQuantity.bind(null)}
        />
        <Modal
            isOpen={modal.addUser}
            toggle={() => toggle('addUser')}
            size="md"
        >
            <ModalHeader toggle={() => toggle('addUser')}>Add Customer</ModalHeader>
            <AddUser userList={user.list} toggle={() => toggle('addUser')} addUserInOrder={addUserInOrder.bind(null)} searchUser={searchUser.bind(null)} loading={order.is_loading}/>
        </Modal>
        <Modal
            isOpen={modal.addAddress}
            toggle={() => toggle('addAddress')}
            size="md"
        >
            <ModalHeader toggle={() => toggle('addAddress')}>{editedAddressValue && editedAddressValue.id ? 'Edit Address' : 'Add Address' }</ModalHeader>
            <AddAddress toggle={() => toggle('addAddress')} addUserAddress={addSelectedUserAddress.bind(null)} loading={user.is_loading} editedAddressValue={editedAddressValue}/>
        </Modal>
        <Modal
            isOpen={modal.addressList}
            toggle={() => toggle('addressList')}
            size="md"
        >
            <ModalHeader toggle={() => toggle('addressList')}>User Address</ModalHeader>
            <AddressList toggle={toggle} list={user.users_address} selectedAddress={order.selected_user_address} getSelectedAddress={getSelectedAddress.bind(null)} setEditedValue={setEditedValue}/>
        </Modal>
        <Modal
            isOpen={modal.frames}
            toggle={() => toggle('frames')}
            size="xl"
        >
            <ModalHeader toggle={() => toggle('frames')}></ModalHeader>
            <Frames 
                order={order} 
                frames={frames} 
                searchFrames={searchFrames.bind(null)} 
                handleSelecteFrame={handleSelecteFrame} 
                getOrdersDetail={getOrdersDetail.bind(null)} 
                loading={cart.is_loading} 
                addCart={addCart.bind(null)}
                addFrameInWishlist={addFrameInWishlist.bind(this)}
            />
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
                frameDetail={cartDetail} 
                loading={cart.is_loading}
                setLens={setLens.bind(null)}
                lens={lens}
                lensLeft={lensLeft}
                setInputValue={setInputValue.bind(null)}
                inputValue={inputValue}
                addToCartAddon={addToCartAddon.bind(null)}
                setLensLeft={setLensLeft.bind(null)}
                setLensSwitch={setLensSwitch.bind(null)}
                lensSwitch={lensSwitch}
                editedLens={editedLens}
                updateCartAddon={updateCartAddon.bind(null)}
                setIs_sunwear={setIs_sunwear.bind(null)}
                is_sunwear={is_sunwear}
            />
        </Modal>
        <Modal
            isOpen={modal.itemType}
            toggle={() => toggle('itemType')}
            size="xl"
        >
            <ModalHeader toggle={() => toggle('itemType')}> Select Item Type</ModalHeader>
            <OrderSelectionType toggle={setModal.bind(null)} setSku={setSku.bind(null)} setEditedLens={setEditedLens.bind(null)} getClipon={getClipons.bind(null)} setClipon={setClipon.bind(null)}/>
        </Modal>
        <Modal
            isOpen={modal.prescription}
            toggle={() => toggle('prescription')}
            size="xl"
        >
            <ModalHeader toggle={() => toggle('prescription')}> Add Prescription</ModalHeader>
            <AddPrescription 
                loading={prescription.is_loading}
                addUpdataPrescription={createPrescription.bind(null)}
                selectedPrescription={selectedPrescription}
                isPreview={isPreview}
            />
        </Modal>
        <Modal
            isOpen={modal.clipon}
            toggle={() => toggle('clipon')}
            size="xl"
        >
            <ModalHeader toggle={() => { 
                toggle('clipon'); 
                setClipon(!isClipon); 
            }}> Clip On</ModalHeader>
            <Clipon 
                loading={cart.is_loading}
                setModal={setModal.bind(null)} 
                clipons={clipons}
                addToCartAddon={addToCartAddon.bind(null)}
                selectedClipon={selectedClipon}
                setSelectedClipon={setSelectedClipon.bind(null)}
                updateCartClipon={updateCartClipon.bind(null)}
            />
        </Modal>
        <Modal
            isOpen={modal.discount}
            toggle={() => toggle('discount')}
            size="md"
            onClosed={()=>setChecked('amount')}
        >
        <ModalHeader toggle={() => toggle('discount')}>Input Discount</ModalHeader>
        <Discount 
            toggle={setModal.bind(null)} 
            loading={cart.is_loading}
            discountItem={discountItem}
            setModal={setModal.bind(null)} 
            discountPrice={discountPrice}
            setDiscountPrice={setDiscountPrice.bind(null)}
            applyDicountValue={applyDicountValue.bind(null)}
            checked={checked}
            setChecked={setChecked.bind(null)}
            setDiscountNote={setDiscountNote.bind(null)}
            discoutNote={discoutNote}
            setTotalDiscount={setTotalDiscount.bind(null)}
        />
        </Modal>
        <Modal
            isOpen={modal.store}
            toggle={()=>toggle('store')}
            className={null}
            size="md"
        >
        <ModalHeader toggle={()=>toggle('store')}>Select Store</ModalHeader>
        <StoreListModal 
            history={props.history} 
            stores={stores} 
            hadnleStoreSelection={hadnleStoreSelection}
            toggle={toggle.bind(null)}
            storeId={user.data.store_id || ''}
        />
        </Modal>
        <Modal
            isOpen={modal.discountList}
            toggle={() => toggle('discountList')}
            size="lg"
            onClosed={()=>{ setSearch(''); 
                            setDiscountCategory(''); 
                            setDiscountSubCategory('');
                            dispatch(getVoucherList({list:[], total_rows:0}));
                        }}
            scrollable={true}
        >
        <ModalHeader toggle={() => toggle('discountList')}>Select Discount</ModalHeader>
        <ModalBody>
        <DiscountList 
            toggle={toggle.bind(null)}
            categories = {discount.categories}
            discountCategory= {discountCategory}
            setDiscountCategory= {setDiscountCategory.bind(null)}
            setDiscountSubCategory= {setDiscountSubCategory.bind(null)}
            discountList = {discount}  
            loading={discount.is_loading}
            isLoading={order.is_loading}
            setSearch={setSearch.bind(null)}        
            applyDiscountCoupon={applyDiscountCoupon.bind(null)}  
        />
        </ModalBody>
        </Modal>

        <Modal
            isOpen={modal.contactLens}
            toggle={()=>toggle('contactLens')}
            size="lg"
        >  
        <ModalHeader toggle={() => toggle('contactLens')}>Contact Lens</ModalHeader>
            <ContactLens
                data={contact_lens} 
                toggle={() => toggle('contactLens')} 
                loading={cart.is_loading}
                title='Select Contact Lens'
                type='contactLens'
                category={3}
                setLens={setLens.bind(null)}
                lens={lens}
                lensLeft={lensLeft}
                setInputValue={setInputValue.bind(null)}
                inputValue={inputValue}
                addToCartContactLens={addToCartContactLens.bind(null)}
                editedLens={editedLens}
                updateToCartContactLens={updateToCartContactLens.bind(null)}
                contactLensQuantity={contactLensQuantity}
                setContactLensQuantity={setContactLensQuantity.bind(null)}
            />
        </Modal>

        <Modal
            isOpen={modal.otherProduct}
            toggle={()=>toggle('otherProduct')}
            size="lg"
        >  
        <ModalHeader toggle={() => toggle('otherProduct')}>Other Product</ModalHeader>
            <ContactLens
                data={other_product} 
                toggle={() => toggle('otherProduct')} 
                loading={cart.is_loading}
                title='Select Other Product'
                type='otherProduct'
                category={4}
                setLens={setLens.bind(null)}
                lens={lens}
                lensLeft={lensLeft}
                setInputValue={setInputValue.bind(null)}
                inputValue={inputValue}
                addToCartContactLens={addToCartContactLens.bind(null)}
                editedLens={editedLens}
                updateToCartContactLens={updateToCartContactLens.bind(null)}
                contactLensQuantity={contactLensQuantity}
                setContactLensQuantity={setContactLensQuantity.bind(null)}
            />
        </Modal>
    </>
    ) 
};