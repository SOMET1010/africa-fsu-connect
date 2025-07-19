
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Agency = Database['public']['Tables']['agencies']['Row'] & {
  agency_connectors?: Database['public']['Tables']['agency_connectors']['Row'][];
};
type AgencyInsert = Database['public']['Tables']['agencies']['Insert'];
type AgencyUpdate = Database['public']['Tables']['agencies']['Update'];

export const useAgencies = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agencies')
        .select(`
          *,
          agency_connectors (*)
        `)
        .order('name');

      if (error) throw error;
      setAgencies(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des agences';
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

  const createAgency = async (agency: AgencyInsert) => {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .insert(agency)
        .select()
        .single();

      if (error) throw error;

      setAgencies(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "Agence créée avec succès",
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

  const updateAgency = async (id: string, updates: AgencyUpdate) => {
    try {
      const { data, error } = await supabase
        .from('agencies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAgencies(prev => prev.map(agency => 
        agency.id === id ? data : agency
      ));
      toast({
        title: "Succès",
        description: "Agence mise à jour avec succès",
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

  const deleteAgency = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agencies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAgencies(prev => prev.filter(agency => agency.id !== id));
      toast({
        title: "Succès",
        description: "Agence supprimée avec succès",
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
    fetchAgencies();
  }, []);

  return {
    agencies,
    loading,
    error,
    createAgency,
    updateAgency,
    deleteAgency,
    refetch: fetchAgencies,
  };
};
