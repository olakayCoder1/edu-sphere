import axios from 'axios';

// Constants
const USER_STORAGE_KEY = 'eduSphereUser';
const AUTH_HEADER = 'Authorization';
const BEARER = 'Bearer';
const TOKEN_REFRESH_ENDPOINT = '/auth/token/refresh/';

// Create the API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to each request
api.interceptors.request.use(
  (config) => {
    // Only add auth headers in the browser
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem(USER_STORAGE_KEY);
        if (userStr) {
          const userData = JSON.parse(userStr);
          
          console.log(config)
          console.log(config)
          console.log(config)
          console.log(config)
          // Check if we have tokens in the stored data
          if (userData.tokens?.access) {
            // Add authorization header with JWT token
            config.headers[AUTH_HEADER] = `${BEARER} ${userData.tokens.access}`;
          }
        }
      } catch (error) {
        console.error('Error accessing token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Keep track of refresh attempts to prevent infinite loops
let isRefreshing = false;
let refreshSubscribers: any = [];

// Helper to process queued requests after token refresh
const processQueue = (error:any, token = null) => {
  refreshSubscribers.forEach((cb: (arg0: any, arg1: null) => any) => cb(error, token));
  refreshSubscribers = [];
};

// Add a response interceptor to handle token refresh and avoid redirect loops
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only attempt refresh for 401 errors, not already retried, and in browser context
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      typeof window !== 'undefined'
    ) {
      // Set flag to avoid retry cycles
      originalRequest._retry = true;
      
      // Check if we're already refreshing to avoid multiple calls
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Get the refresh token
          const userStr = localStorage.getItem(USER_STORAGE_KEY);
          if (!userStr) throw new Error('No user data found');
          
          const userData = JSON.parse(userStr);
          if (!userData.tokens?.refresh) throw new Error('No refresh token found');
          
          console.log('Attempting token refresh...');
          
          // Call your refresh token endpoint
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}${TOKEN_REFRESH_ENDPOINT}`,
            { refresh: userData.tokens.refresh }
          );
          
          // Update the tokens in localStorage
          if (response.data.access) {
            userData.tokens.access = response.data.access;
            userData.timestamp = Date.now(); // Update timestamp
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
            
            // Process queued requests with new token
            processQueue(null, response.data.access);
            
            // Update the authorization header for original request
            originalRequest.headers[AUTH_HEADER] = `${BEARER} ${response.data.access}`;
            
            console.log('Token refresh successful');
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
          // Process queued requests with error
          processQueue(refreshError, null);
          
          // Clear auth data and redirect to login
          localStorage.removeItem(USER_STORAGE_KEY);
          sessionStorage.removeItem('isLoggedIn');
          
          // Only redirect to login if we're not already on the login page
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/auth/sign-in')) {
            console.log('Redirecting to login after refresh failure');
            window.location.href = '/auth/sign-in';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((error: any, token: any) => {
            if (error) {
              return reject(error);
            }
            
            if (token) {
              originalRequest.headers[AUTH_HEADER] = `${BEARER} ${token}`;
            }
            
            resolve(api(originalRequest));
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;