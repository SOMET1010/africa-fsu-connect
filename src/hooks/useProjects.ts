
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['agency_projects']['Row'] & {
  agencies?: Database['public']['Tables']['agencies']['Row'];
};
type ProjectInsert = Database['public']['Tables']['agency_projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['agency_projects']['Update'];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agency_projects')
        .select(`
          *,
          agencies (
            id,
            name,
            acronym,
            country,
            region
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des projets';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: ProjectInsert) => {
    try {
      const { data, error } = await supabase
        .from('agency_projects')
        .insert(project)
        .select(`
          *,
          agencies (
            id,
            name,
            acronym,
            country,
            region
          )
        `)
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Projet créé avec succès",
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('agency_projects')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          agencies (
            id,
            name,
            acronym,
            country,
            region
          )
        `)
        .single();

      if (error) throw error;

      setProjects(prev => prev.map(project => 
        project.id === id ? data : project
      ));
      toast({
        title: "Succès",
        description: "Projet mis à jour avec succès",
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agency_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Succès",
        description: "Projet supprimé avec succès",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
