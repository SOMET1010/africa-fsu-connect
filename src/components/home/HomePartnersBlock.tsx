import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import atuLogo from "@/assets/atu-logo.png";

export function HomePartnersBlock() {
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
        <p className="text-xs uppercase tracking-widest text-[hsl(var(--nx-text-500))] mb-4">{title}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <img src={atuLogo} alt="ATU - Union Africaine des Télécommunications" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          {items.map((partner, i) => (
            <span key={i} className="text-sm text-[hsl(var(--nx-text-700))] font-medium px-4 py-2 rounded-full border border-[hsl(var(--nx-border))]">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
