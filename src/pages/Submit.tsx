import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileText, Clock, CheckCircle, XCircle, AlertCircle, Sparkles, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdaptiveInterface } from '@/components/layout/AdaptiveInterface';
import { SimplifiedSubmit } from '@/components/submissions/SimplifiedSubmit';
import { AdvancedSubmitControls } from '@/components/submissions/AdvancedSubmitControls';
import ContextualNavigation from '@/components/shared/ContextualNavigation';
import { useAdvancedSubmissions } from '@/hooks/useAdvancedSubmissions';
import { useAutoSave } from '@/hooks/useAutoSave';
import { TemplateSelector } from '@/components/submissions/TemplateSelector';
import { submissionTemplateService, SubmissionTemplate } from '@/services/submissionTemplateService';

export const Submit = () => {
  const [selectedType, setSelectedType] = useState<'project' | 'position' | 'regulation' | 'funding'>('project');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SubmissionTemplate | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  
  const {
    submissions,
    loading: submissionsLoading,
    createSubmission,
    updateSubmission,
    autoSave,
    submitForReview,
    uploadAttachment,
  } = useAdvancedSubmissions();

  const { autoSaveStatus, manualSave } = useAutoSave(formData, {
    delay: 30000,
    onSave: async (data) => {
      if (currentSubmissionId) {
        await autoSave(currentSubmissionId, data);
      }
    },
    onSaveSuccess: () => console.log('Auto-save successful'),
    onSaveError: (error) => console.error('Auto-save failed:', error),
  });

  const submissionTypes = [
    { id: 'project' as const, label: 'Projet', icon: '🚀', description: 'Soumission de nouveaux projets' },
    { id: 'position' as const, label: 'Position', icon: '📝', description: 'Positions officielles' },
    { id: 'regulation' as const, label: 'Réglementation', icon: '⚖️', description: 'Propositions réglementaires' },
    { id: 'funding' as const, label: 'Financement', icon: '💰', description: 'Demandes de financement' },
  ];

  const getFormSteps = () => [
    { id: 'template', title: 'Template', required: false, completed: !!selectedTemplate, fields: [] },
    { id: 'basic', title: 'Informations de base', required: true, completed: false, fields: ['title', 'description'] },
    { id: 'attachments', title: 'Pièces jointes', required: false, completed: false, fields: ['attachments'] },
  ];

  const formSteps = getFormSteps();

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    if (!formData.title?.trim()) errors.title = ['Le titre est requis'];
    if (!formData.description?.trim()) errors.description = ['La description est requise'];
    return errors;
  };

  const handleSaveDraft = async () => {
    if (!currentSubmissionId) {
      const submission = await createSubmission({
        title: formData.title || 'Nouveau brouillon',
        type: selectedType,
        content: formData,
        attachments: uploadedFiles.map(f => f.name),
      });
      if (submission) setCurrentSubmissionId(submission.id);
    } else {
      await updateSubmission(currentSubmissionId, { content: formData });
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Erreurs de validation",
        description: "Veuillez corriger les erreurs avant de soumettre",
        variant: "destructive",
      });
      return;
    }

    if (!currentSubmissionId) await handleSaveDraft();
    if (currentSubmissionId) await submitForReview(currentSubmissionId);
  };

  const handleFileUpload = async (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Fichiers ajoutés",
      description: `${files.length} fichier(s) ajouté(s) avec succès.`,
    });
  };

  const handleTemplateSelect = (template: SubmissionTemplate) => {
    setSelectedTemplate(template);
    setFormData({ ...formData, ...template.content });
  };

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canSubmit = Object.keys(validateForm()).length === 0;

  if (submissionsLoading) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <ContextualNavigation />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Soumettre un Document
          </h1>
          <p className="text-muted-foreground mt-2">
            Assistant intelligent pour vos soumissions de projets, positions et réglementations
          </p>
        </div>
      </div>

      {/* Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Type de Soumission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {submissionTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedType === type.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h3 className="font-semibold">{type.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Interface */}
      {selectedType && (
        <AdaptiveInterface
          title="Interface de Soumission"
          description="Formulaire adapté à votre niveau d'expertise"
          advancedContent={
            <AdvancedSubmitControls
              formSteps={formSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formData={formData}
              validationErrors={validationErrors}
              onSaveDraft={handleSaveDraft}
              onSubmit={handleSubmit}
              canSubmit={canSubmit}
              autoSaveStatus={autoSaveStatus}
              selectedType={selectedType}
              submissions={submissions}
              onFileUpload={handleFileUpload}
              uploadedFiles={uploadedFiles}
            />
          }
        >
          <SimplifiedSubmit
            selectedType={selectedType}
            formData={formData}
            updateFormField={updateFormField}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            submissions={submissions}
            autoSaveStatus={typeof autoSaveStatus === 'string' ? autoSaveStatus : 'idle'}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
            canSubmit={canSubmit}
          />
        </AdaptiveInterface>
      )}
    </div>
  );
};

export default Submit;