import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3021', // Your API base URL
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    config.headers.token = token ? token : '';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);


export default api;