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
  Plus, 
  Trash2,
  Shield,
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkWebAuthnSupport();
    fetchCredentials();
  }, [user]);

  const checkWebAuthnSupport = () => {
    const supported = window.PublicKeyCredential && 
                     navigator.credentials && 
                     navigator.credentials.create;
    setIsSupported(supported);
  };

  const fetchCredentials = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('webauthn_credentials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCredentials(data || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerCredential = async (name: string, deviceType: 'biometric' | 'security_key' | 'platform') => {
    if (!isSupported) {
      toast.error('WebAuthn n\'est pas supporté par ce navigateur');
      return;
    }

    setIsRegistering(true);
    
    try {
      // Generate challenge from server
      const challengeResponse = await supabase.functions.invoke('webauthn-challenge', {
        body: { type: 'registration', userId: user?.id }
      });

      if (challengeResponse.error) throw challengeResponse.error;
      
      const { challenge, user: userInfo } = challengeResponse.data;

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(challenge),
          rp: {
            name: "Plateforme de Collaboration",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userInfo.id),
            name: userInfo.email,
            displayName: userInfo.name || userInfo.email,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: deviceType === 'platform' ? 'platform' : 'cross-platform',
            userVerification: 'preferred',
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: 'direct',
        },
      }) as PublicKeyCredential;

      if (!credential) throw new Error('Échec de création de la clé');

      // Send credential to server for verification and storage
      const verifyResponse = await supabase.functions.invoke('webauthn-verify', {
        body: {
          type: 'registration',
          credential: {
            id: credential.id,
            rawId: Array.from(new Uint8Array(credential.rawId)),
            response: {
              attestationObject: Array.from(new Uint8Array((credential.response as AuthenticatorAttestationResponse).attestationObject)),
              clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
            },
            type: credential.type,
          },
          name,
          deviceType,
          userId: user?.id,
        }
      });

      if (verifyResponse.error) throw verifyResponse.error;

      toast.success('Clé de sécurité enregistrée avec succès');
      fetchCredentials();
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(`Erreur d'enregistrement: ${error.message}`);
    } finally {
      setIsRegistering(false);
    }
  };

  const deleteCredential = async (credentialId: string) => {
    try {
      const { error } = await supabase
        .from('webauthn_credentials')
        .delete()
        .eq('id', credentialId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Clé de sécurité supprimée');
      fetchCredentials();
    } catch (error: any) {
      toast.error(`Erreur de suppression: ${error.message}`);
    }
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
                      onClick={() => deleteCredential(cred.id)}
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
                  L'authentification biométrique est active.
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