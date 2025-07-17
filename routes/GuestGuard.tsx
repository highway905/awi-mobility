import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserCred, resetUserCred, isValidUserCredentials } from '@/utils/helper';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const getUserData = getUserCred('userCred');
      
      // Validate token and expiry
      if (getUserData && isValidUserCredentials(getUserData)) {
        // User is authenticated, redirect to orders
        router.push('/orders');
      } else if (getUserData && !isValidUserCredentials(getUserData)) {
        // Clear invalid/expired credentials
        resetUserCred();
      }
      
      setIsInitialized(true);
    };

    // Use a short delay to ensure localStorage is accessible
    const timer = setTimeout(checkAuthAndRedirect, 100);
    return () => clearTimeout(timer);
  }, [router]);

  // Show loading indicator while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
