import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Eye, 
  Key, 
  FileCheck, 
  Server,
  AlertTriangle,
  CheckCircle,
  Zap,
  Users
} from "lucide-react";

export function SecurityComplianceSection() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Row Level Security (RLS)",
      description: "Sécurité au niveau des données avec isolation complète entre organisations",
      level: "Enterprise",
      color: "bg-red-500"
    },
    {
      icon: Key,
      title: "Authentification Multi-Facteurs",
      description: "2FA obligatoire avec support TOTP, SMS et authentificateurs hardware",
      level: "Avancé",
      color: "bg-blue-500"
    },
    {
      icon: Lock,
      title: "Chiffrement Bout-en-Bout",
      description: "AES-256 en transit et au repos, clés gérées par HSM certifiés",
      level: "Militaire",
      color: "bg-purple-500"
    },
    {
      icon: Eye,
      title: "Audit Trails Complets",
      description: "Logs immutables de toutes les actions avec horodatage cryptographique",
      level: "Forensique",
      color: "bg-green-500"
    },
    {
      icon: Server,
      title: "Infrastructure Résiliente", 
      description: "Multi-zones avec failover automatique et backup temps réel",
      level: "Critique",
      color: "bg-orange-500"
    },
    {
      icon: Users,
      title: "Gestion d'Accès Granulaire",
      description: "Contrôles RBAC avec permissions contextuelles par pays/région",
      level: "Enterprise",
      color: "bg-teal-500"
    }
  ];

  const complianceStandards = [
    {
      standard: "ISO 27001:2022",
      description: "Système de management de la sécurité de l'information",
      status: "Certifié",
      validUntil: "2025",
      coverage: "100%"
    },
    {
      standard: "SOC 2 Type II",
      description: "Contrôles de sécurité, disponibilité et confidentialité",
      status: "Certifié", 
      validUntil: "2025",
      coverage: "100%"
    },
    {
      standard: "GDPR",
      description: "Règlement général sur la protection des données",
      status: "Compliant",
      validUntil: "Permanent",
      coverage: "100%"
    },
    {
      standard: "CCPA",
      description: "California Consumer Privacy Act", 
      status: "Compliant",
      validUntil: "Permanent",
      coverage: "100%"
    },
    {
      standard: "HIPAA",
      description: "Health Insurance Portability and Accountability Act",
      status: "Ready",
      validUntil: "Sur demande",
      coverage: "95%"
    },
    {
      standard: "PCI DSS Level 1",
      description: "Payment Card Industry Data Security Standard",
      status: "Certifié",
      validUntil: "2025",
      coverage: "100%"
    }
  ];

  const securityMetrics = [
    {
      metric: "99.99%",
      label: "Uptime SLA",
      description: "Disponibilité garantie",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      metric: "< 15min",
      label: "Temps de Détection",
      description: "Anomalies sécurisées",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      metric: "256-bit",
      label: "Chiffrement AES",
      description: "Standard militaire",
      icon: Lock,
      color: "text-purple-600"
    },
    {
      metric: "24/7/365",
      label: "Monitoring",
      description: "Surveillance continue",
      icon: Eye,
      color: "text-blue-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Certifié": return "bg-green-100 text-green-800 border-green-200";
      case "Compliant": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ready": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Sécurité & Conformité Enterprise
        </motion.h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Une sécurité de niveau bancaire avec conformité aux standards internationaux les plus stricts
        </p>
      </div>

      {/* Métriques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center bg-gradient-to-br from-card to-muted/20">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{metric.metric}</div>
                <div className="font-medium text-foreground mb-2">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Fonctionnalités de sécurité */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Fonctionnalités de Sécurité Avancées</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                      <Icon className={`h-6 w-6 text-${feature.color.split('-')[1]}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg">{feature.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {feature.level}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Standards de conformité */}
      <Card className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/20">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Certifications & Standards de Conformité</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complianceStandards.map((standard, index) => (
            <motion.div
              key={standard.standard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-bold text-lg text-foreground">{standard.standard}</h4>
                  <Badge className={`text-xs ${getStatusColor(standard.status)}`}>
                    {standard.status}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm mb-4">
                  {standard.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Couverture:</span>
                    <span className="font-medium">{standard.coverage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Validité:</span>
                    <span className="font-medium">{standard.validUntil}</span>
                  </div>
                </div>

                {/* Barre de progression pour la couverture */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: standard.coverage }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Engagement sécurité */}
      <Card className="p-8 bg-gradient-to-r from-red-50 via-purple-50 to-blue-50 dark:from-red-900/10 dark:via-purple-900/10 dark:to-blue-900/10">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            <h3 className="text-3xl font-bold">Notre Engagement Sécurité</h3>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-bold">Zero Trust Architecture</h4>
              <p className="text-muted-foreground text-sm">
                Vérification continue de tous les accès avec principe du moindre privilège
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold">Réponse Incident 24/7</h4>
              <p className="text-muted-foreground text-sm">
                Équipe dédiée avec temps de réponse garanti sous 15 minutes
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <FileCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold">Audits Réguliers</h4>
              <p className="text-muted-foreground text-sm">
                Évaluations trimestrielles par des tiers indépendants certifiés
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Badge variant="outline" className="text-red-600 border-red-200">
              <Shield className="h-4 w-4 mr-1" />
              Sécurité Proactive
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Lock className="h-4 w-4 mr-1" />
              Chiffrement Total
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Eye className="h-4 w-4 mr-1" />
              Transparence Complète
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}