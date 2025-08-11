import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// TODO for future use, e.g., for authentication
// api.interceptors.request.use(cfg => {
//   const token = localStorage.getItem('token');
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });