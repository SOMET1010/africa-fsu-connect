
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, ExternalLink } from "lucide-react";

interface SyncConfig {
  urls: string[];
  extractSchema: {
    projects: boolean;
    resources: boolean;
    news: boolean;
  };
  frequency: number; // in hours
  includePaths: string[];
  excludePaths: string[];
}

interface SyncConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agency: any;
  onSave: (config: SyncConfig) => Promise<void>;
}

export function SyncConfigDialog({ open, onOpenChange, agency, onSave }: SyncConfigDialogProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState<SyncConfig>({
    urls: [agency?.website_url || ""],
    extractSchema: {
      projects: true,
      resources: true,
      news: false
    },
    frequency: 24,
    includePaths: [],
    excludePaths: ["**/admin/**", "**/login/**", "**/auth/**"]
  });
  const [newUrl, setNewUrl] = useState("");
  const [newIncludePath, setNewIncludePath] = useState("");
  const [newExcludePath, setNewExcludePath] = useState("");
  const [saving, setSaving] = useState(false);

  // Load existing connector config
  useEffect(() => {
    if (agency?.agency_connectors?.[0]?.auth_config) {
      const existingConfig = agency.agency_connectors[0].auth_config;
      setConfig(prev => ({
        ...prev,
        urls: existingConfig.urls || [agency.website_url],
        extractSchema: {
          projects: existingConfig.extract_projects !== false,
          resources: existingConfig.extract_resources !== false,
          news: existingConfig.extract_news === true
        },
        frequency: existingConfig.sync_frequency || 24,
        includePaths: existingConfig.include_paths || [],
        excludePaths: existingConfig.exclude_paths || ["**/admin/**", "**/login/**", "**/auth/**"]
      }));
    }
  }, [agency]);

  const addUrl = () => {
    if (newUrl && !config.urls.includes(newUrl)) {
      setConfig(prev => ({ ...prev, urls: [...prev.urls, newUrl] }));
      setNewUrl("");
    }
  };

  const removeUrl = (index: number) => {
    setConfig(prev => ({ 
      ...prev, 
      urls: prev.urls.filter((_, i) => i !== index) 
    }));
  };

  const addIncludePath = () => {
    if (newIncludePath && !config.includePaths.includes(newIncludePath)) {
      setConfig(prev => ({ 
        ...prev, 
        includePaths: [...prev.includePaths, newIncludePath] 
      }));
      setNewIncludePath("");
    }
  };

  const removeIncludePath = (index: number) => {
    setConfig(prev => ({ 
      ...prev, 
      includePaths: prev.includePaths.filter((_, i) => i !== index) 
    }));
  };

  const addExcludePath = () => {
    if (newExcludePath && !config.excludePaths.includes(newExcludePath)) {
      setConfig(prev => ({ 
        ...prev, 
        excludePaths: [...prev.excludePaths, newExcludePath] 
      }));
      setNewExcludePath("");
    }
  };

  const removeExcludePath = (index: number) => {
    setConfig(prev => ({ 
      ...prev, 
      excludePaths: prev.excludePaths.filter((_, i) => i !== index) 
    }));
  };

  const handleSave = async () => {
    if (config.urls.length === 0) {
      toast({
        title: "Erreur",
        description: "Au moins une URL est requise",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await onSave(config);
      toast({
        title: "Configuration sauvegardée",
        description: "Les paramètres de synchronisation ont été mis à jour"
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuration de synchronisation - {agency?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* URLs à scraper */}
          <div className="space-y-4">
            <Label>URLs à synchroniser</Label>
            <div className="space-y-2">
              {config.urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={url} readOnly className="flex-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUrl(index)}
                    disabled={config.urls.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="https://exemple.com/projets"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addUrl()}
                />
                <Button onClick={addUrl} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Type de données à extraire */}
          <div className="space-y-4">
            <Label>Types de données à extraire</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Projets</div>
                  <div className="text-sm text-muted-foreground">
                    Pages contenant des informations sur les projets
                  </div>
                </div>
                <Switch
                  checked={config.extractSchema.projects}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ 
                      ...prev, 
                      extractSchema: { ...prev.extractSchema, projects: checked } 
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Ressources</div>
                  <div className="text-sm text-muted-foreground">
                    Documents, guides et rapports
                  </div>
                </div>
                <Switch
                  checked={config.extractSchema.resources}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ 
                      ...prev, 
                      extractSchema: { ...prev.extractSchema, resources: checked } 
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Actualités</div>
                  <div className="text-sm text-muted-foreground">
                    Articles de blog et actualités
                  </div>
                </div>
                <Switch
                  checked={config.extractSchema.news}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ 
                      ...prev, 
                      extractSchema: { ...prev.extractSchema, news: checked } 
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Fréquence */}
          <div className="space-y-2">
            <Label>Fréquence de synchronisation (heures)</Label>
            <Input
              type="number"
              min="1"
              max="168"
              value={config.frequency}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                frequency: parseInt(e.target.value) || 24 
              }))}
            />
          </div>

          {/* Chemins à inclure */}
          <div className="space-y-4">
            <Label>Chemins à inclure (optionnel)</Label>
            <div className="space-y-2">
              {config.includePaths.map((path, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex-1 justify-between">
                    {path}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIncludePath(index)}
                      className="h-auto p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="/projets/**, /documents/**"
                  value={newIncludePath}
                  onChange={(e) => setNewIncludePath(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addIncludePath()}
                />
                <Button onClick={addIncludePath} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chemins à exclure */}
          <div className="space-y-4">
            <Label>Chemins à exclure</Label>
            <div className="space-y-2">
              {config.excludePaths.map((path, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="flex-1 justify-between">
                    {path}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExcludePath(index)}
                      className="h-auto p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="**/admin/**, **/private/**"
                  value={newExcludePath}
                  onChange={(e) => setNewExcludePath(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addExcludePath()}
                />
                <Button onClick={addExcludePath} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
