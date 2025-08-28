import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Calendar, 
  Users, 
  Zap, 
  CheckCircle,
  Gift,
  Clock,
  Phone,
  Mail,
  Globe
} from "lucide-react";

export function CallToActionSection() {
  const offers = [
    {
      title: "Pilote Gratuit 90 Jours",
      description: "Essayez SUTEL Platform sans engagement avec accès complet",
      features: [
        "Accès illimité à toutes les fonctionnalités",
        "Support dédié 24/7 en français",
        "Formation personnalisée incluse",
        "Migration de vos données gratuites"
      ],
      icon: Gift,
      color: "bg-green-500",
      highlight: "Populaire"
    },
    {
      title: "Migration Assistée",
      description: "Notre équipe s'occupe de tout pour une transition sans stress",
      features: [
        "Équipe de migration dédiée",
        "Transfert sécurisé des données",
        "Formation de vos équipes", 
        "Support post-migration 6 mois"
      ],
      icon: Users,
      color: "bg-blue-500",
      highlight: "Recommandé"
    },
    {
      title: "Démo Personnalisée",
      description: "Présentation adaptée à vos besoins spécifiques",
      features: [
        "Session 1-à-1 avec nos experts",
        "Analyse de vos besoins actuels",
        "ROI personnalisé pour votre pays",
        "Plan d'implémentation sur-mesure"
      ],
      icon: Calendar,
      color: "bg-purple-500",
      highlight: "Immédiat"
    }
  ];

  const nextSteps = [
    {
      step: 1,
      title: "Contactez-Nous",
      description: "Planifiez un appel avec notre équipe régionale",
      duration: "15 min",
      icon: Phone
    },
    {
      step: 2,
      title: "Évaluation",
      description: "Analyse de vos besoins et calcul ROI personnalisé", 
      duration: "1 semaine",
      icon: CheckCircle
    },
    {
      step: 3,
      title: "Pilote",
      description: "Démarrage du pilote avec formation et support",
      duration: "90 jours",
      icon: Rocket
    },
    {
      step: 4,
      title: "Déploiement",
      description: "Migration complète avec accompagnement dédié",
      duration: "30 jours",
      icon: Zap
    }
  ];

  const urgencyFactors = [
    {
      factor: "Offre limitée",
      description: "Pilote gratuit disponible pour les 5 prochains SUTELs seulement",
      icon: Clock,
      color: "text-red-600"
    },
    {
      factor: "Tarif préférentiel",
      description: "50% de réduction sur l'abonnement la première année",
      icon: Gift,
      color: "text-green-600"
    },
    {
      factor: "Formation prioritaire",
      description: "Accès prioritaire à nos formateurs experts",
      icon: Users,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent"
        >
          Rejoignez la Révolution SUTEL Aujourd'hui
        </motion.h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Ne restez pas en arrière. Transformez votre organisation dès maintenant avec la plateforme qui unit l'Afrique.
        </p>
      </div>

      {/* Urgence et offres limitées */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/10 dark:via-red-900/10 dark:to-pink-900/10 border-orange-200">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
            <Badge className="bg-orange-100 text-orange-800 text-sm font-bold">
              OFFRE LIMITÉE - AGISSEZ MAINTENANT
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {urgencyFactors.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <motion.div
                  key={factor.factor}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${factor.color}`} />
                  <div className="font-bold text-sm">{factor.factor}</div>
                  <div className="text-xs text-muted-foreground">{factor.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Offres principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {offers.map((offer, index) => {
          const Icon = offer.icon;
          return (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-8 h-full relative hover:shadow-xl transition-all duration-300 border-2 hover:border-primary">
                {offer.highlight && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    {offer.highlight}
                  </Badge>
                )}

                <div className="text-center space-y-6">
                  <div className={`mx-auto w-16 h-16 ${offer.color} bg-opacity-10 rounded-full flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 text-${offer.color.split('-')[1]}-600`} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-muted-foreground">{offer.description}</p>
                  </div>

                  <div className="space-y-3 text-left">
                    {offer.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    size="lg" 
                    className={`w-full bg-gradient-to-r from-${offer.color.split('-')[1]}-600 to-${offer.color.split('-')[1]}-700 hover:from-${offer.color.split('-')[1]}-700 hover:to-${offer.color.split('-')[1]}-800`}
                  >
                    Choisir cette Option
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Processus en 4 étapes */}
      <Card className="p-8">
        <div className="text-center space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Votre Parcours vers le Succès</h3>
            <p className="text-muted-foreground">
              Un processus simple et éprouvé pour votre transformation digitale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {index < nextSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary/30 transform translate-x-2" />
                  )}
                  
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">
                        {step.step}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {step.duration}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* CTA Final */}
      <Card className="p-8 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-3xl font-bold mb-4">Prêt à Transformer Votre SUTEL ?</h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Rejoignez les 55+ pays qui font confiance à SUTEL Platform. 
              Votre organisation mérite le meilleur.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 font-bold px-8"
            >
              <Phone className="mr-2 h-5 w-5" />
              Planifier un Appel
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary font-bold px-8"
            >
              <Mail className="mr-2 h-5 w-5" />
              Demander une Demo
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost"
              className="text-white hover:bg-white/10 font-bold px-8"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Commencer le Pilote
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-6 opacity-80">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">contact@sutel-platform.africa</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+33 (0)1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">www.sutel-platform.africa</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}