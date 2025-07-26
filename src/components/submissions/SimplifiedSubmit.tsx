import { useState } from 'react';
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernStatsCard } from "@/components/ui/modern-stats-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProgressiveForm } from "@/components/submissions/ProgressiveForm";
import { TemplateSelector } from "@/components/submissions/TemplateSelector";
import { 
  FileText, 
  Sparkles, 
  Save, 
  Send,
  Clock,
  CheckCircle
} from "lucide-react";

interface SimplifiedSubmitProps {
  selectedType: 'project' | 'position' | 'regulation' | 'funding';
  formData: Record<string, any>;
  updateFormField: (field: string, value: any) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  submissions: any[];
  autoSaveStatus: string;
  selectedTemplate: any;
  onTemplateSelect: (template: any) => void;
  canSubmit: boolean;
}

export const SimplifiedSubmit = ({
  selectedType,
  formData,
  updateFormField,
  onSaveDraft,
  onSubmit,
  submissions,
  autoSaveStatus,
  selectedTemplate,
  onTemplateSelect,
  canSubmit
}: SimplifiedSubmitProps) => {
  const submissionTypes = [
    { id: 'project' as const, label: 'Projet', icon: '🚀', description: 'Nouveau projet' },
    { id: 'position' as const, label: 'Position', icon: '📝', description: 'Position officielle' },
    { id: 'regulation' as const, label: 'Réglementation', icon: '⚖️', description: 'Proposition réglementaire' },
    { id: 'funding' as const, label: 'Financement', icon: '💰', description: 'Demande de financement' },
  ];

  const quickStats = [
    {
      title: "Brouillons",
      value: submissions.filter(s => s.status === 'draft').length,
      icon: Clock,
      trend: { value: 2, label: "En cours", positive: true },
      description: "Documents en cours"
    },
    {
      title: "Soumis",
      value: submissions.filter(s => s.status === 'submitted').length,
      icon: CheckCircle,
      trend: { value: 3, label: "Ce mois", positive: true },
      description: "Documents envoyés"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickStats.map((stat, index) => (
          <ModernStatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
            variant="gradient"
            size="md"
          />
        ))}
      </div>

      {/* Quick Type Selection */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Type de Document</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {submissionTypes.map((type) => (
            <ModernButton
              key={type.id}
              variant={selectedType === type.id ? 'default' : 'outline'}
              size="sm"
              className="flex-col h-16 p-2"
            >
              <span className="text-lg mb-1">{type.icon}</span>
              <span className="text-xs">{type.label}</span>
            </ModernButton>
          ))}
        </div>
      </ModernCard>

      {/* Template Selection */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Template Rapide</h3>
            <p className="text-sm text-muted-foreground">
              Choisissez un template pour commencer rapidement
            </p>
          </div>
          {selectedTemplate && (
            <Badge variant="secondary" className="text-xs">
              {selectedTemplate.name}
            </Badge>
          )}
        </div>
        <TemplateSelector
          type={selectedType}
          onTemplateSelect={onTemplateSelect}
          selectedTemplateId={selectedTemplate?.id}
        />
      </ModernCard>

      {/* Simple Form */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Informations Essentielles</h3>
            <p className="text-sm text-muted-foreground">
              Remplissez les champs de base
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Save className="h-3 w-3" />
            {autoSaveStatus}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              placeholder="Titre de votre document"
              value={formData.title || ''}
              onChange={(e) => updateFormField('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Description courte de votre document"
              value={formData.description || ''}
              onChange={(e) => updateFormField('description', e.target.value)}
              rows={4}
            />
          </div>

          {selectedType === 'project' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="100000"
                  value={formData.budget || ''}
                  onChange={(e) => updateFormField('budget', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Date de début</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => updateFormField('start_date', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </ModernCard>

      {/* Quick Actions */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Actions Rapides</h3>
            <p className="text-sm text-muted-foreground">
              Sauvegarder ou soumettre votre document
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton variant="outline" size="sm" onClick={onSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Brouillon
            </ModernButton>
            <ModernButton 
              variant="default" 
              size="sm" 
              onClick={onSubmit}
              disabled={!canSubmit}
            >
              <Send className="h-4 w-4 mr-2" />
              Soumettre
            </ModernButton>
          </div>
        </div>
      </ModernCard>

      {/* Recent Submissions */}
      {submissions.length > 0 && (
        <ModernCard variant="glass" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Soumissions Récentes</h3>
            <Badge variant="secondary" className="text-xs">
              {submissions.length} total
            </Badge>
          </div>
          
          <div className="space-y-2">
            {submissions.slice(0, 3).map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{submission.title}</p>
                  <p className="text-xs text-muted-foreground">{submission.type}</p>
                </div>
                <Badge variant={submission.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                  {submission.status}
                </Badge>
              </div>
            ))}
          </div>
        </ModernCard>
      )}
    </div>
  );
};