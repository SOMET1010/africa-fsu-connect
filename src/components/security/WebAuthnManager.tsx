import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Fingerprint, 
  Key, 
  Smartphone, 
  Monitor, 
  Trash2,
  Shield,
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WebAuthnCredential {
  id: string;
  credential_id: string;
  public_key: string;
  name: string;
  device_type: 'biometric' | 'security_key' | 'platform';
  created_at: string;
  last_used: string | null;
}

const WebAuthnManager = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWebAuthnSupport();
    // Temporairement désactivé - en attente des tables de base de données
    setLoading(false);
  }, [user]);

  const checkWebAuthnSupport = () => {
    const supported = !!(window.PublicKeyCredential && 
                       navigator.credentials && 
                       navigator.credentials.create);
    setIsSupported(supported);
  };

  const registerCredential = async (name: string, deviceType: 'biometric' | 'security_key' | 'platform') => {
    if (!isSupported) {
      toast.error('WebAuthn non supporté sur ce navigateur');
      return;
    }

    setIsRegistering(true);
    try {
      // Mode démo - simulation de l'enregistrement
      const newCredential: WebAuthnCredential = {
        id: `demo-${Date.now()}`,
        credential_id: `cred-${Date.now()}`,
        public_key: 'demo-public-key',
        name: name,
        device_type: deviceType,
        created_at: new Date().toISOString(),
        last_used: null
      };

      setCredentials([newCredential, ...credentials]);
      toast.success('Credential WebAuthn enregistré (mode démo)');
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const removeCredential = async (credentialId: string) => {
    // Mode démo - suppression locale
    setCredentials(credentials.filter(c => c.id !== credentialId));
    toast.success('Credential supprimé (mode démo)');
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'biometric':
        return <Fingerprint className="h-5 w-5" />;
      case 'security_key':
        return <Key className="h-5 w-5" />;
      case 'platform':
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getDeviceTypeLabel = (deviceType: string) => {
    switch (deviceType) {
      case 'biometric':
        return 'Biométrique';
      case 'security_key':
        return 'Clé de sécurité';
      case 'platform':
        return 'Plateforme';
      default:
        return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Authentification WebAuthn
        </CardTitle>
        <CardDescription>
          Sécurisez votre compte avec l'authentification biométrique et les clés de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSupported && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Votre navigateur ne supporte pas WebAuthn. Veuillez utiliser un navigateur moderne.
            </AlertDescription>
          </Alert>
        )}

        {isSupported && (
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => registerCredential('Empreinte digitale', 'biometric')}
                disabled={isRegistering}
                size="sm"
                variant="outline"
              >
                <Fingerprint className="h-4 w-4 mr-2" />
                Ajouter empreinte
              </Button>
              <Button
                onClick={() => registerCredential('Clé de sécurité', 'security_key')}
                disabled={isRegistering}
                size="sm"
                variant="outline"
              >
                <Key className="h-4 w-4 mr-2" />
                Ajouter clé USB
              </Button>
              <Button
                onClick={() => registerCredential('Authentificateur plateforme', 'platform')}
                disabled={isRegistering}
                size="sm"
                variant="outline"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Ajouter appareil
              </Button>
            </div>

            {credentials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune clé de sécurité configurée</p>
                <p className="text-sm">Ajoutez une méthode d'authentification biométrique pour plus de sécurité</p>
              </div>
            ) : (
              <div className="space-y-3">
                {credentials.map((cred) => (
                  <div key={cred.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(cred.device_type)}
                      <div>
                        <p className="font-medium">{cred.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {getDeviceTypeLabel(cred.device_type)}
                          </Badge>
                          {cred.last_used && (
                            <span className="text-xs text-muted-foreground">
                              Dernière utilisation: {new Date(cred.last_used).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCredential(cred.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {credentials.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Vous avez {credentials.length} clé(s) de sécurité configurée(s). 
                  L'authentification biométrique est active (mode démo).
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WebAuthnManager;