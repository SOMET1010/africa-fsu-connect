import { useState } from 'react';
import { useHomepageContentAdmin } from '@/hooks/useHomepageContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { NexusLayout } from '@/components/layout/NexusLayout';
import { Save, Eye, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { LANGUAGES, type SupportedLanguage } from '@/i18n/languages';

const LANG_COLS: Record<SupportedLanguage, string> = {
  fr: 'content_fr',
  en: 'content_en',
  ar: 'content_ar',
  pt: 'content_pt',
};

export default function HomepageEditor() {
  const { blocks, isLoading, updateBlock } = useHomepageContentAdmin();
  const [editState, setEditState] = useState<Record<string, Record<string, unknown>>>({});

  const getEditValue = (blockId: string, lang: SupportedLanguage) => {
    const col = LANG_COLS[lang];
    return editState[blockId]?.[col] ?? blocks.find((b: any) => b.id === blockId)?.[col] ?? {};
  };

  const setFieldValue = (blockId: string, lang: SupportedLanguage, field: string, value: string) => {
    const col = LANG_COLS[lang];
    const current = getEditValue(blockId, lang) as Record<string, unknown>;
    setEditState(prev => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        [col]: { ...current, [field]: value },
      },
    }));
  };

  const handleSave = async (blockId: string) => {
    const updates = editState[blockId];
    if (!updates || Object.keys(updates).length === 0) {
      toast.info('Aucune modification');
      return;
    }
    try {
      await updateBlock.mutateAsync({ id: blockId, updates });
      setEditState(prev => {
        const next = { ...prev };
        delete next[blockId];
        return next;
      });
      toast.success('Bloc sauvegardé');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleToggleVisibility = async (blockId: string, currentValue: boolean) => {
    try {
      await updateBlock.mutateAsync({ id: blockId, updates: { is_visible: !currentValue } });
      toast.success(!currentValue ? 'Bloc activé' : 'Bloc masqué');
    } catch {
      toast.error('Erreur');
    }
  };

  const renderJsonFields = (blockId: string, lang: SupportedLanguage, content: Record<string, unknown>) => {
    return Object.entries(content).map(([key, value]) => {
      if (key === 'items') return null; // handled separately
      return (
        <div key={key} className="space-y-1">
          <Label className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</Label>
          {typeof value === 'string' && value.length > 80 ? (
            <Textarea
              value={(getEditValue(blockId, lang) as Record<string, string>)[key] ?? value}
              onChange={e => setFieldValue(blockId, lang, key, e.target.value)}
              className="text-sm"
              rows={3}
            />
          ) : (
            <Input
              value={String((getEditValue(blockId, lang) as Record<string, string>)[key] ?? value)}
              onChange={e => setFieldValue(blockId, lang, key, e.target.value)}
              className="text-sm"
            />
          )}
        </div>
      );
    });
  };

  if (isLoading) {
    return (
      <NexusLayout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </NexusLayout>
    );
  }

  return (
    <NexusLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Éditeur de la page d'accueil</h1>
            <p className="text-sm text-muted-foreground">Gérez le contenu multilingue des blocs de la homepage</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
        </div>

        <div className="space-y-4">
          {blocks.map((block: any) => (
            <Card key={block.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg capitalize">{block.block_key}</CardTitle>
                    <Badge variant={block.is_visible ? 'default' : 'secondary'} className="text-xs">
                      {block.is_visible ? 'Visible' : 'Masqué'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={block.is_visible}
                      onCheckedChange={() => handleToggleVisibility(block.id, block.is_visible)}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSave(block.id)}
                      disabled={!editState[block.id] || updateBlock.isPending}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Sauver
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="fr">
                  <TabsList className="mb-4">
                    {Object.values(LANGUAGES).map(lang => (
                      <TabsTrigger key={lang.code} value={lang.code} className="text-xs">
                        {lang.flag} {lang.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.values(LANGUAGES).map(lang => {
                    const col = LANG_COLS[lang.code];
                    const content = (block[col] || {}) as Record<string, unknown>;
                    return (
                      <TabsContent key={lang.code} value={lang.code} className="space-y-3">
                        {renderJsonFields(block.id, lang.code, content)}
                        {content.items && Array.isArray(content.items) && (
                          <div className="border border-border rounded-lg p-3 space-y-2">
                            <Label className="text-xs text-muted-foreground font-medium">Items (JSON)</Label>
                            <Textarea
                              value={JSON.stringify(
                                (getEditValue(block.id, lang.code) as any)?.items ?? content.items,
                                null, 2
                              )}
                              onChange={e => {
                                try {
                                  const parsed = JSON.parse(e.target.value);
                                  setFieldValue(block.id, lang.code, 'items', parsed as any);
                                } catch { /* invalid json, let user keep typing */ }
                              }}
                              className="font-mono text-xs"
                              rows={6}
                            />
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </NexusLayout>
  );
}
