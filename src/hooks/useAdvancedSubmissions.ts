import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/utils/logger';

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

  const createSubmission = useCallback(async (submissionData: CreateSubmissionData) => {
    if (!user) return null;

    try {
      // Create a mock submission for now since the database schema doesn't match yet
      const mockSubmission: AdvancedSubmission = {
        id: `temp-${Date.now()}`,
        title: submissionData.title,
        type: submissionData.type,
        status: 'draft',
        content: submissionData.content,
        attachments: submissionData.attachments || [],
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submitted_by: user.id,
      };

      setSubmissions(prev => [mockSubmission, ...prev]);
      
      toast({
        title: "Brouillon créé",
        description: "Votre soumission a été sauvegardée en brouillon",
      });

      return mockSubmission;
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
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { 
                ...sub, 
                ...updates,
                content: { ...sub.content, ...updates.content },
                updated_at: new Date().toISOString() 
              }
            : sub
        )
      );

      return true;
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
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, content, auto_saved_at: new Date().toISOString() }
            : sub
        )
      );
    } catch (err) {
      logger.error('Auto-save failed:', err);
    }
  }, []);

  const submitForReview = useCallback(async (id: string) => {
    try {
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id 
            ? { ...sub, status: 'submitted' as const, updated_at: new Date().toISOString() }
            : sub
        )
      );

      toast({
        title: "Soumission envoyée",
        description: "Votre soumission a été envoyée pour révision",
      });

      return true;
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
      // Mock file upload
      const fileName = `${submissionId}/${file.name}`;
      
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, attachments: [...sub.attachments, fileName] }
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

  const fetchSubmissions = useCallback(async () => {
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

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