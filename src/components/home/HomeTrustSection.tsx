import { Lock, ShieldCheck, FileCheck, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TRUST_FEATURES = [
  {
    icon: Lock,
    title: "Chiffrement TLS/SSL",
    description: "Toutes les données sont chiffrées en transit et au repos pour garantir leur confidentialité.",
  },
  {
    icon: ShieldCheck,
    title: "Contrôle d'accès RBAC",
    description: "Un système de rôles garantit que chaque utilisateur n'accède qu'aux données autorisées.",
  },
  {
    icon: FileCheck,
    title: "Conformité RGPD & UA",
    description: "Respect des réglementations internationales et du cadre de l'Union Africaine sur la protection des données.",
  },
  {
    icon: Eye,
    title: "Modération active",
    description: "Les contenus sont modérés pour assurer la qualité des échanges et la sécurité de la communauté.",
  },
];

export const HomeTrustSection = () => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="py-16 md:py-24"
  >
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Sécurité et Protection des données
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          La plateforme NEXUS met en œuvre les standards les plus élevés pour protéger vos données et garantir la conformité réglementaire.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {TRUST_FEATURES.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center hover:border-[hsl(var(--nx-gold))]/30 transition-colors"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--nx-gold))]/10">
              <Icon className="h-6 w-6 text-[hsl(var(--nx-gold))]" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/legal/privacy"
          className="text-sm text-[hsl(var(--nx-gold))]/70 hover:text-[hsl(var(--nx-gold))] underline underline-offset-2 transition-colors"
        >
          Consulter notre politique de confidentialité →
        </Link>
      </div>
    </div>
  </motion.section>
);
