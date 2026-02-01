import axios from 'axios';
import {Clerk} from "@clerk/clerk-js";

// Create axios instance
const axiosInstance = axios.create();

// Initialize Clerk instance if needed outside of React components
// TODO: Remove clerk-js and use react-clerk for get token
const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY); 
await clerk.load();

// Request interceptor
axiosInstance.interceptors.request.use(
  async(config) => {
    // Add auth token if available
    const token = await clerk.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add common headers
    config.headers['Content-Type'] = 'application/json';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login only if not already on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/') {
        // localStorage.removeItem('authToken');
        window.location.href = '/';
      }
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
