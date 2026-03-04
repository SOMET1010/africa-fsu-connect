import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ROUTES, getProtectedRoutes, getAdminRoutes } from "@/config/routes";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PageLoadingFallback } from "@/components/app/PageLoadingFallback";
import { useCriticalPreloader } from "@/hooks/usePreloader";
import { usePageMetadata } from "@/hooks/usePageMetadata";
import { UserRole } from "@/types/userRole";

// Eager loaded pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Presentation from "@/pages/Presentation";
import NotFound from "@/pages/NotFound";

// Lazy loaded pages
const PresentationAnalytics = lazy(() =>
    import('@/components/presentation/PresentationAnalytics').then(m => ({ default: m.PresentationAnalytics }))
);

// Constantes rôles admin
const ADMIN_ROLES: UserRole[] = ['super_admin', 'country_admin'];

export function AppRoutes() {
    useCriticalPreloader();
    usePageMetadata(window.location.pathname);

    // Wrapper pour les routes protégées
    const wrapProtected = (Component: any, requiredRoles?: UserRole[]) => (
        <ProtectedRoute requiredRoles={requiredRoles} fallbackPath="/dashboard">
            <AppShell>
                <Suspense fallback={<PageLoadingFallback />}>
                    <Component />
                </Suspense>
            </AppShell>
        </ProtectedRoute>
    );

    return (
        <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AppShell hideFooter><Auth /></AppShell>} />
            <Route path="/presentation" element={<Presentation />} />

            {/* Routes admin */}
            <Route path="/presentation/analytics" element={wrapProtected(PresentationAnalytics, ADMIN_ROLES)} />

            {/* Routes publiques dynamiques */}
            {ROUTES.filter(r => !r.isProtected && r.path !== '/presentation').map(({ path, component: Component }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <AppShell>
                            <Suspense fallback={<PageLoadingFallback />}>
                                <Component />
                            </Suspense>
                        </AppShell>
                    }
                />
            ))}

            {/* Routes protégées dynamiques */}
            {[...getProtectedRoutes(), ...getAdminRoutes()].map(({ path, component: Component, requiredRoles }) => (
                <Route
                    key={path}
                    path={path}
                    element={wrapProtected(Component, requiredRoles as UserRole[])}
                />
            ))}

            {/* Catch-all */}
            <Route path="*" element={<AppShell><NotFound /></AppShell>} />
        </Routes>
    );
}