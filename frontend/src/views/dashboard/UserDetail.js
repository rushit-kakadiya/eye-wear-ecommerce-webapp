import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, FormGroup, Input, Button } from 'reactstrap';
import {addDayDate, getDay, getDayMeridiem} from '../../utilities/methods';

export default ({detail, setDuration, stores, setStoreId, store_id, start_date, end_date, setStartDate, setEndDate, duration, filterRecordsByDate, resetFilterRecords}) => {
    return(
        <>
        <Row>
           <Col md="6">
                <h2 className="text-primary">{getDayMeridiem(new Date())}, {`${detail['name']}!`}</h2>
                <span>Today is {getDay(new Date())}, {addDayDate(new Date())}</span>
           </Col> 
            <Col md="2" className="pl-0 mt-2 pl-3"> 
            <DatePicker  selected={start_date} onChange={date => setStartDate(date)}  className="form-control" placeholderText="Start Date"  maxDate={ end_date || new Date() } isClearable={true}/>
            </Col>
            <Col md="2" className="pl-0 mt-2 pl-3">
            <DatePicker disabled={!start_date} selected={end_date} onChange={date =>setEndDate(date)}  className="form-control"  placeholderText="End Date" maxDate={new Date()} minDate={start_date} isClearable={true}/>
            </Col>
            <Col md="2" className="pr-0" >
            <Button type="button" color="primary" className="mt-2" onClick={()=>filterRecordsByDate()} disabled={!store_id && !end_date}>Filter</Button>
            <Button type="button" color="primary" className="mt-2 ml-2" onClick={()=>resetFilterRecords()}>Reset</Button>
            </Col>
        </Row>
        <Row >
            <Col md="6" className="mr-0">
            <div className="button-group ml-0 mt-2">
                <Button className="btn mr-2" style={{backgroundColor: duration === '0' && "#2962ff", color:duration === '0' && "white"}} outline color="info" onClick={()=>setDuration('0')}>
                    Today
                </Button>
                <Button className="btn  mr-2" style={{backgroundColor: duration === '1' && "#2962ff", color:duration === '1' && "white"}} outline color="info" onClick={()=>setDuration('1')}>
                    Yesterday
                </Button>
                <Button className="btn  mr-2"  style={{backgroundColor: duration === '7' && "#2962ff", color:duration === '7' && "white"}}  outline color="info" onClick={()=>setDuration('7')}>
                    This Week
                </Button>
                <Button className="btn  mr-2"   style={{backgroundColor: duration === '30' && "#2962ff", color:duration === '30' && "white"}}  outline color="info" onClick={()=>setDuration('30')}>
                    This Month
                </Button>
                <Button className="btn"  style={{backgroundColor: duration === '365' && "#2962ff", color:duration === '365' && "white"}}  outline color="info" onClick={()=>setDuration('365')}>
                    This Year
                </Button>
            </div>  
            </Col>
            {
                !detail['store_id'] && 
                <Col md="3" className="mt-2"> 
                    <div className="ml-auto d-flex align-items-left">
                        <div className="dl">
                        <FormGroup>
                            <Input type="select" className="custom-select" onChange={e => setStoreId(e.target.value)} value={store_id}>
                            <option value="">All Stores</option>
                            {stores.map((row, index) => <option value={row.id} key={index}>{row.name}</option>)}
                            </Input>
                        </FormGroup>
                        </div>
                    </div>
                </Col>
            }
        </Row>
        </>
    )
}