import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { motion } from "framer-motion";

interface NexusSectionHeroProps {
  /** Badge affiché au-dessus du titre */
  badge?: string;
  /** Icône du badge */
  badgeIcon?: LucideIcon;
  /** Titre principal de la section */
  title: string;
  /** Sous-titre ou description narrative */
  subtitle?: string;
  /** Label du CTA principal */
  ctaLabel?: string;
  /** Lien du CTA principal */
  ctaHref?: string;
  /** Icône du CTA */
  ctaIcon?: LucideIcon;
  /** Action onClick pour le CTA (alternative au href) */
  onCtaClick?: () => void;
  /** Contenu additionnel (statistiques, badges, etc.) */
  children?: ReactNode;
  /** Variante de couleur */
  variant?: 'dark' | 'light' | 'gradient';
  /** Taille du hero */
  size?: 'sm' | 'md' | 'lg';
  /** Classe additionnelle */
  className?: string;
}

/**
 * NexusSectionHero - Composant Hero pour les pages intérieures NEXUS
 * 
 * Version compacte du Hero principal, conçu pour :
 * - Les pages intérieures avec un design Premium Dark
 * - Support RTL intégré
 * - Animations douces (NEXUS Layer 1)
 * - Badge, titre, sous-titre et CTA optionnel
 */
export function NexusSectionHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  ctaIcon: CtaIcon,
  onCtaClick,
  children,
  variant = 'dark',
  size = 'md',
  className = '',
}: NexusSectionHeroProps) {
  const { isRTL } = useDirection();

  const sizeClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20',
  };

  const variantClasses = {
    dark: 'bg-transparent text-white',
    light: 'bg-[hsl(var(--nx-bg))] text-[hsl(var(--nx-text-900))]',
    gradient: 'bg-gradient-to-br from-[hsl(var(--nx-night))] via-[hsl(var(--nx-deep))] to-[hsl(var(--nx-network)/0.2)]',
  };

  return (
    <section className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          className="text-center space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Badge animé */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Badge 
                variant="outline" 
                className={`
                  px-4 py-2 border-[hsl(var(--nx-gold)/0.4)] 
                  ${variant === 'dark' || variant === 'gradient' 
                    ? 'bg-[hsl(var(--nx-gold)/0.1)] text-[hsl(var(--nx-gold))]' 
                    : 'bg-[hsl(var(--nx-brand-900)/0.1)] text-[hsl(var(--nx-brand-900))]'
                  }
                  shadow-[var(--nx-shadow-sm)]
                `}
              >
                {BadgeIcon && (
                  <BadgeIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                )}
                {badge}
              </Badge>
            </motion.div>
          )}

          {/* Titre principal avec dégradé */}
          <motion.h1 
            className={`
              text-[28px] md:text-[36px] lg:text-[42px] font-bold leading-tight max-w-3xl mx-auto
              ${variant === 'dark' || variant === 'gradient' 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-[hsl(var(--nx-gold)/0.9)] to-[hsl(var(--nx-cyan))]' 
                : 'text-[hsl(var(--nx-text-900))]'
              }
            `}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {title}
          </motion.h1>

          {/* Sous-titre narrative */}
          {subtitle && (
            <motion.p 
              className={`
                text-base md:text-lg max-w-2xl mx-auto leading-relaxed
                ${variant === 'dark' || variant === 'gradient' 
                  ? 'text-white/70' 
                  : 'text-[hsl(var(--nx-text-500))]'
                }
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* CTA */}
          {(ctaLabel && (ctaHref || onCtaClick)) && (
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              {ctaHref ? (
                <Button 
                  asChild 
                  className={`
                    rounded-[var(--nx-radius-md)] px-6 py-2.5 
                    transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]
                    ${variant === 'dark' || variant === 'gradient'
                      ? 'bg-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold)/0.9)] text-[hsl(var(--nx-night))]'
                      : 'bg-[hsl(var(--nx-brand-900))] hover:bg-[hsl(var(--nx-brand-700))] text-white'
                    }
                  `}
                >
                  <Link to={ctaHref} className={`inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {CtaIcon && <CtaIcon className="w-4 h-4" />}
                    {ctaLabel}
                  </Link>
                </Button>
              ) : (
                <Button 
                  onClick={onCtaClick}
                  className={`
                    rounded-[var(--nx-radius-md)] px-6 py-2.5 
                    transition-all duration-[var(--nx-dur-2)] ease-[var(--nx-ease)]
                    ${variant === 'dark' || variant === 'gradient'
                      ? 'bg-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold)/0.9)] text-[hsl(var(--nx-night))]'
                      : 'bg-[hsl(var(--nx-brand-900))] hover:bg-[hsl(var(--nx-brand-700))] text-white'
                    }
                  `}
                >
                  <span className={`inline-flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {CtaIcon && <CtaIcon className="w-4 h-4" />}
                    {ctaLabel}
                  </span>
                </Button>
              )}
            </motion.div>
          )}

          {/* Contenu additionnel */}
          {children && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default NexusSectionHero;
