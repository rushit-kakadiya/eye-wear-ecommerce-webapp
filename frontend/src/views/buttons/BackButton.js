import React from 'react';
import { NavLink } from "react-router-dom";

const BackButton = ({history, path, action, data}) => {
    return path ? <NavLink to={{pathname: path,  state: { detail: data }}} onClick={()=>  action() }><i style={{fontSize: '20px'}}className="mdi mdi-arrow-left-bold-circle"></i></NavLink> : <NavLink to="#" onClick={()=>  history.goBack()}><i style={{fontSize: '20px'}}className="mdi mdi-arrow-left-bold-circle"></i></NavLink>
}

BackButton.defaultProps = {
    path: null,
    action: () => false
}
    
export default BackButton;