import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Server, 
  Database, 
  Shield, 
  Zap, 
  Globe, 
  Cloud,
  Network,
  Lock,
  CheckCircle,
  Gauge
} from "lucide-react";

export function TechnicalArchitecture() {
  const architectureComponents = [
    {
      layer: "Frontend",
      icon: Globe,
      technologies: ["React 18", "TypeScript", "Tailwind CSS", "Vite"],
      description: "Interface moderne et responsive",
      color: "bg-blue-500"
    },
    {
      layer: "Backend",
      icon: Server,
      technologies: ["Supabase", "PostgreSQL", "Edge Functions", "Real-time"],
      description: "Infrastructure scalable et sécurisée",
      color: "bg-green-500"
    },
    {
      layer: "Sécurité", 
      icon: Shield,
      technologies: ["RLS", "JWT", "2FA", "Encryption"],
      description: "Sécurité de niveau enterprise",
      color: "bg-red-500"
    },
    {
      layer: "DevOps",
      icon: Cloud,
      technologies: ["CI/CD", "Docker", "Monitoring", "Auto-scaling"],
      description: "Déploiement et monitoring automatisés",
      color: "bg-purple-500"
    }
  ];

  const performanceMetrics = [
    {
      metric: "Disponibilité",
      value: "99.9%",
      description: "SLA garanti",
      icon: Gauge,
      color: "text-green-600"
    },
    {
      metric: "Temps de réponse",
      value: "<200ms",
      description: "Latence moyenne",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      metric: "Sécurité",
      value: "A+",
      description: "Score SSL Labs",
      icon: Lock,
      color: "text-purple-600"
    },
    {
      metric: "Couverture Tests",
      value: "95%",
      description: "Tests automatisés",
      icon: CheckCircle,
      color: "text-orange-600"
    }
  ];

  const certifications = [
    "ISO 27001",
    "SOC 2 Type II", 
    "GDPR Compliant",
    "HIPAA Ready",
    "FedRAMP",
    "PCI DSS Level 1"
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Architecture Technique Enterprise
        </motion.h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Une infrastructure moderne, scalable et sécurisée conçue pour les entreprises africaines
        </p>
      </div>

      {/* Architecture Layers */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Network className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Stack Technologique</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {architectureComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <motion.div
                key={component.layer}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="p-6 h-full border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${component.color} bg-opacity-10`}>
                      <Icon className={`h-5 w-5 text-${component.color.split('-')[1]}-600`} />
                    </div>
                    <h4 className="font-bold text-lg">{component.layer}</h4>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {component.description}
                  </p>

                  <div className="space-y-2">
                    {component.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="mr-1 mb-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 text-center bg-gradient-to-br from-card to-card/80">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="font-medium text-foreground mb-1">{metric.metric}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Architecture Diagram */}
      <Card className="p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900/50 dark:to-blue-900/20">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold">Architecture Simplifiée</h3>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Users Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex justify-center gap-4 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium">Utilisateurs</div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>

            {/* Frontend Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex justify-center gap-4 mb-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-center">
                    <Server className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-medium">React Frontend</div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>

            {/* Backend Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex justify-center gap-4 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-sm font-medium">Supabase Backend</div>
                  </div>
                </div>
                <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <div className="text-sm font-medium">Sécurité RLS</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Certifications & Compliance */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Certifications & Conformité</h3>
        </div>

        <div className="text-center space-y-6">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nos certifications garantissent la conformité aux standards internationaux les plus stricts
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-card to-muted/20 rounded-lg border text-center hover:shadow-md transition-shadow"
              >
                <div className="text-sm font-medium">{cert}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              <Shield className="h-4 w-4 mr-1" />
              Enterprise Grade
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              <Zap className="h-4 w-4 mr-1" />
              High Performance
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}