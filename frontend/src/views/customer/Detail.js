import React from "react";
import classnames from "classnames";
import {
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";
import ProfileSummary from "./detail/profile/ProfileSummary";
import PrescriptionList from "./detail/profile/PrescriptionList";
//import LastPurchase from "./detail/profile/LastPurchase";
import OrderHistory from "./detail/OrderHistory";
import Wishlist from "./detail/Wishlist";
import InCart from "./detail/InCart";
import Referral from "./detail/referral/Detail";
import HtoAppointment from "./detail/HtoAppointment";
import Timeline from "../order/detail/Timeline";

export default ({ type, setType, detail, order, toggle, options, setSelectPrescription, handleDelete, is_loading, history, setEditedValue, userData }) => {

    return (
        <Row>
            <Col>
                <Nav pills className="custom-pills mt-4">
                    <NavItem>
                        <NavLink
                            className={classnames({ active: type === "summary" })}
                            onClick={() => {
                                setType("summary");
                            }}
                        >
                            Profile Summary
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: type === "history" })}
                            onClick={() => {
                                setType("history");
                            }}
                        >
                            Order History ({detail && detail.count ? detail.count.orders : 0})
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: type === "hto_appointment" })}
                            onClick={() => {
                                setType("hto_appointment");
                            }}
                        >
                            Hto Appointment
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: type === "wishlist" })}
                            onClick={() => {
                                setType("wishlist");
                            }}
                        >
                            Wishlist ({detail && detail.count ? detail.count.wishlist : 0})
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: type === "cart" })}
                            onClick={() => {
                                setType("cart");
                            }}
                        >
                            In the cart ({detail && detail.count ? detail.count.cart : 0})
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: type === "referral" })}
                            onClick={() => {
                                setType("referral");
                            }}
                        >
                            Referral
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={type} className="mt-3">
                    <TabPane tabId="summary">
                        <Row >
                            <Col md="7" className="ml-4" style={{ border: '2px solid #ccc' }} >
                                <ProfileSummary
                                    detail={detail.profileSummary.user}
                                    address={detail.profileSummary.address || []}
                                    toggle={toggle.bind(null)}
                                    setEditedValue={setEditedValue.bind(null)}
                                />
                            </Col>
                        </Row>
                        {/* { detail.profileSummary.prescriptions && detail.profileSummary.prescriptions.length>0 && */}
                        <Row>
                            <Col md="7" className="ml-4 mt-3" style={{ border: '2px solid #ccc', width: '100%' }}>
                                <PrescriptionList
                                    list={detail.profileSummary.prescriptions}
                                    toggle={toggle.bind(null)}
                                    setSelectPrescription={setSelectPrescription.bind(null)}
                                    handleDelete={handleDelete.bind(null)}
                                />
                            </Col>
                        </Row>
                        {/* } */}
                        {/* <Row> 
                            <Col md="7" className="ml-4 mt-3"  style={{border:'2px solid #ccc', width:'100%'}}>
                            <LastPurchase/>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col md="7" className="ml-4 mt-3" style={{ width: '100%' }}>
                                <Timeline
                                    title="Customer History"
                                    orderHistory={detail.profileSummary.activity ? detail.profileSummary.activity.slice(0,10) : []}
                                    userData={userData}
                                    toggle={toggle.bind(null)}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={type} className="mt-3">
                    <TabPane tabId="history">
                        <Row>
                            <Col className="ml-3">
                                <OrderHistory
                                    orderList={detail.orderHistory}
                                    options={options}
                                    history={history}
                                    userData={userData}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={type} className="mt-3">
                    <TabPane tabId="hto_appointment">
                        <Row>
                            <Col className="ml-3">
                                <HtoAppointment
                                    htoAppointment={detail.htoAppointment}
                                    options={options}
                                    history={history}
                                    userData={userData}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={type} className="mt-3">
                    <TabPane tabId="wishlist">
                        <Row >
                            <Col className="ml-4" sm={6}>
                                <Wishlist data={detail.wishlist || []} loading={is_loading} />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={type} className="mt-3">
                    <TabPane tabId="cart">
                        <Row >
                            <Col>
                                <InCart
                                    cart={{
                                        data: Object.keys(detail.cart).length ? detail.cart : { list: [] },
                                        lensesOnly: Object.keys(detail.lensesOnly).length ? detail.lensesOnly : { list: [] },
                                        clipons: Object.keys(detail.clipons).length ? detail.clipons : { list: [] }
                                    }}
                                    order={order}
                                    loading={is_loading}
                                    history={history}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
                <TabContent activeTab={type} className="mt-3">
                    <TabPane tabId="referral">
                        <Referral
                            loading={is_loading}
                            history={history}
                            referralDetail={detail.referral || []}
                        />
                    </TabPane>
                </TabContent>
            </Col>
        </Row>
    )
}