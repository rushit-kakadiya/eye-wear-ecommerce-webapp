import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AuthRoutes from "../routes/AppointmentRoutes";
import './layout.scss'


const AppointmentLayout = () => {
  return (
    <div className="appointment-container">
      <Switch>
        {AuthRoutes.map((prop, key) => {
          if (prop.redirect)
            return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        })}
      </Switch>
    </div>
  );
};
export default AppointmentLayout;


