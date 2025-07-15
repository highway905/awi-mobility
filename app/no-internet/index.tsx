import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';

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
    <Fragment>
      <Head>
        <title> Internet Connection Error | AWI</title>
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            No Internet Connection
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please check your internet connection and try again.
          </p>
        </div>
      </div>
    </Fragment>
  );
}
