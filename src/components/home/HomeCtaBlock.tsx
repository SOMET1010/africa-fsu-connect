import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useHomepageContent } from "@/hooks/useHomepageContent";

export function HomeCtaBlock() {
  const { isRTL } = useDirection();
  const { getBlock } = useHomepageContent();

  const content = getBlock('cta');
  if (!content) return null;

  const kicker = content.kicker as string || 'Rejoignez-nous';
  const title = content.title as string || 'Rejoignez le réseau SUTEL';
  const subtitle = content.subtitle as string || '';
  const buttonLabel = content.button_label as string || 'Créer un compte';
  const buttonLink = content.button_link as string || '/auth';

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="container mx-auto px-4 pb-12">
      <div className={cn("rounded-2xl bg-gradient-to-br from-[hsl(var(--nx-gold))]/10 to-[hsl(var(--nx-gold))]/5 border border-[hsl(var(--nx-gold))]/20 p-8 md:p-12 text-center", isRTL && "text-right")}>
        <p className="text-[hsl(var(--nx-gold))] font-medium text-sm mb-2">{kicker}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h2>
        {subtitle && <p className="text-white/60 mb-6 max-w-xl mx-auto">{subtitle}</p>}
        <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(var(--nx-gold))] to-amber-500 text-[hsl(var(--nx-night))] hover:opacity-90 font-semibold px-8">
          <Link to={buttonLink} className="flex items-center gap-2">
            {buttonLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
