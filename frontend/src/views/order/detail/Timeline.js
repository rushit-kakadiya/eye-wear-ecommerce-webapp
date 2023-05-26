import React from 'react';
import { Row, Col, NavLink } from "reactstrap";
import { getDateFormat, titleCase, replaceGlobal } from "../../../utilities/methods"

export default ({ orderHistory, userData, title = 'Timeline', toggle }) => {
    return (
        <>
            {title === 'Customer History List' ? null
                : <Row className="p-3">
                    <Col sm="8"><h5>{title}</h5>
                    </Col>
                </Row>
            }
            {orderHistory && orderHistory.map((row, index) => {
                const status = replaceGlobal(row.appointment_status || row.status || row.action);
                return <Row className="pl-4" key={index}>
                    <Col sm="1">
                        <div className="mt-1 rounded-circle bg-secondary " style={{ width: '10px', height: '10px' }}></div>
                        {index < orderHistory.length - 1 &&
                            <div className="ml-1 mt-1 bg-secondary" style={{ width: '2px', height: '35px' }}></div>}
                    </Col>
                    <Col sm="7">
                        <div>
                            {status.toLowerCase().search('by') > -1 ? titleCase(status) : `${titleCase(status)} By ${titleCase(row.name || 'Admin')}`}
                        </div>
                    </Col>
                    <Col>
                        <div> {getDateFormat(row.created_at, true, true, userData.time_zone)}</div>
                    </Col>
                </Row>
            })}
            <br />
            {orderHistory.length === 10 && title === 'Customer History' &&
                <NavLink
                    to="#"
                    className="text-info align-items-end"
                    style={{ display: "contents", textDecoration: "underLine", cursor: "pointer" }}
                    onClick={() => toggle('activityList')}>
                    {`See More`}
                </NavLink>
            }
        </>
    )
}