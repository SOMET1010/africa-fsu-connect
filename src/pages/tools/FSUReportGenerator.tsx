import React, { useState, useMemo } from 'react';
import { FileText, Download, Save, Eye, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GlassCard } from '@/components/ui/glass-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { reportTemplates, type ReportTemplate, type ReportSection } from '@/data/fsu-report-templates';
import { DemoExportService } from '@/components/demo/services/demoExportService';
import { useToast } from '@/hooks/use-toast';

const LOCAL_DRAFT_PREFIX = 'fsu_report_draft_';

const FSUReportGenerator: React.FC = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(reportTemplates[0]);
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);

  // Charger le brouillon depuis localStorage
  const loadDraft = () => {
    const key = LOCAL_DRAFT_PREFIX + selectedTemplate.id;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setSectionContents(JSON.parse(saved));
        toast({ title: 'Brouillon chargé', description: 'Votre brouillon a été restauré.' });
      } catch {
        toast({ title: 'Erreur', description: 'Impossible de charger le brouillon.' });
      }
    } else {
      toast({ title: 'Aucun brouillon', description: 'Aucun brouillon trouvé pour ce modèle.' });
    }
  };

  // Sauvegarder le brouillon
  const saveDraft = () => {
    const key = LOCAL_DRAFT_PREFIX + selectedTemplate.id;
    localStorage.setItem(key, JSON.stringify(sectionContents));
    toast({ title: 'Brouillon sauvegardé', description: 'Votre travail a été enregistré localement.' });
  };

  // Générer le Markdown
  const generateMarkdown = useMemo(() => {
    const lines: string[] = [];
    lines.push(`# ${selectedTemplate.name}`);
    lines.push(`\n*Généré le ${new Date().toLocaleDateString('fr-FR')}*\n`);
    lines.push(`---\n`);

    selectedTemplate.sections.forEach((section) => {
      const content = sectionContents[section.id];
      if (content || section.required) {
        lines.push(`## ${section.title}\n`);
        if (content) {
          lines.push(content);
        } else {
          lines.push(`*Section à compléter*`);
        }
        lines.push('\n');
      }
    });

    return lines.join('\n');
  }, [selectedTemplate, sectionContents]);

  // Calculer le pourcentage de complétion
  const completionStats = useMemo(() => {
    const requiredSections = selectedTemplate.sections.filter((s) => s.required);
    const completedRequired = requiredSections.filter((s) => sectionContents[s.id]?.trim()).length;
    const totalCompleted = selectedTemplate.sections.filter((s) => sectionContents[s.id]?.trim()).length;

    return {
      requiredTotal: requiredSections.length,
      requiredCompleted: completedRequired,
      totalSections: selectedTemplate.sections.length,
      totalCompleted,
      percentage: requiredSections.length > 0 
        ? Math.round((completedRequired / requiredSections.length) * 100) 
        : 0,
    };
  }, [selectedTemplate, sectionContents]);

  const handleSectionChange = (sectionId: string, content: string) => {
    setSectionContents((prev) => ({ ...prev, [sectionId]: content }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleExportMarkdown = () => {
    const filename = `${selectedTemplate.id}-${Date.now()}.md`;
    DemoExportService.downloadAsFile(generateMarkdown, filename, 'text/markdown');
    toast({ title: 'Export réussi', description: 'Le fichier Markdown a été téléchargé.' });
  };

  const handleTemplateChange = (templateId: string) => {
    const template = reportTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setSectionContents({});
      setExpandedSections(new Set());
    }
  };

  const categoryLabels: Record<string, string> = {
    annual: 'Rapport Annuel',
    project: 'Suivi de Projet',
    consultation: 'Consultation',
    kpi: 'Tableau de Bord',
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHero
          badge="Outil FSU"
          badgeIcon={FileText}
          title="Générateur de Rapports FSU"
          subtitle="Créez des rapports structurés selon les standards GSMA avec des modèles prêts à l'emploi"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panneau principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sélection du modèle */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Choisir un modèle</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedTemplate.id === template.id
                        ? 'bg-[hsl(var(--nx-gold)/0.1)] border-[hsl(var(--nx-gold)/0.3)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-[hsl(var(--nx-gold))] text-xs mb-1">
                      {categoryLabels[template.category]}
                    </p>
                    <p className="text-white font-medium text-sm">{template.name}</p>
                    <p className="text-white/50 text-xs mt-1">
                      {template.sections.length} sections
                    </p>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Éditeur de sections */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selectedTemplate.name}</h2>
                  <p className="text-white/60 text-sm">{selectedTemplate.description}</p>
                </div>
                <div className="flex gap-2">
                  <ModernButton variant="ghost" size="sm" onClick={loadDraft}>
                    Charger
                  </ModernButton>
                  <ModernButton variant="outline" size="sm" onClick={saveDraft}>
                    <Save className="w-4 h-4 mr-1" /> Sauvegarder
                  </ModernButton>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-6 p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">
                    Sections requises: {completionStats.requiredCompleted}/{completionStats.requiredTotal}
                  </span>
                  <span className="text-[hsl(var(--nx-gold))] font-medium">
                    {completionStats.percentage}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[hsl(var(--nx-gold))] transition-all"
                    style={{ width: `${completionStats.percentage}%` }}
                  />
                </div>
              </div>

              {/* Liste des sections */}
              <div className="space-y-3">
                {selectedTemplate.sections.map((section) => {
                  const isExpanded = expandedSections.has(section.id);
                  const hasContent = !!sectionContents[section.id]?.trim();

                  return (
                    <Collapsible
                      key={section.id}
                      open={isExpanded}
                      onOpenChange={() => toggleSection(section.id)}
                    >
                      <div className={`border rounded-lg ${
                        hasContent 
                          ? 'border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.05)]' 
                          : 'border-white/10 bg-white/5'
                      }`}>
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex items-center justify-between p-4 text-left">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                hasContent 
                                  ? 'bg-[hsl(var(--success))]' 
                                  : section.required 
                                    ? 'bg-[hsl(var(--warning))]' 
                                    : 'bg-white/30'
                              }`} />
                              <div>
                                <p className="text-white font-medium">
                                  {section.title}
                                  {section.required && (
                                    <span className="text-[hsl(var(--warning))] ml-1">*</span>
                                  )}
                                </p>
                                <p className="text-white/50 text-sm">{section.description}</p>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-white/50" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-white/50" />
                            )}
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="px-4 pb-4 space-y-3">
                            <Textarea
                              value={sectionContents[section.id] || ''}
                              onChange={(e) => handleSectionChange(section.id, e.target.value)}
                              placeholder={section.placeholder}
                              rows={6}
                              className="bg-white/5 border-white/10 text-white resize-none"
                            />
                            
                            {/* Tips */}
                            <div className="flex items-start gap-2 p-3 bg-[hsl(var(--nx-gold)/0.1)] rounded-lg">
                              <Lightbulb className="w-4 h-4 text-[hsl(var(--nx-gold))] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[hsl(var(--nx-gold))] text-xs font-medium mb-1">Conseils</p>
                                <ul className="space-y-1">
                                  {section.tips.map((tip, i) => (
                                    <li key={i} className="text-white/60 text-xs">• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Actions */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>
              <div className="space-y-3">
                <ModernButton
                  className="w-full"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showPreview ? 'Masquer l\'aperçu' : 'Voir l\'aperçu'}
                </ModernButton>
                <ModernButton
                  variant="outline"
                  className="w-full"
                  onClick={handleExportMarkdown}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter Markdown
                </ModernButton>
                <p className="text-white/40 text-xs text-center">
                  Formats: {selectedTemplate.exportFormats.join(', ').toUpperCase()}
                </p>
              </div>
            </GlassCard>

            {/* Aperçu */}
            {showPreview && (
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Aperçu</h2>
                <div className="prose prose-sm prose-invert max-w-none max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-white/70 text-xs bg-white/5 p-4 rounded-lg">
                    {generateMarkdown}
                  </pre>
                </div>
              </GlassCard>
            )}

            {/* Statistiques */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Statistiques</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Sections complétées</span>
                  <span className="text-white">
                    {completionStats.totalCompleted}/{completionStats.totalSections}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Sections requises</span>
                  <span className={completionStats.requiredCompleted === completionStats.requiredTotal 
                    ? 'text-[hsl(var(--success))]' 
                    : 'text-[hsl(var(--warning))]'
                  }>
                    {completionStats.requiredCompleted}/{completionStats.requiredTotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Caractères</span>
                  <span className="text-white">
                    {Object.values(sectionContents).join('').length}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Aide */}
            <GlassCard className="p-6">
              <h3 className="text-[hsl(var(--nx-cyan))] font-semibold mb-3">📚 Aide</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Les sections avec <span className="text-[hsl(var(--warning))]">*</span> sont requises</li>
                <li>• Sauvegardez régulièrement votre travail</li>
                <li>• Exportez en Markdown pour conversion PDF</li>
                <li>• Utilisez les conseils de chaque section</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FSUReportGenerator;
