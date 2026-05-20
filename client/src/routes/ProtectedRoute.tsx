import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Protected Route — blocks unauthenticated users.
 *
 * HOW IT WORKS:
 * ┌──────────────────────────────────────────┐
 * │ User visits /dashboard                   │
 * │   ↓                                      │
 * │ ProtectedRoute checks: isAuthenticated?  │
 * │   ↓                                      │
 * │ YES → render child routes (<Outlet />)   │
 * │ NO  → redirect to /login                 │
 * └──────────────────────────────────────────┘
 *
 * <Outlet /> is a React Router concept — it renders
 * whatever child route matches the current URL.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Still checking localStorage — show nothing (prevents flash)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  // Not logged in — redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in — render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
