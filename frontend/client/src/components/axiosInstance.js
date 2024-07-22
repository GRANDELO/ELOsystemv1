
import axios from 'axios';

// Retrieve the token from localStorage
const token = localStorage.getItem('token');

// Create an Axios instance with the base URL and authorization headers
const axiosInstance = axios.create({
  baseURL: 'https://elosystemv1.onrender.com/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
