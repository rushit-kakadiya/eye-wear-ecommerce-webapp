import React from  'react';
import classnames from "classnames";
import { Row, Col, Card, CardBody, Nav, NavLink, NavItem, Button, Input, Badge, Tooltip} from "reactstrap";
import Pagination from "react-js-pagination";
import {addDayDate, getFormatDate, titleCase, getNumberFormat, checkRoleAccess} from '../../utilities/methods';
import {roles_actions} from '../../utilities/constants';

export default ({history, loading, list, editDiscount, options, handlePageChange, page, setPage, status, setStatus, setSearch, tooltipOpen, setTooltipOpen, userData}) => {
  
     const toggle = (id) => { 
         if(id === tooltipOpen){
            setTooltipOpen('');
         } else {
            setTooltipOpen(id);
         }
        
    };

    const handleStatus = (data) => {
        if(tooltipOpen)
        {
            setTooltipOpen('')
        }
        setStatus(data);
        setPage(1);
    }
    
    const getStatus = (row) => {
        if(status === 'all'){
            if(row.status === 2) {
                return "Inactive";
            } else if (row.is_expired){
                return "Expired";
            } else if (getFormatDate(row.start_at, 24) >  getFormatDate(new Date())){
                return "Scheduled";
            } else if(row.status === 1) {
                return 'Active';
            } 
        } 
        else {
            return titleCase(status);
        }
    }
    const getVoucherList = () => {
        if(loading) {
            return <h4 style={{marginLeft: '40%'}}>loading...</h4>;
        } else if (list.total_rows === 0) {
            return <h4 style={{marginLeft: '40%', marginTop:"5%"}}>There is no data to display!</h4>;
        } else {
            return list && list.list.map((row, index)=>
                <Row className="m-3 border" key={index} >
                    <Col className="p-2" sm={4}>
                        <b>{row.voucher_title} {row.voucher_code}</b> <br/>
                        {row.voucher_sku_mapping_type === 3  ? row.voucher_type === 1 ? 
                        `${row.voucher_percentage+'% off of all products'}` : `${getNumberFormat(row.voucher_amount)+ ' off for all products'}` : row.voucher_type === 1 ? 
                        `${row.voucher_percentage+'% off of specific products'}` : `${getNumberFormat(row.voucher_amount)+ ' off for specific products'}`    
                        }
                    </Col>
                    <Col sm={2} className="p-2"> 
                        <Badge color={row.status === 2 || row.is_expired ? "danger" : "success"} className="mr-2" pill>{getStatus(row)}</Badge>
                    </Col>
                    <Col className="p-2" sm={2}>
                        {row.max_count} * used
                    </Col>
                    <Col className="p-2" sm={3}>
                        From {`${addDayDate(row.start_at)+' - '+addDayDate(row.expire_at)}`}
                    </Col>
                    { row.status !== 2 &&
                    <Col className="p-2">
                        <i className="fa fa-ellipsis-h" aria-hidden="true" style={{cursor: "pointer"}} onClick={() => toggle(row.id)} id="TooltipExample">
                        <Tooltip placement="bottom" isOpen={tooltipOpen === row.id} target="TooltipExample">
                        <div style={{cursor: "pointer"}} onClick={()=>editDiscount('view', row.id)}>View</div>
                        { !row.is_expired && checkRoleAccess(userData.accessRole, userData.permissions, 'voucher', roles_actions.is_update) &&
                            <div style={{cursor: "pointer"}} onClick={()=>editDiscount('edit', row.id)}>Edit</div>
                        }
                        {
                            checkRoleAccess(userData.accessRole, userData.permissions, 'voucher', roles_actions.is_delete) &&
                            <div style={{cursor: "pointer"}} onClick={()=>editDiscount('delete', row.id)}>Delete</div>
                        }
                        </Tooltip> 
                        </i>
                    </Col>}
                </Row>) 
        }
    }
    
    return(
        <Row>
            <Col md="12">
            <Card>
                <CardBody>
                    <Row>
                    <Col sm={10}>
                        <Nav>
                            <h3>Discount</h3>
                        </Nav>
                    </Col> 
                    <Col>
                    {checkRoleAccess(userData.accessRole, userData.permissions, 'voucher', roles_actions.is_add) &&
                        <Button color="info" onClick={()=>history.push('/settings/add-discount')}>Add Discount </Button>
                    }  
                    </Col>
                    </Row>
                    <Row>
                    <Col sm={9}>
                    <Nav pills className="custom-pills mt-4">
                        <NavItem>
                            <NavLink
                            className={classnames({ active: status === "all" })}
                            onClick={() => {
                                handleStatus("all");
                            }}
                            >
                                All
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: status === "active" })}
                            onClick={() => {
                                handleStatus("active");
                            }}
                            >
                                Active
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: status === "scheduled" })}
                            onClick={() => {
                                handleStatus("scheduled");
                            }}
                            >
                                Scheduled
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: status === "expired" })}
                            onClick={() => {
                                handleStatus("expired");
                            }}
                            >
                                Expired
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                            className={classnames({ active: status === "inactive" })}
                            onClick={() => {
                                handleStatus("inactive");
                            }}
                            >
                                Inactive
                            </NavLink>
                        </NavItem>
                        </Nav>
                    </Col>
                    <Col sm={3} className="mt-4">
                    <Input type="text" name="search" id="search" placeholder="Search Promo" onKeyUp={(event)=>setSearch(event.target.value)} />
                    </Col>
                </Row> 
                { getVoucherList() } 
                { list.total_rows > 0 && !loading &&
                    <Row style={{float:'right'}} > 
                        <Col >
                        <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            activePage={page}
                            itemsCountPerPage={options.pageSize}
                            totalItemsCount={list.total_rows}
                            pageRangeDisplayed={options.pageRange}
                            onChange={(e)=>handlePageChange(e)}
                            prevPageText="<"
                            nextPageText=">"
                        />
                        </Col>
                    </Row>   
                }         
                </CardBody>
            </Card>
            </Col>
        </Row>
    )
}