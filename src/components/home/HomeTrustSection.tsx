import { Lock, ShieldCheck, FileCheck, Eye } from "lucide-react";
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
  <section className="py-16 md:py-24 bg-[hsl(var(--nx-section-cool))] animate-fade-in" style={{ contentVisibility: 'auto' }}>
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--nx-text-900))] mb-3">
          Sécurité et Protection des données
        </h2>
        <p className="text-[hsl(var(--nx-text-700))] max-w-2xl mx-auto">
          La plateforme UDC met en œuvre les standards les plus élevés pour protéger vos données et garantir la conformité réglementaire.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {TRUST_FEATURES.map(({ icon: Icon, title, description }, i) => (
          <div
            key={i}
            className="rounded-xl border border-[hsl(var(--nx-border))] bg-[hsl(var(--nx-surface))] p-6 text-center shadow-[var(--nx-shadow-sm)] hover:border-[hsl(var(--nx-gold))]/30 transition-colors"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--nx-gold))]/10">
              <Icon className="h-6 w-6 text-[hsl(var(--nx-gold))]" />
            </div>
            <h3 className="text-sm font-semibold text-[hsl(var(--nx-text-900))] mb-2">{title}</h3>
            <p className="text-xs text-[hsl(var(--nx-text-700))] leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/legal/privacy"
          className="text-sm text-[hsl(var(--nx-brand-900))] hover:text-[hsl(var(--nx-brand-700))] underline underline-offset-2 transition-colors"
        >
          Consulter notre politique de confidentialité →
        </Link>
      </div>
    </div>
  </section>
);
