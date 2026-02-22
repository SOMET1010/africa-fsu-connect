import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NexusLayout } from "@/components/layout/NexusLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Save, Loader2, Plus, Trash2, Settings2, Navigation, LayoutDashboard,
  Eye, GripVertical, ExternalLink, Pencil
} from "lucide-react";
import { toast } from "sonner";
import { LANGUAGES, type SupportedLanguage } from "@/i18n/languages";

// ─── Site Settings Tab ─────────────────────────────────────────

function SiteSettingsTab() {
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState<Record<string, any>>({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings" as any).select("*").order("key");
      if (error) throw error;
      return data as any[];
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("site_settings" as any)
        .update({ value, updated_at: new Date().toISOString() } as any)
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Paramètre sauvegardé");
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  const addSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { error } = await supabase
        .from("site_settings" as any)
        .insert({ key, value } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Paramètre ajouté");
      setNewKey("");
      setNewValue("");
    },
    onError: () => toast.error("Erreur — clé peut-être déjà existante"),
  });

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto my-8" />;

  return (
    <div className="space-y-4">
      {settings.map((s: any) => {
        const editVal = edits[s.key] ?? JSON.stringify(s.value, null, 2);
        const isDirty = edits[s.key] !== undefined;
        return (
          <Card key={s.key} className="border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono">{s.key}</CardTitle>
                <Button
                  size="sm"
                  disabled={!isDirty || updateSetting.isPending}
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(edits[s.key]);
                      updateSetting.mutate({ key: s.key, value: parsed });
                      setEdits((p) => { const n = { ...p }; delete n[s.key]; return n; });
                    } catch {
                      toast.error("JSON invalide");
                    }
                  }}
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Sauver
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editVal}
                onChange={(e) => setEdits((p) => ({ ...p, [s.key]: e.target.value }))}
                className="font-mono text-xs"
                rows={3}
              />
            </CardContent>
          </Card>
        );
      })}

      <Card className="border-dashed border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Plus className="h-4 w-4" /> Ajouter un paramètre
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Clé</Label>
            <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="ex: social_twitter" className="text-sm" />
          </div>
          <div className="flex-[2] space-y-1">
            <Label className="text-xs">Valeur (JSON)</Label>
            <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder='{"value": "https://..."}' className="text-sm" />
          </div>
          <Button
            size="sm"
            disabled={!newKey || !newValue || addSetting.isPending}
            onClick={() => {
              try {
                addSetting.mutate({ key: newKey, value: JSON.parse(newValue) });
              } catch {
                toast.error("JSON invalide");
              }
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Navigation Tab ────────────────────────────────────────────

const NAV_LOCATIONS = [
  { value: "header", label: "Header" },
  { value: "footer_modules", label: "Footer — Modules" },
  { value: "footer_partners", label: "Footer — Partenaires" },
  { value: "footer_legal", label: "Footer — Légal" },
] as const;

const LANG_KEYS: SupportedLanguage[] = ["fr", "en", "ar", "pt"];

function NavigationTab() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [filterLocation, setFilterLocation] = useState<string>("header");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["navigation-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("navigation_items" as any).select("*").order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

  const upsertItem = useMutation({
    mutationFn: async (item: any) => {
      if (item.id) {
        const { error } = await supabase
          .from("navigation_items" as any)
          .update({ ...item, updated_at: new Date().toISOString() } as any)
          .eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("navigation_items" as any).insert(item as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      setEditingId(null);
      setForm({});
      toast.success("Navigation mise à jour");
    },
    onError: () => toast.error("Erreur"),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("navigation_items" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast.success("Lien supprimé");
    },
    onError: () => toast.error("Erreur"),
  });

  const filtered = items.filter((i: any) => i.location === filterLocation);

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ ...item });
  };

  const startNew = () => {
    setEditingId("new");
    setForm({
      location: filterLocation,
      label: { fr: "", en: "", ar: "", pt: "" },
      href: "",
      sort_order: filtered.length,
      is_visible: true,
      is_external: false,
    });
  };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto my-8" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NAV_LOCATIONS.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={startNew}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Ajouter un lien
        </Button>
      </div>

      {filtered.map((item: any) => (
        <Card key={item.id} className="border-border">
          {editingId === item.id ? (
            <NavForm form={form} setForm={setForm} onSave={() => upsertItem.mutate(form)} onCancel={() => { setEditingId(null); setForm({}); }} isPending={upsertItem.isPending} />
          ) : (
            <CardContent className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{item.label?.fr || item.href}</span>
                <span className="text-xs text-muted-foreground">{item.href}</span>
                {item.is_external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                <Badge variant={item.is_visible ? "default" : "secondary"} className="text-[10px]">
                  {item.is_visible ? "Visible" : "Masqué"}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(item)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => { if (confirm("Supprimer ce lien ?")) deleteItem.mutate(item.id); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {editingId === "new" && (
        <Card className="border-dashed border-primary/30">
          <NavForm form={form} setForm={setForm} onSave={() => { const { id, ...rest } = form; upsertItem.mutate(rest); }} onCancel={() => { setEditingId(null); setForm({}); }} isPending={upsertItem.isPending} />
        </Card>
      )}

      {filtered.length === 0 && editingId !== "new" && (
        <p className="text-sm text-muted-foreground text-center py-6">Aucun lien pour cette section</p>
      )}
    </div>
  );
}

function NavForm({ form, setForm, onSave, onCancel, isPending }: {
  form: any; setForm: (f: any) => void; onSave: () => void; onCancel: () => void; isPending: boolean;
}) {
  const updateLabel = (lang: string, val: string) => {
    setForm({ ...form, label: { ...form.label, [lang]: val } });
  };

  return (
    <CardContent className="py-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {LANG_KEYS.map((lang) => (
          <div key={lang} className="space-y-1">
            <Label className="text-xs text-muted-foreground">Label ({lang.toUpperCase()})</Label>
            <Input
              value={form.label?.[lang] || ""}
              onChange={(e) => updateLabel(lang, e.target.value)}
              className="text-sm"
              placeholder={`Label en ${lang}`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">URL</Label>
          <Input value={form.href || ""} onChange={(e) => setForm({ ...form, href: e.target.value })} className="text-sm" placeholder="/about" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Ordre</Label>
          <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Location</Label>
          <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NAV_LOCATIONS.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.is_visible ?? true} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} />
          Visible
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.is_external ?? false} onCheckedChange={(v) => setForm({ ...form, is_external: v })} />
          Lien externe
        </label>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel}>Annuler</Button>
        <Button size="sm" onClick={onSave} disabled={isPending || !form.href}>
          <Save className="h-3.5 w-3.5 mr-1" /> Sauver
        </Button>
      </div>
    </CardContent>
  );
}

// ─── Homepage Blocks Tab (reuses existing logic) ───────────────

const LANG_COLS: Record<SupportedLanguage, string> = {
  fr: "content_fr",
  en: "content_en",
  ar: "content_ar",
  pt: "content_pt",
};

function HomepageBlocksTab() {
  const queryClient = useQueryClient();
  const [editState, setEditState] = useState<Record<string, Record<string, unknown>>>({});

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ["homepage-content-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("homepage_content_blocks" as any).select("*").order("sort_order");
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const updateBlock = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { error } = await supabase
        .from("homepage_content_blocks" as any)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homepage-content-blocks"] }),
  });

  const getEditValue = (blockId: string, lang: SupportedLanguage) => {
    const col = LANG_COLS[lang];
    return editState[blockId]?.[col] ?? blocks.find((b: any) => b.id === blockId)?.[col] ?? {};
  };

  const setFieldValue = (blockId: string, lang: SupportedLanguage, field: string, value: any) => {
    const col = LANG_COLS[lang];
    const current = getEditValue(blockId, lang) as Record<string, unknown>;
    setEditState((prev) => ({
      ...prev,
      [blockId]: { ...(prev[blockId] || {}), [col]: { ...current, [field]: value } },
    }));
  };

  const handleSave = async (blockId: string) => {
    const updates = editState[blockId];
    if (!updates) { toast.info("Aucune modification"); return; }
    try {
      await updateBlock.mutateAsync({ id: blockId, updates });
      setEditState((prev) => { const n = { ...prev }; delete n[blockId]; return n; });
      toast.success("Bloc sauvegardé");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto my-8" />;

  return (
    <div className="space-y-4">
      {blocks.map((block: any) => (
        <Card key={block.id} className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base capitalize">{block.block_key}</CardTitle>
                <Badge variant={block.is_visible ? "default" : "secondary"} className="text-[10px]">
                  {block.is_visible ? "Visible" : "Masqué"}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={block.is_visible}
                  onCheckedChange={async () => {
                    try {
                      await updateBlock.mutateAsync({ id: block.id, updates: { is_visible: !block.is_visible } });
                      toast.success(!block.is_visible ? "Bloc activé" : "Bloc masqué");
                    } catch { toast.error("Erreur"); }
                  }}
                />
                <Button size="sm" onClick={() => handleSave(block.id)} disabled={!editState[block.id] || updateBlock.isPending}>
                  <Save className="h-3.5 w-3.5 mr-1" /> Sauver
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fr">
              <TabsList className="mb-3">
                {Object.values(LANGUAGES).map((lang) => (
                  <TabsTrigger key={lang.code} value={lang.code} className="text-xs">
                    {lang.flag} {lang.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {Object.values(LANGUAGES).map((lang) => {
                const col = LANG_COLS[lang.code];
                const content = (block[col] || {}) as Record<string, unknown>;
                return (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-3">
                    {Object.entries(content).map(([key, value]) => {
                      if (key === "items") return null;
                      return (
                        <div key={key} className="space-y-1">
                          <Label className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</Label>
                          {typeof value === "string" && value.length > 80 ? (
                            <Textarea
                              value={(getEditValue(block.id, lang.code) as any)[key] ?? value}
                              onChange={(e) => setFieldValue(block.id, lang.code, key, e.target.value)}
                              className="text-sm"
                              rows={3}
                            />
                          ) : (
                            <Input
                              value={String((getEditValue(block.id, lang.code) as any)[key] ?? value)}
                              onChange={(e) => setFieldValue(block.id, lang.code, key, e.target.value)}
                              className="text-sm"
                            />
                          )}
                        </div>
                      );
                    })}
                    {content.items && Array.isArray(content.items) && (
                      <div className="border border-border rounded-lg p-3 space-y-2">
                        <Label className="text-xs text-muted-foreground font-medium">Items (JSON)</Label>
                        <Textarea
                          value={JSON.stringify((getEditValue(block.id, lang.code) as any)?.items ?? content.items, null, 2)}
                          onChange={(e) => {
                            try {
                              setFieldValue(block.id, lang.code, "items", JSON.parse(e.target.value));
                            } catch { /* let user keep typing */ }
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
  );
}

// ─── Main ContentManager Page ──────────────────────────────────

export default function ContentManager() {
  return (
    <NexusLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion du contenu</h1>
            <p className="text-sm text-muted-foreground">
              Paramètres du site, navigation et blocs de la page d'accueil
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")}>
            <Eye className="h-4 w-4 mr-2" /> Aperçu du site
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="settings" className="gap-1.5">
              <Settings2 className="h-3.5 w-3.5" /> Paramètres
            </TabsTrigger>
            <TabsTrigger value="navigation" className="gap-1.5">
              <Navigation className="h-3.5 w-3.5" /> Navigation
            </TabsTrigger>
            <TabsTrigger value="blocks" className="gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5" /> Blocs Homepage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SiteSettingsTab />
          </TabsContent>
          <TabsContent value="navigation">
            <NavigationTab />
          </TabsContent>
          <TabsContent value="blocks">
            <HomepageBlocksTab />
          </TabsContent>
        </Tabs>
      </div>
    </NexusLayout>
  );
}
