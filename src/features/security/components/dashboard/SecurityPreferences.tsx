
import { useState } from 'react';
import { useSecurity } from '../../hooks/useSecurity';
import { SectionCard } from '@/components/layout/SectionCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SecurityPreferences = () => {
  const { securityPreferences, updateSecurityPreferences } = useSecurity();
  const [localPreferences, setLocalPreferences] = useState(securityPreferences);

  const handlePreferenceChange = (key: string, value: boolean | number) => {
    const updatedPrefs = { ...localPreferences, [key]: value };
    setLocalPreferences(updatedPrefs);
  };

  const handleSave = () => {
    updateSecurityPreferences.mutate(localPreferences);
  };

  return (
    <div className="space-y-6">
      <SectionCard 
        title="Paramètres de sécurité" 
        description="Configurez vos préférences de sécurité et d'authentification"
        variant="elevated"
      >
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Sécurisez votre compte avec une couche supplémentaire de protection
              </p>
            </div>
            <Switch
              checked={localPreferences?.two_factor_enabled || false}
              onCheckedChange={(checked) => handlePreferenceChange('two_factor_enabled', checked)}
            />
          </div>

          {/* Login Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notifications de connexion</Label>
              <p className="text-sm text-muted-foreground">
                Recevez des alertes lors de nouvelles connexions
              </p>
            </div>
            <Switch
              checked={localPreferences?.login_notifications ?? true}
              onCheckedChange={(checked) => handlePreferenceChange('login_notifications', checked)}
            />
          </div>

          {/* Security Alerts */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Alertes de sécurité</Label>
              <p className="text-sm text-muted-foreground">
                Soyez averti des activités suspectes
              </p>
            </div>
            <Switch
              checked={localPreferences?.security_alerts ?? true}
              onCheckedChange={(checked) => handlePreferenceChange('security_alerts', checked)}
            />
          </div>

          {/* Session Timeout */}
          <div className="space-y-2">
            <Label>Délai d'expiration de session (minutes)</Label>
            <Input
              type="number"
              min="15"
              max="1440"
              value={Math.floor((localPreferences?.session_timeout || 7200) / 60)}
              onChange={(e) => handlePreferenceChange('session_timeout', parseInt(e.target.value) * 60)}
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">
              Temps avant déconnexion automatique
            </p>
          </div>

          {/* Max Concurrent Sessions */}
          <div className="space-y-2">
            <Label>Sessions simultanées maximum</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={localPreferences?.max_concurrent_sessions || 3}
              onChange={(e) => handlePreferenceChange('max_concurrent_sessions', parseInt(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">
              Nombre maximum de connexions simultanées autorisées
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSave}
            disabled={updateSecurityPreferences.isPending}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </SectionCard>

      {localPreferences?.two_factor_enabled && (
        <Alert variant="warning" className="animate-fade-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            L'authentification à deux facteurs est activée. Assurez-vous de conserver vos codes de récupération en lieu sûr.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecurityPreferences;
