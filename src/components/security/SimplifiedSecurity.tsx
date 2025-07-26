import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, UserCheck, Clock } from "lucide-react";

interface SimplifiedSecurityProps {
  securityMetrics: any[];
  twoFactorEnabled: boolean;
  onToggleTwoFactor: () => void;
  onPasswordChange: () => void;
}

export const SimplifiedSecurity = ({
  securityMetrics,
  twoFactorEnabled,
  onToggleTwoFactor,
  onPasswordChange
}: SimplifiedSecurityProps) => {
  const basicStats = [
    {
      title: "Sécurité",
      value: "Élevé",
      icon: Shield,
      trend: { value: 95, label: "Score", positive: true },
      description: "Niveau global"
    },
    {
      title: "2FA",
      value: twoFactorEnabled ? "ON" : "OFF",
      icon: Key,
      trend: { value: twoFactorEnabled ? 100 : 0, label: "Protection", positive: twoFactorEnabled },
      description: "Double authentification"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {basicStats.map((stat, index) => (
          <ModernStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
            variant="gradient"
            size="md"
          />
        ))}
      </div>

      {/* Quick Actions */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Actions Rapides</h3>
            <p className="text-sm text-muted-foreground">
              Sécurisez votre compte rapidement
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton 
              variant={twoFactorEnabled ? "outline" : "default"} 
              size="sm"
              onClick={onToggleTwoFactor}
            >
              <Key className="h-4 w-4 mr-2" />
              {twoFactorEnabled ? 'Désactiver 2FA' : 'Activer 2FA'}
            </ModernButton>
            <ModernButton variant="outline" size="sm" onClick={onPasswordChange}>
              <Shield className="h-4 w-4 mr-2" />
              Changer mot de passe
            </ModernButton>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge variant={twoFactorEnabled ? "default" : "secondary"} className="text-xs">
            <Key className="h-3 w-3 mr-1" />
            2FA {twoFactorEnabled ? 'Activé' : 'Désactivé'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Sécurisé
          </Badge>
        </div>
      </ModernCard>

      {/* Security Tips */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Conseils de Sécurité</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
            <div className={`p-1 rounded-full ${twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              <Key className="h-3 w-3" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Authentification à deux facteurs</h4>
              <p className="text-xs text-muted-foreground">
                {twoFactorEnabled ? 'Votre compte est protégé par 2FA' : 'Activez 2FA pour plus de sécurité'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
            <div className="p-1 rounded-full bg-blue-100 text-blue-600">
              <Shield className="h-3 w-3" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Mot de passe fort</h4>
              <p className="text-xs text-muted-foreground">
                Utilisez un mot de passe unique et complexe
              </p>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};