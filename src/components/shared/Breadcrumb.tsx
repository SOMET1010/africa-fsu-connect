import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items = [], className = "" }: BreadcrumbProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  // Auto-generate breadcrumbs from current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const routeMap: Record<string, string> = {
      dashboard: t('dashboard.title') || 'Tableau de bord',
      analytics: t('nav.analytics') || 'Analytics',
      projects: t('nav.projects') || 'Projets',
      docs: t('nav.library') || 'Bibliothèque',
      forum: t('nav.forum') || 'Forum',
      submit: t('nav.submit') || 'Soumettre',
      events: t('nav.events') || 'Événements',
      profile: t('nav.profile') || 'Profil',
      admin: t('nav.admin') || 'Administration',
      organizations: t('nav.organizations') || 'Organisations',
      training: t('nav.learn.elearning') || 'Formation',
      indicators: t('nav.indicators') || 'Indicateurs',

      // Layer 1 (public)
      network: t('nav.network') || 'Réseau',
      members: t('nav.network.members') || 'Pays membres',
      map: t('nav.network.map') || t('nav.map') || 'Carte',
      community: t('nav.community') || 'Communauté',
      about: t('nav.about') || 'À propos',
      activity: t('nav.network.activity') || 'Activité récente',
      country: t('country.tab.contact') ? 'Pays' : 'Pays',
    };


    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Accueil', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  // Don't show breadcrumb on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2" />
          )}
          
          {index === 0 && (
            <Home className="h-4 w-4 mr-1" />
          )}
          
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;