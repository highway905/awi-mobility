import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserCred, resetUserCred, isValidUserCredentials } from "@/utils/helper"

interface UseAuthRedirectReturn {
  isRedirecting: boolean
}

export const useAuthRedirect = (): UseAuthRedirectReturn => {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    try {
      const userCred = getUserCred("userCred")
      
      // Validate token and expiry before redirecting
      if (userCred && isValidUserCredentials(userCred) && !isRedirecting) {
        setIsRedirecting(true)
        router.push("/orders")
      } else if (userCred && !isValidUserCredentials(userCred)) {
        // Clear invalid credentials
        resetUserCred()
      }
    } catch (error) {
      // Silent fail - clear any corrupted data and user just needs to login normally
      resetUserCred()
    }
  }, [router, isRedirecting])

  return { isRedirecting }
}
