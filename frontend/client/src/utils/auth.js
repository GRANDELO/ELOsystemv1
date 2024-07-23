import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


export const logout = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const username = getUsernameFromToken();
    await axios.post('https://elosystemv1.onrender.com/api/auth/logout', {username}, {
      headers: {
        'Authorization': token
      }
    });

    // Clear the user token or session
    localStorage.removeItem('userToken'); // or your token key

    // Redirect to login page or perform other logout actions
    window.location.href = '/login';
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export const getUsernameFromToken = () => {
  const token = localStorage.getItem('userToken'); // or your token key

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.username;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  return null;
};