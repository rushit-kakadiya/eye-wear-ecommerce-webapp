import React from "react";
import indexRoutes from "./routes";
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ConnectedRouter } from "connected-react-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { configureStore } from "./redux/Store";
import { History } from "./jwt/_helpers";
import { PrivateRoute } from "./routes/PrivateRoutes";
import BlankLayout from "./layouts/BlankLayout";
import AppointmentLayout from "./layouts/AppointmentLayout";

const { Store, Persistor } = configureStore();
const App = () => {

  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
      <ConnectedRouter history={History}>
      <ToastContainer />
      <Router history={History}>
        <Switch>
          <Route exact path="/authentication/Login" component={BlankLayout} />;
          <Route exact path="/tryon/Login" component={AppointmentLayout} />;
          <Route exact path="/tryon/Appointment" component={AppointmentLayout} />;
          <Route exact path="/tryon/thankyou" component={AppointmentLayout} />;
          {indexRoutes.map((prop, key) => {
            return (
              <PrivateRoute
                path={prop.path}
                key={key}
                component={prop.component}
                store={Store}
              />
            );
          })}
        </Switch>
      </Router>
      </ConnectedRouter>
      </PersistGate>
    </Provider>
  );
};
export default App;
