import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";

import Dropzone from 'react-dropzone';
import { toastAction } from '../../../../../redux/ToastActions';


export default ({
    options,
    detail,
    loading,
    changeImage,
}) => {


    const [type, setType] = useState("OPTICAL");


    const handleDrop = acceptedFiles => {
        // setFileNames(acceptedFiles.map(file => file.name))
        toastAction('true',"We are working on to uploading you image.")
    }

    const handleImageUpload = (data) => {
        changeImage(data)
    }

    const changeAnalytics = (type) => {
        setType(type)
    }


    return (
        <Row className='summary'>
            <Col md="12" sm="12" >
                <Col md="12" sm="12" className="summary-section">
                    <Row>
                        <Col>
                            <Nav pills className="custom-pills">
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: type === "OPTICAL" })}
                                        onClick={() => changeAnalytics('OPTICAL')}
                                    >
                                        EyeGlasses
                                </NavLink>
                                </NavItem>
                                <NavItem className="cp">
                                    <NavLink
                                        className={classnames({ active: type === "SUNWEAR" })}
                                        onClick={() => changeAnalytics('SUNWEAR')}
                                    >
                                        SunGlassess
                                </NavLink>
                                </NavItem>
                            </Nav>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TabContent activeTab={type} className="mt-3">
                                <TabPane tabId="OPTICAL">
                                    <Row>
                                        <Col md="12" className="images-categories" > Catalog Images </Col>
                                        <br></br>
                                        <Col md="6">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <span className="image-uploadin-help">Main view</span>
                                        </Col>
                                        <Col md="6">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <span className="image-uploadin-help">Grid view</span>
                                        </Col>
                                        <Col md="12" className="images-categories images-categories-separator"> Model Images </Col>
                                        <br></br>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </Col>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </Col>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </Col>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                        </Col>
                                        <Col md="12" className="images-categories images-categories-separator"> Detail Images </Col>
                                        <br></br>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <span className="image-uploadin-help">Front unfolded</span>
                                        </Col>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <span className="image-uploadin-help">Side view</span>
                                        </Col>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <span className="image-uploadin-help">45 degree view</span>
                                        </Col>
                                        <Col md="3">
                                            <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)} accept="image/*">
                                                {({ getRootProps, getInputProps }) => (
                                                    <div className="dropzone" {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                )}
                                            </Dropzone>
                                            <span className="image-uploadin-help">Folded</span>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </Col>
            </Col>
        </Row>
    )
}