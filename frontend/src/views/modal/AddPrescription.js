import React, {useState} from "react";
import { Row, Col, Card, CardBody, Input, Label, Button } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

export default ({loading, addUpdataPrescription, selectedPrescription, isPreview}) => {
  const [state, setState] = useState({
    label: selectedPrescription.label || 'My Prescription',
    spheris_l: selectedPrescription.spheris_l || '0',
    spheris_r: selectedPrescription.spheris_r || '0',
    cylinder_l: selectedPrescription.cylinder_l || '0',
    cylinder_r: selectedPrescription.cylinder_r || '0',
    axis_l: selectedPrescription.axis_l || '0',
    axis_r: selectedPrescription.axis_r || '0',
    addition_l: selectedPrescription.addition_l || '0',
    addition_r: selectedPrescription.addition_r || '0',
    pupilary_distance: selectedPrescription.pupilary_distance || '0'
  });
  const rows = [
      {value: 'r', spheris_r: state.spheris_r, cylinder_r: state.cylinder_r, axis_r: state.axis_r, addition_r: state.addition_r},
      {value: 'l', spheris_l: state.spheris_l, cylinder_l: state.cylinder_l, axis_l: state.axis_l, addition_l: state.addition_l}
  ];
  const handleOnChange = (key, value) => {
    setState({...state, [key]: value});
  }
  return (
      <Row>
        <Col md="12">
          <Card>
            <CardBody>
            <Label>Label:</Label>
                    <Row>
                        <Col md="4">
                            <Input disabled={isPreview} type="text" name="label" value={state.label} placeholder="My Prescription" onChange={(e) => handleOnChange('label', e.target.value)}/>
                        </Col>
                    </Row>
                    <br/>
                    <BootstrapTable
                      data={rows}
                      striped hover 
                      tableHeaderClass="mb-0"
                    >
                      <TableHeaderColumn width="100" dataField="value" dataFormat={(cell, row) => row.value === 'r' ? 'Right' : 'Left'} isKey>
                        
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataFormat={(cell, row) => <input disabled={isPreview} type="number" value={row[`spheris_${row.value}`]} onChange={(e) => handleOnChange(`spheris_${row.value}`, e.target.value)}/>}>
                        SPH
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataFormat={(cell, row) => <input disabled={isPreview} type="number" value={row[`cylinder_${row.value}`]} onChange={(e) => handleOnChange(`cylinder_${row.value}`, e.target.value)}/>}>
                        CYL
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataFormat={(cell, row) => <input disabled={isPreview} type="number" value={row[`axis_${row.value}`]} onChange={(e) => handleOnChange(`axis_${row.value}`, e.target.value)}/>}>
                        AXIS
                      </TableHeaderColumn>
                      <TableHeaderColumn width="100" dataFormat={(cell, row) => <input disabled={isPreview} type="number" value={row[`addition_${row.value}`]} onChange={(e) => handleOnChange(`addition_${row.value}`, e.target.value)}/>}>
                        ADD
                      </TableHeaderColumn>
                    </BootstrapTable>
                    <br/>
                    <Label>PD:</Label>
                    <Row>
                        <Col md="4">
                            <Input disabled={isPreview} type="number" name="pd" value={state.pupilary_distance} onChange={(e) => handleOnChange('pupilary_distance', e.target.value)}/>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                      {!isPreview  && <Col md="6"><Button disabled={loading} color="primary" size="lg" onClick={() => addUpdataPrescription(state)}>{selectedPrescription && selectedPrescription.id  ? 'Update and Add to Cart' : 'Save'}</Button></Col>}
                      </Row>
              </CardBody>
            </Card>
        </Col>
      </Row>
  );
};

