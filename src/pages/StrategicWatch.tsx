import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
import { 
  Eye, 
  Rss, 
  Bell, 
  ExternalLink, 
  Calendar, 
  DollarSign,
  FileText,
  Globe,
  TrendingUp,
  Filter,
  Search,
  Bookmark,
  Share2
} from "lucide-react";
import { useState } from "react";

const StrategicWatch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const newsItems = [
    {
      id: 1,
      title: "L'UIT publie de nouvelles recommandations sur la connectivité rurale",
      source: "ITU News",
      date: "2026-01-28",
      category: "Régulation",
      urgent: true,
      summary: "De nouvelles lignes directrices pour améliorer l'accès au service universel dans les zones rurales africaines."
    },
    {
      id: 2,
      title: "La GSMA annonce un partenariat pour l'expansion du mobile en Afrique",
      source: "GSMA Intelligence",
      date: "2026-01-27",
      category: "Partenariats",
      urgent: false,
      summary: "Un nouveau programme de financement de 500 millions USD pour l'infrastructure mobile."
    },
    {
      id: 3,
      title: "Rapport annuel sur la fracture numérique en Afrique subsaharienne",
      source: "Banque Mondiale",
      date: "2026-01-25",
      category: "Études",
      urgent: false,
      summary: "Analyse détaillée des progrès réalisés et des défis persistants dans la région."
    },
    {
      id: 4,
      title: "Nouvelles politiques de spectre pour la 5G en Afrique de l'Ouest",
      source: "CEDEAO",
      date: "2026-01-24",
      category: "Régulation",
      urgent: true,
      summary: "Harmonisation des bandes de fréquences pour le déploiement de la 5G dans la région."
    }
  ];

  const fundingOpportunities = [
    {
      id: 1,
      title: "Fonds d'Innovation Numérique Africain",
      organization: "Union Africaine",
      amount: "5M - 20M USD",
      deadline: "2026-03-15",
      eligibility: "Gouvernements, Agences FSU",
      status: "Ouvert"
    },
    {
      id: 2,
      title: "Programme de Connectivité Rurale",
      organization: "Banque Mondiale",
      amount: "10M - 50M USD",
      deadline: "2026-04-30",
      eligibility: "Pays membres",
      status: "Ouvert"
    },
    {
      id: 3,
      title: "Subvention Infrastructure Télécom",
      organization: "BAD",
      amount: "2M - 15M USD",
      deadline: "2026-02-28",
      eligibility: "Opérateurs, PPP",
      status: "Clôture proche"
    }
  ];

  const alerts = [
    { type: "Régulation", count: 3, color: "bg-[hsl(var(--nx-cyan))]" },
    { type: "Financement", count: 2, color: "bg-green-500" },
    { type: "Technologie", count: 5, color: "bg-purple-500" },
    { type: "Événements", count: 1, color: "bg-[hsl(var(--nx-gold))]" }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <PageHero
          badge="Veille Stratégique"
          badgeIcon={Eye}
          title="Actualités et Opportunités"
          subtitle="Actualités, opportunités de financement et alertes configurables pour rester informé des évolutions du secteur"
        />

        {/* Alerts Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          {alerts.map((alert) => (
            <GlassCard key={alert.type} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{alert.type}</p>
                  <p className="text-2xl font-bold text-white">{alert.count}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${alert.color} animate-pulse`} />
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 animate-fade-in">
          <ModernButton variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Configurer alertes
          </ModernButton>
          <ModernButton variant="outline">
            <Rss className="h-4 w-4 mr-2" />
            Flux RSS
          </ModernButton>
        </div>

        {/* Search */}
        <div className="flex gap-4 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Rechercher dans les actualités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <ModernButton variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </ModernButton>
        </div>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-white/5">
            <TabsTrigger value="news" className="data-[state=active]:bg-white/10">Actualités</TabsTrigger>
            <TabsTrigger value="funding" className="data-[state=active]:bg-white/10">Financements</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white/10">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-4 animate-fade-in">
            {newsItems.map((item) => (
              <GlassCard key={item.id} className="p-6 hover:bg-white/[0.08] transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={item.urgent ? "destructive" : "secondary"} className={item.urgent ? "" : "bg-white/10 text-white/70"}>
                        {item.category}
                      </Badge>
                      {item.urgent && (
                        <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white hover:text-[hsl(var(--nx-gold))] cursor-pointer transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/60">{item.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {item.source}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <ModernButton variant="ghost" size="icon" aria-label="Sauvegarder">
                      <Bookmark className="h-4 w-4" />
                    </ModernButton>
                    <ModernButton variant="ghost" size="icon" aria-label="Partager">
                      <Share2 className="h-4 w-4" />
                    </ModernButton>
                    <ModernButton variant="ghost" size="icon" aria-label="Ouvrir">
                      <ExternalLink className="h-4 w-4" />
                    </ModernButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </TabsContent>

          <TabsContent value="funding" className="space-y-4 animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fundingOpportunities.map((opportunity) => (
                <GlassCard key={opportunity.id} className="p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <Badge 
                      variant={opportunity.status === "Clôture proche" ? "destructive" : "default"}
                      className={opportunity.status !== "Clôture proche" ? "bg-[hsl(var(--nx-gold))] text-[hsl(var(--nx-night))]" : ""}
                    >
                      {opportunity.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{opportunity.title}</h3>
                  <p className="text-sm text-white/60 mb-4">{opportunity.organization}</p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-white">{opportunity.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      <span className="text-white/70">Date limite: {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[hsl(var(--nx-cyan))]" />
                      <span className="text-white/60">{opportunity.eligibility}</span>
                    </div>
                  </div>
                  <ModernButton className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir les détails
                  </ModernButton>
                </GlassCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 animate-fade-in">
            <GlassCard className="p-12 text-center">
              <FileText className="h-16 w-16 mx-auto text-white/30 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-white">Rapports et Publications</h3>
              <p className="text-white/60 mb-4">
                Accédez aux derniers rapports des organisations partenaires
              </p>
              <ModernButton variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Explorer les rapports
              </ModernButton>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StrategicWatch;
