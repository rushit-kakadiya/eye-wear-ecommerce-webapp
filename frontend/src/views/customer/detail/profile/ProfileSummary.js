import React from 'react';
import { Row, Col, NavLink, Button, Badge} from "reactstrap";

export default ({detail, address, toggle, setEditedValue}) => {
    const dob = detail.dob ? new Date(detail.dob).toDateString().split(" ") : null;
    const getCustomerSource = (type= '') =>{
        if (type === 'store'){
                return <div className="border border-success text-success" style={{textAlign:"center", borderRadius:'50px', width:'80%'}}><i className="fas fa-home mr-1"></i>from Store</div>
        }if (type === 'app'){
                return <div className="border border-info text-info" style={{textAlign:"center", borderRadius:'50px', width:'80%'}}><i className="fas fa-mobile-alt mr-1"></i>from App</div>
            } else {
                return <div className="border border-danger text-danger" style={{textAlign:"center", borderRadius:'50px', width:'100%'}}><i className="fas fa-database mr-1"></i>from Database</div>
            }
    }
    return(
        <div className="pb-3">
            <Row>
                <Col sm={detail.channel === 'data_insert' ? 8 : 9}  className="text-muted pt-3">
                <h4>PROFILE</h4>
                </Col>
                <Col className="mt-2">{getCustomerSource(detail.channel)}</Col>
                
            </Row>
            <Row>
                <Col sm={5} className="text-dark font-bold">Email</Col>
                <Col sm={3} className="text-dark font-bold">Birthdate</Col>
                <Col sm={2} className="text-dark font-bold">Gender</Col>
                <Col className="ml-4"><i className=" fas fa-pencil-alt text-success ml-1" style={{cursor: "pointer"}}  onClick={()=>{toggle('addUser');}}></i></Col>
            </Row>
            <Row>
                <Col sm={5}>{detail.email}</Col>
                <Col sm={3}>{ dob ? `${dob[1]} ${dob[2]} ${dob[3]}` : '---'}</Col>
                <Col sm={2}>{detail.gender === 1 ? 'Male' : 'Female'}</Col>
            </Row>
            <hr/>
            {address.length>0 &&
            <Row className="mt-2">
                <Col sm={11} className="text-dark font-bold">Address</Col>
                <i className=" fas fa-pencil-alt text-success" style={{cursor: "pointer"}}  onClick={()=> { setEditedValue(address[0]); toggle('addAddress'); }}></i>
                <Col>{ address[0].address}</Col>
            </Row>}
            {address.length>1 ?
            <NavLink to="#"  className="text-info align-items-end " style={{ display: "contents", textDecoration:"underLine", cursor: "pointer"}} onClick={()=>toggle('addressList')}>{`View ${address.length-1} More`}</NavLink>:
                <Row>
                    <Col sm={4}>
                    <Button style={{width: '100%'}} color="primary mt-2" type="button" onClick={()=>{ setEditedValue(null); toggle('addAddress');}} >
                            + Add New Address
                    </Button>
                    </Col>
                </Row>
            }
      </div>
    )
}