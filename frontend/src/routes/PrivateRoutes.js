import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, store,  ...rest }) => (

  <Route
    {...rest}
    render={(props) => {
      const user = store.getState().user;
      if (!user.is_login) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{
              pathname: window.location.host.includes('hto') ? "/tryon/Login" : "/authentication/Login",
              state: { from: props.location },
            }}
          />
        );
      } else if(user.data.accessRole !== 'super-admin' && user.data.permissions && user.data.permissions.findIndex(permission => props.location.pathname.includes(permission.module_name)) === -1){
        return (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: props.location },
            }}
          />
        );
      }

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;
