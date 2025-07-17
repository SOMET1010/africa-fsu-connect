import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Lock,
  Key,
  FileText,
  Download,
  Upload,
  Shield,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EncryptionKey {
  id: string;
  name: string;
  key_id: string;
  algorithm: string;
  created_at: string;
  is_active: boolean;
}

const AdvancedEncryption = () => {
  const { user } = useAuth();
  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKey[]>([]);
  const [e2eEnabled, setE2eEnabled] = useState(false);
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEncryptionData();
  }, [user]);

  const fetchEncryptionData = async () => {
    if (!user?.id) return;

    try {
      // Fetch encryption keys
      const { data: keysData, error: keysError } = await supabase
        .from('encryption_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (keysError) throw keysError;

      // Check if E2E is enabled
      const { data: prefsData, error: prefsError } = await supabase
        .from('security_preferences')
        .select('e2e_encryption_enabled')
        .eq('user_id', user.id)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') {
        console.error('Error fetching preferences:', prefsError);
      }

      setEncryptionKeys(keysData || []);
      setE2eEnabled(prefsData?.e2e_encryption_enabled || false);
    } catch (error) {
      console.error('Error fetching encryption data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEncryptionKey = async () => {
    if (!user?.id) return;

    setProcessing(true);
    try {
      const response = await supabase.functions.invoke('generate-encryption-key', {
        body: { userId: user.id }
      });

      if (response.error) throw response.error;

      toast.success('Clé de chiffrement générée');
      fetchEncryptionData();
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const toggleE2E = async (enabled: boolean) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('security_preferences')
        .upsert({
          user_id: user.id,
          e2e_encryption_enabled: enabled,
        });

      if (error) throw error;

      setE2eEnabled(enabled);
      toast.success(enabled ? 'Chiffrement E2E activé' : 'Chiffrement E2E désactivé');
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  const encryptText = async () => {
    if (!textToEncrypt.trim()) return;

    setProcessing(true);
    try {
      const response = await supabase.functions.invoke('encrypt-data', {
        body: {
          data: textToEncrypt,
          userId: user?.id
        }
      });

      if (response.error) throw response.error;

      setEncryptedText(response.data.encryptedData);
      toast.success('Texte chiffré avec succès');
    } catch (error: any) {
      toast.error(`Erreur de chiffrement: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const decryptText = async () => {
    if (!textToDecrypt.trim()) return;

    setProcessing(true);
    try {
      const response = await supabase.functions.invoke('decrypt-data', {
        body: {
          encryptedData: textToDecrypt,
          userId: user?.id
        }
      });

      if (response.error) throw response.error;

      setDecryptedText(response.data.decryptedData);
      toast.success('Texte déchiffré avec succès');
    } catch (error: any) {
      toast.error(`Erreur de déchiffrement: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  const exportKeys = async () => {
    try {
      const response = await supabase.functions.invoke('export-encryption-keys', {
        body: { userId: user?.id }
      });

      if (response.error) throw response.error;

      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encryption-keys-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Clés exportées');
    } catch (error: any) {
      toast.error(`Erreur d'export: ${error.message}`);
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
              onCheckedChange={toggleE2E}
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
              {encryptionKeys.length} clé(s) de chiffrement configurée(s)
            </p>
            <div className="flex gap-2">
              <Button
                onClick={generateEncryptionKey}
                disabled={processing}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Générer nouvelle clé
              </Button>
              {encryptionKeys.length > 0 && (
                <Button
                  onClick={exportKeys}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              )}
            </div>
          </div>

          {encryptionKeys.length > 0 && (
            <div className="space-y-2">
              {encryptionKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{key.name || 'Clé sans nom'}</p>
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

      {/* Encryption Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encrypt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Chiffrer du texte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Texte à chiffrer..."
              value={textToEncrypt}
              onChange={(e) => setTextToEncrypt(e.target.value)}
              rows={4}
            />
            <Button
              onClick={encryptText}
              disabled={!textToEncrypt.trim() || processing}
              className="w-full"
            >
              <Lock className="h-4 w-4 mr-2" />
              Chiffrer
            </Button>
            {encryptedText && (
              <div className="space-y-2">
                <Label>Texte chiffré</Label>
                <div className="relative">
                  <Textarea
                    value={encryptedText}
                    readOnly
                    rows={3}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(encryptedText)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decrypt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Déchiffrer du texte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Texte chiffré à déchiffrer..."
              value={textToDecrypt}
              onChange={(e) => setTextToDecrypt(e.target.value)}
              rows={4}
            />
            <Button
              onClick={decryptText}
              disabled={!textToDecrypt.trim() || processing}
              className="w-full"
              variant="outline"
            >
              <Key className="h-4 w-4 mr-2" />
              Déchiffrer
            </Button>
            {decryptedText && (
              <div className="space-y-2">
                <Label>Texte déchiffré</Label>
                <div className="relative">
                  <Textarea
                    value={decryptedText}
                    readOnly
                    rows={3}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(decryptedText)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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