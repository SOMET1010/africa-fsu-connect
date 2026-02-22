import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface NexusLayoutProps {
  children: ReactNode;
  /** Si true, désactive le scroll automatique en haut */
  preserveScroll?: boolean;
}

/**
 * NexusLayout - Layout institutionnel clair pour les pages intérieures
 */
export function NexusLayout({ children, preserveScroll = false }: NexusLayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, preserveScroll]);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default NexusLayout;
