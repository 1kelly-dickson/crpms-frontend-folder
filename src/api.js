import axios from 'axios';

const api = axios.create({
  baseURL: 'https://crpms-backend-folder.onrender.com',
  withCredentials: true
});

export default api;
