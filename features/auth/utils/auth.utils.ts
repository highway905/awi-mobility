/**
 * Utility functions for authentication
 */

export const handleLoginSuccess = (callback: () => void, delay: number = 100) => {
  setTimeout(callback, delay)
}

export const isLoginSuccessful = (response: any): boolean => {
  // Check for both status codes: 0 (internal success) and 200 (HTTP success)
  return (response?.statusCode === 0 || response?.statusCode === 200) && response?.response?.token
}

export const extractValidationErrors = (errors: Array<{ key: string; value: string }>): string => {
  return errors.map(err => err.value).join(", ")
}
