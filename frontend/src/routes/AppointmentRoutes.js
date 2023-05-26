import {lazy } from "react";

const Login = lazy(() => (import("../containers/CustomerLogin")));
const Appointment = lazy(() => (import('../containers/Appointment')));
const ThankYou = lazy(() => (import('../views/appointment/ThankYou')));

var AuthRoutes = [
    { path: '/tryon/Login', name: 'Login', icon: 'mdi mdi-account-key', component: Login },
    { path: '/tryon/Appointment', name: 'Appointment', icon: 'mdi mdi-account-convert', component: Appointment },
    { path: '/tryon/thankyou', name: 'Thank You', icon: 'mdi mdi-account-convert', component: ThankYou }
];
export default AuthRoutes; 