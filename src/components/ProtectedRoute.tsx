"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig'; // Import Firebase Auths

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check Firebase authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false);
        router.push('/login'); // Redirect to login if not authenticated
      }
      setLoading(false); // Stop loading state once authentication check is done
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, [router]);

  // While loading the authentication status, show a loading spinner or message
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ice-blue">Loading...</div>;
  }

  // Render children only if the user is authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
