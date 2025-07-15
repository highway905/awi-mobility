/**
 * Global error handler utility
 * Provides consistent error handling across the application
 */

import { errorMessage } from './errorMessage';

// Error types
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  SERVER = 'server',
  NOT_FOUND = 'not_found',
  CLIENT = 'client',
}

// Error handler options
interface ErrorHandlerOptions {
  showToast?: boolean;
  redirect?: boolean;
  logToConsole?: boolean;
}

// Default options
const defaultOptions: ErrorHandlerOptions = {
  showToast: true,
  redirect: true,
  logToConsole: true,
};

/**
 * Handle API errors consistently across the application
 */
export const handleApiError = (
  error: any, 
  options: ErrorHandlerOptions = defaultOptions
) => {
  const { showToast, redirect, logToConsole } = { ...defaultOptions, ...options };
  
  // Log error to console if enabled
  if (logToConsole) {
    console.error('API Error:', error);
  }
  
  // Get error details
  const status = error?.response?.status;
  const message = error?.response?.data?.response?.message || error?.message || 'An unexpected error occurred';
  
  // Determine error type
  let errorType = ErrorType.CLIENT;
  
  if (!error.response) {
    errorType = ErrorType.NETWORK;
  } else if (status === 401) {
    errorType = ErrorType.AUTHENTICATION;
  } else if (status === 403) {
    errorType = ErrorType.AUTHORIZATION;
  } else if (status === 404) {
    errorType = ErrorType.NOT_FOUND;
  } else if (status >= 500) {
    errorType = ErrorType.SERVER;
  } else if (status === 422 || status === 400) {
    errorType = ErrorType.VALIDATION;
  }
  
  // Show toast notification if enabled
  if (showToast) {
    if (errorType === ErrorType.VALIDATION && error?.response?.data?.response?.validationFailed) {
      errorMessage(error?.response?.data?.response?.validationErrors?.[0]?.value);
    } else {
      errorMessage(message);
    }
  }
  
  // Handle redirects if enabled
  if (redirect && typeof window !== 'undefined') {
    if (errorType === ErrorType.AUTHENTICATION) {
      window.location.href = '/login';
    } else if (errorType === ErrorType.AUTHORIZATION) {
      window.location.href = '/unauthorized';
    } else if (errorType === ErrorType.NOT_FOUND) {
      window.location.href = '/not-found';
    } else if (errorType === ErrorType.SERVER) {
      window.location.href = '/server-error';
    } else if (errorType === ErrorType.NETWORK) {
      window.location.href = '/no-internet';
    }
  }
  
  // Return error details for further handling if needed
  return {
    type: errorType,
    status,
    message,
    originalError: error,
  };
};

/**
 * Format validation errors from the API
 */
export const formatValidationErrors = (errors: any[]) => {
  if (!errors || !Array.isArray(errors)) {
    return {};
  }
  
  return errors.reduce((acc, error) => {
    if (error.key && error.value) {
      acc[error.key] = error.value;
    }
    return acc;
  }, {});
};