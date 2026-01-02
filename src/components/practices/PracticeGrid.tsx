import { PracticeCard } from "./PracticeCard";

const allPractices = [
  {
    title: "Réseau communautaire WiFi autogéré",
    description: "Formation de techniciens locaux pour installer et maintenir des réseaux WiFi communautaires dans 50 villages.",
    country: "Mali",
    countryFlag: "🇲🇱",
    theme: "Connectivité",
    date: "Sep 2025",
  },
  {
    title: "Plateforme agricole de conseil à distance",
    description: "Application mobile permettant aux agriculteurs d'obtenir des conseils d'experts via messages vocaux.",
    country: "Burkina Faso",
    countryFlag: "🇧🇫",
    theme: "Agriculture",
    date: "Août 2025",
  },
  {
    title: "Guichet unique numérique pour les entrepreneurs",
    description: "Portail en ligne simplifiant les démarches administratives pour la création d'entreprises.",
    country: "Togo",
    countryFlag: "🇹🇬",
    theme: "Gouvernance",
    date: "Juil 2025",
  },
  {
    title: "Formation des enseignants aux outils numériques",
    description: "Programme de certification pour 2000 enseignants sur l'utilisation des tablettes éducatives.",
    country: "Niger",
    countryFlag: "🇳🇪",
    theme: "Éducation",
    date: "Juin 2025",
  },
  {
    title: "Système d'alerte précoce par SMS",
    description: "Réseau d'alerte météorologique par SMS pour prévenir les agriculteurs des événements climatiques.",
    country: "Bénin",
    countryFlag: "🇧🇯",
    theme: "Agriculture",
    date: "Mai 2025",
  },
  {
    title: "Bibliothèque numérique hors-ligne",
    description: "Serveurs locaux contenant des ressources éducatives accessibles sans connexion internet.",
    country: "Guinée",
    countryFlag: "🇬🇳",
    theme: "Éducation",
    date: "Avr 2025",
  },
];

export function PracticeGrid() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6">
        Toutes les bonnes pratiques
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPractices.map((practice, index) => (
          <PracticeCard key={index} {...practice} />
        ))}
      </div>
    </section>
  );
}
