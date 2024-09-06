import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthHOC = (props: any) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
    const intendedRoute = typeof window !== 'undefined' ? window.location.pathname : '/';

    useEffect(() => {
      if (!isLoggedIn) {
        // Redirect to login page with the intended route as a query parameter
        router.push(`/login?redirect=${encodeURIComponent(intendedRoute)}`);
      } else {
        setLoading(false);
      }
    }, [isLoggedIn, intendedRoute, router]);

    // Optionally, show a loading spinner while redirecting
    if (loading) {
        return <div>Loading...</div>; // You can customize this as needed
      }

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
