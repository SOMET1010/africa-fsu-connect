import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import atuLogo from "@/assets/atu-logo.png";

export function HomePartnersBlock({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const d = variant === 'dark';
  const { isRTL } = useDirection();
  const { getBlock } = useHomepageContent();

  const content = getBlock('partners');
  if (!content) return null;

  const title = content.title as string || 'Partenaires';
  const items = content.items as string[] || [];

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 pb-8 animate-fade-in" style={{ contentVisibility: 'auto' }}>
      <div className={cn("text-center", isRTL && "text-right")}>
        <p className={cn("text-xs uppercase tracking-widest mb-4", d ? "text-white/50" : "text-[hsl(var(--nx-text-500))]")}>{title}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <img src={atuLogo} alt="ATU - Union Africaine des Télécommunications" className={cn("h-12 w-auto transition-opacity", d ? "opacity-60 hover:opacity-100 invert" : "opacity-70 hover:opacity-100")} />
          {items.map((partner, i) => (
            <span key={i} className={cn("text-sm font-medium px-4 py-2 rounded-full border", d ? "text-white/75 border-white/20" : "text-[hsl(var(--nx-text-700))] border-[hsl(var(--nx-border))]")}>
              {partner}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
