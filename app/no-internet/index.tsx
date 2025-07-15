'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NoInternet() {
  const router = useRouter();

  useEffect(() => {
    function handleNetworkStatusChange() {
      if (navigator?.onLine) {
        router.back();
      }
    }

    handleNetworkStatusChange(); // Check initial network status

    window.addEventListener('online', handleNetworkStatusChange);
    return () => {
      window.removeEventListener('online', handleNetworkStatusChange);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* WiFi Off Icon */}
        <div className="mx-auto w-24 h-24 text-gray-400">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636l-12.728 12.728m0 0L7.05 16.95m-1.414 1.414L7.05 16.95m11.314-11.314L16.95 7.05M7.05 16.95l2.122-2.121M16.95 7.05L14.828 9.172M7.05 16.95L5.636 18.364M16.95 7.05l1.414-1.414M8.464 15.536l7.072-7.072M3 3l18 18"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lost internet connection
          </h1>
          <p className="text-gray-600">
            Please check your internet connection or try again later
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
