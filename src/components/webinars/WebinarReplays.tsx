import { WebinarCard } from "./WebinarCard";

const replayWebinars = [
  {
    title: "Introduction à l'architecture UDC",
    description: "Présentation de la plateforme et de ses fonctionnalités pour les nouveaux membres.",
    presenter: "Équipe UDC",
    presenterCountry: "Réseau",
    presenterFlag: "🌍",
    date: "5 Déc 2025",
    duration: "45min",
    isUpcoming: false,
  },
  {
    title: "Partage d'expérience : Connectivité rurale en Côte d'Ivoire",
    description: "Retour d'expérience sur le projet de connectivité satellite dans le nord du pays.",
    presenter: "M. Yao Kouadio",
    presenterCountry: "Côte d'Ivoire",
    presenterFlag: "🇨🇮",
    date: "28 Nov 2025",
    duration: "1h15",
    isUpcoming: false,
  },
  {
    title: "Indicateurs de performance du Service Universel",
    description: "Comment mesurer et suivre l'impact des programmes de service universel.",
    presenter: "Dr. Oumar Sow",
    presenterCountry: "Sénégal",
    presenterFlag: "🇸🇳",
    date: "15 Nov 2025",
    duration: "1h30",
    isUpcoming: false,
  },
  {
    title: "Cadre juridique harmonisé CEDEAO",
    description: "Présentation du projet de cadre juridique harmonisé pour le service universel.",
    presenter: "Mme. Aïssatou Bah",
    presenterCountry: "Guinée",
    presenterFlag: "🇬🇳",
    date: "1 Nov 2025",
    duration: "2h",
    isUpcoming: false,
  },
];

export function WebinarReplays() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        ▶️ Replays disponibles
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {replayWebinars.map((webinar, index) => (
          <WebinarCard key={index} {...webinar} />
        ))}
      </div>
    </section>
  );
}
