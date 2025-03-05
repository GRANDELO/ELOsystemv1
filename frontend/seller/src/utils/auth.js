import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../components/axiosInstance';
import Cookies from 'js-cookie';

export const getUsernameFromToken = () => {
  const token = sessionStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.username;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const getToken = () => {
  return sessionStorage.getItem('userToken');
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getemailFromToken = () => {
  const token = sessionStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.email;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const getcategoryFromToken = () => {
  const token = sessionStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.category;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    const token = sessionStorage.getItem('userToken');
    const username = getUsernameFromToken();

    if (!token || !username) {
      console.error('Token or username is missing.');
      return;
    }

    await axiosInstance.post('/auth/logout', { username }, {
      headers: {
        'Authorization': token
      }
    });

    // Clear the user token or session
    sessionStorage.removeItem('userToken'); // or your token key

    // Redirect to login page or perform other logout actions
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const getagentnoFromToken = () => {
  const token = sessionStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.agentnumber;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};


export const getdpnoFromToken = () => {
  const token = sessionStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.dpnumber;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};