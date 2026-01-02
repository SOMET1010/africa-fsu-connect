import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdvancedSubmissions } from '@/hooks/useAdvancedSubmissions';
import { ShareInitiativeHero } from '@/components/submit/ShareInitiativeHero';
import { InitiativeTypeSelector, InitiativeType } from '@/components/submit/InitiativeTypeSelector';
import { SimpleContributionForm } from '@/components/submit/SimpleContributionForm';
import { ContributionSuccess } from '@/components/submit/ContributionSuccess';

export const Submit = () => {
  const [selectedType, setSelectedType] = useState<InitiativeType | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const {
    createSubmission,
    submitForReview,
  } = useAdvancedSubmissions();

  const updateFormField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const mapTypeToSubmissionType = (type: InitiativeType): 'project' | 'position' | 'regulation' | 'funding' => {
    // Map new types to existing database types
    switch (type) {
      case 'project': return 'project';
      case 'practice': return 'position'; // Bonnes pratiques → position
      case 'resource': return 'regulation'; // Ressources → regulation
      default: return 'project';
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedType) return;
    
    try {
      const submission = await createSubmission({
        title: formData.title || 'Brouillon',
        type: mapTypeToSubmissionType(selectedType),
        content: { ...formData, initiativeType: selectedType },
        attachments: formData.attachments?.map((f: File) => f.name) || [],
      });
      
      if (submission) {
        toast({
          title: "Brouillon enregistré",
          description: "Vous pourrez reprendre votre contribution plus tard.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le brouillon.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedType || !formData.title || !formData.description) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le titre et la description.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submission = await createSubmission({
        title: formData.title,
        type: mapTypeToSubmissionType(selectedType),
        content: { ...formData, initiativeType: selectedType },
        attachments: formData.attachments?.map((f: File) => f.name) || [],
      });
      
      if (submission) {
        await submitForReview(submission.id);
        setIsSuccess(true);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de soumettre votre contribution.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewContribution = () => {
    setSelectedType(null);
    setFormData({});
    setIsSuccess(false);
  };

  // Success state
  if (isSuccess && selectedType) {
    return (
      <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
        <div className="container mx-auto px-4 py-12 max-w-2xl animate-fade-in">
          <ContributionSuccess
            type={selectedType}
            title={formData.title}
            onNewContribution={handleNewContribution}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-3xl">
        
        {/* Hero épuré */}
        <div className="animate-fade-in">
          <ShareInitiativeHero />
        </div>
        
        {/* Choix du type - 3 options narratives */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <InitiativeTypeSelector 
            selected={selectedType}
            onSelect={setSelectedType}
          />
        </div>
        
        {/* Formulaire simple et guidé */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SimpleContributionForm
            type={selectedType}
            formData={formData}
            onChange={updateFormField}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            isSubmitting={isSubmitting}
          />
        </div>
        
      </div>
    </div>
  );
};

export default Submit;
