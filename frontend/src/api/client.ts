import axios from 'axios';
import Cookies from 'js-cookie';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';
const API_BASE_URL = 'http://localhost:3000/';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the CSRF token
api.interceptors.request.use((config) => {
  // List of methods that require CSRF protection
  const methodsRequiringCSRF = ['post', 'put', 'patch', 'delete'];

  // Only add CSRF token for relevant methods
  if (config.method && methodsRequiringCSRF.includes(config.method)) {
    // Read the token from the cookie set by Rails
    const csrfToken = Cookies.get('CSRF-TOKEN'); // Ensure cookie name matches Rails

    if (csrfToken) {
      // Set the X-CSRF-Token header
      config.headers['X-CSRF-Token'] = csrfToken;
    } else {
       console.warn('CSRF token not found in cookies. Request might fail.');
    }
  }
  return config;
}, (error) => {
  // Do something with request error
  return Promise.reject(error);
});
