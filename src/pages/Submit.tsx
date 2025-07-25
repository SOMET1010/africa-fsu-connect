import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, Clock, CheckCircle, XCircle, AlertCircle, Sparkles, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/shared/FileUpload';
import ContextualNavigation from '@/components/shared/ContextualNavigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdvancedSubmissions } from '@/hooks/useAdvancedSubmissions';
import { useAutoSave } from '@/hooks/useAutoSave';
import { ProgressiveForm } from '@/components/submissions/ProgressiveForm';
import { AIWritingAssistant } from '@/components/submissions/AIWritingAssistant';
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

  // Auto-save functionality
  const { autoSaveStatus, manualSave } = useAutoSave(formData, {
    delay: 30000, // 30 seconds
    onSave: async (data) => {
      if (currentSubmissionId) {
        await autoSave(currentSubmissionId, data);
      }
    },
    onSaveSuccess: () => {
      console.log('Auto-save successful');
    },
    onSaveError: (error) => {
      console.error('Auto-save failed:', error);
    },
  });

  // Form steps configuration
  const getFormSteps = (type: string) => {
    const baseSteps = [
      {
        id: 'template',
        title: 'Template',
        description: 'Choisissez un template pour commencer',
        required: false,
        completed: !!selectedTemplate,
        fields: [],
      },
      {
        id: 'basic',
        title: 'Informations de base',
        description: 'Titre et informations générales',
        required: true,
        completed: false,
        fields: ['title', 'country', 'description'],
      },
    ];

    if (type === 'project') {
      return [
        ...baseSteps,
        {
          id: 'project-details',
          title: 'Détails du projet',
          description: 'Budget, dates et KPIs',
          required: true,
          completed: false,
          fields: ['budget', 'start_date', 'end_date', 'kpis'],
        },
        {
          id: 'attachments',
          title: 'Pièces jointes',
          description: 'Documents et fichiers supportants',
          required: false,
          completed: false,
          fields: ['attachments'],
        },
      ];
    }

    if (type === 'position') {
      return [
        ...baseSteps,
        {
          id: 'position-details',
          title: 'Détails de la position',
          description: 'Contexte et justification',
          required: true,
          completed: false,
          fields: ['context', 'position', 'justification'],
        },
        {
          id: 'attachments',
          title: 'Pièces jointes',
          description: 'Documents et références',
          required: false,
          completed: false,
          fields: ['attachments'],
        },
      ];
    }

    return [
      ...baseSteps,
      {
        id: 'attachments',
        title: 'Pièces jointes',
        description: 'Documents supportants',
        required: false,
        completed: false,
        fields: ['attachments'],
      },
    ];
  };

  const formSteps = getFormSteps(selectedType);

  const submissionTypes = [
    { id: 'project' as const, label: 'Projet', icon: '🚀', description: 'Soumission de nouveaux projets' },
    { id: 'position' as const, label: 'Position', icon: '📝', description: 'Positions officielles et recommandations' },
    { id: 'regulation' as const, label: 'Réglementation', icon: '⚖️', description: 'Propositions de réglementation' },
    { id: 'funding' as const, label: 'Financement', icon: '💰', description: 'Demandes de financement' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'submitted':
        return 'default';
      case 'under_review':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <AlertCircle className="h-4 w-4" />;
      case 'under_review':
        return <AlertCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Validation logic
  const validateForm = useCallback(() => {
    const errors: Record<string, string[]> = {};
    
    if (!formData.title?.trim()) {
      errors.title = ['Le titre est requis'];
    }
    
    if (!formData.description?.trim()) {
      errors.description = ['La description est requise'];
    }
    
    if (selectedType === 'project') {
      if (!formData.budget) {
        errors.budget = ['Le budget est requis'];
      }
      if (!formData.start_date) {
        errors.start_date = ['La date de début est requise'];
      }
      if (!formData.end_date) {
        errors.end_date = ['La date de fin est requise'];
      }
    }
    
    return errors;
  }, [formData, selectedType]);

  const handleSaveDraft = async () => {
    if (!currentSubmissionId) {
      const submission = await createSubmission({
        title: formData.title || 'Nouveau brouillon',
        type: selectedType,
        content: formData,
        attachments: uploadedFiles.map(f => f.name),
      });
      if (submission) {
        setCurrentSubmissionId(submission.id);
      }
    } else {
      await updateSubmission(currentSubmissionId, {
        content: formData,
      });
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

    if (!currentSubmissionId) {
      await handleSaveDraft();
    }

    if (currentSubmissionId) {
      await submitForReview(currentSubmissionId);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (currentSubmissionId) {
      for (const file of files) {
        await uploadAttachment(file, currentSubmissionId);
      }
    }
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Fichiers ajoutés",
      description: `${files.length} fichier(s) ajouté(s) avec succès.`,
    });
  };

  const handleTemplateSelect = (template: SubmissionTemplate) => {
    setSelectedTemplate(template);
    setFormData({ ...formData, ...template.content });
    toast({
      title: "Template appliqué",
      description: `Template "${template.name}" appliqué avec succès`,
    });
  };

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update validation when form data changes
  useEffect(() => {
    const errors = validateForm();
    setValidationErrors(errors);
  }, [validateForm]);

  // Initialize form when component mounts (remove auto-save trigger)
  useEffect(() => {
    // Only auto-create draft if user has meaningful content
    const timer = setTimeout(async () => {
      if (!currentSubmissionId && selectedType && formData.title?.trim()) {
        await handleSaveDraft();
      }
    }, 10000); // 10 seconds delay

    return () => clearTimeout(timer);
  }, [selectedType]); // Remove formData from dependency

  const canSubmit = Object.keys(validationErrors).length === 0 && formSteps.every(step => 
    !step.required || step.fields.every(field => formData[field])
  );

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
        <div className="flex items-center gap-2">
          <Button onClick={manualSave} variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
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

      {/* Progressive Form */}
      {selectedType && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <ProgressiveForm
              steps={formSteps}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onSave={handleSaveDraft}
              onSubmit={handleSubmit}
              formData={formData}
              validationErrors={validationErrors}
              canSubmit={canSubmit}
              autoSaveStatus={autoSaveStatus}
            >
              {/* Step Content */}
              {currentStep === 0 && (
                <TemplateSelector
                  type={selectedType}
                  onTemplateSelect={handleTemplateSelect}
                  selectedTemplateId={selectedTemplate?.id}
                />
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        placeholder="Titre du document"
                        value={formData.title || ''}
                        onChange={(e) => updateFormField('title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays/Région</Label>
                      <Select onValueChange={(value) => updateFormField('country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="senegal">Sénégal</SelectItem>
                          <SelectItem value="mali">Mali</SelectItem>
                          <SelectItem value="burkina">Burkina Faso</SelectItem>
                          <SelectItem value="niger">Niger</SelectItem>
                          <SelectItem value="cote-divoire">Côte d'Ivoire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Description détaillée"
                      value={formData.description || ''}
                      onChange={(e) => updateFormField('description', e.target.value)}
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && selectedType === 'project' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (USD) *</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="100000"
                        value={formData.budget || ''}
                        onChange={(e) => updateFormField('budget', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Date de début *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date || ''}
                        onChange={(e) => updateFormField('start_date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">Date de fin *</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date || ''}
                        onChange={(e) => updateFormField('end_date', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>KPIs du projet</Label>
                    <Textarea
                      placeholder="Listez les indicateurs de performance clés (un par ligne)"
                      value={Array.isArray(formData.kpis) ? formData.kpis.join('\n') : (formData.kpis || '')}
                      onChange={(e) => updateFormField('kpis', e.target.value.split('\n').filter(kpi => kpi.trim()))}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && selectedType === 'position' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="context">Contexte *</Label>
                    <Textarea
                      id="context"
                      placeholder="Contexte et situation actuelle"
                      value={formData.context || ''}
                      onChange={(e) => updateFormField('context', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position proposée *</Label>
                    <Textarea
                      id="position"
                      placeholder="Description de la position officielle"
                      value={formData.position || ''}
                      onChange={(e) => updateFormField('position', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justification">Justification *</Label>
                    <Textarea
                      id="justification"
                      placeholder="Arguments et justifications"
                      value={formData.justification || ''}
                      onChange={(e) => updateFormField('justification', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Attachments Step */}
              {(currentStep === formSteps.length - 1) && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pièces jointes</Label>
                    <FileUpload onFilesSelected={handleFileUpload} />
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Fichiers ajoutés :</p>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{file.name}</span>
                            <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ProgressiveForm>
          </div>

          {/* Sidebar - AI Assistant */}
          <div className="lg:col-span-1">
            <AIWritingAssistant
              content={formData.description || ''}
              onContentUpdate={(content) => updateFormField('description', content)}
              type={selectedType}
              context={{
                title: formData.title,
                description: formData.description,
                ...formData,
              }}
            />
          </div>
        </div>
      )}

      {!selectedType && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Commencez votre soumission</h3>
              <p>Sélectionnez un type de document pour bénéficier de l'assistant IA et des templates intelligents.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mes Soumissions ({submissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Aucune soumission</h3>
                <p>Créez votre première soumission en sélectionnant un type ci-dessus.</p>
              </div>
            ) : (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{submission.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {submission.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(submission.created_at).toLocaleDateString()}
                      </span>
                      {submission.auto_saved_at && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Clock className="h-4 w-4" />
                          Auto-sauvegardé
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusColor(submission.status)}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(submission.status)}
                      {submission.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCurrentSubmissionId(submission.id);
                        setFormData(submission.content);
                        setSelectedType(submission.type);
                      }}
                    >
                      Continuer
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Submit;