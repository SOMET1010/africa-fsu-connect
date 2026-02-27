import React from "react"
import { Link } from "react-router-dom"
import {
    Calculator,
    ClipboardCheck,
    Percent,
    FileText,
    Wrench,
    ArrowRight,
} from "lucide-react"
import { PageHero } from "@/components/shared/PageHero"
import { GlassCard } from "@/components/ui/glass-card"
import { ModernButton } from "@/components/ui/modern-button"
import { Badge } from "@/components/ui/badge"

import type { LucideIcon } from "lucide-react"

interface ToolCard {
    id: string
    title: string
    description: string
    icon: LucideIcon
    path: string
    color: string
    features: string[]
    status: "available" | "coming_soon"
}

const tools: ToolCard[] = [
    {
        id: "cost-calculator",
        title: "Calculateur de Coûts FSU",
        description:
            "Calculez les coûts complets de vos Projets (CAPEX et OPEX) selon la méthodologie GSMA",
        icon: Calculator,
        path: "/tools/fsu-calculator",
        color: "hsl(var(--nx-gold))",
        features: [
            "Calcul CAPEX détaillé par catégorie",
            "Projection OPEX sur la durée de vie",
            "Coût par bénéficiaire",
            "Graphiques de flux de trésorerie",
        ],
        status: "available",
    },
    {
        id: "self-assessment",
        title: "Auto-évaluation FSU",
        description:
            "Évaluez la maturité de votre FSU selon les 11 recommandations GSMA/UAT",
        icon: ClipboardCheck,
        path: "/tools/fsu-assessment",
        color: "hsl(var(--nx-cyan))",
        features: [
            "Questionnaire basé sur les recommandations GSMA",
            "Score de maturité par dimension",
            "Recommandations personnalisées",
            "Bonnes pratiques suggérées",
        ],
        status: "available",
    },
    {
        id: "contribution-simulator",
        title: "Simulateur de Taux de Contribution",
        description:
            "Estimez le taux de contribution optimal pour atteindre vos objectifs de couverture",
        icon: Percent,
        path: "/tools/contribution-simulator",
        color: "hsl(var(--primary))",
        features: [
            "Simulation basée sur le déficit d'accès",
            "Comparaison de scénarios",
            "Impact estimé sur les prix",
            "Benchmarks régionaux",
        ],
        status: "available",
    },
    {
        id: "report-generator",
        title: "Générateur de Rapports",
        description:
            "Créez des rapports FSU structurés selon les standards GSMA",
        icon: FileText,
        path: "/tools/fsu-reports",
        color: "hsl(var(--success))",
        features: [
            "Modèles de rapport annuel",
            "Suivi de projet",
            "Rapport de consultation",
            "Export Markdown/PDF",
        ],
        status: "available",
    },
]

const FSUToolsHub: React.FC = () => {
    return (
        <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
            <div className="container mx-auto px-4 py-8 space-y-8">
                <PageHero
                    badge="Boîte à Outils"
                    badgeIcon={Wrench}
                    title="Outils Méthodologiques FSU"
                    subtitle="Des outils pratiques basés sur les recommandations GSMA/UAT pour optimiser la gestion de votre Fonds du Service Universel"
                />

                {/* Introduction */}
                <GlassCard className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[hsl(var(--nx-gold)/0.1)]">
                            <Wrench className="w-6 h-6 text-[hsl(var(--nx-gold))]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-2">
                                Des outils au service de votre FSU
                            </h2>
                            <p className="text-white/70">
                                Ces outils ont été conçus à partir du rapport
                                GSMA/UAT "Les Fonds du Service Universel en
                                Afrique" pour vous aider à appliquer les
                                meilleures pratiques dans la gestion de votre
                                FSU. Chaque outil utilise{" "}
                                <strong className="text-white">
                                    vos propres données
                                </strong>{" "}
                                — aucune donnée n'est partagée ou comparée avec
                                d'autres pays.
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* Grille des outils */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tools.map(tool => (
                        <GlassCard
                            key={tool.id}
                            className="p-6 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{
                                        backgroundColor: `${tool.color}20`,
                                    }}
                                >
                                    <tool.icon
                                        className="w-6 h-6"
                                        color={tool.color}
                                    />
                                </div>
                                {tool.status === "coming_soon" && (
                                    <Badge
                                        variant="outline"
                                        className="text-white/50 border-white/20"
                                    >
                                        Bientôt
                                    </Badge>
                                )}
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-2">
                                {tool.title}
                            </h3>
                            <p className="text-white/60 mb-4">
                                {tool.description}
                            </p>

                            <ul className="space-y-2 mb-6">
                                {tool.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2 text-sm text-white/70"
                                    >
                                        <span className="text-[hsl(var(--nx-gold))]">
                                            ✓
                                        </span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {tool.status === "available" ? (
                                <Link to={tool.path}>
                                    <ModernButton className="w-full group-hover:bg-white/10">
                                        Accéder à l'outil
                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                    </ModernButton>
                                </Link>
                            ) : (
                                <ModernButton
                                    disabled
                                    className="w-full opacity-50"
                                >
                                    Bientôt disponible
                                </ModernButton>
                            )}
                        </GlassCard>
                    ))}
                </div>

                {/* Méthodologie */}
                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        📚 Base Méthodologique
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-[hsl(var(--nx-gold))] font-medium mb-2">
                                Rapport GSMA/UAT
                            </h3>
                            <p className="text-white/60 text-sm">
                                "Les Fonds du Service Universel en Afrique" — 11
                                recommandations pour des FSU efficaces
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-[hsl(var(--nx-cyan))] font-medium mb-2">
                                Données Souveraines
                            </h3>
                            <p className="text-white/60 text-sm">
                                Vos données restent privées et ne sont jamais
                                partagées avec d'autres pays
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <h3 className="text-[hsl(var(--primary))] font-medium mb-2">
                                Bonnes Pratiques
                            </h3>
                            <p className="text-white/60 text-sm">
                                Inspirées des succès du Maroc (Pay or Play),
                                Ghana (GIFEC), et autres
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}

export default FSUToolsHub
