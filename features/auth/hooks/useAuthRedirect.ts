import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserCred } from "@/utils/helper"

interface UseAuthRedirectReturn {
  isRedirecting: boolean
}

export const useAuthRedirect = (): UseAuthRedirectReturn => {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    try {
      const userCred = getUserCred("userCred")
      if (userCred?.token && !isRedirecting) {
        setIsRedirecting(true)
        router.push("/orders")
      }
    } catch (error) {
      // Silent fail - user just needs to login normally
    }
  }, [router, isRedirecting])

  return { isRedirecting }
}
