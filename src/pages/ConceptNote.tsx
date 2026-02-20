import React, { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PageHero } from "@/components/shared/PageHero";
import { GlassCard } from "@/components/ui/glass-card";
import { ModernButton } from "@/components/ui/modern-button";
import { AIWritingAssistant } from "@/components/submissions/AIWritingAssistant";
import { submissionTemplateService } from "@/services/submissionTemplateService";
import { DemoExportService } from "@/components/demo/services/demoExportService";
import { useToast } from "@/hooks/use-toast";
import { FileDown, Printer, Upload, FileText } from "lucide-react";
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
    lines.push(`# ${data.title || "Note conceptuelle UDC"}`);
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
    headline: data.title || "Note conceptuelle UDC",
    about: data.subject || undefined,
    audience: data.audience || undefined,
    description: data.context?.slice(0, 150) || undefined,
  }), [data]);

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <PageHero
          badge="Note Conceptuelle"
          badgeIcon={FileText}
          title="Rédaction de Note Conceptuelle"
          subtitle="Rédigez et prévisualisez une note conceptuelle structurée"
        />

        <link rel="canonical" href={`${window.location.origin}/concept-note`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Formulaire */}
          <section aria-labelledby="form-title">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 id="form-title" className="text-lg font-semibold text-white">Saisie</h2>
                <div className="flex flex-wrap gap-2">
                  <ModernButton variant="outline" size="sm" onClick={loadDefaultTemplate}>
                    <Upload className="h-4 w-4 mr-2" /> Charger le modèle
                  </ModernButton>
                  <ModernButton variant="ghost" size="sm" onClick={saveLocalTemplate}>
                    Sauvegarder comme modèle
                  </ModernButton>
                  <ModernButton variant="ghost" size="sm" onClick={loadLocalTemplate}>
                    Charger modèle local
                  </ModernButton>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white/80">Titre</Label>
                  <Input id="title" placeholder="Titre court et clair" value={data.title} onChange={update("title")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white/80">Sujet / Problématique</Label>
                  <Textarea id="subject" rows={2} placeholder="Quel problème souhaitons-nous résoudre ?" value={data.subject} onChange={update("subject")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="context" className="text-white/80">Contexte</Label>
                    <span className="text-xs text-white/50">Astuce: 5-8 lignes</span>
                  </div>
                  <div className="grid gap-2">
                    <Textarea id="context" rows={5} placeholder="Contexte et justification..." value={data.context} onChange={update("context")} className="bg-white/5 border-white/10 text-white" />
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
                    <Label htmlFor="objectives" className="text-white/80">Objectifs</Label>
                    <span className="text-xs text-white/50">Liste en puces (une par ligne)</span>
                  </div>
                  <div className="grid gap-2">
                    <Textarea id="objectives" rows={4} placeholder="1) ...\n2) ..." value={data.objectives} onChange={update("objectives")} className="bg-white/5 border-white/10 text-white" />
                    <AIWritingAssistant
                      content={data.objectives}
                      onContentUpdate={(v: string) => setData((d) => ({ ...d, objectives: v }))}
                      type="concept_note"
                      context={{ section: "objectives" }}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="audience" className="text-white/80">Public cible</Label>
                  <Textarea id="audience" rows={2} placeholder="Qui est concerné ?" value={data.audience} onChange={update("audience")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="scope" className="text-white/80">Périmètre</Label>
                  <Textarea id="scope" rows={3} placeholder="Ce qui est inclus / exclu..." value={data.scope} onChange={update("scope")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="budget" className="text-white/80">Budget estimatif</Label>
                  <Input id="budget" placeholder="Ex: 120 000 000 FCFA (CAPEX/OPEX)" value={data.budget} onChange={update("budget")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="outcomes" className="text-white/80">Résultats attendus</Label>
                    <span className="text-xs text-white/50">Liste en puces</span>
                  </div>
                  <div className="grid gap-2">
                    <Textarea id="outcomes" rows={4} placeholder="Impact concret attendu..." value={data.outcomes} onChange={update("outcomes")} className="bg-white/5 border-white/10 text-white" />
                    <AIWritingAssistant
                      content={data.outcomes}
                      onContentUpdate={(v: string) => setData((d) => ({ ...d, outcomes: v }))}
                      type="concept_note"
                      context={{ section: "outcomes" }}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="indicators" className="text-white/80">Indicateurs de succès</Label>
                  <Textarea id="indicators" rows={3} placeholder="KPI mesurables..." value={data.indicators} onChange={update("indicators")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timeline" className="text-white/80">Calendrier</Label>
                  <Textarea id="timeline" rows={3} placeholder=" Jalons clés..." value={data.timeline} onChange={update("timeline")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="risks" className="text-white/80">Risques / Atténuation</Label>
                  <Textarea id="risks" rows={3} placeholder="Principaux risques et mesures..." value={data.risks} onChange={update("risks")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="decisions" className="text-white/80">Décisions attendues</Label>
                  <Textarea id="decisions" rows={2} placeholder="Quelles décisions sont requises ?" value={data.decisions} onChange={update("decisions")} className="bg-white/5 border-white/10 text-white" />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <ModernButton size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" /> Exporter PDF (Imprimer)
                  </ModernButton>
                  <ModernButton variant="outline" size="sm" onClick={handleExportMarkdown}>
                    <FileDown className="h-4 w-4 mr-2" /> Exporter Markdown
                  </ModernButton>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Prévisualisation */}
          <section aria-labelledby="preview-title">
            <GlassCard className="p-6 print:border-none">
              <h2 id="preview-title" className="text-lg font-semibold text-white mb-6">Aperçu</h2>
              <article className="prose prose-sm max-w-none prose-invert">
                <h2 className="mb-2 text-[hsl(var(--nx-gold))]">{data.title || "Note conceptuelle UDC"}</h2>
                {data.subject && (
                  <p><strong>Sujet / Problématique:</strong> {data.subject}</p>
                )}
                {data.context && (
                  <section>
                    <h3 className="text-white">Contexte</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.context}</p>
                  </section>
                )}
                {data.objectives && (
                  <section>
                    <h3 className="text-white">Objectifs</h3>
                    <ul className="list-disc pl-6 whitespace-pre-wrap text-white/70">
                      {data.objectives.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {data.audience && (
                  <section>
                    <h3 className="text-white">Public cible</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.audience}</p>
                  </section>
                )}
                {data.scope && (
                  <section>
                    <h3 className="text-white">Périmètre</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.scope}</p>
                  </section>
                )}
                {data.budget && (
                  <section>
                    <h3 className="text-white">Budget estimatif</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.budget}</p>
                  </section>
                )}
                {data.outcomes && (
                  <section>
                    <h3 className="text-white">Résultats attendus</h3>
                    <ul className="list-disc pl-6 whitespace-pre-wrap text-white/70">
                      {data.outcomes.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {data.indicators && (
                  <section>
                    <h3 className="text-white">Indicateurs de succès</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.indicators}</p>
                  </section>
                )}
                {data.timeline && (
                  <section>
                    <h3 className="text-white">Calendrier</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.timeline}</p>
                  </section>
                )}
                {data.risks && (
                  <section>
                    <h3 className="text-white">Risques / Atténuation</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.risks}</p>
                  </section>
                )}
                {data.decisions && (
                  <section>
                    <h3 className="text-white">Décisions attendues</h3>
                    <p className="whitespace-pre-wrap text-white/70">{data.decisions}</p>
                  </section>
                )}
              </article>
            </GlassCard>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ConceptNote;
