import React, {useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import {fecthDiscountDetail, inactiveVoucher} from '../../redux/discount/action';
import View from '../../views/discount/View';


export default (props) =>{
    const id = props.match.params ? props.match.params.id : ''; 
    const dispatch = useDispatch();
    const {discount, user} = useSelector(state=>state);
    useEffect(()=>{        
        dispatch(fecthDiscountDetail({id}));
    },[dispatch, id]);

    const handelViewEvents = (type) => {
        if(type === "edit"){
            props.history.push(`/settings/edit-discount/${id}`);
        } else {
            confirmAlert({
                title: 'Inactive Coupon!',
                message: 'Are you sure to Inactive this Coupon!',
                buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(inactiveVoucher(id, 'view'))
                        }
                },
                {
                    label: 'No'
                }
                ]
            });
            }
    }
    if(discount.is_loading) {
        return <h4 style={{marginLeft: '40%'}}>loading...</h4>;
    } else if (!discount.detail) {
        return <h4 style={{marginLeft: '40%', marginTop:"5%"}}>There is no data to display!</h4>;
    }
    return(
       <View
            detail={discount.detail || {}}
            history={props.history}
            handelViewEvents={handelViewEvents.bind(null)}
            userData={user.data}
       />
    )
}