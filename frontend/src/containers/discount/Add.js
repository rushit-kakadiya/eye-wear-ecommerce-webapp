import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Add from '../../views/discount/Add';
import {discountCategoryList, fecthSkuList, uploadImage, setDiscountVoucher} from '../../redux/discount/action';

export default (props) =>{  
    const [state, setState] = useState({minimumReq:'', discountType:'amount', avilabilty_type:false, appliesType:'', specificItem:'', exclude_global_sku:false})
    const [ItemCount, setItemCount] = useState([{}]);
    const [scheduleTime, setScheduleTime] = useState({});
    const [selectedSku, setSlectedSku] = useState([]);
    const [image, setImage] = useState();
    const [imageData, setImageData] = useState();
    const dispatch = useDispatch();
    const {discount} = useSelector(state=>state);
        
    useEffect(()=>{
        dispatch(discountCategoryList());
    },[dispatch]);
        
    const handleStateChange = (key, value) => {
        setState({...state, [key]:value})
    }
    
    const handleProductChange = (type) =>{
        if(type){
        dispatch(fecthSkuList({type}));
        }
    }

    const handleTimeChange = (key, value) =>{
        setScheduleTime({...scheduleTime, [key]:value})
    }

    const handleProductSelection = (index, type, sku ) => {
        if(selectedSku[index])
        {   
            if(type)
            {
                selectedSku[index] = {type:type , sku_code:sku}
            } else {
            selectedSku[index] = {type:type ||  selectedSku[index].type, sku_code:sku || selectedSku[index].sku_code  }
            }
            setSlectedSku([...selectedSku])
        } else {
            setSlectedSku([...selectedSku, {type:type, sku_code:sku }])
        }
    }

    const handleDelete = (index) => {
        if(selectedSku[index])
        {
            selectedSku.splice(index,1)
            setSlectedSku([...selectedSku]);
            ItemCount.splice(index, 1);
        } else {
            ItemCount.splice(index, 1);
        }
    }

    const handleSubmitData = (data) => {
        const payload = {
            voucher_title: data.voucher_title,
            voucher_code: data.voucher_code.toUpperCase(),
            voucher_type:Number(data.voucher_type),
            voucher_sku_mapping:selectedSku.length>0 ? selectedSku.map(row=> ({type: row.type, sku_code:row.sku_code || discount.skuList[row.type].map((row) => row.DISTINCT).toString()})) : undefined,
            minimum_cart_amount:data.minimum_cart_amount || undefined,
            min_cart_count:data.min_cart_count || undefined,
            voucher_sku_mapping_type:data.voucher_sku_mapping_type || 3,
            max_count:data.max_count,
            voucher_max_amount:data.voucher_max_amount,
            is_single_user: !!data.is_single_user,
            first_order: !!data.first_order,
            avilabilty_type: data.avilabilty_type.map(Number),
            start_at:new Date(scheduleTime.schedule_start_date+' '+scheduleTime.schedule_start_time),
            expire_at:new Date(scheduleTime.schedule_end_date+' '+scheduleTime.schedule_end_time),
            term_conditions:data.term_conditions || undefined,
            voucher_type_value:data.voucher_type_value,
            discount_category:data.discount_category,
            discount_sub_category:data.discount_sub_category,
            sub_title:data.sub_title || undefined
        };
        if(imageData && data.avilabilty_type.includes('mobile_app'))
        {
            dispatch(uploadImage(imageData)).then((res)=>{
                dispatch(setDiscountVoucher({...payload, voucher_image_key:res.fileName})).then(()=>props.history.push('/settings/discount'))
            });
        } else {
            dispatch(setDiscountVoucher(payload)).then(()=>props.history.push('/settings/discount'))
        }
    }

    return (
        <Add
            history={props.history}
            loading={discount.is_loading}
            categories={discount.categories || []}
            skuList={discount.skuList || []}
            state={state}
            handleStateChange={handleStateChange.bind(null)}
            ItemCount={ItemCount}
            setItemCount={setItemCount.bind(null)}
            scheduleTime={scheduleTime}
            handleProductChange={handleProductChange.bind(null)}
            handleTimeChange={handleTimeChange.bind(null)}
            handleProductSelection={handleProductSelection.bind(null)}
            selectedSku={selectedSku}
            handleDelete={handleDelete.bind(null)}
            handleSubmitData={handleSubmitData.bind(null)}
            image={image}
            setImage={setImage.bind(null)}
            setImageData={setImageData.bind(null)}
            setSlectedSku={setSlectedSku.bind(null)}
        />
    )
}