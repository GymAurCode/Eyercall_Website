import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  console.log('[AUTH] ProtectedRoute checking - token:', token ? 'exists' : 'null', 'user:', user ? 'exists' : 'null');

  if (!token) {
    console.log('[AUTH] No token, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (isTokenExpired(token)) {
    console.log('[AUTH] Token expired, logging out and redirecting to /login');
    useAuthStore.getState().logout();
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.log('[AUTH] No user, showing loading...');
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-base">
        <div className="text-muted text-sm font-medium animate-pulse">Loading session...</div>
      </div>
    );
  }

  console.log('[AUTH] User authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
export { ProtectedRoute };
