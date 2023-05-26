import React from 'react';
import {
    Card,
    CardBody,
    Progress,
    ListGroup,
    ListGroupItem, 
    NavLink
  } from "reactstrap";

const NetSaleChannel = ({getNumberFormat, appSale, whatsappSale, storeApp, totalSale, stores, loading, storeId, websiteSale, htoSale, hadnleStoreSelection}) => {
    const storesList = storeId ? stores.filter(s => s.id.toString() === storeId) : stores;
    return(
        <Card className="border border-info">
        <CardBody >
        {loading ? 'loading...' :
            <div className="pt-3 ">
                <span className="font-bold text-dark">NET SALES BY CHANNEL</span>
                <Progress multi className="mt-3" style={{height:'20px'}} >
                    {/* <Progress bar color="secondary" value="20" /> */}
                    <Progress bar color="purple" value={(appSale*100)/totalSale} />
                    <Progress bar color="success" value={(whatsappSale*100)/totalSale} />
                    <Progress bar color="info" value={(storeApp*100)/totalSale} />
                </Progress>
                <ListGroup>
                {/* <ListGroupItem className="border-0 mt-3 p-0">
                    <i className="fas fa-square mr-1 text-secondary font-12 pr-3"></i> 
                    Website
                    <span className="float-right">Rp 8,000,000</span>
                </ListGroupItem> */}
                <ListGroupItem className="border-0 mt-3 p-0">
                    <i className="fas fa-square mr-1 text-purple font-12 pr-3"></i> 
                    Mobile Apps
                    <span className="float-right">{getNumberFormat(appSale)}</span>
                </ListGroupItem>
                <ListGroupItem className="border-0 mt-3 p-0">
                    <i className="fas fa-square mr-1 text-success font-12 pr-3"></i>
                    Whatsapp
                    <span className="float-right">{getNumberFormat(whatsappSale)}</span>
                </ListGroupItem>
                <ListGroupItem className="border-0 mt-3 p-0">
                    <i className="fas fa-square mr-1 text-success font-12 pr-3"></i>
                    Website
                    <span className="float-right">{getNumberFormat(websiteSale)}</span>
                </ListGroupItem>
                <ListGroupItem className="border-0 mt-3 p-0">
                    <i className="fas fa-square mr-1 text-success font-12 pr-3"></i>
                    HTO
                    <span className="float-right">{getNumberFormat(htoSale)}</span>
                </ListGroupItem>
                <ListGroupItem className="border-0 mt-3 p-0">
                    <i className="fas fa-square mr-1 text-info font-12 pr-3"></i>
                    In Store
                    <span className="float-right">{getNumberFormat(storeApp)}</span>
                </ListGroupItem>
                {storesList.map((row, index) =>
                    <ListGroupItem className="border-0 mt-3 p-0" key={index}>
                        <NavLink href="#" active onClick={() => hadnleStoreSelection(row)} style={{display: 'contents'}}>
                        <span className="ml-4">- {row.name}</span>
                        </NavLink>
                        <span className="float-right ">{getNumberFormat(row.amount)}</span>
                    </ListGroupItem>
                )}
                </ListGroup>
            </div>
        }       
        </CardBody>
    </Card>      
    )
}

NetSaleChannel.defaultProps = {
    appSale: 0,
    whatsappSale: 0,
    storeApp: 0,
    totalSale: 0,
    stores: []
}
    
export default NetSaleChannel;