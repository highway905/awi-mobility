import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/lib/redux/api/auth"
import { encryptedMessage } from "@/utils/rsa"
import type { 
  LoginFormData, 
  LoginSuccessResponse 
} from "../types/auth.types"
import { handleLoginSuccess, isLoginSuccessful } from "../utils/auth.utils"
import { isValidToken } from "@/utils/helper"

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

      // console.log("Login response:", response)
      // Check if login was successful and token exists
      if (isLoginSuccessful(response)) {
        // Double-check that we have a token and it's valid before redirecting
        if (response?.response?.token && isValidToken(response.response.token, response.response.expiryDate)) {
          // Successful login - redirect with a shorter delay to ensure credentials are saved
          handleLoginSuccess(() => {
            router.push("/dashboard")
          }, 100)
        } else {
          setError("Authentication failed. Invalid or expired token received.")
        }
      } else {
        // console.log("Login response:", response?.message)
        // For unsuccessful responses, use the API message or fallback to generic message
        setError(response?.message ? `Login failed: ${response.message}` : "Login failed due to an unknown error.")
      }
    } catch (error: unknown) {
      console.error("Login error:", error)
    }
  }, [loginMutation, router])

  return {
    login,
    isLoading,
    error: error, // Only show local validation errors, Redux handles API errors via toast
    clearError,
  }
}
