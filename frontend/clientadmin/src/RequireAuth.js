import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  
    var isAuthenticated = Boolean(sessionStorage.getItem('admintoken')); 
    var token = localStorage.getItem('admintoken');

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
