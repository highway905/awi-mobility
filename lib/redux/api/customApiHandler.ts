/* eslint-disable consistent-return */
import axios from 'axios';
import { errorMessage } from '@/utils/errorMessage';
import { successMessage } from '@/utils/successMessage';
import { getUserCred, loginCredentials, resetUserCred } from '@/utils/helper';
import { handleApiError } from '@/utils/errorHandler';

const BASE_URL = process.env.HOST_API_KEY || "http://localhost:8080/";

let isRefreshing = false;
const refreshSubscribers: any = [];

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Get error details
    const status = error?.response?.status;
    const originalRequest = error?.config;
    
    // If we have a user session
    if (getUserCred('userCred')) {
      // Handle 403 Forbidden - Access denied
      if (status === 403) {
        resetUserCred();
        if (typeof window !== 'undefined') {
          window.location.href = '/unauthorized';
        }
        return Promise.reject(error);
      }

      // Handle 404 Not Found
      // if (status === 404) {
      //   if (typeof window !== 'undefined') {
      //     window.location.href = '/not-found';
      //   }
      //   return Promise.reject(error);
      // }
      
      // Handle 500 Server Error
      // if (status === 500) {
      //   if (typeof window !== 'undefined') {
      //     window.location.href = '/server-error';
      //   }
      //   return Promise.reject(error);
      // }

      // Handle 401 Unauthorized - Token refresh
      const getUserData = getUserCred('userCred');
      if (status === 401 && getUserData?.token) {
        if (!isRefreshing) {
          isRefreshing = true;
          
          // Try to refresh the token
          axiosInstance.post(`core/api/auth/RefreshToken/`, {
            token: getUserData?.token,
            refreshToken: getUserData?.refreshToken,
          })
            .then((res: any) => {
              isRefreshing = false;
              const valueToRefresh = {
                ...getUserData,
                token: res?.data?.response?.token,
                refreshToken: res?.data?.response?.refreshToken,
              };
              loginCredentials('userCred', valueToRefresh);
              loginCredentials('warehouseIds', valueToRefresh);
              onRefreshes(res?.data?.response?.token);
            })
            .catch(() => {
              isRefreshing = false;
              // If refresh fails, log out
              let showMessage = false;
              resetUserCred();
              if (!showMessage) {
                errorMessage("You've been logged out due to inactivity, please login again.");
                showMessage = true;
              }
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
            });
        }

        // Queue the original request to retry after token refresh
        const retryOrigReq = new Promise((resolve) => {
          subscribeTokenRefresh((token: any) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
        return retryOrigReq;
      }
    }
    
    // Network errors
    if (!error.response) {
      if (typeof window !== 'undefined' && navigator && !navigator.onLine) {
        window.location.href = '/no-internet';
      }
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config: any) => {
    const getUserData = getUserCred('userCred');
    if (getUserData && getUserData?.token) {
      config.headers.Authorization = `Bearer ${getUserData?.token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

function subscribeTokenRefresh(cb: any) {
  refreshSubscribers.push(cb);
}

function onRefreshes(token: any) {
  refreshSubscribers.forEach((cb: any) => cb(token));
  // Clear subscribers after calling them
  refreshSubscribers.length = 0;
}

const customApiHandler =
  (): any =>
  async ({ url, method, body, params, needError, successCode }: any) => {
    try {
      // Make the request using our configured axios instance
      const result = await axiosInstance({
        url,
        method,
        data: body,
        params,
      });
      
      // Show success message if needed
      if (successCode && result?.data?.statusCode === 200) {
        successMessage(successCode);
      }

      return { data: result.data };
    } catch (error: any) {
      
      // For development/testing - simulate successful response for specific endpoints
      if (process.env.NODE_ENV === 'development' && url.includes('Order/GetAll')) {
        return { 
          data: { 
            statusCode: 200, 
            response: { 
              items: [], 
              totalCount: 0 
            } 
          } 
        };
      }
      
      // Show error message if needed
      if (needError) {
        if (error?.response?.data?.response?.validationFailed) {
          errorMessage(error?.response?.data?.response?.validationErrors?.[0]?.value);
        } else {
          errorMessage(error?.response?.data?.response?.message || "Network connection error");
        }
      }
      
      // Return error response or fallback
      return { 
        data: error?.response?.data || { 
          statusCode: error?.response?.status || 500, 
          response: { 
            message: error?.message || "Network connection error", 
            items: [], 
            totalCount: 0 
          } 
        } 
      };
    }
  };

export default customApiHandler;