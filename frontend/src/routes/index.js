import { lazy } from "react";
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const BlankLayout = lazy(() => import("../layouts/BlankLayout.js"));
const AppointmentLayout = lazy(() => import("../layouts/AppointmentLayout"));

var indexRoutes = [
  { path: "/authentication", name: "Athentication", component: BlankLayout },
  { path: "/tryon", name: "Appointment", component: AppointmentLayout },
  { path: "/", name: "Dashboard", component: FullLayout },
];

export default indexRoutes;
