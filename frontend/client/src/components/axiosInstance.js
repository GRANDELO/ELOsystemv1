
import axios from 'axios';


const token = sessionStorage.getItem('userToken');

const axiosInstance = axios.create({
  baseURL: 'https://elosystemv1.onrender.com/api', 
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Log the error message and any available response
    console.error('Axios Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
