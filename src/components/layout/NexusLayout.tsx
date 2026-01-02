import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * NoiseOverlay - Texture cinématographique granuleuse
 * Donne une profondeur premium au fond sombre
 */
const NoiseOverlay = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
    }}
    aria-hidden="true"
  />
);

interface NexusLayoutProps {
  children: ReactNode;
  /** Si true, désactive le scroll automatique en haut */
  preserveScroll?: boolean;
}

/**
 * NexusLayout - Layout Premium Dark pour les pages intérieures
 * 
 * Caractéristiques :
 * - Fond bleu nuit (nx-night)
 * - Texture noise overlay
 * - Scroll automatique en haut à chaque changement de route
 * - Compatibilité avec le système AppShell existant
 */
export function NexusLayout({ children, preserveScroll = false }: NexusLayoutProps) {
  const { pathname } = useLocation();

  // Scroll en haut de page à chaque changement de route
  useEffect(() => {
    if (!preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, preserveScroll]);

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-night))] text-white relative">
      {/* Texture granuleuse cinématographique */}
      <NoiseOverlay />
      
      {/* Contenu de la page */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default NexusLayout;
