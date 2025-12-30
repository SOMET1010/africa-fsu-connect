import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    { type: "Régulation", count: 3, color: "bg-blue-500" },
    { type: "Financement", count: 2, color: "bg-green-500" },
    { type: "Technologie", count: 5, color: "bg-purple-500" },
    { type: "Événements", count: 1, color: "bg-orange-500" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Veille Stratégique</h1>
          </div>
          <p className="text-muted-foreground">
            Actualités, opportunités de financement et alertes configurables
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Configurer alertes
          </Button>
          <Button variant="outline">
            <Rss className="h-4 w-4 mr-2" />
            Flux RSS
          </Button>
        </div>
      </div>

      {/* Alerts Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {alerts.map((alert) => (
          <Card key={alert.type} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{alert.type}</p>
                <p className="text-2xl font-bold">{alert.count}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${alert.color} animate-pulse`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les actualités..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="funding">Financements</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          {newsItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={item.urgent ? "destructive" : "secondary"}>
                        {item.category}
                      </Badge>
                      {item.urgent && (
                        <Badge variant="outline" className="border-red-500 text-red-500">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="funding" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundingOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge 
                      variant={opportunity.status === "Clôture proche" ? "destructive" : "default"}
                      className="mb-2"
                    >
                      {opportunity.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <CardDescription>{opportunity.organization}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{opportunity.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>Date limite: {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">{opportunity.eligibility}</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir les détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Rapports et Publications</h3>
            <p className="text-muted-foreground mb-4">
              Accédez aux derniers rapports des organisations partenaires
            </p>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Explorer les rapports
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategicWatch;
