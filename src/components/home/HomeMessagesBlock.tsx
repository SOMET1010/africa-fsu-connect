import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

const OFFICIAL_MESSAGES = [
  {
    name: "Secrétaire Général de l'UAT",
    title: "Message du Secrétaire Général",
    text: "La plateforme NEXUS représente un pas décisif vers la coordination numérique panafricaine. Notre ambition est de connecter les 55 États membres pour accélérer le déploiement du service universel sur tout le continent.",
    initials: "SG",
  },
  {
    name: "Président du Comité SUTEL",
    title: "Message du Président",
    text: "Le réseau SUTEL incarne la solidarité africaine en matière de télécommunications. Cette plateforme permettra le partage d'expériences et de bonnes pratiques pour ne laisser personne hors ligne.",
    initials: "PS",
  },
];

export const HomeMessagesBlock = () => {
  const { isRTL } = useDirection();

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Messages officiels
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[hsl(var(--nx-gold))] to-[hsl(var(--nx-gold))]/50 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {OFFICIAL_MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[hsl(var(--nx-gold))]/20 transition-colors"
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
              <p className="text-white/70 leading-relaxed text-sm italic">
                "{msg.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
