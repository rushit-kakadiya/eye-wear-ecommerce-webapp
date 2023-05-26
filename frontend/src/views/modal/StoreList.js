import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Form,
  FormGroup,
  Button,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Select from 'react-select';

export default ({history, stores, hadnleStoreSelection, toggle, storeId = '', buttonText = '', title = ''}) => {
  const [selectedStore, setSelectedStore] = useState(null);
  const store = stores.find(s => s.id.toString() === storeId.toString());
  
  useEffect(() => {
    if(store && store.id){
       setSelectedStore({value: store.id, label: store.name});
    }
  },[store]);

  const handleChange = value => {
    setSelectedStore(value);
  }; 
  return (
    <Form
        onSubmit={(e) => {
            e.preventDefault();
            if (
                !selectedStore
            ) {
                return;
            }
            hadnleStoreSelection(selectedStore);
            if(history && (history.location.pathname === "/order" || history.location.pathname.includes('/customer/detail/') || history.location.pathname.includes('/hto/detail/')))
            {
              history.push('/order/add');
            } else {
              toggle('store');
            }
        }}
    >
        <ModalBody>
          <Row>
            <Col className="text-center">
              <h4>{title || ''}</h4>
                <FormGroup>
                    <Select
                      placeholder="Select a store"
                      value={selectedStore}
                      onChange={handleChange.bind(null)}
                      isDisabled={!!storeId}
                      options={stores.map(row => ({value: row.id, label: row.name}))}
                    />
                </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" disabled={!selectedStore}>
            {buttonText|| 'Go Next'}
          </Button>
        </ModalFooter>
    </Form>
  );
};


