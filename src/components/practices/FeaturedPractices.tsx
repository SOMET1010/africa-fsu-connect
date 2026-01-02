import { PracticeCard } from "./PracticeCard";
import { Sparkles } from "lucide-react";

const featuredPractices = [
  {
    title: "Connectivité rurale par satellite en zones isolées",
    description: "Déploiement de solutions satellite low-cost pour connecter 150 villages isolés du nord du pays, avec formation des communautés locales.",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    theme: "Connectivité",
    date: "Déc 2025",
  },
  {
    title: "Télémédecine villageoise intégrée",
    description: "Mise en place de centres de télémédecine dans 80 villages, permettant des consultations à distance avec des spécialistes urbains.",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    theme: "E-Santé",
    date: "Nov 2025",
  },
];

export function FeaturedPractices() {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold">
          Pratiques inspirantes ce mois-ci
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-5">
        {featuredPractices.map((practice, index) => (
          <PracticeCard key={index} {...practice} />
        ))}
      </div>
    </section>
  );
}
