import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:5000',  // Updated from localhost to deployed backend URL
  withCredentials: true,
=======
  baseURL: 'https://crpms-backend-folder.onrender.com',
  withCredentials: true
>>>>>>> 9ed1186cd82586c09df9fe0878899f3a85dc9bf2
});

export default api;