import axios from 'axios';

// Creez o instanță Axios configurată
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // baza pentru toate requesturile
  withCredentials: true, // în caz că folosești cookies (pentru refresh token, login etc.)
});

// Adaug interceptor pe fiecare request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
