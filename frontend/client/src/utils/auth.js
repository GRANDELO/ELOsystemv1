import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const getUsernameFromToken = () => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.username;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('userToken');
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
    localStorage.removeItem('userToken'); // or your token key

    // Redirect to login page or perform other logout actions
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
