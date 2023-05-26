/*global google*/
import React from "react";
import className from "classnames"
import AutoComplete from 'react-google-autocomplete';
import {  Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";


export default ({ markerposition,  onMarkerDragEnd, mapAddress, dropAddress, updateMarker,  mapModal, toggleMap, confirmLocation}) => {

    return (
        <div>
            <Modal size="lg" className="location-modal" isOpen={mapModal} toggle={toggleMap} >
                <ModalHeader toggle={toggleMap} cssModule={{'modal-title': 'w-100 text-center'}} className="location-map-head">SEARCH ADDRESS</ModalHeader>
                <ModalBody>
                    <Col md="12" className="mapAddress">    
                        <AutoComplete
                            className="form-control"
                            apiKey={"AIzaSyAi11lLDJCDlCM3iLi8O-TZgWkKbWLtORc"}
                            onPlaceSelected={(place) => updateMarker(place)}
                            placeholder="Search your province, district, etc"
                            options={{
                               types: ["geocode", "establishment" ]
                            }}
                        />
                    </Col>
                    <GoogleMap
                        center={markerposition}
                        zoom={16}
                        mapContainerStyle={{ height: "400px", width: "100%" }}
                    >
                        <Marker
                            position={markerposition}
                            draggable={true}
                            onDragEnd={(coord) => onMarkerDragEnd(coord)}

                        >
                            <span>{"place"}</span>
                        </Marker>
                    </GoogleMap>
                    <Col md="12" className="mapAddress">
                        <div>{dropAddress}</div>
                    </Col>
                </ModalBody>
                <ModalFooter className="location-map-footer" cssModule={{'modal-title': 'w-100 text-center'}}>
                        <Col md={{ size: 8, offset: 2 }} sm="12" xs="12" >
                            <Button onClick={confirmLocation} className="button-staurdays">CHOOSE THIS LOCATION</Button>
                        </Col>
                </ModalFooter>
            </Modal>
        </div>
    );
}

