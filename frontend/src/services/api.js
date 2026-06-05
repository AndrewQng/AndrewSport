import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Request Interceptor: Attach access token based on role/path
api.interceptors.request.use(
  (config) => {
    const isAdminPath = window.location.pathname.startsWith('/admin');
    const tokenKey = isAdminPath ? 'admin_token' : 'token';
    const token = localStorage.getItem(tokenKey);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const isAdminPath = window.location.pathname.startsWith('/admin');
      const refreshKey = isAdminPath ? 'admin_refreshToken' : 'refreshToken';
      const tokenKey = isAdminPath ? 'admin_token' : 'token';
      const refreshToken = localStorage.getItem(refreshKey);
      
      if (refreshToken) {
        try {
          // Perform call to refresh token endpoint
          // Use axios directly to prevent interceptor looping
          const response = await axios.post('http://localhost:8080/api/auth/refresh', {
            refreshToken: refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem(tokenKey, accessToken);
          localStorage.setItem(refreshKey, newRefreshToken);
          
          // Retry original request with new access token
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid, log out user
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(refreshKey);
          
          if (isAdminPath) {
            window.location.href = '/admin/login';
          } else {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
