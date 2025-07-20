
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SampleDataButton = ({ onDataAdded }: { onDataAdded: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sampleDocuments = [
    {
      title: "Guide de Développement Rural en Afrique de l'Ouest",
      description: "Un guide complet sur les meilleures pratiques pour le développement rural dans la région ouest-africaine, incluant des stratégies d'agriculture durable et de gestion des ressources naturelles.",
      document_type: "guide" as const,
      country: "Sénégal",
      mime_type: "application/pdf",
      file_name: "guide_developpement_rural_2024.pdf",
      file_size: 2500000,
      download_count: 45
    },
    {
      title: "Rapport d'Impact - Projets FSU 2023",
      description: "Analyse détaillée de l'impact des projets FSU menés en 2023 à travers différents pays africains, avec des données sur l'efficacité et les résultats obtenus.",
      document_type: "rapport" as const,
      country: "Côte d'Ivoire",
      mime_type: "application/pdf",
      file_name: "rapport_impact_fsu_2023.pdf",
      file_size: 1800000,
      download_count: 67
    },
    {
      title: "Présentation - Innovation Technologique en Agriculture",
      description: "Présentation sur les nouvelles technologies appliquées à l'agriculture africaine, incluant l'IoT, les drones et les systèmes d'irrigation intelligents.",
      document_type: "presentation" as const,
      country: "Kenya",
      mime_type: "application/vnd.ms-powerpoint",
      file_name: "innovation_agri_tech.pptx",
      file_size: 5200000,
      download_count: 23
    },
    {
      title: "Formulaire de Candidature - Programme de Formation",
      description: "Formulaire standardisé pour les candidatures aux programmes de formation FSU destinés aux professionnels du développement en Afrique.",
      document_type: "formulaire" as const,
      country: "Ghana",
      mime_type: "application/vnd.ms-excel",
      file_name: "formulaire_candidature_formation.xlsx",
      file_size: 450000,
      download_count: 89
    },
    {
      title: "Étude de Cas - Microfinance et Inclusion Financière",
      description: "Analyse approfondie des programmes de microfinance mis en place dans plusieurs pays africains et leur impact sur l'inclusion financière des populations rurales.",
      document_type: "rapport" as const,
      country: "Tanzanie",
      mime_type: "application/pdf",
      file_name: "etude_microfinance_2024.pdf",
      file_size: 3100000,
      download_count: 34
    },
    {
      title: "Manuel - Gestion des Ressources Hydriques",
      description: "Manuel pratique pour la gestion durable des ressources en eau dans les communautés rurales africaines, avec des exemples concrets et des outils pratiques.",
      document_type: "guide" as const,
      country: "Ouganda",
      mime_type: "application/pdf",
      file_name: "manuel_gestion_eau.pdf",
      file_size: 4200000,
      download_count: 56
    }
  ];

  const addSampleData = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter des données",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const documentsWithUser = sampleDocuments.map(doc => ({
        ...doc,
        uploaded_by: user.id,
        file_url: `https://exemple.com/documents/${doc.file_name}`,
        is_public: true
      }));

      const { error } = await supabase
        .from('documents')
        .insert(documentsWithUser);

      if (error) throw error;

      toast({
        title: "Succès",
        description: `${sampleDocuments.length} documents d'exemple ajoutés à la bibliothèque`,
      });

      onDataAdded();
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les données d'exemple",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={addSampleData} 
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      Ajouter des documents d'exemple
    </Button>
  );
};

export default SampleDataButton;
