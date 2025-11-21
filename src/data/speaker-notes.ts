export interface SpeakerNote {
  duration: number; // minutes
  keyPoints: string[];
  statistics: string[];
  questions: string[];
  tips: string;
}

export const speakerNotes: Record<string, SpeakerNote> = {
  "hero": {
    duration: 3,
    keyPoints: [
      "55+ pays connectés à travers l'Afrique",
      "1100+ projets de télécommunications gérés",
      "Transformation digitale à l'échelle continentale",
      "Solution cloud-native et scalable"
    ],
    statistics: [
      "156% de croissance annuelle",
      "€50M+ économisés par les partenaires",
      "99.9% de disponibilité",
      "2M+ utilisateurs actifs"
    ],
    questions: [
      "Combien de pays sont actuellement couverts ?",
      "Quel est le ROI moyen pour vos clients ?",
      "Quelles sont les principales fonctionnalités ?"
    ],
    tips: "Insister sur l'impact continental et la couverture pan-africaine. Mettre en avant l'unicité de la solution dans le contexte africain."
  },
  "regional-impact": {
    duration: 4,
    keyPoints: [
      "Présence dans 5 régions africaines",
      "Partenariats avec 200+ agences de régulation",
      "Impact économique direct sur les communautés",
      "Création de 10,000+ emplois indirects"
    ],
    statistics: [
      "55 pays = 100% couverture Afrique",
      "1100 projets simultanés",
      "€500M+ investissements coordonnés"
    ],
    questions: [
      "Comment gérez-vous la diversité réglementaire ?",
      "Quels sont les défis spécifiques par région ?",
      "Comment mesurez-vous l'impact social ?"
    ],
    tips: "Utiliser la carte interactive pour montrer la couverture. Insister sur les success stories régionales."
  },
  "roi-calculator": {
    duration: 5,
    keyPoints: [
      "Économies de 30-40% en moyenne",
      "ROI positif dès la première année",
      "Gains d'efficacité opérationnelle de 50%+",
      "Réduction des délais de 60%"
    ],
    statistics: [
      "€50,000 économies annuelles moyennes",
      "3 mois pour atteindre le break-even",
      "350% ROI sur 3 ans"
    ],
    questions: [
      "Comment sont calculées les économies ?",
      "Quels coûts sont inclus dans l'analyse ?",
      "Y a-t-il des coûts cachés ?"
    ],
    tips: "Laisser l'audience interagir avec le calculateur. Donner des exemples concrets basés sur des cas réels."
  },
  "interactive-demo": {
    duration: 6,
    keyPoints: [
      "Dashboard temps réel avec analytics avancés",
      "Collaboration multi-agences seamless",
      "Workflows automatisés intelligents",
      "Intégrations API complètes"
    ],
    statistics: [
      "50+ intégrations natives",
      "< 100ms latence temps réel",
      "99.99% précision analytics"
    ],
    questions: [
      "Peut-on personnaliser le dashboard ?",
      "Comment fonctionne la collaboration ?",
      "Quelles APIs sont disponibles ?"
    ],
    tips: "Faire une démo live si possible. Montrer les features les plus impressionnantes en premier."
  },
  "technical-architecture": {
    duration: 4,
    keyPoints: [
      "Architecture microservices cloud-native",
      "Scalabilité horizontale illimitée",
      "Multi-cloud (AWS, Azure, GCP)",
      "Edge computing pour performance optimale"
    ],
    statistics: [
      "10,000+ requêtes/seconde",
      "< 50ms latence globale",
      "Auto-scaling intelligent"
    ],
    questions: [
      "Quelle stack technique utilisez-vous ?",
      "Comment gérez-vous la scalabilité ?",
      "Quels sont vos SLAs ?"
    ],
    tips: "Rester technique mais accessible. Utiliser des analogies pour expliquer les concepts complexes."
  },
  "social-proof": {
    "duration": 3,
    keyPoints: [
      "98% satisfaction client (NPS 72)",
      "200+ témoignages positifs",
      "Récompenses internationales",
      "Cas d'usage diversifiés"
    ],
    statistics: [
      "98% taux de satisfaction",
      "97% taux de rétention",
      "15+ awards industriels"
    ],
    questions: [
      "Qui sont vos principaux clients ?",
      "Quels résultats ont-ils obtenus ?",
      "Comment mesurez-vous le succès ?"
    ],
    tips: "Partager des quotes et success stories. Montrer la diversité des clients."
  },
  "security-compliance": {
    duration: 4,
    keyPoints: [
      "Chiffrement end-to-end (AES-256)",
      "Conformité ISO 27001, SOC 2, GDPR",
      "Audit trail complet et immutable",
      "Backup automatique quotidien"
    ],
    statistics: [
      "0 breach depuis le lancement",
      "100% conformité réglementaire",
      "< 1h RTO (Recovery Time Objective)"
    ],
    questions: [
      "Comment protégez-vous les données sensibles ?",
      "Êtes-vous conforme GDPR ?",
      "Quelle est votre politique de backup ?"
    ],
    tips: "Rassurer sur la sécurité. Montrer les certifications. Expliquer les mesures techniques et organisationnelles."
  },
  "call-to-action": {
    duration: 2,
    keyPoints: [
      "Essai gratuit 30 jours",
      "Onboarding personnalisé",
      "Support 24/7",
      "ROI garanti ou remboursé"
    ],
    statistics: [
      "500+ nouvelles organisations/mois",
      "95% conversion trial → paid",
      "< 48h pour setup complet"
    ],
    questions: [
      "Comment commencer ?",
      "Quels sont les prérequis ?",
      "Y a-t-il des frais cachés ?"
    ],
    tips: "Créer l'urgence. Donner les next steps clairs. Proposer un rendez-vous immédiat."
  }
};
