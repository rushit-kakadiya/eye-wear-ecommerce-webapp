import React, {useState} from 'react';
import classnames from "classnames";
import {
    Card,
    CardBody,
    Progress,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane, 
    ListGroup,
    ListGroupItem,
  } from "reactstrap";

export default ({loading, bestProductSales, bestFramesSales, bestVariantsSales, bestSizeLabelSales}) => {
    const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
    return(
        <Card className="border border-info">
        <CardBody >
          {loading ? 'loading...' :
            <div className="pt-3">
                <span className="font-bold text-dark">BEST SELLER ITEMS</span>
                <Nav pills className="custom-pills mt-2">
                    <NavItem>
                        <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                            toggle("1");
                        }}
                        >
                        Product
                        </NavLink>
                    </NavItem> 
                    <NavItem>
                        <NavLink
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                            toggle("2");
                        }}
                        >
                        Frame
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                            toggle("3");
                        }}
                        >
                        Color
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                        className={classnames({ active: activeTab === "4" })}
                        onClick={() => {
                            toggle("4");
                        }}
                        >
                        Size
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="mt-2">
                <TabPane tabId="1">
                  <ListGroup>
                    {bestProductSales.map((row, index) => 
                      <ListGroupItem className="p-0 mt-3 border-0" key={index}>
                        <div className="d-flex align-items-center">
                          <i className="text-muted mdi mdi-sunglasses"></i>
                              <div className="ml-2">
                                  <h6 className="mb-0">{row.name}</h6>
                                  <span className="text-muted">Sold {row.total_count} Items</span></div>
                        </div>
                        <Progress color="success" value={row.total_count}/>
                      </ListGroupItem>
                    )}
                  </ListGroup>
                </TabPane>
                <TabPane tabId="2">
                  <ListGroup>
                      {bestFramesSales.map((row, index) => 
                        <ListGroupItem className="p-0 mt-3 border-0" key={index}>
                          <div className="d-flex align-items-center">
                            <i className="text-muted mdi mdi-sunglasses"></i>
                                <div className="ml-2">
                                    <h6 className="mb-0">{row.name}</h6>
                                    <span className="text-muted">Sold {row.total_count} Items</span></div>
                          </div>
                          <Progress color="success" value={row.total_count}/>
                        </ListGroupItem>
                      )}
                    </ListGroup>
                  </TabPane>
                  <TabPane tabId="3">
                  <ListGroup>
                      {bestVariantsSales.map((row, index) => 
                        <ListGroupItem className="p-0 mt-3 border-0" key={index}>
                          <div className="d-flex align-items-center">
                            <i className="text-muted mdi mdi-sunglasses"></i>
                                <div className="ml-2">
                                    <h6 className="mb-0">{row.name}</h6>
                                    <span className="text-muted">Sold {row.total_count} Items</span></div>
                          </div>
                          <Progress color="success" value={row.total_count}/>
                        </ListGroupItem>
                      )}
                    </ListGroup>
                  </TabPane>
                  <TabPane tabId="4">
                  <ListGroup>
                      {bestSizeLabelSales.map((row, index) => 
                        <ListGroupItem className="p-0 mt-3 border-0" key={index}>
                          <div className="d-flex align-items-center">
                            <i className="text-muted mdi mdi-sunglasses"></i>
                                <div className="ml-2">
                                    <h6 className="mb-0">{row.name}</h6>
                                    <span className="text-muted">Sold {row.total_count} Items</span></div>
                          </div>
                          <Progress color="success" value={row.total_count}/>
                        </ListGroupItem>
                      )}
                    </ListGroup>
                  </TabPane>
                </TabContent>
               </div>
            }
        </CardBody>
    </Card>      
    )
}
