import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Project, ProjectInsert, ProjectUpdate } from '@/types/projects';

interface UseProjectsOptions {
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useProjects = (options: UseProjectsOptions = {}) => {
  const { pageSize = 20, sortBy = 'created_at', sortOrder = 'desc' } = options;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  // Optimisation : fetch avec pagination et cache
  const fetchProjects = useCallback(async (page = 0, resetData = false) => {
    try {
      setLoading(true);
      setError(null);

      const from = page * pageSize;
      const to = from + pageSize - 1;

      // Requête avec pagination et optimisation
      const { data, error: queryError, count } = await supabase
        .from("agency_projects")
        .select(`
          *,
          agencies (
            id,
            name,
            acronym,
            country,
            region
          )
        `, { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (queryError) throw queryError;

      if (resetData || page === 0) {
        setProjects(data || []);
      } else {
        // Append pour pagination infinie
        setProjects(prev => [...prev, ...(data || [])]);
      }
      
      setTotalCount(count || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching projects:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pageSize, sortBy, sortOrder, toast]);

  // Load more projects (pagination infinie)
  const loadMore = useCallback(() => {
    if (!loading && (currentPage + 1) * pageSize < totalCount) {
      fetchProjects(currentPage + 1, false);
    }
  }, [loading, currentPage, pageSize, totalCount, fetchProjects]);

  // Refresh (reset data)
  const refresh = useCallback(() => {
    fetchProjects(0, true);
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects(0, true);
  }, [fetchProjects]);

  // Optimized create with immediate UI update
  const createProject = useCallback(async (project: ProjectInsert) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from("agency_projects")
        .insert([project])
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

      if (insertError) throw insertError;

      // Optimistic UI update
      setProjects(prev => [data, ...prev]);
      setTotalCount(prev => prev + 1);
      
      toast({
        title: "Succès",
        description: "Projet créé avec succès",
      });
      
      return data;
    } catch (err) {
      console.error("Error creating project:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  // Optimized update with immediate UI update
  const updateProject = useCallback(async (id: string, updates: ProjectUpdate) => {
    try {
      setError(null);
      
      // Optimistic UI update
      const optimisticUpdate = (prev: Project[]) =>
        prev.map(p => p.id === id ? { ...p, ...updates } : p);
      
      const previousProjects = projects;
      setProjects(optimisticUpdate);

      const { data, error: updateError } = await supabase
        .from("agency_projects")
        .update(updates)
        .eq("id", id)
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

      if (updateError) {
        // Rollback on error
        setProjects(previousProjects);
        throw updateError;
      }

      // Final update with server data
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      
      toast({
        title: "Succès",
        description: "Projet mis à jour avec succès",
      });
      
      return data;
    } catch (err) {
      console.error("Error updating project:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [projects, toast]);

  // Optimized delete with immediate UI update
  const deleteProject = useCallback(async (id: string) => {
    try {
      setError(null);
      
      // Optimistic UI update
      const previousProjects = projects;
      setProjects(prev => prev.filter(p => p.id !== id));
      setTotalCount(prev => prev - 1);

      const { error: deleteError } = await supabase
        .from("agency_projects")
        .delete()
        .eq("id", id);

      if (deleteError) {
        // Rollback on error
        setProjects(previousProjects);
        setTotalCount(prev => prev + 1);
        throw deleteError;
      }

      toast({
        title: "Succès",
        description: "Projet supprimé avec succès",
      });
    } catch (err) {
      console.error("Error deleting project:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [projects, toast]);

  // Mémorisation des valeurs de retour
  const memoizedReturn = useMemo(() => ({
    projects,
    loading,
    error,
    totalCount,
    currentPage,
    hasMore: (currentPage + 1) * pageSize < totalCount,
    createProject,
    updateProject,
    deleteProject,
    loadMore,
    refresh
  }), [
    projects,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    createProject,
    updateProject,
    deleteProject,
    loadMore,
    refresh
  ]);

  return memoizedReturn;
};