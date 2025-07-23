import { useState } from "react";
import { FileText, Upload, Send, Save, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ModernTabs, ModernTabsContent, ModernTabsList, ModernTabsTrigger } from "@/components/ui/modern-tabs";
import { Badge } from "@/components/ui/badge";
import FileUpload from "@/components/shared/FileUpload";
import ContextualNavigation from "@/components/shared/ContextualNavigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { glassEffect, hoverEffects } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const Submit = () => {
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const submissions = [
    {
      id: 1,
      type: "Projet",
      title: "Extension 4G - Zones Rurales",
      status: "Brouillon",
      lastModified: "2024-01-15",
      reviewer: null
    },
    {
      id: 2,
      type: "Position",
      title: "Harmonisation Réglementaire CEDEAO",
      status: "En révision",
      lastModified: "2024-01-10",
      reviewer: "Dr. Amina Kone"
    },
    {
      id: 3,
      type: "Financement",
      title: "Villages Connectés Phase 3",
      status: "Approuvé",
      lastModified: "2024-01-05",
      reviewer: "Comité Technique"
    }
  ];

  const submissionTypes = [
    {
      id: "projet",
      title: "Fiche Projet FSU",
      description: "Soumettez un nouveau projet pour financement ou partage d'expérience",
      icon: FileText,
      fields: ["titre", "description", "budget", "timeline", "kpis", "documents"]
    },
    {
      id: "position",
      title: "Position Commune",
      description: "Contribuez à l'élaboration d'une position commune africaine",
      icon: User,
      fields: ["sujet", "position", "justification", "impact", "collaborateurs"]
    },
    {
      id: "regulation",
      title: "Proposition Réglementaire",
      description: "Proposez des améliorations au cadre réglementaire FSU",
      icon: FileText,
      fields: ["domaine", "proposition", "analyse", "recommandations"]
    },
    {
      id: "financement",
      title: "Demande de Financement",
      description: "Demandez un financement pour votre projet FSU",
      icon: Upload,
      fields: ["projet", "montant", "justification", "plan", "garanties"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Brouillon":
        return "bg-muted text-muted-foreground border-muted";
      case "En révision":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300";
      case "Approuvé":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300";
      case "Rejeté":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Brouillon":
        return <Clock className="h-4 w-4" />;
      case "En révision":
        return <AlertCircle className="h-4 w-4" />;
      case "Approuvé":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Brouillon sauvegardé",
      description: "Votre brouillon a été sauvegardé avec succès.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Soumission envoyée",
      description: "Votre soumission a été envoyée pour révision.",
    });
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: "Fichiers ajoutés",
      description: `${files.length} fichier(s) ajouté(s) avec succès.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <PageContainer size="xl" padding="lg">
        <ContextualNavigation />

        <PageHeader
          title="Formulaires de Soumission"
          description="Soumettez vos projets, positions communes, propositions réglementaires ou demandes de financement à la communauté FSU africaine."
          gradient
        />

        {/* My Submissions */}
        <ModernCard variant="glass" className="mb-8">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-lg font-semibold text-foreground">Mes Soumissions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Historique de vos soumissions et leur statut
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <ModernCard 
                  key={submission.id} 
                  variant="light" 
                  hover="lift"
                  className={cn(
                    "p-4 transition-all duration-300",
                    hoverEffects.lift
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                        {getStatusIcon(submission.status)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{submission.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.type} • Modifié le {new Date(submission.lastModified).toLocaleDateString('fr-FR')}
                        </p>
                        {submission.reviewer && (
                          <p className="text-sm text-muted-foreground">
                            Réviseur: {submission.reviewer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      <ModernButton variant="outline" size="sm">
                        Voir
                      </ModernButton>
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          </div>
        </ModernCard>

        <ModernTabs value={selectedType} onValueChange={setSelectedType} className="space-y-8">
          {/* Type Selection */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {submissionTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <ModernCard 
                  key={type.id} 
                  variant={selectedType === type.id ? "gradient" : "medium"}
                  hover="lift"
                  interactive
                  className={cn(
                    "p-6 text-center cursor-pointer transition-all duration-300",
                    selectedType === type.id && "ring-2 ring-primary/50",
                    hoverEffects.lift
                  )}
                  onClick={() => setSelectedType(type.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center mb-4">
                    <div className={cn(
                      "p-3 rounded-xl border transition-all duration-300",
                      selectedType === type.id 
                        ? "bg-primary/20 border-primary/30" 
                        : "bg-primary/10 border-primary/20"
                    )}>
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </ModernCard>
              );
            })}
          </div>

          {/* Forms */}
          <ModernTabsContent value="projet" className="space-y-6">
            <ModernCard variant="glass">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-lg font-semibold text-foreground">Fiche Projet FSU</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Remplissez les informations de votre projet FSU pour soumission et évaluation
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre du Projet</Label>
                    <Input id="titre" placeholder="Ex: Villages Connectés - Phase 2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pays">Pays</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ci">Côte d'Ivoire</SelectItem>
                        <SelectItem value="sn">Sénégal</SelectItem>
                        <SelectItem value="bf">Burkina Faso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description du Projet</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Décrivez les objectifs, la portée et les bénéficiaires de votre projet..."
                    className="min-h-32"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Total (USD)</Label>
                    <Input id="budget" type="number" placeholder="1000000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debut">Date de Début</Label>
                    <Input id="debut" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fin">Date de Fin</Label>
                    <Input id="fin" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kpis">Indicateurs de Performance (KPIs)</Label>
                  <Textarea 
                    id="kpis" 
                    placeholder="Listez les indicateurs clés de mesure du succès du projet..."
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Documents Justificatifs</Label>
                  <FileUpload
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    maxSize={50 * 1024 * 1024}
                    multiple={true}
                    onFilesSelected={handleFileUpload}
                  />
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Fichiers ajoutés:</p>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <ModernCard key={index} variant="light" className="p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground">{file.name}</span>
                              <ModernButton variant="ghost" size="sm">
                                Supprimer
                              </ModernButton>
                            </div>
                          </ModernCard>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <ModernButton variant="outline" className="flex-1" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer en Brouillon
                  </ModernButton>
                  <ModernButton variant="default" className="flex-1" onClick={handleSubmit}>
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre pour Révision
                  </ModernButton>
                </div>
              </div>
            </ModernCard>
          </ModernTabsContent>

          <ModernTabsContent value="position" className="space-y-6">
            <ModernCard variant="glass">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-lg font-semibold text-foreground">Position Commune Africaine</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Contribuez à l'élaboration d'une position commune sur les enjeux FSU
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sujet">Sujet de la Position</Label>
                  <Input id="sujet" placeholder="Ex: Financement des infrastructures rurales" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contexte">Contexte et Enjeux</Label>
                  <Textarea 
                    id="contexte" 
                    placeholder="Décrivez le contexte et les enjeux liés à cette position..."
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position-text">Position Proposée</Label>
                  <Textarea 
                    id="position-text" 
                    placeholder="Formulez clairement la position africaine proposée..."
                    className="min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea 
                    id="justification" 
                    placeholder="Justifiez cette position avec des arguments et données..."
                    className="min-h-24"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <ModernButton variant="outline" className="flex-1" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer en Brouillon
                  </ModernButton>
                  <ModernButton variant="default" className="flex-1" onClick={handleSubmit}>
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre pour Révision
                  </ModernButton>
                </div>
              </div>
            </ModernCard>
          </ModernTabsContent>

          {/* Placeholder content for other tabs */}
          <ModernTabsContent value="regulation">
            <ModernCard variant="glass">
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Proposition Réglementaire</h3>
                  <p className="text-muted-foreground">
                    Formulaire en cours de développement
                  </p>
                </div>
              </div>
            </ModernCard>
          </ModernTabsContent>

          <ModernTabsContent value="financement">
            <ModernCard variant="glass">
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <Upload className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Demande de Financement</h3>
                  <p className="text-muted-foreground">
                    Formulaire en cours de développement
                  </p>
                </div>
              </div>
            </ModernCard>
          </ModernTabsContent>
        </ModernTabs>

        {!selectedType && (
          <ModernCard variant="glass" className="mt-8">
            <div className="p-6">
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <Send className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Sélectionnez un Type de Soumission</h3>
                <p className="text-muted-foreground">
                  Choisissez le type de document que vous souhaitez soumettre ci-dessus
                </p>
              </div>
            </div>
          </ModernCard>
        )}
      </PageContainer>
    </div>
  );
};

export default Submit;