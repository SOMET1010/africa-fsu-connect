import { Users, FolderGit2, FileText, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, LucideIcon> = { Users, FolderGit2, FileText };

const FALLBACK_FEATURES = [
  { icon: "Users", title: "54 Pays Membres", description: "Réseau panafricain des agences de régulation" },
  { icon: "FolderGit2", title: "Projets FSU", description: "Partage d'expériences et bonnes pratiques" },
  { icon: "FileText", title: "Ressources", description: "Documentation et guides méthodologiques" },
];

export function HomeFeaturesBlock() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { getBlock, isLoading } = useHomepageContent();

  const content = getBlock('features');
  const items = (content?.items as Array<{ icon: string; title: string; description: string }>) || FALLBACK_FEATURES;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="container mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((feature, index) => {
          const Icon = ICON_MAP[feature.icon] || FileText;
          return (
            <div key={index} className={cn("p-5 rounded-xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors", isRTL && "text-right")}>
              <div className={cn("flex items-start gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-2.5 rounded-lg bg-[hsl(var(--nx-gold))]/10 border border-[hsl(var(--nx-gold))]/20">
                  <Icon className="w-5 h-5 text-[hsl(var(--nx-gold))]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
