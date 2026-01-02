import { WebinarCard } from "./WebinarCard";

const upcomingWebinars = [
  {
    title: "Financement innovant du Service Universel",
    description: "Stratégies de financement et partenariats public-privé pour accélérer le déploiement.",
    presenter: "Dr. Aminata Diallo",
    presenterCountry: "Sénégal",
    presenterFlag: "🇸🇳",
    date: "15 Jan 2026",
    time: "14:00 UTC",
    duration: "1h30",
    attendees: 124,
    isUpcoming: true,
  },
  {
    title: "Technologies satellite pour zones rurales",
    description: "Présentation des solutions LEO et leur impact sur la connectivité rurale africaine.",
    presenter: "Ing. Kofi Mensah",
    presenterCountry: "Ghana",
    presenterFlag: "🇬🇭",
    date: "22 Jan 2026",
    time: "10:00 UTC",
    duration: "2h",
    attendees: 89,
    isUpcoming: true,
  },
  {
    title: "Cybersécurité pour les agences de régulation",
    description: "Bonnes pratiques et cadres réglementaires pour la protection des données.",
    presenter: "Mme. Fatou Camara",
    presenterCountry: "Mali",
    presenterFlag: "🇲🇱",
    date: "29 Jan 2026",
    time: "15:00 UTC",
    duration: "1h",
    attendees: 67,
    isUpcoming: true,
  },
];

export function UpcomingWebinars() {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        📅 Prochains webinaires
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingWebinars.map((webinar, index) => (
          <WebinarCard key={index} {...webinar} />
        ))}
      </div>
    </section>
  );
}
