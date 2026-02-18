import { Link } from "react-router-dom";
import { FileText, Scale, Globe, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

const FRAMEWORKS = [
  { key: "ecowas", icon: Globe, color: "from-emerald-500/20 to-emerald-500/5" },
  { key: "sadc", icon: Globe, color: "from-blue-500/20 to-blue-500/5" },
  { key: "au", icon: Scale, color: "from-amber-500/20 to-amber-500/5" },
  { key: "itu", icon: Globe, color: "from-purple-500/20 to-purple-500/5" },
];

const Strategies = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <main className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative py-20 bg-[hsl(var(--nx-night))] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--nx-gold))]/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-[hsl(var(--nx-gold))]/10 text-[hsl(var(--nx-gold))] border border-[hsl(var(--nx-gold))]/20">
            {t("strategies.badge") || "Stratégies & Politiques"}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("strategies.title") || "Cadres Réglementaires et Politiques"}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {t("strategies.subtitle") || "Textes réglementaires régissant les Fonds du Service Universel en Afrique"}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Intro */}
        <section className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("strategies.intro") || "Les Fonds du Service Universel en Afrique s'inscrivent dans des cadres réglementaires nationaux et régionaux. Cette section présente les principaux textes et politiques qui guident l'action des pays membres du réseau SUTEL."}
          </p>
        </section>

        {/* Documents réglementaires */}
        <section className="space-y-6">
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <div className="p-2 rounded-lg bg-[hsl(var(--nx-gold))]/10">
              <FileText className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("strategies.documents.title") || "Documents réglementaires"}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            {t("strategies.documents.description") || "Accédez aux textes de loi, décrets et règlements relatifs au Service Universel par pays dans notre bibliothèque de ressources."}
          </p>
          <Button asChild variant="outline" className="border-[hsl(var(--nx-gold))]/30 text-[hsl(var(--nx-gold))] hover:bg-[hsl(var(--nx-gold))]/10">
            <Link to="/resources">
              <BookOpen className="h-4 w-4 mr-2" />
              {t("strategies.documents.cta") || "Explorer la bibliothèque"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </section>

        {/* Cadres politiques */}
        <section className="space-y-6">
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <div className="p-2 rounded-lg bg-[hsl(var(--nx-gold))]/10">
              <Scale className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t("strategies.frameworks.title") || "Cadres politiques régionaux"}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FRAMEWORKS.map(({ key, icon: Icon, color }) => (
              <div key={key} className={cn("rounded-2xl border border-border p-6 bg-gradient-to-br", color)}>
                <div className={cn("flex items-center gap-3 mb-3", isRTL && "flex-row-reverse")}>
                  <Icon className="h-5 w-5 text-foreground/70" />
                  <h3 className="font-semibold text-foreground">
                    {t(`strategies.frameworks.${key}.title`) || key.toUpperCase()}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t(`strategies.frameworks.${key}.description`) || "Cadre de politique régionale pour le Service Universel."}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <Button asChild size="lg" className="bg-[hsl(var(--nx-gold))] text-[hsl(var(--nx-night))] hover:bg-[hsl(var(--nx-gold))]/90">
            <Link to="/resources">
              {t("strategies.cta") || "Consulter tous les documents"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
};

export default Strategies;
