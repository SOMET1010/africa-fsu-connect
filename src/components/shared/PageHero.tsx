import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ModernButton } from '@/components/ui/modern-button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

interface PageHeroProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaIcon?: LucideIcon;
  onCtaClick?: () => void;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  ctaLabel,
  ctaIcon: CtaIcon,
  onCtaClick,
  className,
}) => {
  const { isRTL } = useDirection();

  return (
    <ScrollReveal direction="fade">
      <div className={cn(
        "relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10",
        className
      )}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className={cn(
            "absolute top-0 w-96 h-96 bg-[hsl(var(--nx-gold)/0.2)] rounded-full blur-3xl",
            isRTL ? "left-0" : "right-0"
          )} />
          <div className={cn(
            "absolute bottom-0 w-64 h-64 bg-[hsl(var(--nx-cyan)/0.2)] rounded-full blur-2xl",
            isRTL ? "right-0" : "left-0"
          )} />
        </div>
        
        <div className="relative px-8 py-12 md:px-12 md:py-16">
          <div className="max-w-3xl">
            {/* Badge */}
            {badge && (
              <Badge variant="outline" className={cn(
                "mb-4 px-4 py-2 border-white/20 bg-white/5 text-white/80",
                isRTL && "flex-row-reverse"
              )}>
                {BadgeIcon && <BadgeIcon className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />}
                {badge}
              </Badge>
            )}
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h1>
            
            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg text-white/60 max-w-2xl mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}
            
            {/* CTA */}
            {ctaLabel && onCtaClick && (
              <ModernButton
                onClick={onCtaClick}
                className={cn("gap-2", isRTL && "flex-row-reverse")}
              >
                {CtaIcon && <CtaIcon className="w-4 h-4" />}
                {ctaLabel}
              </ModernButton>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default PageHero;
