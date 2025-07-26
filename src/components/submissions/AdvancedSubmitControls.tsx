import { ModernButton } from "@/components/ui/modern-button";
import { ModernCard } from "@/components/ui/modern-card";
import { ProgressiveForm } from "@/components/submissions/ProgressiveForm";
import { AIWritingAssistant } from "@/components/submissions/AIWritingAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/shared/FileUpload";
import { 
  FileText, 
  Bot, 
  Upload, 
  History,
  Settings,
  Zap,
  BarChart3,
  CheckCircle
} from "lucide-react";

interface AdvancedSubmitControlsProps {
  formSteps: any[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: Record<string, any>;
  validationErrors: Record<string, string[]>;
  onSaveDraft: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  autoSaveStatus: {
    status: 'idle' | 'saving' | 'saved' | 'error';
    lastSaved?: Date;
  };
  selectedType: string;
  submissions: any[];
  onFileUpload: (files: File[]) => void;
  uploadedFiles: File[];
}

export const AdvancedSubmitControls = ({
  formSteps,
  currentStep,
  setCurrentStep,
  formData,
  validationErrors,
  onSaveDraft,
  onSubmit,
  canSubmit,
  autoSaveStatus,
  selectedType,
  submissions,
  onFileUpload,
  uploadedFiles
}: AdvancedSubmitControlsProps) => {
  return (
    <div className="space-y-6">
      {/* Advanced Tools */}
      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Outils Avancés</h3>
            <p className="text-sm text-muted-foreground">
              Assistant IA, validation avancée et analytics
            </p>
          </div>
          <div className="flex gap-2">
            <ModernButton variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              Historique
            </ModernButton>
            <ModernButton variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </ModernButton>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Bot className="h-4 w-4 mr-2" />
            Assistant IA
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <CheckCircle className="h-4 w-4 mr-2" />
            Validation
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </ModernButton>
          <ModernButton variant="outline" size="sm" className="justify-start">
            <Zap className="h-4 w-4 mr-2" />
            Auto-complétion
          </ModernButton>
        </div>
      </ModernCard>

      {/* Advanced Form Interface */}
      <ModernCard variant="glass" className="overflow-hidden">
        <Tabs defaultValue="progressive" className="w-full">
          <div className="border-b border-border/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3 bg-muted/30">
              <TabsTrigger value="progressive" className="flex items-center gap-2 data-[state=active]:bg-background">
                <FileText className="h-4 w-4" />
                Formulaire
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Bot className="h-4 w-4" />
                Assistant IA
              </TabsTrigger>
              <TabsTrigger value="attachments" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Upload className="h-4 w-4" />
                Pièces jointes
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="progressive" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Formulaire Progressif</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Formulaire étape par étape avec validation avancée
                </p>
              </div>
              <ProgressiveForm
                steps={formSteps}
                currentStep={currentStep}
                onStepChange={setCurrentStep}
                onSave={onSaveDraft}
                onSubmit={onSubmit}
                formData={formData}
                validationErrors={validationErrors}
                canSubmit={canSubmit}
                autoSaveStatus={autoSaveStatus}
              >
                <div className="text-center text-muted-foreground p-8">
                  Formulaire progressif avancé - Contenu personnalisé
                </div>
              </ProgressiveForm>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-assistant" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Assistant d'Écriture IA</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Assistance intelligente pour la rédaction de documents
                </p>
              </div>
              <AIWritingAssistant
                content={formData.description || ''}
                onContentUpdate={(content) => {}}
                type={selectedType as 'project' | 'position' | 'regulation' | 'funding'}
                context={formData}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="attachments" className="p-6 mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Gestion des Pièces Jointes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload en lot et gestion avancée des fichiers
                </p>
              </div>
              
              <div className="space-y-4">
                <FileUpload
                  onFilesSelected={onFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  maxSize={10}
                  multiple={true}
                />
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Fichiers attachés ({uploadedFiles.length})</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <ModernButton variant="outline" size="sm">
                            Supprimer
                          </ModernButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ModernCard>

      {/* Submission Analytics */}
      <ModernCard variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Analytics de Soumission</h3>
          <ModernButton variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Rapport Détaillé
          </ModernButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Taux d'Approbation</h4>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-600">
                {submissions.length > 0 
                  ? Math.round((submissions.filter(s => s.status === 'approved').length / submissions.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">
                sur {submissions.length} soumissions
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Temps Moyen</h4>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">3.2j</div>
              <div className="text-sm text-muted-foreground">
                traitement
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Score Qualité</h4>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-purple-600">8.7/10</div>
              <div className="text-sm text-muted-foreground">
                moyenne
              </div>
            </div>
          </div>
        </div>
      </ModernCard>
    </div>
  );
};