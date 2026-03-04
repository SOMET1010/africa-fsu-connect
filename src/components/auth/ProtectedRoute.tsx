import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    requiredRoles?: UserRole[];
    fallbackPath?: string; // redirection si non autorisé
}

const ProtectedRoute = ({
    children,
    requireAuth = true,
    requiredRoles = ["super_admin","country_admin", "editor", "focal_point", "contributor", "reader"]
    //requiredRoles = []
}: ProtectedRouteProps) => {
    const { user, profile, loading, profileLoading, hasRole, hasPermissionURL } = useAuth();
    const location = useLocation();

    // 🔹 Loading global auth
    if (loading || profileLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // 🔹 Vérification authentification
    if (requireAuth && !user) {
        return <Navigate to="/auth" replace />;
    }

    // 🔹 Vérification des rôles
    /*if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        return <Navigate to="/dashboard" replace />;
    }*/

    // 🔹 Vérification de la permission sur la page, sauf pour les pages publiques essentielles
    const publicPaths = ['/dashboard', '/auth', '/']; // Autoriser ces pages même si non listées
    if (!publicPaths.includes(location.pathname) && !hasPermissionURL(location.pathname)) {
        return <Navigate to='/dashboard' replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;