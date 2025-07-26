
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database, Plus } from "lucide-react";
import { useState } from "react";
import { logger } from "@/utils/logger";

export const SampleProjectData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getSampleProjects = async () => {
    // Get sample projects with dynamic country data
    const projects = [
      {
        title_key: "sample.projects.fiber_senegal.title",
        description_key: "sample.projects.fiber_senegal.description", 
        country_code: "SN",
        status: "ongoing",
        budget: 2500000,
        beneficiaries: 85000,
        start_date: "2024-03-15",
        end_date: "2025-12-31",
        location: "Régions de Tambacounda et Kédougou",
        completion_percentage: 45,
        tags: ["fibre optique", "rural", "connectivité", "haut débit"]
      },
      {
        title_key: "sample.projects.egovernment_ci.title",
        description_key: "sample.projects.egovernment_ci.description",
        country_code: "CI", 
        status: "ongoing",
        budget: 1800000,
        beneficiaries: 2500000,
        start_date: "2024-01-10",
        end_date: "2025-06-30",
        location: "Abidjan et 15 préfectures",
        completion_percentage: 65,
        tags: ["e-gouvernement", "digitalisation", "services publics"]
      },
      {
        title_key: "sample.projects.telemedicine_bf.title",
        description_key: "sample.projects.telemedicine_bf.description",
        country_code: "BF",
        status: "completed", 
        budget: 950000,
        beneficiaries: 120000,
        start_date: "2023-08-01",
        end_date: "2024-11-30",
        location: "Provinces du Sahel et du Nord",
        completion_percentage: 100,
        tags: ["télémédecine", "santé", "rural", "consultations"]
      }
    ];

    // For demo purposes, return the projects with fallback titles
    return projects.map(project => ({
      ...project,
      title: project.title_key, // Would be replaced by translation
      description: project.description_key // Would be replaced by translation
    }));
  };

  const handleCreateSampleData = async () => {
    setLoading(true);
    try {
      // Récupérer les agences existantes
      const { data: agencies, error: agenciesError } = await supabase
        .from('agencies')
        .select('id')
        .order('created_at', { ascending: true });

      if (agenciesError) throw agenciesError;

      if (!agencies || agencies.length === 0) {
        toast({
          title: "Erreur",
          description: "Aucune agence trouvée. Veuillez d'abord créer des agences.",
          variant: "destructive",
        });
        return;
      }

      // Get sample projects  
      const sampleProjects = await getSampleProjects();

      // Mapper les projets avec les vraies IDs d'agences
      const projectsWithAgencies = sampleProjects.map((project, index) => ({
        ...project,
        agency_id: agencies[index % agencies.length]?.id || agencies[0].id
      }));

      // Insérer les projets
      const { error: insertError } = await supabase
        .from('agency_projects')
        .insert(projectsWithAgencies);

      if (insertError) throw insertError;

      toast({
        title: "Succès",
        description: `${sampleProjects.length} projets de démonstration créés avec succès!`,
      });
    } catch (error) {
      logger.error('Failed to create sample project data', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des données de démonstration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Données de démonstration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Créez des projets de démonstration réalistes basés sur des initiatives FSU/SUTEL authentiques à travers l'Afrique.
        </p>
        <Button 
          onClick={handleCreateSampleData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {loading ? 'Création en cours...' : 'Créer les données de démonstration'}
        </Button>
      </CardContent>
    </Card>
  );
};
