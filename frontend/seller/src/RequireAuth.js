import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const RequireAuth = () => {
    var isAuthenticated = Boolean(sessionStorage.getItem('userToken')); 
    var token = Cookies.get('token');

  if(!isAuthenticated)
    {
        if(token) 
            { 
                isAuthenticated = token; 
                sessionStorage.setItem('userToken', token);
            }
    }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default RequireAuth;
