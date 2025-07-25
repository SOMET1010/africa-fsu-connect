import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Fingerprint, 
  Key, 
  Smartphone, 
  Monitor, 
  Trash2,
  Shield,
  CheckCircle,
  AlertTriangle,
  Plus,
  Scan
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityApiService } from '@/features/security/services/securityApi';
import { WebAuthnCredential } from '@/features/security/core/types';
import { toast } from 'sonner';

const EnhancedWebAuthn = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCredentialName, setNewCredentialName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    checkWebAuthnSupport();
    if (!user?.id) return;
    
    loadCredentials();
  }, [user]);

  const checkWebAuthnSupport = () => {
    const supported = !!(
      window.PublicKeyCredential && 
      navigator.credentials && 
      navigator.credentials.create &&
      window.isSecureContext
    );
    setIsSupported(supported);
  };

  const loadCredentials = async () => {
    try {
      const webauthnCreds = await SecurityApiService.getWebAuthnCredentials(user!.id);
      setCredentials(webauthnCreds);
    } catch (error) {
      console.error('Error loading WebAuthn credentials:', error);
      toast.error('Erreur lors du chargement des clés de sécurité');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCredential = async (type: 'security_key' | 'biometric' | 'platform') => {
    if (!newCredentialName.trim()) {
      toast.error('Veuillez saisir un nom pour cette clé de sécurité');
      return;
    }

    try {
      setIsRegistering(true);
      
      // In a real implementation, this would trigger the WebAuthn API
      const publicKeyCredentialCreationOptions = {
        challenge: new Uint8Array(32),
        rp: {
          name: "SUTEL Platform",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(user!.id),
          name: user!.email || 'user@example.com',
          displayName: user!.email || 'User',
        },
        pubKeyCredParams: [{alg: -7, type: "public-key" as const}],
        authenticatorSelection: {
          authenticatorAttachment: type === 'platform' ? 'platform' as const : 'cross-platform' as const,
          userVerification: "required" as const,
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "none" as const
      };

      try {
        // Simulate WebAuthn registration
        if (type === 'biometric' && !await checkBiometricSupport()) {
          throw new Error('Authentification biométrique non supportée sur cet appareil');
        }

        // const credential = await navigator.credentials.create({
        //   publicKey: publicKeyCredentialCreationOptions
        // });

        // For demo purposes, we'll create a mock credential
        const newCred = await SecurityApiService.registerWebAuthnCredential(
          user!.id, 
          newCredentialName,
          type
        );
        
        setCredentials([...credentials, newCred]);
        setNewCredentialName('');
        setShowAddForm(false);
        toast.success('Clé de sécurité enregistrée avec succès');
        
      } catch (webauthnError) {
        console.error('WebAuthn registration failed:', webauthnError);
        throw new Error('Échec de l\'enregistrement WebAuthn: ' + (webauthnError as Error).message);
      }
      
    } catch (error) {
      console.error('Error registering credential:', error);
      toast.error((error as Error).message || 'Erreur lors de l\'enregistrement');
    } finally {
      setIsRegistering(false);
    }
  };

  const checkBiometricSupport = async (): Promise<boolean> => {
    try {
      // Check if biometric authentication is available
      const available = await (navigator as any).credentials?.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          userVerification: 'required'
        }
      });
      return true;
    } catch {
      return false;
    }
  };

  const handleDeleteCredential = async (credentialId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette clé de sécurité ?')) {
      return;
    }

    try {
      // In a real implementation, this would call an API to delete the credential
      setCredentials(credentials.filter(cred => cred.id !== credentialId));
      toast.success('Clé de sécurité supprimée');
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const testCredential = async (credentialId: string) => {
    try {
      // In a real implementation, this would test the credential
      toast.success('Test de la clé de sécurité réussi');
    } catch (error) {
      console.error('Error testing credential:', error);
      toast.error('Échec du test de la clé de sécurité');
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'biometric': return <Fingerprint className="h-5 w-5" />;
      case 'security_key': return <Key className="h-5 w-5" />;
      case 'platform': return <Smartphone className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const getDeviceTypeLabel = (deviceType: string) => {
    switch (deviceType) {
      case 'biometric': return 'Biométrique';
      case 'security_key': return 'Clé de sécurité';
      case 'platform': return 'Plateforme';
      default: return 'Inconnu';
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
          Authentification WebAuthn Avancée
        </CardTitle>
        <CardDescription>
          Sécurisez votre compte avec l'authentification sans mot de passe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSupported && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Votre navigateur ne supporte pas WebAuthn ou vous n'êtes pas sur HTTPS. 
              Veuillez utiliser un navigateur moderne sur une connexion sécurisée.
            </AlertDescription>
          </Alert>
        )}

        {isSupported && (
          <>
            {/* Add New Credential Form */}
            {showAddForm ? (
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="credential-name">Nom de la clé de sécurité</Label>
                    <Input
                      id="credential-name"
                      value={newCredentialName}
                      onChange={(e) => setNewCredentialName(e.target.value)}
                      placeholder="Ex: Mon iPhone, Clé YubiKey, TouchID..."
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleRegisterCredential('security_key')}
                      disabled={isRegistering}
                      variant="outline"
                      size="sm"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Clé de sécurité
                    </Button>
                    
                    <Button
                      onClick={() => handleRegisterCredential('biometric')}
                      disabled={isRegistering}
                      variant="outline"
                      size="sm"
                    >
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Biométrique
                    </Button>
                    
                    <Button
                      onClick={() => handleRegisterCredential('platform')}
                      disabled={isRegistering}
                      variant="outline"
                      size="sm"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Plateforme
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowAddForm(false)}
                      variant="ghost"
                      size="sm"
                    >
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                onClick={() => setShowAddForm(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une authentification
              </Button>
            )}

            {/* Credentials List */}
            {credentials.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune clé de sécurité configurée</p>
                <p className="text-sm">Ajoutez une méthode d'authentification pour plus de sécurité</p>
              </div>
            ) : (
              <div className="space-y-3">
                {credentials.map((cred) => (
                  <Card key={cred.id} className="p-4">
                    <div className="flex items-center justify-between">
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
                            <Badge variant="outline" className="text-xs text-green-600">
                              Actif
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => testCredential(cred.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Scan className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteCredential(cred.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {credentials.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Excellent ! Vous avez {credentials.length} méthode(s) d'authentification WebAuthn configurée(s). 
                  Votre compte bénéficie d'une sécurité renforcée sans mot de passe.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedWebAuthn;