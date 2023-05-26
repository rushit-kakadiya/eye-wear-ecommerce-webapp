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
    Row,
    Col, 
    Button
  } from "reactstrap";

export default ({user={}, setAgeType, ageType, ageList}) => {
    const [activeTab, setActiveTab] = useState("1");
    const totalPerson = ageList.firstRange + ageList.secondRange + ageList.thirdRange + ageList.forthRange + ageList.fifthRange + ageList.sixthRange + ageList.aboveRange + ageList.unknown; 
   
    const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
    return(
        <Card className="border border-info">
        <CardBody >
            <div className="pt-3 ">
                <span className="font-bold text-dark">CUSTOMER TYPE</span>
                <Nav pills className="custom-pills mt-2">
                    <NavItem>
                        <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                            toggle("1");
                        }}
                        >
                        Gender
                        </NavLink>
                    </NavItem> 
                    <NavItem>
                        <NavLink
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                            toggle("2");
                        }}
                        >
                        Type
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                        className={classnames({ active: activeTab === "3" })}
                        onClick={() => {
                            toggle("3");
                        }}
                        >
                        Age
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="mt-3">
                <TabPane tabId="1">
                    <Progress multi className="mt-3" style={{height:'20px'}} >
                    <Progress bar color="secondary" value={user.male ? (user.male[0].total_sales*100)/user.total[0].total_sales : 0}/>
                        <Progress bar color="purple" value={user.female ? (user.female[0].total_sales*100)/user.total[0].total_sales : 0} />
                    </Progress>
                    <ListGroup>
                        <ListGroupItem className="border-0 mt-3 p-0">
                            <i className="fas fa-square mr-1 text-secondary font-12 pr-3"></i> 
                             Male
                            <span className="float-right">{user.male ? user.male[0].total_sales : 0} People</span>
                        </ListGroupItem>
                        <ListGroupItem className="border-0 mt-3 p-0">
                            <i className="fas fa-square mr-1 text-purple font-12 pr-3"></i> 
                                Female
                            <span className="float-right">{user.female ? user.female[0].total_sales : 0} People</span>
                        </ListGroupItem>
                    </ListGroup>
                </TabPane>
                <TabPane tabId="2">
                    <Progress multi className="mt-3" style={{height:'20px'}} >
                        <Progress bar color="secondary" value={user.firstTimeLogin && user.firstTimeLogin.length > 0 ? (user.firstTimeLogin[0].total_count*100)/user.total[0].total_sales : 0}/>
                        <Progress bar color="purple" value={user.returning && user.returning.length > 0 ? (user.returning[0].total_count*100)/user.total[0].total_sales : 0} />
                    </Progress>
                    <ListGroup>
                        <ListGroupItem className="border-0 mt-3 p-0">
                            <i className="fas fa-square mr-1 text-secondary font-12 pr-3"></i> 
                            First Timer
                            <span className="float-right">{user.firstTimeLogin && user.firstTimeLogin.length > 0 ? user.firstTimeLogin[0].total_count : 0} People</span>
                        </ListGroupItem>
                        <ListGroupItem className="border-0 mt-3 p-0">
                            <i className="fas fa-square mr-1 text-purple font-12 pr-3"></i> 
                                Returning
                            <span className="float-right">{user.returning && user.returning.length > 0 ? user.returning[0].total_count : 0} People</span>
                        </ListGroupItem>
                    </ListGroup>
                  </TabPane>
                    <TabPane tabId="3">
                        <Row className="mb-2">
                            <Col sm={1} className="mr-3">
                            <Button className="btn" style={{borderRadius:'15px', backgroundColor: ageType === 'ageAll' ? '#2dce89' : 'white', color: ageType === 'ageAll' && '#fff' }} outline color="success" type="button" onClick={()=>setAgeType('ageAll')}>All</Button>
                            </Col>
                            <Col sm={1} className="mr-3">
                            <Button  className="btn " style={{borderRadius:'18px',  backgroundColor: ageType === 'ageMale' ? '#2dce89' : 'white', color: ageType === 'ageMale' && '#fff'}} outline color="success" type="button" onClick={()=>setAgeType('ageMale')}>Male</Button>
                            </Col>
                            <Col sm={3} className="ml-2">
                            <Button  className="btn" style={{borderRadius:'18px',  backgroundColor: ageType === 'ageFemale' ? '#2dce89' : 'white', color: ageType === 'ageFemale' && '#fff'}} outline color="success" type="button" onClick={()=>setAgeType('ageFemale')}>Female</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>13-17</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.firstRange*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.firstRange} person</Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>18-24</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.secondRange*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.secondRange} person</Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>25-34</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.thirdRange*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.thirdRange} person</Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>35-44</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.forthRange*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.forthRange} person</Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>45-54</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.fifthRange*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.fifthRange} person</Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>55-64</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.sixthRange*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.sixthRange} person</Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>65+</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.aboveRange*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.aboveRange} person</Col>
                        </Row>
                        <Row>
                            <Col sm={2} className="ml-3" style={{wordWrap:'initial'}}>UnKnown</Col>
                            <Col sm={6} className="ml-0 mt-1"><Progress color="success" style={{height:"15px"}} value={totalPerson > 0 ? ageList.unknown*100/totalPerson : 0}/> </Col>
                            <Col className="ml-0 mr-0" style={{wordWrap:'initial'}}>{ageList.unknown} person</Col>
                        </Row>
                    </TabPane>
                </TabContent>
               </div>
        </CardBody>
    </Card>      
    )
}