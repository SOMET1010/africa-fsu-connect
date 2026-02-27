// Templates de rapports FSU basés sur les standards GSMA/UAT

export interface ReportSection {
    id: string
    title: string
    description: string
    placeholder: string
    required: boolean
    tips: string[]
}

export interface ReportTemplate {
    id: string
    name: string
    description: string
    category: "annual" | "project" | "consultation" | "kpi"
    sections: ReportSection[]
    exportFormats: ("pdf" | "docx" | "md")[]
}

export const reportTemplates: ReportTemplate[] = [
    {
        id: "annual-report",
        name: "Rapport Annuel FSU",
        description:
            "Rapport annuel complet du Fonds du Service Universel conforme aux recommandations GSMA",
        category: "annual",
        exportFormats: ["pdf", "docx", "md"],
        sections: [
            {
                id: "executive_summary",
                title: "Résumé exécutif",
                description:
                    "Synthèse des principaux accomplissements et défis de l'année",
                placeholder:
                    "Présentez les faits saillants de l'année : budget total, projets réalisés, population couverte, défis majeurs...",
                required: true,
                tips: [
                    "Limitez à une page maximum",
                    "Incluez 3-5 chiffres clés",
                    "Mentionnez les principaux accomplissements",
                ],
            },
            {
                id: "financial_overview",
                title: "Aperçu financier",
                description:
                    "État des fonds collectés, décaissés et disponibles",
                placeholder:
                    "Détaillez les flux financiers : contributions des opérateurs, décaissements par projet, solde disponible...",
                required: true,
                tips: [
                    "Inclure un tableau récapitulatif",
                    "Comparer avec l'année précédente",
                    "Expliquer les écarts significatifs",
                ],
            },
            {
                id: "projects_completed",
                title: "Projets réalisés",
                description:
                    "Liste et résultats des projets achevés durant l'année",
                placeholder:
                    "Pour chaque projet : nom, localisation, budget, population bénéficiaire, résultats atteints...",
                required: true,
                tips: [
                    "Inclure des photos si disponibles",
                    "Mentionner les partenaires",
                    "Quantifier l'impact",
                ],
            },
            {
                id: "projects_ongoing",
                title: "Projets en cours",
                description: "État d'avancement des projets actifs",
                placeholder:
                    "Pour chaque projet en cours : état d'avancement, budget consommé, difficultés rencontrées, prochaines étapes...",
                required: true,
                tips: [
                    "Utiliser des indicateurs de progression",
                    "Signaler les retards éventuels",
                    "Indiquer les dates prévisionnelles",
                ],
            },
            {
                id: "impact_metrics",
                title: "Indicateurs d'impact",
                description: "Mesures de l'efficacité des interventions FSU",
                placeholder:
                    "Présentez les KPIs : population nouvellement couverte, écart de connectivité réduit, coût par bénéficiaire...",
                required: true,
                tips: [
                    "Comparer avec les objectifs fixés",
                    "Montrer l'évolution sur plusieurs années",
                    "Utiliser des graphiques",
                ],
            },
            {
                id: "challenges",
                title: "Défis et leçons apprises",
                description: "Difficultés rencontrées et enseignements tirés",
                placeholder:
                    "Décrivez les obstacles majeurs et comment ils ont été surmontés ou ce qui sera fait différemment...",
                required: false,
                tips: [
                    "Être transparent sur les difficultés",
                    "Proposer des solutions",
                    "Partager les leçons avec le réseau",
                ],
            },
            {
                id: "outlook",
                title: "Perspectives",
                description:
                    "Orientations et projets prévus pour l'année suivante",
                placeholder:
                    "Présentez la stratégie, les projets planifiés, le budget prévisionnel, les objectifs...",
                required: true,
                tips: [
                    "Aligner avec les objectifs nationaux",
                    "Être réaliste dans les prévisions",
                    "Inclure un calendrier",
                ],
            },
        ],
    },
    {
        id: "project-monitoring",
        name: "Rapport de Suivi de Projet",
        description: "Rapport périodique de suivi d'un projet FSU spécifique",
        category: "project",
        exportFormats: ["pdf", "docx", "md"],
        sections: [
            {
                id: "project_info",
                title: "Informations du projet",
                description: "Données d'identification du projet",
                placeholder:
                    "Nom du projet, code, localisation, date de démarrage, budget total, partenaires...",
                required: true,
                tips: [
                    "Inclure le numéro de référence",
                    "Mentionner le responsable projet",
                ],
            },
            {
                id: "progress_summary",
                title: "Résumé de l'avancement",
                description: "Synthèse de l'état d'avancement global",
                placeholder:
                    "Pourcentage d'avancement global, conformité au calendrier, état du budget...",
                required: true,
                tips: [
                    "Utiliser un code couleur (vert/orange/rouge)",
                    "Comparer réalisé vs prévu",
                ],
            },
            {
                id: "activities_completed",
                title: "Activités réalisées",
                description: "Détail des travaux accomplis durant la période",
                placeholder:
                    "Listez les activités réalisées : installations, tests, formations...",
                required: true,
                tips: ["Être factuel et précis", "Inclure les dates"],
            },
            {
                id: "financial_status",
                title: "Situation financière",
                description: "État des dépenses par rapport au budget",
                placeholder:
                    "Budget engagé, dépensé, reste à consommer, écarts...",
                required: true,
                tips: [
                    "Inclure un tableau budgétaire",
                    "Expliquer les dépassements",
                ],
            },
            {
                id: "issues_risks",
                title: "Problèmes et risques",
                description: "Difficultés rencontrées et risques identifiés",
                placeholder:
                    "Décrivez les problèmes rencontrés et les mesures prises ou à prendre...",
                required: false,
                tips: [
                    "Proposer des solutions",
                    "Évaluer l'impact sur le calendrier",
                ],
            },
            {
                id: "next_steps",
                title: "Prochaines étapes",
                description: "Activités prévues pour la prochaine période",
                placeholder:
                    "Listez les activités planifiées avec dates et responsables...",
                required: true,
                tips: ["Être réaliste", "Identifier les dépendances"],
            },
        ],
    },
    {
        id: "consultation-report",
        name: "Rapport de Consultation",
        description: "Synthèse d'une consultation des parties prenantes",
        category: "consultation",
        exportFormats: ["pdf", "docx", "md"],
        sections: [
            {
                id: "consultation_context",
                title: "Contexte de la consultation",
                description: "Objet et cadre de la consultation",
                placeholder:
                    "Décrivez le sujet de la consultation, sa période, les parties invitées...",
                required: true,
                tips: [
                    "Expliquer pourquoi cette consultation",
                    "Mentionner le cadre réglementaire",
                ],
            },
            {
                id: "participants",
                title: "Participants",
                description: "Liste des parties prenantes ayant participé",
                placeholder:
                    "Opérateurs, associations, communautés, experts... ayant contribué",
                required: true,
                tips: [
                    "Catégoriser les participants",
                    "Indiquer le nombre de contributions",
                ],
            },
            {
                id: "key_inputs",
                title: "Contributions principales",
                description: "Synthèse des retours reçus",
                placeholder:
                    "Résumez les principales contributions, suggestions et préoccupations exprimées...",
                required: true,
                tips: ["Regrouper par thème", "Rester objectif"],
            },
            {
                id: "analysis",
                title: "Analyse et recommandations",
                description: "Analyse des contributions et propositions",
                placeholder:
                    "Analysez les retours et présentez les recommandations qui en découlent...",
                required: true,
                tips: [
                    "Justifier les choix",
                    "Expliquer ce qui n'a pas été retenu et pourquoi",
                ],
            },
            {
                id: "decisions",
                title: "Décisions prises",
                description:
                    "Résumé des décisions résultant de la consultation",
                placeholder:
                    "Listez les décisions prises suite à cette consultation...",
                required: true,
                tips: [
                    "Être clair et actionnable",
                    "Indiquer les prochaines étapes",
                ],
            },
        ],
    },
    {
        id: "kpi-dashboard",
        name: "Tableau de Bord des KPIs",
        description: "Rapport synthétique des indicateurs clés de performance",
        category: "kpi",
        exportFormats: ["pdf", "md"],
        sections: [
            {
                id: "coverage_metrics",
                title: "Indicateurs de couverture",
                description: "Métriques relatives à la couverture réseau",
                placeholder:
                    "Population couverte (2G/3G/4G/5G), zones desservies, écart de couverture...",
                required: true,
                tips: [
                    "Comparer avec les objectifs nationaux",
                    "Montrer l'évolution",
                ],
            },
            {
                id: "usage_metrics",
                title: "Indicateurs d'utilisation",
                description: "Métriques relatives à l'adoption des services",
                placeholder:
                    "Taux de pénétration, abonnés actifs, écart d'utilisation...",
                required: true,
                tips: [
                    "Distinguer couverture et usage",
                    "Identifier les barrières à l'adoption",
                ],
            },
            {
                id: "financial_metrics",
                title: "Indicateurs financiers",
                description: "Métriques relatives aux fonds FSU",
                placeholder:
                    "Taux de décaissement, coût par bénéficiaire, ROI estimé...",
                required: true,
                tips: ["Calculer l'efficience", "Comparer avec les benchmarks"],
            },
            {
                id: "project_metrics",
                title: "Indicateurs de projets",
                description: "Métriques relatives aux Projets",
                placeholder:
                    "Projets complétés, en cours, en retard, taux de réussite...",
                required: true,
                tips: [
                    "Utiliser un système de feux tricolores",
                    "Analyser les causes des retards",
                ],
            },
        ],
    },
]

export const getTemplateById = (id: string): ReportTemplate | undefined => {
    return reportTemplates.find(t => t.id === id)
}

export const getTemplatesByCategory = (
    category: ReportTemplate["category"]
): ReportTemplate[] => {
    return reportTemplates.filter(t => t.category === category)
}
