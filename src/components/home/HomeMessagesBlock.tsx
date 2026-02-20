import { Quote } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

const OFFICIAL_MESSAGES = [
  {
    name: "Secrétaire Général de l'UAT",
    title: "Message du Secrétaire Général",
    text: "La plateforme UDC représente un pas décisif vers la coordination numérique panafricaine. Notre ambition est de connecter les 55 États membres pour accélérer le déploiement du service universel sur tout le continent.",
    initials: "SG",
  },
  {
    name: "Directeur Général de l'ANSUT",
    title: "Message du Directeur Général",
    text: "L'ANSUT s'engage aux côtés de l'UAT pour faire d'UDC un outil stratégique au service du déploiement du service universel. Cette plateforme renforce notre capacité collective à réduire la fracture numérique et à connecter les communautés les plus isolées.",
    initials: "DG",
  },
];

export const HomeMessagesBlock = () => {
  const { isRTL } = useDirection();

  return (
    <section className="py-16 relative animate-fade-in" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Messages officiels
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/50 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {OFFICIAL_MESSAGES.map((msg, i) => (
            <div
              key={i}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[hsl(var(--nx-gold))]/20 transition-colors"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-[hsl(var(--nx-gold))]/15" />
              <div className={cn("flex items-center gap-4 mb-6", isRTL && "flex-row-reverse")}>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/60 flex items-center justify-center shrink-0">
                  <span className="text-[hsl(var(--nx-night))] font-bold text-sm">{msg.initials}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{msg.title}</h3>
                  <p className="text-[hsl(var(--nx-gold))]/80 text-sm">{msg.name}</p>
                </div>
              </div>
              <p className="text-white/85 leading-relaxed text-sm italic">
                "{msg.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
