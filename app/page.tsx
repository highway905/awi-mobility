"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserCred } from "@/utils/helper";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle authentication and redirection
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      try {
        const userCred = getUserCred("userCred");
        
        if (userCred?.token) {
          // Redirect to the orders page if the token exists
          router.push("/orders");
        } else {
          // Redirect to the login page if the token is missing
          router.push("/login");
        }
      } catch (error) {
        console.error("Navigation error:", error);
        // Fallback to login page on error
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use a timeout to ensure the router is ready and localStorage is accessible
    const timer = setTimeout(checkAuthAndRedirect, 300);
    return () => clearTimeout(timer);
  }, [router]);
  
  // Network status check
  useEffect(() => {
    function handleNetworkStatusChange() {
      if (typeof navigator !== 'undefined' && !navigator?.onLine) {
        router.push('/no-internet');
      }
    }

    if (typeof window !== 'undefined') {
      handleNetworkStatusChange(); // Check initial network status
      window.addEventListener('offline', handleNetworkStatusChange);

      return () => {
        window.removeEventListener('offline', handleNetworkStatusChange);
      };
    }
  }, [router]);
  
  // Show a loading indicator while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  );
}