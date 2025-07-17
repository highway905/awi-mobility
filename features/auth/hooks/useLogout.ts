import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLogoutMutation } from "@/lib/redux/api/auth"
import { resetUserCred } from "@/utils/helper"

interface UseLogoutReturn {
  logout: () => Promise<void>
  isLoading: boolean
}

export const useLogout = (): UseLogoutReturn => {
  const router = useRouter()
  const [logoutMutation, { isLoading }] = useLogoutMutation()

  const logout = useCallback(async () => {
    try {
      // Call logout API
      await logoutMutation().unwrap()
    } catch (error) {
      console.error("Logout API error:", error)
      // Even if API fails, clear local credentials
    } finally {
      // Always clear credentials and redirect to login
      resetUserCred()
      
      // Force the redirection to login page - both with Next.js router and as a fallback
      router.push("/login")
      
      // As a fallback, also use direct navigation to ensure we leave orders page
      // This helps prevent any issues with Next.js router cache/state
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = "/login"
        }
      }, 100)
    }
  }, [logoutMutation, router])

  return {
    logout,
    isLoading,
  }
}
