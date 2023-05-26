import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from "reactstrap";
import UserDetail from '../views/dashboard/UserDetail';
import TotalSales from '../views/dashboard/TotalSales';
import TotalOrders from '../views/dashboard/TotalOrders';
import BestSeller from '../views/dashboard/BestSeller';
import TotalSaleChart from '../views/dashboard/TotalSaleChart';
import TotalOrderChart from '../views/dashboard/TotalOrderChart';
import NetSaleChannel from '../views/dashboard/NetSaleChannel';
import CustomerType from '../views/dashboard/CustomerType';
import SaleComparisonChart from '../views/dashboard/SaleComparisonChart';
import {fetchDashboardData} from '../redux/dashboard/action';
import {getNumberFormat, toDateFormat } from '../utilities/methods';
import {fetchStores} from '../redux/stores/action';
import {setFilterStoreId} from '../redux/order/action';

export default (props) =>  {
    const dispatch = useDispatch();
    const {user, dashboard, stores} = useSelector(state => state);
    const [duration, setDuration] = useState('0');
    const [store_id, setStoreId] = useState(user.data.store_id || '');
    const [start_date, setStartDate] = useState(null);
    const [end_date, setEndDate] = useState(null);
    const [ageType, setAgeType] = useState('ageAll');
    
 
    useEffect(() => {
        setStoreId(user.data.store_id);
        dispatch(fetchStores());
    },[dispatch, user]);

    useEffect(() => {
        setAgeType('ageAll')
        if(end_date){
            dispatch(fetchDashboardData({store_id, start_date: toDateFormat(start_date), end_date: toDateFormat(end_date)}));
        } else {
            dispatch(fetchDashboardData({duration, store_id}));
        }
    },[dispatch, duration, store_id]);

    // process to create new order
    const hadnleStoreSelection  = (data) => {
        dispatch(setFilterStoreId(data));
        props.history.push(`/order`)
     }

    const filterRecordsByDate = () => {
        setDuration('0');
        dispatch(fetchDashboardData({store_id, start_date: toDateFormat(start_date), end_date: toDateFormat(end_date)}));
    }

    const resetFilterRecords = () => {
        setDuration('0');
        setStartDate(null);
        setEndDate(null);
        setStoreId('');
        dispatch(fetchDashboardData({store_id: user.data.store_id || '', start_date: undefined, end_date: undefined}));
    }

    return (
        <>
        <Row>
            <Col>
            <UserDetail 
                detail={user.data || {}} 
                setDuration={setDuration.bind(this)} 
                stores={stores} 
                setStoreId={setStoreId.bind(this)} 
                start_date={start_date}
                end_date={end_date}
                setStartDate={setStartDate.bind(this)}
                setEndDate={setEndDate.bind(this)}
                duration={duration}
                filterRecordsByDate={filterRecordsByDate.bind(null)}
                resetFilterRecords={resetFilterRecords.bind(null)}
                store_id={store_id}
            />
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm="3">
            <TotalSales history={props.history} totalSale={getNumberFormat(dashboard['salesToday'] || 0)}  loading={dashboard['is_loading']}/>
            </Col>
            <Col sm="3">
            <TotalOrders history={props.history} totalOrders={dashboard['ordersToday'] || 0} loading={dashboard['is_loading']}/>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col sm="6">
            <TotalSaleChart data={dashboard['sales']}  loading={dashboard['is_loading']}/>
            </Col> 
            <Col sm="6">
            <TotalOrderChart data={dashboard['orders']} loading={dashboard['is_loading']}/>
            </Col>
        </Row>
        {!end_date &&
            <Row className="mt-2">
                <Col >
                    <SaleComparisonChart duration={duration} data={dashboard['sales']} dataComparizon={dashboard['salesComparizon']}  loading={dashboard['is_loading']}/>
                </Col> 
            </Row>
        }
        <Row className="mt-2">
            <Col sm="6">
                <NetSaleChannel 
                    appSale={dashboard['appSale']} 
                    whatsappSale={dashboard['whatsappSale']} 
                    storeApp={dashboard['storeApp']}
                    getNumberFormat={getNumberFormat.bind(null)}
                    totalSale={dashboard['salesToday'] || 0}
                    stores={dashboard['stores']}
                    loading={dashboard['is_loading']}
                    storeId={store_id}
                    websiteSale={dashboard['websiteSale']} 
                    htoSale={dashboard['htoSale']} 
                    hadnleStoreSelection={hadnleStoreSelection.bind(null)}
                />
            </Col> 
            <Col sm="6">
            {!dashboard['is_loading'] &&
                <CustomerType user={dashboard['user']} setAgeType={setAgeType.bind(null)} ageType={ageType} ageList={dashboard[ageType] || {}} />
            }
            <BestSeller 
                loading={dashboard['is_loading']} 
                bestProductSales={dashboard['bestProductSales'] || []}
                bestFramesSales={dashboard['bestFramesSales'] || []}
                bestVariantsSales={dashboard['bestVariantsSales'] || []} 
                bestSizeLabelSales={dashboard['bestSizeLabelSales'] || []}
            />
            </Col>
        </Row>
        </>
    )
}