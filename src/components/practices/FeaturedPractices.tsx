import { PracticeCard } from "./PracticeCard";

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
  {
    title: "École numérique mobile",
    description: "Bus équipés de matériel informatique et connexion internet pour dispenser des cours numériques dans les zones rurales.",
    country: "Cameroun",
    countryFlag: "🇨🇲",
    theme: "Éducation",
    date: "Oct 2025",
  },
];

export function FeaturedPractices() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        ⭐ Pratiques mises en avant
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredPractices.map((practice, index) => (
          <PracticeCard key={index} {...practice} featured />
        ))}
      </div>
    </section>
  );
}
