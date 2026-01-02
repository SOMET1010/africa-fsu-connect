import { PracticeCard } from "./PracticeCard";

const allPractices = [
  {
    title: "École numérique mobile",
    description: "Des salles de classe itinérantes connectées pour les zones rurales.",
    impact: { value: "45", label: "écoles équipées" },
    agency: "Ministère de l'Éducation Numérique",
    country: "Cameroun",
    countryFlag: "🇨🇲",
    theme: "Éducation",
    date: "Oct 2025",
  },
  {
    title: "Registre foncier numérique",
    description: "Sécurisation des transactions immobilières par blockchain.",
    impact: { value: "12k", label: "titres numérisés" },
    agency: "Direction du Cadastre National",
    country: "Burkina Faso",
    countryFlag: "🇧🇫",
    theme: "Gouvernance",
    date: "Sept 2025",
  },
  {
    title: "Plateforme agricole connectée",
    description: "Connexion directe entre agriculteurs et marchés locaux.",
    impact: { value: "8k", label: "agriculteurs actifs" },
    agency: "Office National Agricole",
    country: "Mali",
    countryFlag: "🇲🇱",
    theme: "Agriculture",
    date: "Août 2025",
  },
  {
    title: "Système d'alerte précoce inondations",
    description: "Prévention des catastrophes grâce aux capteurs IoT.",
    impact: { value: "200", label: "capteurs déployés" },
    agency: "Agence Nationale de Météorologie",
    country: "Sénégal",
    countryFlag: "🇸🇳",
    theme: "Résilience",
    date: "Juil 2025",
  },
  {
    title: "E-administration communale",
    description: "Démarches administratives accessibles en ligne pour tous.",
    impact: { value: "35", label: "communes connectées" },
    agency: "Agence FSU Côte d'Ivoire",
    country: "Côte d'Ivoire",
    countryFlag: "🇨🇮",
    theme: "Gouvernance",
    date: "Juin 2025",
  },
  {
    title: "Formation digitale des enseignants",
    description: "Certification en ligne sur les outils pédagogiques numériques.",
    impact: { value: "5k", label: "enseignants certifiés" },
    agency: "Institut de Formation Continue",
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
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          Toutes les pratiques
        </h2>
        <span className="text-sm text-muted-foreground">
          {filteredPractices.length} résultat{filteredPractices.length > 1 ? "s" : ""}
        </span>
      </div>
      
      {filteredPractices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPractices.map((practice, index) => (
            <div 
              key={index} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PracticeCard {...practice} />
            </div>
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
