import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { 
  FolderOpen, 
  Globe, 
  FileText, 
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  ArrowRight,
  Activity,
  Bell,
  Download,
  Settings,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

// Stats from PDF specifications
const mainStats = [
  { 
    key: "activeProjects", 
    value: 127, 
    label: "Projets Actifs",
    labelEn: "Active Projects",
    icon: FolderOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    trend: "+12%"
  },
  { 
    key: "countries", 
    value: 54, 
    label: "Pays",
    labelEn: "Countries",
    icon: Globe,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    trend: "+3"
  },
  { 
    key: "documents", 
    value: 89, 
    label: "Nouveaux Documents",
    labelEn: "New Documents",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    trend: "+24"
  },
  { 
    key: "events", 
    value: 12, 
    label: "Événements à Venir",
    labelEn: "Upcoming Events",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    trend: "Ce mois"
  }
];

// Regional filters from PDF
const regions = [
  { id: "all", label: "Toutes les régions", count: 54 },
  { id: "cedeao", label: "CEDEAO", count: 15 },
  { id: "sadc", label: "SADC", count: 16 },
  { id: "eaco", label: "EACO", count: 8 },
  { id: "eccas", label: "ECCAS", count: 11 },
  { id: "uma", label: "UMA", count: 5 }
];

// Recent activity
const recentActivities = [
  { 
    type: "project",
    title: "Projet Connectivité Rurale",
    country: "Côte d'Ivoire",
    time: "Il y a 2h",
    status: "active"
  },
  { 
    type: "document",
    title: "Rapport Annuel FSU 2024",
    country: "Nigeria",
    time: "Il y a 4h",
    status: "new"
  },
  { 
    type: "event",
    title: "Webinaire Régulation FSU",
    country: "UAT",
    time: "Demain",
    status: "upcoming"
  },
  { 
    type: "project",
    title: "Infrastructure Backbone",
    country: "Kenya",
    time: "Il y a 1 jour",
    status: "completed"
  }
];

export function SutelDashboard() {
  const { profile } = useAuth();
  const { t, currentLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Premium Header */}
      <div className="premium-card m-6 p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold gradient-text">
                Tableau de Bord SUTEL
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Activity className="h-3 w-3 mr-1" />
                Temps Réel
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              Bienvenue {profile?.first_name || 'Collaborateur'}, voici l'état du réseau FSU africain
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="backdrop-blur-sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm" className="backdrop-blur-sm">
              <Bell className="h-4 w-4 mr-2" />
              Alertes
            </Button>
            <Button variant="outline" size="sm" className="backdrop-blur-sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurer
            </Button>
          </div>
        </div>
      </div>

      <PageContainer>
        <div className="space-y-6">
          {/* Main Stats Grid - 4 KPIs from PDF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainStats.map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className={`inline-flex p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentLanguage === "en" ? stat.labelEn : stat.label}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.trend}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Regional Filters + Map Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Regional Filters */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Filtres Régionaux</h3>
              </div>
              <div className="space-y-2">
                {regions.map((region) => (
                  <Button
                    key={region.id}
                    variant={region.id === "all" ? "default" : "outline"}
                    className="w-full justify-between"
                    size="sm"
                  >
                    <span>{region.label}</span>
                    <Badge variant="secondary">{region.count}</Badge>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Map Preview */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Carte Interactive - Aperçu</h3>
                </div>
                <Link to="/map">
                  <Button variant="outline" size="sm">
                    Plein écran
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M50,10 L60,30 L80,35 L65,50 L70,70 L50,60 L30,70 L35,50 L20,35 L40,30 Z" fill="currentColor" className="text-primary"/>
                  </svg>
                </div>
                <div className="text-center z-10">
                  <Globe className="h-16 w-16 text-primary/60 mx-auto mb-2" />
                  <p className="text-muted-foreground">54 pays • 127 projets actifs</p>
                  <Link to="/map">
                    <Button className="mt-4" size="sm">
                      Explorer la carte
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity + Quick Access */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity Feed */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Activités Récentes</h3>
                </div>
                <Button variant="ghost" size="sm">Voir tout</Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`p-2 rounded-full ${
                      activity.type === "project" ? "bg-blue-500/10" :
                      activity.type === "document" ? "bg-purple-500/10" :
                      "bg-orange-500/10"
                    }`}>
                      {activity.type === "project" && <FolderOpen className="h-4 w-4 text-blue-600" />}
                      {activity.type === "document" && <FileText className="h-4 w-4 text-purple-600" />}
                      {activity.type === "event" && <Calendar className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.country}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        activity.status === "active" ? "default" :
                        activity.status === "new" ? "secondary" :
                        activity.status === "completed" ? "outline" :
                        "secondary"
                      }>
                        {activity.status === "active" && "Actif"}
                        {activity.status === "new" && "Nouveau"}
                        {activity.status === "completed" && "Terminé"}
                        {activity.status === "upcoming" && "À venir"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quick Access Grid */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Accès Rapide</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Base de Données FSU", icon: FolderOpen, href: "/projects", color: "bg-blue-500" },
                  { label: "Carte Interactive", icon: MapPin, href: "/map", color: "bg-green-500" },
                  { label: "Bibliothèque", icon: FileText, href: "/docs", color: "bg-purple-500" },
                  { label: "Forum", icon: Users, href: "/forum", color: "bg-orange-500" },
                  { label: "E-Learning", icon: Globe, href: "/elearning", color: "bg-pink-500" },
                  { label: "Événements", icon: Calendar, href: "/events", color: "bg-cyan-500" },
                ].map((item) => (
                  <Link key={item.href} to={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all cursor-pointer group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center mb-3`}>
                        <item.icon className={`h-5 w-5 ${item.color.replace('bg-', 'text-').replace('-500', '-600')}`} />
                      </div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{item.label}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Coverage Stats */}
          <Card className="p-8">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl mx-auto flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Couverture Population Africaine</h3>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">73%</div>
                  <div className="text-sm text-muted-foreground">Couverture actuelle</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">+5%</div>
                  <div className="text-sm text-muted-foreground">Ce trimestre</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent">95%</div>
                  <div className="text-sm text-muted-foreground">Objectif 2030</div>
                </div>
              </div>
              <Link to="/analytics">
                <Button className="mt-4">
                  Voir les Analyses Détaillées
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
}
