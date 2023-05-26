import React from 'react';
import { Row, Col, Button, Input, Badge } from "reactstrap";
import {getNumberFormat} from '../../utilities/methods';

export default({loading, isLoading, discountList, setSearch, categories, discountCategory, applyDiscountCoupon, setDiscountCategory, setDiscountSubCategory})=>{
    const SubCategoryList = discountCategory ? categories.find(row=>row.name === discountCategory).options : [];
 
    const getDiscountList = () => {
        if(loading){
            return <h4 style={{marginLeft: '40%', marginTop:"5%"}}>Loading...</h4>;
        } else if (discountList.total_rows === 0) {
            return <h4 style={{marginLeft: '30%', marginTop:"5%"}}>Please search for voucher!</h4>;
        } else {
            return(discountList.list.map((row, index)=>
                <>
                <Row className="m-3 border" key={index}>
                    <Col sm={12} className="ml-2 p-2"> 
                        <Badge color="success" className="mr-2" pill>{row.discount_category}</Badge>
                        <Badge color="info" className="mr-2" pill>{row.discount_sub_category}</Badge>
                    </Col>
                    <Col className="ml-2 p-2" sm={8}>
                        <b>{row.voucher_title} {row.voucher_code}</b> <br/>
                        {row.voucher_sku_mapping_type === 3  ? row.voucher_type === 1 ? 
                        `${row.voucher_percentage+'% off of all products'}` : `${getNumberFormat(row.voucher_amount)+ ' off for all products'}` : row.voucher_type === 1 ? 
                        `${row.voucher_percentage+'% off of specific products'}` : `${getNumberFormat(row.voucher_amount)+ ' off for specific products'}`    
                        }
                    </Col>
                    <Col className="p-2 text-right" sm={3}>
                        {/* <span className="text-success">(Discount Rp 150.00)</span> */}
                        <Button className="ml-3" color="info" onClick={()=>applyDiscountCoupon(row)} disabled={isLoading}>Apply </Button>
                    </Col>
                </Row>
                </>
                )
            )      
        } 
    }
   
    return(
        <div>
            <Row className="p-3">
                <Col sm={3}> 
                    <Input type="select" className="custom-selectsetSearch"  onChange={(event)=>{ setDiscountSubCategory('');setDiscountCategory(event.target.value)}}>
                    <option value="" >Categories</option>
                        {categories.map(row=>
                        <option value={row.name} key={row.id}>{row.name}</option>
                        )}
                    </Input>
                </Col>
                <Col sm={3}> 
                <Input type="select" className="custom-select" disabled={!discountCategory} onChange={(event)=>setDiscountSubCategory(event.target.value)}>
                <option value="" >SubCategories</option>
                    { SubCategoryList && SubCategoryList.map(row=>
                    <option value={row.name} key={row.id}>{row.name}</option>
                    )}
                </Input>
                </Col>
                <Col sm={2}></Col>
                <Col sm={4}  style={{textAlign:"right"}}>  
                <Input type="text" name="search" id="search" placeholder="Search Promo" onChange={(event)=>setSearch(event.target.value)}/>
                </Col>
            </Row>
            {getDiscountList()}
           </div>
    )
    }