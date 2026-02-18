import { Shield, Lock, Globe2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TRUST_ITEMS = [
  { icon: Shield, label: "Données protégées" },
  { icon: Lock, label: "Hébergement sécurisé" },
  { icon: Globe2, label: "55 pays membres" },
];

export const HomeTrustBadge = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="py-8"
  >
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
            <Icon className="h-4 w-4 text-[hsl(var(--nx-gold))]/60" />
            <span>{label}</span>
          </div>
        ))}
        <Link
          to="/legal/privacy"
          className="text-xs text-[hsl(var(--nx-gold))]/60 hover:text-[hsl(var(--nx-gold))] underline underline-offset-2 transition-colors"
        >
          Politique de confidentialité
        </Link>
      </div>
    </div>
  </motion.section>
);
