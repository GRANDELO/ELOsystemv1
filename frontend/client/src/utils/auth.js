import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

    await axios.post('https://elosystemv1.onrender.com/api/auth/logout', { username }, {
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
