import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requiredRoles = [],
  fallbackPath = '/auth'
}: ProtectedRouteProps) => {
  const { user, profile, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && (!profile || !hasRole(requiredRoles))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;