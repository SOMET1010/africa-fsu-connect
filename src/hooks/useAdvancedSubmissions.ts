import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
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
  submitted_at?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  review_notes?: string;
  auto_saved_at?: string;
}

export interface CreateSubmissionData {
  title: string;
  type: 'project' | 'position' | 'regulation' | 'funding';
  content: Record<string, any>;
  attachments?: string[];
}

const SubmissionStatusMap: Record<AdvancedSubmission['status'], Database['public']['Enums']['submission_status']> = {
  draft: 'brouillon',
  submitted: 'soumis',
  under_review: 'en_revision',
  approved: 'approuve',
  rejected: 'rejete',
};

const InverseSubmissionStatusMap: Record<Database['public']['Enums']['submission_status'], AdvancedSubmission['status']> = {
  brouillon: 'draft',
  soumis: 'submitted',
  en_revision: 'under_review',
  approuve: 'approved',
  rejete: 'rejected',
};

const parseJson = (value?: string | null): Record<string, any> => {
  if (!value) return {};
  try {
    return JSON.parse(value);
  } catch (error) {
    logger.warn('Failed to parse submission content as JSON', error);
    return { raw: value };
  }
};

const mapRowToSubmission = (row: any): AdvancedSubmission => {
  const parsedContent = parseJson(row.content);
  const typeFromContent = parsedContent?.type ?? 'project';
  return {
    id: row.id,
    title: row.title,
    type: ['project', 'position', 'regulation', 'funding'].includes(typeFromContent) ? typeFromContent : 'project',
    status: InverseSubmissionStatusMap[row.status] ?? 'draft',
    content: parsedContent,
    attachments: (row.attachments || []).map(String),
    version: row.version ?? 1,
    created_at: row.created_at,
    updated_at: row.updated_at,
    submitted_by: row.submitted_by,
    submitted_at: row.submitted_at ?? undefined,
    reviewer_id: row.reviewed_by ?? undefined,
    reviewed_at: row.reviewed_at ?? undefined,
    review_notes: row.review_notes ?? undefined,
  };
};

export const useAdvancedSubmissions = () => {
  const [submissions, setSubmissions] = useState<AdvancedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSubmissions = useCallback(async () => {
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase
        .from('submissions')
        .select('*')
        .eq('submitted_by', user.id)
        .order('updated_at', { ascending: false });

      if (queryError) throw queryError;

      const mapped = (data || []).map(mapRowToSubmission);
      setSubmissions(mapped);
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la récupération des soumissions';
      setError(message);
      logger.error('Fetching submissions failed', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createSubmission = useCallback(async (submissionData: CreateSubmissionData) => {
    if (!user) return null;
    setError(null);

    try {
      const payload = {
        title: submissionData.title,
        description: submissionData.content?.summary ?? null,
        content: JSON.stringify({ ...submissionData.content, type: submissionData.type }),
        status: SubmissionStatusMap.draft,
        submitted_by: user.id,
        submitted_at: new Date().toISOString(),
        attachments: submissionData.attachments || [],
      };

      const { data, error: insertError } = await supabase
        .from('submissions')
        .insert([payload])
        .select('*')
        .single();

      if (insertError) throw insertError;

      const mapped = mapRowToSubmission(data);
      setSubmissions(prev => [mapped, ...prev]);
      toast({
        title: 'Brouillon créé',
        description: 'Votre soumission est enregistrée.',
      });

      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la soumission';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      logger.error('Create submission failed', err);
      return null;
    }
  }, [toast, user]);

  const updateSubmission = useCallback(async (id: string, updates: Partial<CreateSubmissionData>) => {
    const existing = submissions.find(sub => sub.id === id);
    if (!existing) return null;

    const mergedContent = { ...existing.content, ...updates.content };

    try {
      const payload: Record<string, any> = {
        title: updates.title ?? existing.title,
        description: mergedContent?.summary ?? existing.content?.summary ?? null,
        content: JSON.stringify({ ...mergedContent, type: updates.type ?? existing.type }),
        updated_at: new Date().toISOString(),
      };

      const { data, error: updateError } = await supabase
        .from('submissions')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      const mapped = mapRowToSubmission(data);
      setSubmissions(prev => prev.map(sub => sub.id === id ? mapped : sub));
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      logger.error('Update submission failed', err);
      return null;
    }
  }, [submissions, toast]);

  const autoSave = useCallback(async (id: string, content: Record<string, any>) => {
    try {
      await updateSubmission(id, { content });
    } catch (err) {
      logger.error('Auto-save failed', err);
    }
  }, [updateSubmission]);

  const submitForReview = useCallback(async (id: string) => {
    try {
      const { data, error: submissionError } = await supabase
        .from('submissions')
        .update({
          status: SubmissionStatusMap.submitted,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (submissionError) throw submissionError;

      const mapped = mapRowToSubmission(data);
      setSubmissions(prev => prev.map(sub => sub.id === id ? mapped : sub));
      toast({
        title: 'Soumission envoyée',
        description: 'Votre contribution est en cours de révision.',
      });
      return mapped;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      logger.error('Submit for review failed', err);
      return null;
    }
  }, [toast]);

  const uploadAttachment = useCallback(async (file: File, submissionId: string) => {
    try {
      const fileName = `${submissionId}/${file.name}`;

      const { data, error: attachmentsError } = await supabase
        .from('submissions')
        .select('attachments')
        .eq('id', submissionId)
        .single();

      if (attachmentsError) throw attachmentsError;

      const existingAttachments: string[] = (data?.attachments || []).map(String);
      const payload = [...existingAttachments, fileName];

      const { data: updated, error: updateError } = await supabase
        .from('submissions')
        .update({
          attachments: payload,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId)
        .select('*')
        .single();

      if (updateError) throw updateError;

      const mapped = mapRowToSubmission(updated);
      setSubmissions(prev => prev.map(sub => sub.id === submissionId ? mapped : sub));
      toast({
        title: 'Fichier ajouté',
        description: 'Le fichier est attaché à la soumission.',
      });
      return fileName;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du téléchargement';
      setError(message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      logger.error('Upload attachment failed', err);
      return null;
    }
  }, [toast]);

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
