import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink, FormGroup, Input, Modal, ModalHeader, Button, Badge, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import ToggleButton from 'react-toggle-button';
import classnames from "classnames";
import FeatherIcon from "feather-icons-react";
import { getNumberFormat, titleCase, checkRoleAccess } from '../../utilities/methods';
import { roles_actions, s3BucketProduction } from '../../utilities/constants';
import './products.scss';
import FrameShowToAppModal from '../../views/modal/FrameShowToApp';

const OrdersList = ({
  products,
  options,
  handleFilter,
  history,
  loading,
  exportData,
  uploadExcelFile,
  time_zone,
  handleFilterSubmit,
  showFilter,
  setShowFilter,
  state,
  resetFilter,
  userData,
  getFrameGallery,
  showFramesOnApp
}) => {
  const { type } = state;
  const [search, setSearch] = useState('');
  const [modal, setModal] =  useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popup, setPopupData] = useState({status: false});

  useEffect(() => {
    if(type !== 'lens'){
      setPopoverOpen(false);
    }
  }, [type]); 

  const handleToggle = (status, data) => {
      setPopupData({...popup, ...data, status});
      getFrameGallery(data.sku);
  };

  const handleRedirection = (sku) => {
    if (type === 'frame') {
      window.open(`/frame/${sku}`, '_blank')
    } else if(type === 'clip-on') {
      window.open(`/clip-on/${sku}`, '_blank')
    } else {
      window.open(`/product/${type}/${sku}`, '_blank')
    }
  }

  const inputFileRef = useRef();
  const onFileChangeCapture = ( e ) => {
    uploadExcelFile(e.target);
    document.getElementById("lens").value = "";
  };
  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  };

  const toggleText = data => {
    let text = "Hidden";
    if(data.show_on_app && data.show_sunwear_on_app){
      text = "All";
    } else if(data.show_on_app){
      text = "Only Eyeglasses";
    } else if(data.show_sunwear_on_app){
      text = "Only Sunglasses";
    }
    return text;
  }
  return (
    <Row>
      <Col md="12">
        <Card>
          <CardBody>
            <Nav>
              <NavItem>
                <NavLink href="#" className={classnames({ active: type === "frame" })} onClick={() => handleFilter('type', 'frame')} style={{ textDecoration: type === 'frame' ? 'overline' : 'none' }}>
                  <h6>Frame</h6>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" className={classnames({ active: type === "clip-on" })} onClick={() => handleFilter('type', 'clip-on')} style={{ textDecoration: type === 'clip-on' ? 'overline' : 'none' }}>
                  <h6>Clip-On</h6>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" className={classnames({ active: type === "lens" })} onClick={() => handleFilter('type', 'lens')} style={{ textDecoration: type === 'lens' ? 'overline' : 'none' }}>
                  <h6>Lens</h6>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" className={classnames({ active: type === "contact-lens" })} onClick={() => handleFilter('type', 'contact-lens')} style={{ textDecoration: type === 'contact-lens' ? 'overline' : 'none' }}>
                  <h6>Contact Lens</h6>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" className={classnames({ active: type === "others" })} onClick={() => handleFilter('type', 'others')} style={{ textDecoration: type === 'others' ? 'overline' : 'none' }}>
                  <h6>Others</h6>
                </NavLink>
              </NavItem>
            </Nav>
            <br />
            <Row>
              <Col md="3">
                <Input type="text" name="search" id="search" placeholder="Search products" onKeyUp={event => { event.keyCode === 13 ? handleFilterSubmit(search) : setSearch(event.target.value) }} />
              </Col>
              <Col md="3">
                <FormGroup><Button type="button" color="primary" onClick={() => handleFilterSubmit(search)}>Filter</Button></FormGroup>
              </Col>
              <Col md="2" className="text-right">
                {checkRoleAccess(userData.accessRole, userData.permissions, 'export', roles_actions.is_get) &&
                  <FormGroup>
                    {/* <Button type="button" color="primary" disabled={loading} onClick={() => false}><i className="fas fa-file-excel"></i> Export</Button> */}
                  </FormGroup>
                }
              </Col>
              <Col md="4" className="text-right">
                {checkRoleAccess(userData.accessRole, userData.permissions, 'lens', roles_actions.is_add) &&
                  <FormGroup>
                    <Button type="button" color="primary" id={`Popover-1`} onClick={() => {
                      if (type === 'lens') {
                        setPopoverOpen(!popoverOpen)
                      }
                      else if (type === 'clip-on') {
                        history.push('/add-clip-on')
                      }
                      else if (type === 'frame') {
                        history.push('/add-frame')
                      }
                      else if (type === 'others') {
                        history.push('/add-others')
                      }
                      else if (type === 'contact-lens') {
                        history.push('/add-contact-lens')
                      }
                    }}>Add {titleCase(type)}</Button>
                    <Popover placement="bottom" isOpen={popoverOpen} target="Popover-1" toggle={() => setModal(!modal)}>
                      <PopoverHeader>Select Add Lens Option</PopoverHeader>
                      <PopoverBody style={{width:"300px"}} >
                        <FormGroup>
                          <Button color="primary" type="button" onClick={() => {
                            setPopoverOpen(!popoverOpen);
                            history.push('/add-lens');
                          }}>Input Manually</Button>
                          <Button color="primary" className="ml-1" type="button" onClick={() => {
                            setPopoverOpen(!popoverOpen);
                            onBtnClick();
                          }}>
                          Input With Excel
                        </Button>
                        </FormGroup>
                      </PopoverBody>
                  </Popover>
                  <input
                    type="file"
                    id="lens"
                    ref={inputFileRef}
                    onChangeCapture={onFileChangeCapture}
                    hidden={true}
                    accept=".xls,.xlsx"
                  />
                  </FormGroup>
                }
              </Col>
            </Row>
            <br />
            <BootstrapTable
              data={[...products.list]}
              remote
              condensed
              striped hover pagination
              options={{ ...options }}
              fetchInfo={{ dataTotalSize: products.total_rows }}
              tableHeaderClass="mb-0"

            >
              <TableHeaderColumn isKey width="100" dataField="sku" dataFormat={(cell, row) =>
                <NavLink href="#" active onClick={() => handleRedirection(row.sku)}>
                  {row.sku}
                </NavLink>
              }>
                SKU
                      </TableHeaderColumn>
              <TableHeaderColumn width="130" dataField="name" dataFormat={(cell, row) => titleCase(row.name)}>
                Product Name
                      </TableHeaderColumn>
              {['lens', 'contact-lens'].includes(type) &&
                <TableHeaderColumn width="100" dataField="brand" dataFormat={(cell, row) => titleCase(row.brand)}>
                  Brand
                        </TableHeaderColumn>
              }
              <TableHeaderColumn width="100" dataField="price" dataFormat={(cell, row) => getNumberFormat(row.price)}>
                Price
                      </TableHeaderColumn>
              {['frame'].includes(type) &&
                <TableHeaderColumn width="80" dataField="status" dataFormat={(cell, row) => {
                 return <Row><Col sm="5" className="text-left">{toggleText(row)}</Col> <Col sm="5" className="text-right"></Col><a href="#" style={{cursor: 'pointer'}}><FeatherIcon icon={'eye'} onClick={() => handleToggle(!popup.status, row)}/></a></Row>
                }}>
                </TableHeaderColumn>
              }
              <TableHeaderColumn width="70" dataField="status" dataFormat={(cell, row) =>
                <Badge color={row.status ? "success" : "danger"} className="mr-2" pill> {row.status ? 'Active' : 'De-Activate'} </Badge>
              }>
                Status
                      </TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
          <Modal
              isOpen={popup.status}
              toggle={() => setPopupData({...popup, status: true})}
              className={null}
              size="md"
          >
            <span className="text-center mt-4"><h4>Show {popup.name} To App</h4></span>
            <FrameShowToAppModal 
              history={history} 
              toggle={(status) => setPopupData({...popup, status})}
              detail={popup}
              gallery={products.gallery}
              getFrameGallery={getFrameGallery.bind(null)}
              s3BucketProduction={s3BucketProduction}
              showFramesOnApp={showFramesOnApp.bind(null)}
              loading={products.is_loading}
            />
          </Modal>
      </Col>
    </Row>
  );
};

OrdersList.defaultProps = {
  handleFilterSubmit: () => false,
  resetFilter: () => false
}

export default OrdersList;

