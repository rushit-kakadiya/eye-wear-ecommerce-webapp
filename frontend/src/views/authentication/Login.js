import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CustomInput,
  Form,
  Row,
  Col,
  Label,
  Button,
  FormGroup
} from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { login } from "../../redux/user/action";
import img2 from "../../assets/images/big/auth-bg.jpg";
import { homeUrl } from "../../environment";

const sidebarBackground = {
  backgroundImage: "url(" + img2 + ")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
};

export default (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state);
  const { register, handleSubmit, errors } = useForm(); // initialise the hook

  const doLogin = (data) => {
    dispatch(login({ ...data, role: 1 })).then(
      () => {
        props.history.replace(homeUrl);
      },
      (error) => {
        // error
      }
    );
  };

  return (
    <div
      className="auth-wrapper  align-items-center d-flex"
      style={sidebarBackground}
    >
      {/*--------------------------------------------------------------------------------*/}
      {/*Login2 Cards*/}
      {/*--------------------------------------------------------------------------------*/}
      <div className="container">
        <div>
          <Row className="no-gutters justify-content-center">
            <Col md="6" lg="4" className="bg-dark text-white">
              <div className="p-4">
                <h2 className="display-5">
                  Hi,
                  <br /> <span className="text-cyan font-bold">Admin</span>
                </h2>
                <p className="op-5 mt-4">
                  Welcome Eyewear Admin
                </p>
              </div>
            </Col>
            <Col md="6" lg="4" className="bg-white">
              <div className="p-4">
                <h3 className="font-medium mb-3">Sign In to Admin</h3>
                <Form className="mt-3" id="loginform" onSubmit={handleSubmit(doLogin)} >
                  <FormGroup>
                    <Label for="email" className="font-medium">
                      Email
                    </Label>
                    <InputGroup className="mb-2" size="lg">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ti-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <input
                        type="text"
                        name="email"
                        ref={register({
                          required: true,
                          pattern: /^\S+@\S+$/i
                        })}
                        className="form-control"
                      />
                    </InputGroup>
                    <span className="text-danger">{errors.email && 'Email is required.'}</span>
                  </FormGroup>
                  <FormGroup>
                    <Label for="password" className="font-medium">
                      Password
                    </Label>
                    <InputGroup className="mb-3" size="lg">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ti-pencil"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <input
                        type="password"
                        name="password"
                        ref={register({
                          required: true,
                          //pattern: /^\S+@\S+$/i
                        })}
                        className="form-control"
                      />
                    </InputGroup>
                    <span className="text-danger">{errors.password && 'Password is required.'}</span>
                  </FormGroup>
                  {/* <FormGroup>
                  <div className="d-flex no-block align-items-center mb-4 mt-4">
                    <CustomInput
                      type="checkbox"
                      id="exampleCustomCheckbox"
                      label="Remember Me"
                    />
                  </div>
                  </FormGroup> */}
                  <Row className="mb-3">
                    <Col xs="12">
                      <Button
                        color="primary"
                        size="lg"
                        type="submit"
                        block
                        disabled={user.is_loading}
                      >
                        Log In
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

