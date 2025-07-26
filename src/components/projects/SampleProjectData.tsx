
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

  const sampleProjects = [
    {
      title: "Connectivité Fibre Optique Rurale - Sénégal",
      description: "Déploiement de 500 km de fibre optique dans 150 villages ruraux du Sénégal pour améliorer l'accès à Internet haut débit.",
      status: "ongoing",
      budget: 2500000,
      beneficiaries: 85000,
      start_date: "2024-03-15",
      end_date: "2025-12-31",
      location: "Régions de Tambacounda et Kédougou",
      completion_percentage: 45,
      tags: ["fibre optique", "rural", "connectivité", "haut débit"],
      agency_id: "agencies[0]" // À remplacer par l'ID réel
    },
    {
      title: "Plateforme E-Government - Côte d'Ivoire",
      description: "Modernisation des services publics avec une plateforme numérique unifiée pour 200 démarches administratives.",
      status: "ongoing",
      budget: 1800000,
      beneficiaries: 2500000,
      start_date: "2024-01-10",
      end_date: "2025-06-30",
      location: "Abidjan et 15 préfectures",
      completion_percentage: 65,
      tags: ["e-gouvernement", "digitalisation", "services publics"],
      agency_id: "agencies[1]"
    },
    {
      title: "Télémédecine Communautaire - Burkina Faso",
      description: "Équipement de 50 centres de santé avec des solutions de télémédecine pour consultations à distance.",
      status: "completed",
      budget: 950000,
      beneficiaries: 120000,
      start_date: "2023-08-01",
      end_date: "2024-11-30",
      location: "Provinces du Sahel et du Nord",
      completion_percentage: 100,
      tags: ["télémédecine", "santé", "rural", "consultations"],
      agency_id: "agencies[2]"
    },
    {
      title: "Éducation Numérique - Mali",
      description: "Équipement de 300 écoles avec tablettes et connexion Internet pour l'éducation numérique.",
      status: "ongoing",
      budget: 1200000,
      beneficiaries: 45000,
      start_date: "2024-09-01",
      end_date: "2025-08-31",
      location: "Régions de Kayes et Sikasso",
      completion_percentage: 25,
      tags: ["éducation", "numérique", "écoles", "tablettes"],
      agency_id: "agencies[3]"
    },
    {
      title: "Centres Communautaires Connectés - Ghana",
      description: "Création de 75 centres communautaires avec accès Internet et formation digitale.",
      status: "planned",
      budget: 1500000,
      beneficiaries: 95000,
      start_date: "2025-02-01",
      end_date: "2026-12-31",
      location: "Régions du Nord et de l'Upper East",
      completion_percentage: 0,
      tags: ["centres communautaires", "formation", "inclusion numérique"],
      agency_id: "agencies[4]"
    },
    {
      title: "Réseau de Surveillance Environnementale - Cameroun",
      description: "Déploiement de capteurs IoT pour surveillance environnementale et alertes climatiques.",
      status: "ongoing",
      budget: 800000,
      beneficiaries: 200000,
      start_date: "2024-05-01",
      end_date: "2025-04-30",
      location: "Régions du Littoral et du Sud-Ouest",
      completion_percentage: 35,
      tags: ["IoT", "environnement", "surveillance", "climat"],
      agency_id: "agencies[5]"
    }
  ];

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
