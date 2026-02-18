import { motion } from "framer-motion";
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }} className="container mx-auto px-4 pb-8">
      <div className={cn("text-center", isRTL && "text-right")}>
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">{title}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <img src={atuLogo} alt="ATU - Union Africaine des Télécommunications" className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          {items.map((partner, i) => (
            <span key={i} className="text-sm text-white/30 font-medium px-4 py-2 rounded-full border border-white/10">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
