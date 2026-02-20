import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Download, 
  FileDown, 
  RotateCcw, 
  CheckCircle2,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlatformConfig } from '@/hooks/usePlatformConfig';
import { IdentitySection } from '@/components/admin/config/IdentitySection';
import { PartnersSection } from '@/components/admin/config/PartnersSection';
import { AdminsSection } from '@/components/admin/config/AdminsSection';
import { ModulesSection } from '@/components/admin/config/ModulesSection';
import { LanguagesSection } from '@/components/admin/config/LanguagesSection';
import { MilestonesSection } from '@/components/admin/config/MilestonesSection';
import { SignaturesSection } from '@/components/admin/config/SignaturesSection';
import { exportConfigToPDF } from '@/utils/configPdfExport';
import { toast } from 'sonner';

const PlatformConfig = () => {
  const {
    config,
    updateConfig,
    saveConfig,
    resetConfig,
    exportToJSON,
    getCompletionPercentage,
    isSaving,
    lastSaved,
  } = usePlatformConfig();

  const [activeTab, setActiveTab] = useState('identity');
  const completion = getCompletionPercentage();

  const handleSave = async () => {
    const success = await saveConfig();
    if (success) {
      toast.success('Configuration sauvegardée avec succès');
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleExportPDF = () => {
    try {
      exportConfigToPDF(config);
      toast.success('PDF généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du PDF');
      console.error(error);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la configuration ?')) {
      resetConfig();
      toast.info('Configuration réinitialisée');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Configuration de la plateforme</h1>
                <p className="text-sm text-muted-foreground">
                  Fiche de configuration initiale USF Universal Digital Connect
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastSaved && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Sauvegardé {lastSaved.toLocaleTimeString('fr-FR')}
                </Badge>
              )}
              
              <Button variant="outline" onClick={handleReset} size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              
              <Button variant="outline" onClick={exportToJSON} size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                JSON
              </Button>
              
              <Button variant="outline" onClick={handleExportPDF} size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-4">
            <Progress value={completion} className="flex-1 h-2" />
            <Badge 
              variant={completion === 100 ? "default" : "secondary"}
              className={completion === 100 ? "bg-green-500/10 text-green-600" : ""}
            >
              {completion === 100 ? (
                <><CheckCircle2 className="h-3 w-3 mr-1" /> Complet</>
              ) : (
                `${completion}% complété`
              )}
            </Badge>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="identity">Identité</TabsTrigger>
            <TabsTrigger value="partners">Partenaires</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="languages">Langues</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <IdentitySection
              identity={config.identity}
              onChange={(identity) => updateConfig('identity', identity)}
            />
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <PartnersSection
              partners={config.partners}
              onChange={(partners) => updateConfig('partners', partners)}
            />
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <AdminsSection
              admins={config.admins}
              onChange={(admins) => updateConfig('admins', admins)}
            />
          </TabsContent>

          <TabsContent value="modules" className="space-y-6">
            <ModulesSection
              modules={config.modules}
              onChange={(modules) => updateConfig('modules', modules)}
            />
          </TabsContent>

          <TabsContent value="languages" className="space-y-6">
            <LanguagesSection
              languages={config.languages}
              onChange={(languages) => updateConfig('languages', languages)}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <MilestonesSection
              milestones={config.milestones}
              onChange={(milestones) => updateConfig('milestones', milestones)}
            />
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <SignaturesSection
              signatures={config.signatures}
              onChange={(signatures) => updateConfig('signatures', signatures)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PlatformConfig;
