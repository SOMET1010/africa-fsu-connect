import { Shield, Lock, Globe2, CheckCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const TRUST_ITEMS = [
  { icon: Shield, label: "Données protégées" },
  { icon: Lock, label: "Hébergement sécurisé" },
  { icon: Globe2, label: "55 pays membres" },
  { icon: CheckCircle, label: "Conforme RGPD" },
  { icon: Eye, label: "Modération active" },
];

export const HomeTrustBadge = () => (
  <section className="py-8 animate-fade-in">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
        {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
          <div key={i} className="flex items-center gap-2 text-white/70 text-base">
            <Icon className="h-5 w-5 text-[hsl(var(--nx-gold))]/70" />
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
  </section>
);
