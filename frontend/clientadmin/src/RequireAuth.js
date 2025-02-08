import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const RequireAuth = () => {
  
    var isAuthenticated = Boolean(sessionStorage.getItem('admintoken')); 
    var token = Cookies.get('admintoken');

  if(!isAuthenticated)
    {
        if(token) 
            { 
                isAuthenticated = token; 
                sessionStorage.setItem('admintoken', token);
            }
    }
    console.log("i was here" + isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireAuth;
