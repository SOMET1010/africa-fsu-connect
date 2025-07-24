import { useState } from "react";
import { FileText, Upload, Send, Save, User, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import FileUpload from "@/components/shared/FileUpload";
import ContextualNavigation from "@/components/shared/ContextualNavigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const Submit = () => {
  console.log("🚀 NOUVELLE VERSION DE LA PAGE SUBMIT - MISE À JOUR RÉUSSIE!");
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  const submissions = [
    {
      id: 1,
      type: "Projet",
      title: "Extension 4G - Zones Rurales",
      status: t('submit.status.draft'),
      lastModified: "2024-01-15",
      reviewer: null
    },
    {
      id: 2,
      type: "Position",
      title: "Harmonisation Réglementaire CEDEAO",
      status: t('submit.status.review'),
      lastModified: "2024-01-10",
      reviewer: "Dr. Amina Kone"
    },
    {
      id: 3,
      type: "Financement",
      title: "Villages Connectés Phase 3",
      status: t('submit.status.approved'),
      lastModified: "2024-01-05",
      reviewer: "Comité Technique"
    }
  ];

  const submissionTypes = [
    {
      id: "projet",
      title: t('submit.type.project'),
      description: t('submit.type.project.description'),
      icon: FileText,
      fields: ["titre", "description", "budget", "timeline", "kpis", "documents"]
    },
    {
      id: "position",
      title: t('submit.type.position'),
      description: t('submit.type.position.description'),
      icon: User,
      fields: ["sujet", "position", "justification", "impact", "collaborateurs"]
    },
    {
      id: "regulation",
      title: t('submit.type.regulation'),
      description: t('submit.type.regulation.description'),
      icon: FileText,
      fields: ["domaine", "proposition", "analyse", "recommandations"]
    },
    {
      id: "financement",
      title: t('submit.type.funding'),
      description: t('submit.type.funding.description'),
      icon: Upload,
      fields: ["projet", "montant", "justification", "plan", "garanties"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case t('submit.status.draft'):
        return "bg-gray-100 text-gray-800 border-gray-200";
      case t('submit.status.review'):
        return "bg-blue-100 text-blue-800 border-blue-200";
      case t('submit.status.approved'):
        return "bg-green-100 text-green-800 border-green-200";
      case t('submit.status.rejected'):
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case t('submit.status.draft'):
        return <Clock className="h-4 w-4" />;
      case t('submit.status.review'):
        return <AlertCircle className="h-4 w-4" />;
      case t('submit.status.approved'):
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: t('submit.toast.draft.saved'),
      description: t('submit.toast.draft.saved.description'),
    });
  };

  const handleSubmit = () => {
    toast({
      title: t('submit.toast.submitted'),
      description: t('submit.toast.submitted.description'),
    });
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast({
      title: t('submit.toast.files.added'),
      description: `${files.length}${t('submit.toast.files.added.description')}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Subtle Background Effect */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <PageContainer size="xl" padding="md" className="space-y-6 relative z-10">
        {/* Navigation contextuelle */}
        <ContextualNavigation />

        {/* Header */}
        <div className="animate-fade-in">
          <PageHeader
            title={t('submit.title')}
            description={t('submit.description')}
          />
        </div>

        {/* My Submissions */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{t('submit.my.submissions')}</CardTitle>
              <CardDescription>
                {t('submit.my.submissions.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover-scale transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded">
                        {getStatusIcon(submission.status)}
                      </div>
                      <div>
                        <p className="font-medium">{submission.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.type} • {t('submit.modified')} {new Date(submission.lastModified).toLocaleDateString('fr-FR')}
                        </p>
                        {submission.reviewer && (
                          <p className="text-sm text-muted-foreground">
                            {t('submit.reviewer')}: {submission.reviewer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="hover-scale">
                        {t('submit.action.view')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-6">
            {/* Type Selection */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {submissionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.id} 
                    className={`cursor-pointer hover:shadow-xl hover-scale transition-all duration-300 border-0 shadow-lg bg-card/80 backdrop-blur-sm ${
                      selectedType === type.id ? 'ring-2 ring-primary border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardHeader className="text-center">
                      <Icon className="h-12 w-12 mx-auto text-primary mb-4" />
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Forms */}
            <TabsContent value="projet" className="space-y-6">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>{t('submit.project.title')}</CardTitle>
                  <CardDescription>
                    {t('submit.project.description.detail')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titre">{t('submit.project.title.field')}</Label>
                      <Input id="titre" placeholder={t('submit.project.title.placeholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pays">{t('submit.project.country')}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={t('submit.project.country.placeholder')} />
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
                        <div className="space-y-1">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                              <span>{file.name}</span>
                              <Button variant="ghost" size="sm" className="hover-scale">
                                Supprimer
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 hover-scale" onClick={handleSaveDraft}>
                      <Save className="h-4 w-4 mr-2" />
                      {t('submit.action.save.draft')}
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover-scale" onClick={handleSubmit}>
                      <Send className="h-4 w-4 mr-2" />
                      {t('submit.action.submit.review')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="position" className="space-y-6">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Position Commune Africaine</CardTitle>
                  <CardDescription>
                    Contribuez à l'élaboration d'une position commune sur les enjeux FSU
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    <Button variant="outline" className="flex-1 hover-scale" onClick={handleSaveDraft}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer en Brouillon
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground hover-scale" onClick={handleSubmit}>
                      <Send className="h-4 w-4 mr-2" />
                      Soumettre pour Révision
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Placeholder content for other tabs */}
            <TabsContent value="regulation">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Proposition Réglementaire</h3>
                    <p className="text-muted-foreground mb-4">
                      Formulaire en cours de développement
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financement">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Demande de Financement</h3>
                    <p className="text-muted-foreground mb-4">
                      Formulaire en cours de développement
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {!selectedType && (
          <div className="animate-fade-in mt-8" style={{ animationDelay: '300ms' }}>
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sélectionnez un Type de Soumission</h3>
                  <p className="text-muted-foreground">
                    Choisissez le type de document que vous souhaitez soumettre ci-dessus
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default Submit;
