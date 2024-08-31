import { useRouter } from 'next/router';
import { useEffect } from 'react';

// This should be replaced with your actual authentication check
const isAuthenticated = () => {
  // Implement your authentication logic here
  return true;
};

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        router.push('/login');
      }
    }, []);

    if (isAuthenticated()) {
      return <WrappedComponent {...props} />;
    } else {
      return null; // or a loading indicator
    }
  };
};

export default withAuth;