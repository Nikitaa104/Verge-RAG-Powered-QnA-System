import axios from 'axios';

// Create an Axios instance pointing to our backend API
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('verge_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user data on 401 Unauthorized
      localStorage.removeItem('verge_auth');
      localStorage.removeItem('verge_token');
      localStorage.removeItem('verge_email');
      localStorage.removeItem('verge_name');
      
      // Dispatch a custom event that AuthContext or App.tsx can listen to
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
