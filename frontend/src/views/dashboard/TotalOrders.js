import React from 'react';
import {
    Card,
    CardBody,
    CardTitle
  } from "reactstrap";

export default ({totalOrders, loading, history}) => {
    return(
        <Card className="border border-info  text-info">
          <CardBody>
            <div className="d-flex align-items-center">
              <div style={{cursor: 'pointer'}} onClick={() => history.push({pathname: '/order', state: {order_status: 'payment_confirmed'}})}>
                <CardTitle>TOTAL ORDERS</CardTitle>
                <h4 className="mb-0">
                {loading ?  'loading...' : totalOrders}
                </h4>
                {/* <div className="mt-1 text-success">
                <i className="ti-arrow-up"></i>0%
                </div> */}
              </div>
            </div>
          </CardBody>
        </Card>
    )
}