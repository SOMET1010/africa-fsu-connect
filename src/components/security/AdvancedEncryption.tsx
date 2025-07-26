import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  Key,
  Copy,
  RefreshCw,
  Download,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityApiService } from '@/features/security/services/securityApi';
import { EncryptionKey } from '@/features/security/core/types';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

const AdvancedEncryption = () => {
  const { user } = useAuth();
  const [keys, setKeys] = useState<EncryptionKey[]>([]);
  const [e2eEnabled, setE2eEnabled] = useState(false);
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    
    const loadData = async () => {
      try {
        const [encryptionKeys, prefs] = await Promise.all([
          SecurityApiService.getEncryptionKeys(user.id),
          SecurityApiService.getSecurityPreferences(user.id)
        ]);
        
        setKeys(encryptionKeys);
        if (prefs?.e2e_encryption_enabled !== undefined) {
          setE2eEnabled(prefs.e2e_encryption_enabled);
        }
      } catch (error) {
        logger.error('Failed to load encryption data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleToggleE2E = async () => {
    try {
      const updated = await SecurityApiService.updateSecurityPreferences({
        user_id: user!.id,
        e2e_encryption_enabled: !e2eEnabled
      });
      setE2eEnabled(updated.e2e_encryption_enabled);
      toast.success(updated.e2e_encryption_enabled ? 'Chiffrement E2E activé' : 'Chiffrement E2E désactivé');
    } catch (error) {
      logger.error('Failed to update E2E encryption setting', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleGenerateKey = async () => {
    try {
      const newKey = await SecurityApiService.generateEncryptionKey(user!.id, `Key ${keys.length + 1}`);
      setKeys([...keys, newKey]);
      toast.success('Nouvelle clé de chiffrement générée');
    } catch (error) {
      logger.error('Failed to generate encryption key', error);
      toast.error('Erreur lors de la génération de la clé');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
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
    <div className="space-y-6">
      {/* E2E Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Chiffrement bout-en-bout
          </CardTitle>
          <CardDescription>
            Sécurisez vos données avec un chiffrement de niveau militaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Chiffrement automatique</Label>
              <p className="text-sm text-muted-foreground">
                Chiffrer automatiquement tous les documents sensibles
              </p>
            </div>
            <Switch
              checked={e2eEnabled}
              onCheckedChange={handleToggleE2E}
            />
          </div>

          {e2eEnabled && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Le chiffrement bout-en-bout est activé. Vos données sont protégées avec un chiffrement AES-256.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Encryption Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Gestion des clés de chiffrement
          </CardTitle>
          <CardDescription>
            Gérez vos clés de chiffrement personnalisées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {keys.length} clé(s) de chiffrement configurée(s)
            </p>
            <Button
              onClick={handleGenerateKey}
              disabled={processing}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Générer nouvelle clé
            </Button>
          </div>

          {keys.length > 0 && (
            <div className="space-y-2">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{key.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {key.algorithm} • {new Date(key.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={key.is_active ? 'default' : 'secondary'}>
                    {key.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Conservez vos clés de chiffrement en lieu sûr. 
          La perte de vos clés rendra vos données chiffrées irrécupérables.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdvancedEncryption;