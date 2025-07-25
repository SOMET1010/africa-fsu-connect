import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentVersion {
  id: string;
  document_id: string;
  version: string;
  file_url: string;
  file_name: string;
  file_size: number;
  changes_summary: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  section?: string;
  created_at: string;
}

export const useDocumentVersions = () => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [comments, setComments] = useState<DocumentComment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchVersions = useCallback(async (documentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les versions du document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchComments = useCallback(async (documentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_comments')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addComment = useCallback(async (documentId: string, comment: string, section?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour commenter",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('document_comments')
        .insert({
          document_id: documentId,
          user_id: user.id,
          user_name: user.email || 'Utilisateur anonyme',
          comment,
          section
        })
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Commentaire ajouté avec succès",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive",
      });
    }
  }, [toast]);

  const uploadNewVersion = useCallback(async (
    documentId: string,
    file: File,
    changesSummary: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour uploader une nouvelle version",
          variant: "destructive",
        });
        return;
      }

      // Get current version count
      const { count } = await supabase
        .from('document_versions')
        .select('*', { count: 'exact', head: true })
        .eq('document_id', documentId);

      const newVersion = `${(count || 0) + 1}.0`;

      // Upload file to storage
      const fileName = `${documentId}/v${newVersion}/${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Create version record
      const { data, error } = await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          version: newVersion,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          changes_summary: changesSummary,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setVersions(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Nouvelle version uploadée avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error uploading new version:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader la nouvelle version",
        variant: "destructive",
      });
    }
  }, [toast]);

  const downloadVersion = useCallback(async (versionId: string) => {
    try {
      const version = versions.find(v => v.id === versionId);
      if (!version) return;

      // Trigger download
      const link = document.createElement('a');
      link.href = version.file_url;
      link.download = version.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Téléchargement démarré",
        description: `Version ${version.version} en cours de téléchargement`,
      });
    } catch (error) {
      console.error('Error downloading version:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger cette version",
        variant: "destructive",
      });
    }
  }, [versions, toast]);

  return {
    versions,
    comments,
    loading,
    fetchVersions,
    fetchComments,
    addComment,
    uploadNewVersion,
    downloadVersion
  };
};