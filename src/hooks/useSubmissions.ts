import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from '@/utils/logger';
import { toErrorMessage } from '@/utils/errors';

export interface Submission {
  id: string;
  title: string;
  description?: string;
  content?: string;
  status: 'brouillon' | 'soumis' | 'en_revision' | 'approuve' | 'rejete';
  submitted_by: string;
  reviewed_by?: string;
  review_notes?: string;
  attachments?: any;
  submitted_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  submitter?: {
    first_name: string;
    last_name: string;
    role: string;
    country?: string;
  };
  reviewer?: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface CreateSubmissionData {
  title: string;
  description?: string;
  content?: string;
  attachments?: any;
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user's submissions
  const fetchSubmissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('submitted_by', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedSubmissions = data || [];

      setSubmissions(formattedSubmissions);
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos soumissions.",
        variant: "destructive",
      });
    }
  };

  // Fetch all submissions (for admins)
  const fetchAllSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les soumissions.",
        variant: "destructive",
      });
    }
  };

  // Create a new submission
  const createSubmission = async (submissionData: CreateSubmissionData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('submissions')
        .insert([{
          ...submissionData,
          submitted_by: user.id,
          status: 'brouillon'
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Brouillon créé",
        description: "Votre soumission a été sauvegardée en brouillon.",
      });

      await fetchSubmissions();
      return data;
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update a submission
  const updateSubmission = async (id: string, submissionData: Partial<CreateSubmissionData>) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update(submissionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Soumission mise à jour",
        description: "Vos modifications ont été sauvegardées.",
      });

      await fetchSubmissions();
      return data;
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Submit for review
  const submitForReview = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update({
          status: 'soumis',
          submitted_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Send notification to reviewers via edge function
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'submission_review',
            submissionId: id,
            title: 'Nouvelle soumission à réviser',
            message: 'Une nouvelle soumission nécessite votre attention.'
          }
        });
      } catch (notifError: unknown) {
        logger.error('Failed to send notification:', notifError);
      }

      toast({
        title: "Soumission envoyée",
        description: "Votre soumission a été envoyée pour révision.",
      });

      await fetchSubmissions();
      return data;
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Review submission (for admins)
  const reviewSubmission = async (
    id: string, 
    status: 'approuve' | 'rejete', 
    reviewNotes?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { data, error } = await supabase
        .from('submissions')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Révision enregistrée",
        description: `La soumission a été ${status === 'approuve' ? 'approuvée' : 'rejetée'}.`,
      });

      await fetchAllSubmissions();
      return data;
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      setError(message);
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
      throw err;
    }
  };

  // Upload attachment to storage
  const uploadAttachment = async (file: File, submissionId: string) => {
    try {
      const fileName = `${submissionId}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('submissions-attachments')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('submissions-attachments')
        .getPublicUrl(fileName);

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        path: fileName
      };
    } catch (err: unknown) {
      toast({
        title: "Erreur d'upload",
        description: toErrorMessage(err),
        variant: "destructive",
      });
      throw err;
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = () => {
      const submissionsSubscription = supabase
        .channel('submissions_changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'submissions' },
          () => {
            fetchSubmissions();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(submissionsSubscription);
      };
    };

    const cleanup = setupSubscriptions();
    return cleanup;
  }, []);

  // Initial fetch
  useEffect(() => {
    const initializeSubmissions = async () => {
      setLoading(true);
      try {
        await fetchSubmissions();
      } finally {
        setLoading(false);
      }
    };

    initializeSubmissions();
  }, []);

  return {
    submissions,
    loading,
    error,
    fetchSubmissions,
    fetchAllSubmissions,
    createSubmission,
    updateSubmission,
    submitForReview,
    reviewSubmission,
    uploadAttachment,
    refetch: fetchSubmissions
  };
};