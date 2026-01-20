import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Updated from localhost to deployed backend URL
  withCredentials: true,
});

export default api;