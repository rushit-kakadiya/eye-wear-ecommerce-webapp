import {lazy } from "react";

const Login = lazy(() => (import("../views/authentication/Login")));
const Recoverpwd = lazy(() => (import('../views/authentication/RecoverPwd')));
const Maintanance = lazy(() => (import('../views/authentication/Maintanance')));

var AuthRoutes = [
    { path: '/authentication/Login', name: 'Login', icon: 'mdi mdi-account-key', component: Login },
    { path: '/authentication/RecoverPwd', name: 'Recover Password', icon: 'mdi mdi-account-convert', component: Recoverpwd },
    { path: '/authentication/Maintanance', name: 'Maintanance', icon: 'mdi mdi-pencil-box-outline', component: Maintanance }
];
export default AuthRoutes; 