import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Star, 
  TrendingUp, 
  Users, 
  Globe, 
  Award,
  Quote,
  CheckCircle,
  Building2,
  Shield
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { useRealRegionalStats } from "@/hooks/useRealRegionalStats";

export function SocialProofSection() {
  const { data: statsData } = useRealRegionalStats();
  const testimonials = [
    {
      name: "Dr. Amadou Diallo",
      position: "Directeur SUTEL Sénégal",
      country: "Sénégal",
      quote: "SUTEL Platform a révolutionné notre gestion des projets télécoms. +400% d'efficacité en 6 mois.",
      rating: 5,
      savings: "2.3M$",
      timeframe: "6 mois"
    },
    {
      name: "Fatima Al-Hassan", 
      position: "CTO SUTEL Nigeria",
      country: "Nigeria",
      quote: "La meilleure décision technologique de notre organisation. ROI de 300% dès la première année.",
      rating: 5,
      savings: "8.7M$",
      timeframe: "12 mois"
    },
    {
      name: "Jean-Baptiste Kouadio",
      position: "Président SUTEL Côte d'Ivoire", 
      country: "Côte d'Ivoire",
      quote: "Simplicité d'usage exceptionnelle. Nos équipes ont adopté la plateforme en moins d'une semaine.",
      rating: 5,
      savings: "1.8M$",
      timeframe: "8 mois"
    }
  ];

  const achievements = [
    {
      icon: Users,
      metric: `${((statsData?.globalStats.users || 0) / 1000).toFixed(1)}K+`,
      label: "Utilisateurs Actifs",
      description: "Professionnels des télécoms",
      color: "bg-blue-500"
    },
    {
      icon: Building2,
      metric: `${statsData?.globalStats.agencies || 0}+`,
      label: "Organisations",
      description: "SUTELs et agences partenaires",
      color: "bg-green-500"
    },
    {
      icon: Globe,
      metric: `${statsData?.globalStats.countries || 0}+`,
      label: "Pays Couverts",
      description: "Présence continentale",
      color: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      metric: "156%",
      label: "Croissance Annuelle",
      description: "Adoption accélérée",
      color: "bg-orange-500"
    }
  ];

  const industryRecognitions = [
    {
      award: "Best African TechSolution 2024",
      organization: "African Tech Awards",
      year: "2024"
    },
    {
      award: "Digital Transformation Leader",
      organization: "Telecom Africa Summit",
      year: "2024"
    },
    {
      award: "Innovation Excellence Award",
      organization: "ITU Regional",
      year: "2023"
    },
    {
      award: "Best B2B Platform",
      organization: "Africa Digital Awards",
      year: "2023"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-gold-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent"
        >
          Résultats Prouvés & Reconnaissances
        </motion.h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Des résultats concrets qui parlent d'eux-mêmes et la reconnaissance de l'industrie
        </p>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center bg-gradient-to-br from-card to-muted/20 hover:shadow-lg transition-all">
                <div className={`mx-auto w-12 h-12 ${achievement.color} bg-opacity-10 rounded-full flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 text-${achievement.color.split('-')[1]}-600`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{achievement.metric}</div>
                <div className="font-medium text-foreground mb-2">{achievement.label}</div>
                <div className="text-sm text-muted-foreground">{achievement.description}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Témoignages clients */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Quote className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Ce Que Disent Nos Partenaires</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-6 h-full bg-gradient-to-br from-primary/5 to-primary/10 border-l-4 border-l-primary">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Results */}
                <div className="flex gap-3 mb-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {testimonial.savings} économisés
                  </Badge>
                  <Badge variant="outline">
                    {testimonial.timeframe}
                  </Badge>
                </div>

                {/* Author */}
                <div className="border-t pt-4">
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-primary font-medium">{testimonial.position}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.country}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Reconnaissances industrie */}
      <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Award className="h-8 w-8 text-amber-600" />
            <h3 className="text-3xl font-bold">Reconnaissances Industrie</h3>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre excellence reconnue par les leaders de l'industrie africaine des télécommunications
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {industryRecognitions.map((recognition, index) => (
              <motion.div
                key={recognition.award}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  
                  <div className="text-left">
                    <h4 className="font-bold text-lg text-foreground mb-1">
                      {recognition.award}
                    </h4>
                    <div className="text-muted-foreground mb-1">
                      {recognition.organization}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {recognition.year}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Growth Chart */}
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Croissance de la Plateforme
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={[
                  { month: 'Jan', users: 12000, projects: 450 },
                  { month: 'Fév', users: 18000, projects: 580 },
                  { month: 'Mar', users: 24000, projects: 720 },
                  { month: 'Avr', users: 31000, projects: 890 },
                  { month: 'Mai', users: 39000, projects: 1020 },
                  { month: 'Juin', users: 48000, projects: 1180 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Legend />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Utilisateurs" />
                <Area type="monotone" dataKey="projects" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Projets" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Statut de confiance */}
          <div className="flex justify-center gap-6 pt-6 border-t">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-sm">Certifié ISO 27001</div>
              <div className="text-xs text-muted-foreground">Sécurité garantie</div>
            </div>
            
            <div className="text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-sm">SOC 2 Type II</div>
              <div className="text-xs text-muted-foreground">Contrôles audités</div>
            </div>
            
            <div className="text-center">
              <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-bold text-sm">GDPR Compliant</div>
              <div className="text-xs text-muted-foreground">Conformité Europe</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}