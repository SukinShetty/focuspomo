'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This should be replaced with your actual authentication check
const isAuthenticated = () => {
  // Your authentication logic here
  return false; // Replace with actual auth check
};

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuth(props: any) {
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/login');
      }
    }, [router]);

    if (!isAuthenticated()) {
      return null; // or a loading indicator
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;