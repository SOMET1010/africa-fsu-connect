import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageHero } from "@/components/shared/PageHero"
import { GlassCard } from "@/components/ui/glass-card"
import { ModernButton } from "@/components/ui/modern-button"
import { Link } from "react-router-dom"
import {
    BarChart3,
    Globe,
    Users,
    Wifi,
    DollarSign,
    Download,
    TrendingUp,
    MapPin,
    Building2,
    Target,
} from "lucide-react"

const PublicDashboard = () => {
    const kpis = [
        {
            title: "Couverture Population",
            value: "68%",
            change: "+5.2%",
            trend: "up",
            icon: Users,
            color: "text-[hsl(var(--nx-cyan))]",
            description: "Population couverte par les services télécoms",
        },
        {
            title: "Sites Connectés",
            value: "12,847",
            change: "+1,234",
            trend: "up",
            icon: Wifi,
            color: "text-green-500",
            description: "Écoles, centres de santé et sites publics",
        },
        {
            title: "Budget FSU Total",
            value: "$2.4B",
            change: "+15%",
            trend: "up",
            icon: DollarSign,
            color: "text-[hsl(var(--nx-gold))]",
            description: "Fonds mobilisés pour le service universel",
        },
        {
            title: "Projets Actifs",
            value: "127",
            change: "+18",
            trend: "up",
            icon: Target,
            color: "text-orange-500",
            description: "Projets en cours d'exécution",
        },
    ]

    const regionalProgress = [
        { region: "CEDEAO", coverage: 72, projects: 45, budget: 850 },
        { region: "SADC", coverage: 65, projects: 38, budget: 720 },
        { region: "EACO", coverage: 58, projects: 24, budget: 450 },
        { region: "ECCAS", coverage: 52, projects: 15, budget: 280 },
        { region: "UMA", coverage: 78, projects: 5, budget: 100 },
    ]

    const topCountries = [
        { name: "Côte d'Ivoire", coverage: 85, projects: 18, flag: "🇨🇮" },
        { name: "Kenya", coverage: 82, projects: 15, flag: "🇰🇪" },
        { name: "Nigeria", coverage: 79, projects: 22, flag: "🇳🇬" },
        { name: "Afrique du Sud", coverage: 88, projects: 12, flag: "🇿🇦" },
        { name: "Maroc", coverage: 91, projects: 8, flag: "🇲🇦" },
    ]

    return (
        <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Hero */}
                <PageHero
                    badge="Tableau de Bord Public"
                    badgeIcon={BarChart3}
                    title="Indicateurs du Service Universel en Afrique"
                    subtitle="Indicateurs clés agrégés et progrès régional du Service Universel en Afrique"
                    ctaLabel="Voir la carte"
                    ctaIcon={Globe}
                    onCtaClick={() => (window.location.href = "/map")}
                />

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                    {kpis.map(kpi => (
                        <GlassCard
                            key={kpi.title}
                            className="p-6 hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-white/10">
                                    <kpi.icon
                                        className={`h-6 w-6 ${kpi.color}`}
                                    />
                                </div>
                                <Badge
                                    variant="outline"
                                    className={
                                        kpi.trend === "up"
                                            ? "text-green-400 border-green-500/30 bg-green-500/10"
                                            : "text-red-400 border-red-500/30 bg-red-500/10"
                                    }
                                >
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    {kpi.change}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-white">
                                    {kpi.value}
                                </h3>
                                <p className="text-sm font-medium text-white/80">
                                    {kpi.title}
                                </p>
                                <p className="text-xs text-white/50">
                                    {kpi.description}
                                </p>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Regional Progress & Top Countries */}
                <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
                    {/* Regional Progress */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                            <h3 className="text-lg font-semibold text-white">
                                Progrès par Région
                            </h3>
                        </div>
                        <p className="text-sm text-white/60 mb-6">
                            Couverture et nombre de projets par communauté
                            économique
                        </p>
                        <div className="space-y-6">
                            {regionalProgress.map(region => (
                                <div key={region.region} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="outline"
                                                className="font-medium border-white/20 text-white/80"
                                            >
                                                {region.region}
                                            </Badge>
                                            <span className="text-sm text-white/50">
                                                {region.projects} projets
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-white">
                                            {region.coverage}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={region.coverage}
                                        className="h-2"
                                    />
                                    <p className="text-xs text-white/50">
                                        Budget: ${region.budget}M USD
                                    </p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Top Countries */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-5 w-5 text-[hsl(var(--nx-cyan))]" />
                            <h3 className="text-lg font-semibold text-white">
                                Pays Leaders
                            </h3>
                        </div>
                        <p className="text-sm text-white/60 mb-6">
                            Meilleurs taux de couverture du service universel
                        </p>
                        <div className="space-y-4">
                            {topCountries.map(country => (
                                <div
                                    key={country.name}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-lg">
                                        {country.flag}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-white">
                                                {country.name}
                                            </span>
                                            <span className="text-sm text-white/50">
                                                {country.projects} projets
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Progress
                                                value={country.coverage}
                                                className="h-1.5 flex-1"
                                            />
                                            <span className="text-sm font-medium text-[hsl(var(--nx-gold))]">
                                                {country.coverage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Africa Map Placeholder */}
                <GlassCard className="overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe className="h-5 w-5 text-[hsl(var(--nx-gold))]" />
                            <h3 className="text-lg font-semibold text-white">
                                Carte Interactive - Projets en Afrique
                            </h3>
                        </div>
                        <p className="text-sm text-white/60">
                            Visualisation géographique de la couverture et des
                            projets
                        </p>
                    </div>
                    <div className="h-[400px] bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <Globe className="h-16 w-16 mx-auto text-white/30" />
                            <div>
                                <p className="text-lg font-medium text-white">
                                    Carte Interactive
                                </p>
                                <p className="text-sm text-white/50">
                                    Cliquez pour explorer la carte complète
                                </p>
                            </div>
                            <ModernButton variant="outline" asChild>
                                <Link to="/map">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Ouvrir la carte
                                </Link>
                            </ModernButton>
                        </div>
                    </div>
                </GlassCard>

                {/* Data Sources */}
                <GlassCard className="p-4 animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
                        <p>
                            Données agrégées depuis les 54 pays africains
                            membres • Dernière mise à jour:{" "}
                            {new Date().toLocaleDateString("fr-FR")}
                        </p>
                        <div className="flex items-center gap-4">
                            <span>
                                Sources: UAT, UIT, Banque Mondiale, GSMA
                            </span>
                            <ModernButton variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                API Données
                            </ModernButton>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}

export default PublicDashboard
