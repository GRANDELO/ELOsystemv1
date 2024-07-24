
import axios from 'axios';


const token = sessionStorage.getItem('userToken');

const axiosInstance = axios.create({
  baseURL: 'https://elosystemv1.onrender.com/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
