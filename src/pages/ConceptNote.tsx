import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AIWritingAssistant } from "@/components/submissions/AIWritingAssistant";
import { submissionTemplateService } from "@/services/submissionTemplateService";
import { DemoExportService } from "@/components/demo/services/demoExportService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileDown, Printer, Upload, Wand2 } from "lucide-react";
import { useAutoSave } from "@/hooks/useAutoSave";

interface ConceptNoteData {
  title: string;
  subject: string;
  context: string;
  objectives: string;
  audience: string;
  scope: string;
  budget: string;
  outcomes: string;
  indicators: string;
  timeline: string;
  risks: string;
  decisions: string;
}

const defaultState: ConceptNoteData = {
  title: "",
  subject: "",
  context: "",
  objectives: "",
  audience: "",
  scope: "",
  budget: "",
  outcomes: "",
  indicators: "",
  timeline: "",
  risks: "",
  decisions: "",
};

const LOCAL_DRAFT_KEY = "concept_note_draft";
const LOCAL_TEMPLATE_KEY = "concept_note_custom_template";

function ConceptNote() {
  const { toast } = useToast();
  const [data, setData] = useState<ConceptNoteData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_DRAFT_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Auto-save in localStorage (30s debounce)
  useAutoSave(data, {
    delay: 30000,
    onSave: async (payload) => {
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(payload));
    },
  });

  const update = (key: keyof ConceptNoteData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const loadDefaultTemplate = () => {
    const tpl = submissionTemplateService.getTemplateById("concept-note-default");
    if (tpl) {
      setData((d) => ({
        ...d,
        title: tpl.content.title || d.title,
        subject: tpl.content.subject || d.subject,
        context: tpl.content.context || d.context,
        objectives: (tpl.content.objectives || []).join("\n") || d.objectives,
        audience: tpl.content.audience || d.audience,
        scope: (tpl.content.scope || []).join("\n") || d.scope,
        budget: tpl.content.budget || d.budget,
        outcomes: (tpl.content.outcomes || []).join("\n") || d.outcomes,
        indicators: (tpl.content.indicators || []).join("\n") || d.indicators,
        timeline: (tpl.content.timeline || []).join("\n") || d.timeline,
        risks: (tpl.content.risks || []).join("\n") || d.risks,
        decisions: tpl.content.decisions || d.decisions,
      }));
      toast({ title: "Modèle chargé", description: "Le modèle par défaut a été appliqué." });
    } else {
      toast({ title: "Modèle introuvable", description: "Aucun modèle de note conceptuelle par défaut." });
    }
  };

  const saveLocalTemplate = () => {
    localStorage.setItem(LOCAL_TEMPLATE_KEY, JSON.stringify(data));
    toast({ title: "Modèle enregistré", description: "Modèle local enregistré sur cet appareil." });
  };

  const loadLocalTemplate = () => {
    const raw = localStorage.getItem(LOCAL_TEMPLATE_KEY);
    if (!raw) {
      toast({ title: "Aucun modèle local", description: "Enregistrez d'abord un modèle local." });
      return;
    }
    try {
      const tpl: ConceptNoteData = JSON.parse(raw);
      setData(tpl);
      toast({ title: "Modèle local chargé", description: "Le modèle local a été appliqué." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger le modèle local." });
    }
  };

  const toMarkdown = useMemo(() => {
    const lines: string[] = [];
    lines.push(`# ${data.title || "Note conceptuelle SUTEL"}`);
    if (data.subject) lines.push(`\n**Sujet / Problématique**: ${data.subject}`);
    if (data.context) lines.push(`\n## Contexte\n${data.context}`);
    if (data.objectives) lines.push(`\n## Objectifs\n${data.objectives}`);
    if (data.audience) lines.push(`\n## Public cible\n${data.audience}`);
    if (data.scope) lines.push(`\n## Périmètre\n${data.scope}`);
    if (data.budget) lines.push(`\n## Budget estimatif\n${data.budget}`);
    if (data.outcomes) lines.push(`\n## Résultats attendus\n${data.outcomes}`);
    if (data.indicators) lines.push(`\n## Indicateurs de succès\n${data.indicators}`);
    if (data.timeline) lines.push(`\n## Calendrier\n${data.timeline}`);
    if (data.risks) lines.push(`\n## Risques / Atténuation\n${data.risks}`);
    if (data.decisions) lines.push(`\n## Décisions attendues\n${data.decisions}`);
    return lines.join("\n");
  }, [data]);

  const handleExportMarkdown = () => {
    DemoExportService.downloadAsFile(toMarkdown, "note-conceptuelle.md", "text/markdown");
  };

  const handlePrint = () => {
    window.print();
  };

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title || "Note conceptuelle SUTEL",
    about: data.subject || undefined,
    audience: data.audience || undefined,
    description: data.context?.slice(0, 150) || undefined,
  }), [data]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* SEO: H1 unique */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Note conceptuelle</h1>
        <p className="text-sm text-muted-foreground">Rédigez et prévisualisez une note conceptuelle structurée.</p>
        <link rel="canonical" href={`${window.location.origin}/concept-note`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <section aria-labelledby="form-title">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle id="form-title">Saisie</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={loadDefaultTemplate}>
                  <Upload className="h-4 w-4 mr-2" /> Charger le modèle
                </Button>
                <Button variant="ghost" size="sm" onClick={saveLocalTemplate}>
                  Sauvegarder comme modèle
                </Button>
                <Button variant="ghost" size="sm" onClick={loadLocalTemplate}>
                  Charger modèle local
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Titre court et clair" value={data.title} onChange={update("title")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet / Problématique</Label>
                <Textarea id="subject" rows={2} placeholder="Quel problème souhaitons-nous résoudre ?" value={data.subject} onChange={update("subject")} />
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="context">Contexte</Label>
                  <span className="text-xs text-muted-foreground">Astuce: 5-8 lignes</span>
                </div>
                <div className="grid gap-2">
                  <Textarea id="context" rows={5} placeholder="Contexte et justification..." value={data.context} onChange={update("context")} />
                  <AIWritingAssistant
                    content={data.context}
                    onContentUpdate={(v: string) => setData((d) => ({ ...d, context: v }))}
                    type="concept_note"
                    context={{ section: "context" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="objectives">Objectifs</Label>
                  <span className="text-xs text-muted-foreground">Liste en puces (une par ligne)</span>
                </div>
                <div className="grid gap-2">
                  <Textarea id="objectives" rows={4} placeholder="1) ...\n2) ..." value={data.objectives} onChange={update("objectives")} />
                  <AIWritingAssistant
                    content={data.objectives}
                    onContentUpdate={(v: string) => setData((d) => ({ ...d, objectives: v }))}
                    type="concept_note"
                    context={{ section: "objectives" }}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="audience">Public cible</Label>
                <Textarea id="audience" rows={2} placeholder="Qui est concerné ?" value={data.audience} onChange={update("audience")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="scope">Périmètre</Label>
                <Textarea id="scope" rows={3} placeholder="Ce qui est inclus / exclu..." value={data.scope} onChange={update("scope")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="budget">Budget estimatif</Label>
                <Input id="budget" placeholder="Ex: 120 000 000 FCFA (CAPEX/OPEX)" value={data.budget} onChange={update("budget")} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="outcomes">Résultats attendus</Label>
                  <span className="text-xs text-muted-foreground">Liste en puces</span>
                </div>
                <div className="grid gap-2">
                  <Textarea id="outcomes" rows={4} placeholder="Impact concret attendu..." value={data.outcomes} onChange={update("outcomes")} />
                  <AIWritingAssistant
                    content={data.outcomes}
                    onContentUpdate={(v: string) => setData((d) => ({ ...d, outcomes: v }))}
                    type="concept_note"
                    context={{ section: "outcomes" }}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="indicators">Indicateurs de succès</Label>
                <Textarea id="indicators" rows={3} placeholder="KPI mesurables..." value={data.indicators} onChange={update("indicators")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="timeline">Calendrier</Label>
                <Textarea id="timeline" rows={3} placeholder=" Jalons clés..." value={data.timeline} onChange={update("timeline")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="risks">Risques / Atténuation</Label>
                <Textarea id="risks" rows={3} placeholder="Principaux risques et mesures..." value={data.risks} onChange={update("risks")} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="decisions">Décisions attendues</Label>
                <Textarea id="decisions" rows={2} placeholder="Quelles décisions sont requises ?" value={data.decisions} onChange={update("decisions")} />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="default" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" /> Exporter PDF (Imprimer)
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
                  <FileDown className="h-4 w-4 mr-2" /> Exporter Markdown
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Prévisualisation */}
        <section aria-labelledby="preview-title">
          <Card className="print:border-none">
            <CardHeader>
              <CardTitle id="preview-title">Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <article className="prose prose-sm max-w-none dark:prose-invert">
                <h2 className="mb-2">{data.title || "Note conceptuelle SUTEL"}</h2>
                {data.subject && (
                  <p><strong>Sujet / Problématique:</strong> {data.subject}</p>
                )}
                {data.context && (
                  <section>
                    <h3>Contexte</h3>
                    <p className="whitespace-pre-wrap">{data.context}</p>
                  </section>
                )}
                {data.objectives && (
                  <section>
                    <h3>Objectifs</h3>
                    <ul className="list-disc pl-6 whitespace-pre-wrap">
                      {data.objectives.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {data.audience && (
                  <section>
                    <h3>Public cible</h3>
                    <p className="whitespace-pre-wrap">{data.audience}</p>
                  </section>
                )}
                {data.scope && (
                  <section>
                    <h3>Périmètre</h3>
                    <p className="whitespace-pre-wrap">{data.scope}</p>
                  </section>
                )}
                {data.budget && (
                  <section>
                    <h3>Budget estimatif</h3>
                    <p className="whitespace-pre-wrap">{data.budget}</p>
                  </section>
                )}
                {data.outcomes && (
                  <section>
                    <h3>Résultats attendus</h3>
                    <ul className="list-disc pl-6 whitespace-pre-wrap">
                      {data.outcomes.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {data.indicators && (
                  <section>
                    <h3>Indicateurs de succès</h3>
                    <p className="whitespace-pre-wrap">{data.indicators}</p>
                  </section>
                )}
                {data.timeline && (
                  <section>
                    <h3>Calendrier</h3>
                    <p className="whitespace-pre-wrap">{data.timeline}</p>
                  </section>
                )}
                {data.risks && (
                  <section>
                    <h3>Risques / Atténuation</h3>
                    <p className="whitespace-pre-wrap">{data.risks}</p>
                  </section>
                )}
                {data.decisions && (
                  <section>
                    <h3>Décisions attendues</h3>
                    <p className="whitespace-pre-wrap">{data.decisions}</p>
                  </section>
                )}
              </article>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default ConceptNote;
