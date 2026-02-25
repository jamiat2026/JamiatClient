'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import Loader from './loader';

function AuthGate({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthRoute = pathname === '/login' || pathname === '/set-password';

  useEffect(() => {
    // Only redirect if not on auth routes and unauthenticated
    if (status === 'unauthenticated' && !isAuthRoute) {
      router.replace('/login');
    }
  }, [status, isAuthRoute, router]);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  // While redirecting (or during unauthenticated render)
  return null;
}

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthGate>{children}</AuthGate>
    </SessionProvider>
  );
}
