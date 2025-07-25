import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface AdvancedSubmission {
  id: string;
  title: string;
  type: 'project' | 'position' | 'regulation' | 'funding';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  content: Record<string, any>;
  attachments: string[];
  version: number;
  created_at: string;
  updated_at: string;
  submitted_by: string;
  reviewer_id?: string;
  review_notes?: string;
  auto_saved_at?: string;
}

export interface CreateSubmissionData {
  title: string;
  type: 'project' | 'position' | 'regulation' | 'funding';
  content: Record<string, any>;
  attachments?: string[];
}

export const useAdvancedSubmissions = () => {
  const [submissions, setSubmissions] = useState<AdvancedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          submitter:profiles!submissions_submitted_by_fkey(display_name),
          reviewer:profiles!submissions_reviewer_id_fkey(display_name)
        `)
        .eq('submitted_by', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des soumissions');
      toast({
        title: "Erreur",
        description: "Impossible de charger les soumissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const createSubmission = useCallback(async (submissionData: CreateSubmissionData) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert({
          title: submissionData.title,
          type: submissionData.type,
          content: submissionData.content,
          attachments: submissionData.attachments || [],
          submitted_by: user.id,
          status: 'draft',
          version: 1,
        })
        .select()
        .single();

      if (error) throw error;

      setSubmissions(prev => [data, ...prev]);
      toast({
        title: "Brouillon créé",
        description: "Votre soumission a été sauvegardée en brouillon",
      });

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      toast({
        title: "Erreur",
        description: "Impossible de créer la soumission",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  const updateSubmission = useCallback(async (id: string, updates: Partial<CreateSubmissionData>) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, ...data } : sub)
      );

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la soumission",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const autoSave = useCallback(async (id: string, content: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          content,
          auto_saved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, content, auto_saved_at: new Date().toISOString() }
            : sub
        )
      );
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, []);

  const submitForReview = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update({
          status: 'submitted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, ...data } : sub)
      );

      toast({
        title: "Soumission envoyée",
        description: "Votre soumission a été envoyée pour révision",
      });

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la soumission",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const uploadAttachment = useCallback(async (file: File, submissionId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${submissionId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('submission-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: submission } = await supabase
        .from('submissions')
        .select('attachments')
        .eq('id', submissionId)
        .single();

      const currentAttachments = submission?.attachments || [];
      const updatedAttachments = [...currentAttachments, fileName];

      const { error: updateError } = await supabase
        .from('submissions')
        .update({ attachments: updatedAttachments })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, attachments: updatedAttachments }
            : sub
        )
      );

      toast({
        title: "Fichier ajouté",
        description: "Le fichier a été ajouté avec succès",
      });

      return fileName;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du téléchargement');
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le fichier",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `submitted_by=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSubmissions(prev => [payload.new as AdvancedSubmission, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSubmissions(prev => 
              prev.map(sub => 
                sub.id === payload.new.id ? payload.new as AdvancedSubmission : sub
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setSubmissions(prev => prev.filter(sub => sub.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    submissions,
    loading,
    error,
    createSubmission,
    updateSubmission,
    autoSave,
    submitForReview,
    uploadAttachment,
    fetchSubmissions,
  };
};