import React, {useEffect, useState, useMemo} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import Edit from '../../views/discount/Edit';
import {discountCategoryList, uploadImage, updateVoucher, fecthDiscountDetail, getVoucherdetail} from '../../redux/discount/action';
import {getLocalTime, toDateFormat} from '../../utilities/methods';

export default (props) =>{  
    const [selectedSku, setSlectedSku] = useState([]);
    const [image, setImage] = useState();
    const [imageData, setImageData] = useState();
    const [scheduleTime, setScheduleTime] = useState({});
    const dispatch = useDispatch();

    const {discount} = useSelector(state=>state);
    const id = props.match.params ? props.match.params.id : ''; 

    const detail = discount.detail || {};
    const skuData = detail && detail.excludesSku && detail.excludesSku.length > 0 ?  detail.excludesSku : detail.voucher_sku_mapping_type === 3  ? detail.includesSku : [];

    useEffect(()=>{
        dispatch(discountCategoryList());
        dispatch(fecthDiscountDetail({id}));
        return (()=>dispatch(getVoucherdetail(null)))
    },[dispatch, id]);

    useMemo(() => {
        if(detail.start_at)
        {
            setScheduleTime({start_date:toDateFormat(detail.start_at), start_time:getLocalTime(detail.start_at), end_date:toDateFormat(detail.expire_at), end_time:getLocalTime(detail.expire_at)})
        }
        setImage(detail.voucher_image_key ? detail.base_url+detail.voucher_image_key : ''); 
        const res = skuData && skuData.reduce((accum, row) => {
            const index = accum.findIndex(val => val.type === row.type);
                if(index > -1){
                    accum[index].sku+=","+row.sku_code;
                } else {
                    accum.push({type: row.type,sku: row.sku_code});
                }
                return accum;
            }, []);
            setSlectedSku(res)
    },[discount.detail]);

    const handleTimeChange = (key, value) =>{
        setScheduleTime({...scheduleTime, [key]:value})
    }

    const handleSubmitData = (data) => {
        const payload = {
            id,
            start_at:new Date(scheduleTime.start_date+' '+scheduleTime.start_time),
            expire_at:new Date(scheduleTime.end_date+' '+scheduleTime.end_time),
            term_conditions:data.term_conditions || undefined,
            voucher_image_key: detail.voucher_image_key || undefined,
            sub_title:data.sub_title || undefined
            };
        if(imageData)
        {
            dispatch(uploadImage(imageData)).then((res)=>{
                dispatch(updateVoucher({...payload, voucher_image_key:res.fileName})).then(()=>props.history.push('/settings/discount'))
            });
        } else {
            dispatch(updateVoucher(payload)).then(()=>props.history.push('/settings/discount'))
        }
    }
    if(discount.is_loading) {
        return <h4 style={{marginLeft: '40%'}}>loading...</h4>;
    }
    return (
        <Edit
            detail={detail}
            history={props.history}
            loading={discount.is_loading}
            categories={discount.categories || []}
            skuList={discount.skuList || []}
            scheduleTime={scheduleTime}
            handleTimeChange={handleTimeChange.bind(null)}
            selectedSku={selectedSku}
            handleSubmitData={handleSubmitData.bind(null)}
            image={image}
            setImage={setImage.bind(null)}
            setImageData={setImageData.bind(null)}
        />
    )
}