import React, { useState, useEffect } from 'react';
import { Col } from 'reactstrap';
import { getNumberFormat } from '../../../utilities/methods';


export default ({performanceDetail,appointment, tab}) => {
    
    const { revenueHTO, revenueStore, appointments } = performanceDetail;

    let value = "";
    let type = "";


    if(tab == "bookings"){
        value = appointments.count;
        type = "Items";
    }
    else if(tab=="htosales"){
        value = getNumberFormat(revenueHTO.total_sale)
        type = "Total Sales"
    }
    else if(tab=="htosalesitems"){
        value = revenueHTO.total_sale_items
        type = "Items"
    }
    else if(tab=="opticiansales" || tab=="staffsales"){
        value = getNumberFormat(revenueStore.total_sale);
        type = "Total Sales"
    }
    else if(tab=="opticiansaleitems" ||  tab=="staffsaleitems"){
        value = revenueStore.total_sale_items;
        type = "Items"
    }

    return (
        <>
            <Col md="12" className="padding-0">
                <Col md="12" className='summary-graphical-item'>  Net {type} </Col>
                <Col md="12" className='summary-graphical-value'> {value}  </Col>
            </Col>
        </>
    )
}