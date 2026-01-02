import { PracticeCard } from "./PracticeCard";

const allPractices = [
  {
    title: "École numérique mobile",
    description: "Bus équipés de matériel informatique et connexion internet pour dispenser des cours numériques dans les zones rurales.",
    country: "Cameroun",
    countryFlag: "🇨🇲",
    theme: "Éducation",
    date: "Oct 2025",
  },
  {
    title: "Registre foncier numérique",
    description: "Digitalisation complète des titres fonciers avec blockchain pour sécuriser les transactions immobilières.",
    country: "Burkina Faso",
    countryFlag: "🇧🇫",
    theme: "Gouvernance",
    date: "Sept 2025",
  },
  {
    title: "Plateforme agricole connectée",
    description: "Application mobile connectant les agriculteurs aux marchés locaux et fournissant des alertes météo en temps réel.",
    country: "Mali",
    countryFlag: "🇲🇱",
    theme: "Agriculture",
    date: "Août 2025",
  },
  {
    title: "Système d'alerte précoce inondations",
    description: "Réseau de capteurs IoT pour la prévention des catastrophes naturelles dans les zones à risque.",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    theme: "Résilience",
    date: "Juil 2025",
  },
  {
    title: "E-administration communale",
    description: "Portail numérique permettant aux citoyens d'effectuer leurs démarches administratives en ligne.",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    theme: "Gouvernance",
    date: "Juin 2025",
  },
  {
    title: "Formation digitale des enseignants",
    description: "Programme de certification en ligne pour 5000 enseignants sur les outils pédagogiques numériques.",
    country: "Cameroun",
    countryFlag: "🇨🇲",
    theme: "Éducation",
    date: "Mai 2025",
  },
];

interface PracticeGridProps {
  searchQuery?: string;
  filters?: {
    theme: string;
    country: string;
    type: string;
  };
}

export function PracticeGrid({ searchQuery = "", filters }: PracticeGridProps) {
  const filteredPractices = allPractices.filter((practice) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        practice.title.toLowerCase().includes(query) ||
        practice.description.toLowerCase().includes(query) ||
        practice.country.toLowerCase().includes(query) ||
        practice.theme.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Theme filter (simplified mapping)
    if (filters?.theme && filters.theme !== "all") {
      const themeMap: Record<string, string[]> = {
        connectivity: ["Connectivité"],
        ehealth: ["E-Santé"],
        education: ["Éducation"],
        agriculture: ["Agriculture"],
        governance: ["Gouvernance"],
      };
      const allowedThemes = themeMap[filters.theme] || [];
      if (!allowedThemes.includes(practice.theme)) return false;
    }

    return true;
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">
          Toutes les pratiques
        </h2>
        <span className="text-sm text-muted-foreground">
          {filteredPractices.length} résultat{filteredPractices.length > 1 ? "s" : ""}
        </span>
      </div>
      
      {filteredPractices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPractices.map((practice, index) => (
            <PracticeCard key={index} {...practice} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>Aucune pratique trouvée pour ces critères.</p>
          <p className="text-sm mt-1">Essayez d'élargir votre recherche.</p>
        </div>
      )}
    </section>
  );
}
