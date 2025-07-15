/**
 * Utility functions for authentication
 */

export const handleLoginSuccess = (callback: () => void, delay: number = 100) => {
  setTimeout(callback, delay)
}

export const isLoginSuccessful = (response: any): boolean => {
  return response?.statusCode === 0 && response?.response?.token
}

export const extractValidationErrors = (errors: Array<{ key: string; value: string }>): string => {
  return errors.map(err => err.value).join(", ")
}
