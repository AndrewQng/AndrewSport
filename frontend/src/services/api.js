import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
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
    
    // Check if the request was to an authentication endpoint.
    // If so, do not attempt token refresh or automatic redirection to prevent infinite reload loops.
    const isAuthRequest = originalRequest.url?.includes('/auth/me') || 
                          originalRequest.url?.includes('/auth/login') || 
                          originalRequest.url?.includes('/auth/refresh') ||
                          originalRequest.url?.includes('/auth/logout');
                          
    if (isAuthRequest) {
      return Promise.reject(error);
    }
    
    // Check if error is 401 and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const isAdminPath = window.location.pathname.startsWith('/admin');
      
      try {
        // Perform call to refresh token endpoint using cookies
        await axios.post('http://localhost:8080/api/auth/refresh', {}, {
          withCredentials: true
        });
        
        // Retry original request (browser will attach cookies automatically)
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or invalid, clear local display state and redirect
        const tokenKey = isAdminPath ? 'admin_token' : 'token';
        const refreshKey = isAdminPath ? 'admin_refreshToken' : 'refreshToken';
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(refreshKey);
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('fullName');
        
        const currentPath = window.location.pathname;
        if (isAdminPath) {
          if (currentPath !== '/admin/login') {
            window.location.href = '/admin/login';
          }
        } else {
          if (currentPath !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
