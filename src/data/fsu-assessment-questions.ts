// Questions d'auto-évaluation FSU basées sur les 11 recommandations GSMA/UAT
// Ces questions permettent à chaque pays d'évaluer la maturité de son FSU

export interface AssessmentQuestion {
    id: string
    category: string
    categoryKey: string
    question: string
    recommendation: string
    options: {
        value: number
        label: string
        description: string
    }[]
    weight: number // Importance relative de la question
    bestPractices: string[]
    resources?: string[]
}

export interface AssessmentCategory {
    key: string
    name: string
    description: string
    icon: string
    color: string
}

export const assessmentCategories: AssessmentCategory[] = [
    {
        key: "cost_calculation",
        name: "Calcul des coûts",
        description: "Méthodologie de calcul des coûts de Projets",
        icon: "Calculator",
        color: "hsl(var(--chart-1))",
    },
    {
        key: "financing",
        name: "Financement",
        description: "Modèles de financement et contribution",
        icon: "DollarSign",
        color: "hsl(var(--chart-2))",
    },
    {
        key: "governance",
        name: "Gouvernance",
        description: "Structure et transparence de gestion",
        icon: "Shield",
        color: "hsl(var(--chart-3))",
    },
    {
        key: "stakeholders",
        name: "Parties prenantes",
        description: "Consultation et collaboration",
        icon: "Users",
        color: "hsl(var(--chart-4))",
    },
    {
        key: "monitoring",
        name: "Suivi-évaluation",
        description: "Indicateurs et rapports",
        icon: "BarChart3",
        color: "hsl(var(--chart-5))",
    },
]

export const assessmentQuestions: AssessmentQuestion[] = [
    // Catégorie 1: Calcul des coûts (Recommandation #1)
    {
        id: "cost_1",
        category: "Calcul des coûts",
        categoryKey: "cost_calculation",
        question:
            "Avez-vous une méthodologie documentée pour calculer les coûts complets des Projets (CAPEX et OPEX) ?",
        recommendation:
            "Les régulateurs doivent calculer les coûts complets des Projets, incluant CAPEX et OPEX sur la durée de vie estimée du projet.",
        options: [
            {
                value: 0,
                label: "Non",
                description: "Aucune méthodologie formalisée",
            },
            {
                value: 1,
                label: "Partiel",
                description:
                    "Calcul CAPEX uniquement ou méthodologie informelle",
            },
            {
                value: 2,
                label: "En développement",
                description: "Méthodologie en cours de formalisation",
            },
            {
                value: 3,
                label: "Oui",
                description: "Méthodologie complète CAPEX/OPEX documentée",
            },
            {
                value: 4,
                label: "Avancé",
                description: "Méthodologie validée avec historique de projets",
            },
        ],
        weight: 1.5,
        bestPractices: [
            "Inclure tous les coûts d'équipement (CAPEX)",
            "Estimer les coûts opérationnels sur 8 ans minimum",
            "Intégrer les coûts de maintenance, énergie et sécurité",
            "Calculer le coût par personne couverte",
        ],
    },
    {
        id: "cost_2",
        category: "Calcul des coûts",
        categoryKey: "cost_calculation",
        question:
            "Utilisez-vous des données de référence (benchmarks) pour valider vos estimations de coûts ?",
        recommendation:
            "Les estimations doivent être validées par des données de marché et des projets similaires.",
        options: [
            {
                value: 0,
                label: "Non",
                description: "Pas de benchmarks utilisés",
            },
            {
                value: 1,
                label: "Parfois",
                description: "Utilisation occasionnelle de références",
            },
            {
                value: 2,
                label: "Régulièrement",
                description: "Benchmarks régionaux utilisés",
            },
            {
                value: 3,
                label: "Systématique",
                description: "Validation systématique avec données de marché",
            },
            {
                value: 4,
                label: "Avancé",
                description: "Base de données de coûts historiques maintenue",
            },
        ],
        weight: 1.0,
        bestPractices: [
            "Collecter les données de coûts des projets précédents",
            "Comparer avec les projets similaires dans la région",
            "Mettre à jour les références annuellement",
        ],
    },

    // Catégorie 2: Financement (Recommandations #2, #6)
    {
        id: "fin_1",
        category: "Financement",
        categoryKey: "financing",
        question:
            "Avez-vous exploré des modèles de financement alternatifs au-delà des subventions directes ?",
        recommendation:
            'Explorer les alternatives comme le modèle "Pay or Play" (Maroc) ou les réseaux ruraux partagés (Ghana).',
        options: [
            {
                value: 0,
                label: "Non",
                description: "Subventions directes uniquement",
            },
            {
                value: 1,
                label: "En étude",
                description: "Modèles alternatifs à l'étude",
            },
            {
                value: 2,
                label: "Pilote",
                description: "Un modèle alternatif en test",
            },
            {
                value: 3,
                label: "Mixte",
                description: "Plusieurs modèles en application",
            },
            {
                value: 4,
                label: "Optimisé",
                description: "Portfolio de modèles adapté au contexte",
            },
        ],
        weight: 1.2,
        bestPractices: [
            'Étudier le modèle "Pay or Play" du Maroc',
            "Considérer les réseaux ruraux partagés (ex: GIFEC Ghana)",
            "Adapter le modèle au contexte national",
        ],
    },
    {
        id: "fin_2",
        category: "Financement",
        categoryKey: "financing",
        question:
            "Le taux de contribution des opérateurs est-il basé sur une analyse du déficit d'accès ?",
        recommendation:
            "Le taux de contribution doit être calibré en fonction du déficit d'accès à combler et de l'investissement nécessaire.",
        options: [
            { value: 0, label: "Non", description: "Taux fixé arbitrairement" },
            {
                value: 1,
                label: "Historique",
                description: "Basé sur des pratiques passées",
            },
            {
                value: 2,
                label: "Partiellement",
                description: "Analyse partielle du déficit",
            },
            {
                value: 3,
                label: "Oui",
                description: "Basé sur analyse du déficit d'accès",
            },
            {
                value: 4,
                label: "Dynamique",
                description: "Taux ajusté périodiquement selon l'évolution",
            },
        ],
        weight: 1.3,
        bestPractices: [
            "Calculer le déficit d'investissement total",
            "Estimer le budget nécessaire sur 5-10 ans",
            "Évaluer la capacité contributive des opérateurs",
        ],
    },

    // Catégorie 3: Gouvernance (Recommandations #4, #7)
    {
        id: "gov_1",
        category: "Gouvernance",
        categoryKey: "governance",
        question:
            "Le FSU bénéficie-t-il d'une indépendance opérationnelle vis-à-vis du gouvernement ?",
        recommendation:
            "Les FSU les plus efficaces opèrent de manière indépendante du contrôle gouvernemental direct.",
        options: [
            {
                value: 0,
                label: "Non",
                description: "Contrôle gouvernemental direct",
            },
            { value: 1, label: "Limité", description: "Autonomie limitée" },
            {
                value: 2,
                label: "Partiel",
                description: "Autonomie opérationnelle partielle",
            },
            {
                value: 3,
                label: "Substantiel",
                description: "Indépendance opérationnelle significative",
            },
            {
                value: 4,
                label: "Total",
                description: "Entité indépendante avec gouvernance propre",
            },
        ],
        weight: 1.4,
        bestPractices: [
            "Établir une entité juridique distincte",
            "Définir un conseil d'administration indépendant",
            "Séparer les fonctions de régulation et de gestion FSU",
        ],
    },
    {
        id: "gov_2",
        category: "Gouvernance",
        categoryKey: "governance",
        question:
            "Publiez-vous régulièrement des rapports financiers et d'activité du FSU ?",
        recommendation:
            "La transparence renforce la confiance des opérateurs et des parties prenantes.",
        options: [
            { value: 0, label: "Non", description: "Aucune publication" },
            {
                value: 1,
                label: "Ad hoc",
                description: "Publications occasionnelles",
            },
            { value: 2, label: "Annuel", description: "Rapport annuel publié" },
            {
                value: 3,
                label: "Régulier",
                description: "Rapports trimestriels et annuels",
            },
            {
                value: 4,
                label: "Temps réel",
                description: "Tableau de bord public en ligne",
            },
        ],
        weight: 1.2,
        bestPractices: [
            "Publier un rapport annuel détaillé",
            "Inclure les flux financiers (collectes, décaissements)",
            "Présenter les résultats des projets",
        ],
    },

    // Catégorie 4: Parties prenantes (Recommandation #9)
    {
        id: "stake_1",
        category: "Parties prenantes",
        categoryKey: "stakeholders",
        question:
            "Consultez-vous régulièrement les opérateurs et autres parties prenantes avant les décisions importantes ?",
        recommendation:
            "Des consultations régulières renforcent l'adhésion et la qualité des décisions.",
        options: [
            {
                value: 0,
                label: "Non",
                description: "Aucune consultation formelle",
            },
            {
                value: 1,
                label: "Rarement",
                description: "Consultations exceptionnelles",
            },
            {
                value: 2,
                label: "Occasionnel",
                description: "Consultations ponctuelles",
            },
            {
                value: 3,
                label: "Régulier",
                description: "Processus de consultation établi",
            },
            {
                value: 4,
                label: "Structuré",
                description: "Comité consultatif permanent",
            },
        ],
        weight: 1.1,
        bestPractices: [
            "Établir un calendrier de consultations",
            "Documenter et publier les retours",
            "Intégrer les contributions dans les décisions",
        ],
    },
    {
        id: "stake_2",
        category: "Parties prenantes",
        categoryKey: "stakeholders",
        question:
            "Impliquez-vous les communautés locales dans la conception et le suivi des projets ?",
        recommendation:
            "L'implication des communautés améliore la pertinence et la durabilité des projets.",
        options: [
            {
                value: 0,
                label: "Non",
                description: "Pas d'implication communautaire",
            },
            {
                value: 1,
                label: "Information",
                description: "Information des communautés",
            },
            {
                value: 2,
                label: "Consultation",
                description: "Consultation avant les projets",
            },
            {
                value: 3,
                label: "Participation",
                description: "Participation active des communautés",
            },
            {
                value: 4,
                label: "Co-conception",
                description: "Co-conception et suivi participatif",
            },
        ],
        weight: 1.0,
        bestPractices: [
            "Identifier les besoins locaux",
            "Impliquer les leaders communautaires",
            "Établir des mécanismes de feedback",
        ],
    },

    // Catégorie 5: Suivi-évaluation (Recommandations #8, #11)
    {
        id: "mon_1",
        category: "Suivi-évaluation",
        categoryKey: "monitoring",
        question:
            "Avez-vous défini des indicateurs clés de performance (KPIs) pour mesurer l'impact des Projets ?",
        recommendation:
            "Des KPIs clairs permettent de mesurer l'efficacité et de justifier les investissements.",
        options: [
            { value: 0, label: "Non", description: "Aucun KPI défini" },
            {
                value: 1,
                label: "Basique",
                description: "Indicateurs de base (budget, délais)",
            },
            {
                value: 2,
                label: "Output",
                description: "Indicateurs de réalisation (sites, couverture)",
            },
            {
                value: 3,
                label: "Outcome",
                description: "Indicateurs d'impact (adoption, usage)",
            },
            {
                value: 4,
                label: "Complet",
                description: "Cadre logique complet avec baseline",
            },
        ],
        weight: 1.3,
        bestPractices: [
            "Définir des objectifs de couverture population",
            "Mesurer le taux d'adoption des services",
            "Calculer le coût par bénéficiaire",
            "Suivre l'évolution de l'écart de connectivité",
        ],
    },
    {
        id: "mon_2",
        category: "Suivi-évaluation",
        categoryKey: "monitoring",
        question: "Effectuez-vous des évaluations d'impact post-projet ?",
        recommendation:
            "Les évaluations post-projet permettent d'apprendre et d'améliorer les futurs projets.",
        options: [
            {
                value: 0,
                label: "Non",
                description: "Aucune évaluation post-projet",
            },
            {
                value: 1,
                label: "Parfois",
                description: "Évaluations occasionnelles",
            },
            {
                value: 2,
                label: "Projets majeurs",
                description: "Pour les grands projets uniquement",
            },
            {
                value: 3,
                label: "Systématique",
                description: "Évaluation systématique",
            },
            {
                value: 4,
                label: "Apprentissage",
                description: "Évaluations avec intégration des leçons",
            },
        ],
        weight: 1.2,
        bestPractices: [
            "Planifier l'évaluation dès le début du projet",
            "Collecter des données de référence (baseline)",
            "Documenter les leçons apprises",
            "Partager les résultats avec le réseau",
        ],
    },
    {
        id: "mon_3",
        category: "Suivi-évaluation",
        categoryKey: "monitoring",
        question:
            "Utilisez-vous des outils technologiques pour le suivi des projets en temps réel ?",
        recommendation:
            "Les outils numériques facilitent le suivi et la transparence.",
        options: [
            { value: 0, label: "Non", description: "Suivi manuel uniquement" },
            { value: 1, label: "Tableurs", description: "Excel ou tableurs" },
            {
                value: 2,
                label: "Base de données",
                description: "Système de base de données",
            },
            {
                value: 3,
                label: "Plateforme",
                description: "Plateforme de suivi dédiée",
            },
            {
                value: 4,
                label: "Intégré",
                description: "Système intégré avec tableaux de bord",
            },
        ],
        weight: 1.0,
        bestPractices: [
            "Utiliser une plateforme centralisée",
            "Automatiser la collecte de données",
            "Visualiser les progrès en temps réel",
        ],
    },
]

export const getMaxScore = (): number => {
    return assessmentQuestions.reduce((sum, q) => sum + 4 * q.weight, 0)
}

export const getCategoryScore = (
    answers: Record<string, number>,
    categoryKey: string
): { score: number; max: number; percentage: number } => {
    const categoryQuestions = assessmentQuestions.filter(
        q => q.categoryKey === categoryKey
    )
    const max = categoryQuestions.reduce((sum, q) => sum + 4 * q.weight, 0)
    const score = categoryQuestions.reduce(
        (sum, q) => sum + (answers[q.id] || 0) * q.weight,
        0
    )
    return { score, max, percentage: max > 0 ? (score / max) * 100 : 0 }
}

export const getMaturityLevel = (
    percentage: number
): { level: string; description: string; color: string } => {
    if (percentage >= 80) {
        return {
            level: "Avancé",
            description: "FSU mature avec bonnes pratiques établies",
            color: "hsl(var(--success))",
        }
    } else if (percentage >= 60) {
        return {
            level: "Établi",
            description: "FSU fonctionnel avec opportunités d'amélioration",
            color: "hsl(var(--chart-2))",
        }
    } else if (percentage >= 40) {
        return {
            level: "En développement",
            description: "FSU en construction, efforts à poursuivre",
            color: "hsl(var(--warning))",
        }
    } else if (percentage >= 20) {
        return {
            level: "Émergent",
            description: "FSU naissant, fondations à renforcer",
            color: "hsl(var(--chart-5))",
        }
    } else {
        return {
            level: "Initial",
            description: "FSU à créer ou restructurer",
            color: "hsl(var(--destructive))",
        }
    }
}
