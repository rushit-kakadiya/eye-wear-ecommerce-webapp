import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import List from  '../../views/discount/List';
import {fecthDiscountList, inactiveVoucher} from '../../redux/discount/action';

export default (props) =>{
    const [page, setPage] = useState(1); 
    const [search, setSearch] = useState(''); 
    const [tooltipOpen, setTooltipOpen] = useState('');   
    const [status, setStatus] = useState('all');
    const dispatch = useDispatch();
    const {discount, user} = useSelector(state=>state)
    const options ={
        pageSize : 10,
        pageRange : 10
    }

    useEffect(()=>{
        dispatch(fecthDiscountList({page, status, search }))
    },[dispatch, page, status, search])

    //Coupon action
    const editDiscount = (type, id) => {
        if(type === "edit")
        {
            props.history.push(`/settings/edit-discount/${id}`)
        } else if (type === 'delete') {
        confirmAlert({
            title: 'Inactive Coupon!',
            message: 'Are you sure to Inactive this Coupon!',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                         setTooltipOpen('');
                         dispatch(inactiveVoucher(id,'list'))
                         }
            },
            {
                label: 'No'
            }
            ]
        });
        } else {
            props.history.push(`/settings/view-discount/${id}`);
        }
    }

    //Handle page change
    const handlePageChange = (value)=> {
        setPage(value)
    }
    return(
        <List
            history={props.history}
            list={discount}
            loading={discount.is_loading}
            editDiscount={editDiscount.bind(null)}
            options={options}
            handlePageChange={handlePageChange.bind(null)}
            page={page}
            setPage={setPage.bind(null)}
            status={status}
            setStatus={setStatus.bind(null)}
            setSearch={setSearch.bind(null)}
            tooltipOpen={tooltipOpen}
            setTooltipOpen={setTooltipOpen.bind(null)}
            userData={user.data || {}}
        />
    )
}