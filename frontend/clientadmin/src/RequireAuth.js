import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
    var isAuthenticated = Boolean(sessionStorage.getItem('userToken')); 
    var token = localStorage.getItem('token');

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
