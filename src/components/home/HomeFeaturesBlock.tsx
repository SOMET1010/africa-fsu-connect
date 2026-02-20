import { Users, Network, FileText, ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ICON_MAP: Record<string, LucideIcon> = { Users, Network, FolderGit2: Network, FileText };

const LINK_MAP: Record<string, string> = {
  Users: "/map",
  Network: "/projects",
  FolderGit2: "/projects",
  FileText: "/resources",
};

const CTA_MAP: Record<string, string> = {
  Users: "Explorer le réseau",
  Network: "Voir les projets",
  FolderGit2: "Voir les projets",
  FileText: "Consulter",
};

const FALLBACK_FEATURES = [
  { icon: "Users", title: "54 Pays Membres", description: "Réseau panafricain des agences de régulation" },
  { icon: "Network", title: "Projets FSU", description: "Partage d'expériences et bonnes pratiques" },
  { icon: "FileText", title: "Ressources", description: "Documentation et guides méthodologiques" },
];

function parseTitle(title: string): { number: number | null; label: string } {
  const match = title.match(/^(\d+)\s+(.+)$/);
  if (match) {
    return { number: parseInt(match[1], 10), label: match[2] };
  }
  return { number: null, label: title };
}

function FeatureCard({ feature, index, isVisible, variant = 'light' }: {
  feature: { icon: string; title: string; description: string };
  index: number;
  isVisible: boolean;
  variant?: 'light' | 'dark';
}) {
  const d = variant === 'dark';
  const { isRTL } = useDirection();
  const Icon = ICON_MAP[feature.icon] || FileText;
  const link = LINK_MAP[feature.icon];
  const cta = CTA_MAP[feature.icon];
  const { number, label } = parseTitle(feature.title);

  return (
    <ScrollReveal delay={index * 150} direction="up">
      <div
        className={cn(
          "group p-6 rounded-xl transition-all duration-300 hover:-translate-y-1",
          d ? "bg-white/5 border border-white/10 hover:border-[hsl(var(--nx-gold))]/40 hover:shadow-lg" : "bg-[hsl(var(--nx-surface))] border border-[hsl(var(--nx-border))] shadow-[var(--nx-shadow-sm)] hover:border-[hsl(var(--nx-gold))]/40 hover:shadow-[var(--nx-shadow-md)]",
          isRTL && "text-right"
        )}
      >
        <div className={cn("flex flex-col gap-4", isRTL && "items-end")}>
          {/* Icon with glow */}
          <div className="p-2.5 rounded-lg bg-[hsl(var(--nx-gold))]/10 border border-[hsl(var(--nx-gold))]/20 w-fit">
            <Icon className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
          </div>

          {/* Title with animated counter */}
          <div>
            {number !== null ? (
              <div className="mb-1">
                <span className={cn("text-3xl font-bold", d ? "text-white" : "text-[hsl(var(--nx-text-900))]")}>
                  {isVisible ? <AnimatedCounter value={number} duration={1200} /> : "0"}
                </span>
                <span className={cn("text-base font-semibold ml-2", d ? "text-white" : "text-[hsl(var(--nx-text-900))]")}>{label}</span>
              </div>
            ) : (
              <h3 className={cn("font-semibold text-lg mb-1", d ? "text-white" : "text-[hsl(var(--nx-text-900))]")}>{label}</h3>
            )}
            <p className={cn("text-sm", d ? "text-white/70" : "text-[hsl(var(--nx-text-500))]")}>{feature.description}</p>
          </div>

          {/* CTA link */}
          {link && cta && (
            <Link
              to={link}
              className={cn(
                "inline-flex items-center gap-1 text-xs text-[hsl(var(--nx-brand-900))] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-[hsl(var(--nx-brand-700))]",
                isRTL && "flex-row-reverse"
              )}
            >
              {cta}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

export function HomeFeaturesBlock({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { t } = useTranslation();
  const { getBlock, isLoading } = useHomepageContent();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const content = getBlock('features');
  const items = (content?.items as Array<{ icon: string; title: string; description: string }>) || FALLBACK_FEATURES;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 bg-[hsl(var(--nx-border))] rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="container mx-auto px-4 pb-12" style={{ contentVisibility: 'auto' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} isVisible={isVisible} variant={variant} />
        ))}
      </div>
    </div>
  );
}
