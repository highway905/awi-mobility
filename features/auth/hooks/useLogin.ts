import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/lib/redux/api/auth"
import { encryptedMessage } from "@/utils/rsa"
import type { 
  LoginFormData, 
  LoginSuccessResponse, 
  LoginErrorResponse 
} from "../types/auth.types"
import { handleLoginSuccess, isLoginSuccessful, extractValidationErrors } from "../utils/auth.utils"

interface UseLoginReturn {
  login: (data: LoginFormData) => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter()
  const [loginMutation, { isLoading }] = useLoginMutation()
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async (data: LoginFormData) => {
    console.log("123")
    console.log("Data : ", data)
    
    try {
      setError(null)

      // Validate inputs before encryption
      if (!data.email?.trim() || !data.password?.trim()) {
        setError("Please enter both email and password.")
        return
      }

      const body = {
        username: encryptedMessage(data.email.trim().toLowerCase()),
        password: encryptedMessage(data.password),
      }

      const response = await loginMutation(body).unwrap() as LoginSuccessResponse

      // Check if login was successful
      if (isLoginSuccessful(response)) {
        // Successful login - redirect with a slight delay to ensure credentials are saved
        handleLoginSuccess(() => {
          router.push("/orders")
        })
      } else {
        setError("Invalid credentials. Please check your email and password.")
      }
    } catch (error: unknown) {
      console.error("Error :",error)
      const apiError = error as LoginErrorResponse
       console.error("Error API:",apiError)

      // Handle API error response format
      if (apiError?.response?.validationFailed && apiError?.response?.validationErrors) {
        const validationMessages = extractValidationErrors(apiError.response.validationErrors)
        setError(validationMessages || "Validation failed")
      } else if (apiError?.response?.message) {
        setError(apiError.response.message)
      } else if (apiError?.message) {
        setError(apiError.message)
      } else {
        setError("Unable to connect. Please check your internet connection and try again.")
      }
    }
  }, [loginMutation, router])

  return {
    login,
    isLoading,
    error,
    clearError,
  }
}
