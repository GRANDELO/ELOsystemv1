
import axios from 'axios';


const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: 'https://elosystemv1.onrender.com/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
