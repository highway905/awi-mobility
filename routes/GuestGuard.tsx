import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PATH_DASHBOARD } from '@/routes/paths';
// components
import { getUserCred } from '@/utils/helper';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { push } = useRouter();

  const getUserData = getUserCred('userCred');
  const isAuthenticated = !!getUserData?.token;
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      push(PATH_DASHBOARD.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (isInitialized === isAuthenticated) {
    return <></>;
  }

  return <> {children} </>;
}
