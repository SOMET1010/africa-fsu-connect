import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  Rocket, 
  TrendingUp, 
  MapPin,
  Building2,
  Network,
  Zap
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { useRealRegionalStats } from "@/hooks/useRealRegionalStats";
import { InteractiveRegionalMap } from "./InteractiveRegionalMap";

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444'];

export function RegionalImpactSection() {
  const { data: statsData, isLoading } = useRealRegionalStats();
  
  const regions = statsData?.regions || [
    {
      name: "CEDEAO",
      countries: 15,
      projects: 312,
      coverage: "98%",
      color: "bg-primary",
      highlights: ["Nigeria", "Ghana", "Sénégal", "Côte d'Ivoire"]
    },
    {
      name: "SADC",
      countries: 16,
      projects: 278,
      coverage: "95%",
      color: "bg-green-500",
      highlights: ["Afrique du Sud", "Botswana", "Zimbabwe", "Namibie"]
    },
    {
      name: "EAC",
      countries: 7,
      projects: 189,
      coverage: "92%",
      color: "bg-purple-500",
      highlights: ["Kenya", "Tanzanie", "Ouganda", "Rwanda"]
    },
    {
      name: "COMESA",
      countries: 12,
      projects: 156,
      coverage: "88%",
      color: "bg-orange-500",
      highlights: ["Égypte", "Éthiopie", "Maurice", "Seychelles"]
    },
    {
      name: "CEMAC",
      countries: 6,
      projects: 134,
      coverage: "85%",
      color: "bg-red-500",
      highlights: ["Cameroun", "Gabon", "Guinée Équatoriale", "Tchad"]
    }
  ];

  const globalStats = [
    {
      icon: Globe,
      label: "Pays Connectés",
      value: statsData?.globalStats.countries || 0,
      description: "Couvrant tout le continent"
    },
    {
      icon: Rocket,
      label: "Projets Actifs",
      value: statsData?.globalStats.projects || 0,
      description: "En cours de réalisation"
    },
    {
      icon: Users,
      label: "Utilisateurs",
      value: `${((statsData?.globalStats.users || 0) / 1000).toFixed(1)}K+`,
      description: "Professionnels connectés"
    },
    {
      icon: TrendingUp,
      label: "Croissance",
      value: "+156%",
      description: "Cette année"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-8 bg-muted animate-pulse rounded w-64 mx-auto mb-4" />
          <div className="h-6 bg-muted animate-pulse rounded w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Impact Continental Prouvé
        </motion.h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Une couverture sans précédent qui transforme les télécommunications africaines
        </p>
      </div>

      {/* Statistiques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center border-2 hover:border-primary/50 transition-colors">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="font-medium text-foreground mb-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Couverture Régionale */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Couverture Régionale Détaillée</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {regions.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{region.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{region.countries} pays</Badge>
                      <Badge variant="outline">{region.coverage} couverture</Badge>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${region.color}`} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Projets actifs</span>
                    <span className="font-bold text-lg">{region.projects}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Pays leaders</span>
                    <div className="flex flex-wrap gap-1">
                      {region.highlights.map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Interactive Map */}
      <InteractiveRegionalMap />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Region Bar Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Projets par Région
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regions}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Bar dataKey="projects" fill="#3b82f6" name="Projets" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Coverage by Region Pie Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Couverture par Région
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regions}
                dataKey="coverage"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.coverage}%`}
              >
                {regions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Avantages Concurrentiels */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Network className="h-8 w-8 text-primary" />
            <h3 className="text-3xl font-bold">Pourquoi Nous Choisir ?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-uat-primary-100 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Déploiement Rapide</h4>
              <p className="text-muted-foreground">
                Migration complète en moins de 30 jours avec notre équipe dédiée
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold">Support 24/7</h4>
              <p className="text-muted-foreground">
                Équipe multilingue dédiée avec expertise locale dans chaque région
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold">ROI Garanti</h4>
              <p className="text-muted-foreground">
                Retour sur investissement prouvé dès le 3ème mois d'utilisation
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}