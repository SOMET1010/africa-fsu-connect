import { PracticeCard } from "./PracticeCard";
import { Sparkles } from "lucide-react";

const featuredPractices = [
  {
    title: "Connectivité rurale par satellite en zones isolées",
    description: "150 villages enfin connectés malgré l'isolement géographique.",
    impact: { value: "150", label: "villages connectés" },
    agency: "Agence FSU Côte d'Ivoire",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    theme: "Connectivité",
    date: "Déc 2025",
  },
  {
    title: "Télémédecine villageoise intégrée",
    description: "Des consultations spécialisées accessibles partout.",
    impact: { value: "80", label: "centres de santé reliés" },
    agency: "Agence de l'Informatique de l'État du Sénégal",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    theme: "E-Santé",
    date: "Nov 2025",
  },
];

export function FeaturedPractices() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold">
          Pratiques inspirantes ce mois-ci
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {featuredPractices.map((practice, index) => (
          <PracticeCard 
            key={index} 
            {...practice} 
            featured={true}
          />
        ))}
      </div>
    </section>
  );
}
