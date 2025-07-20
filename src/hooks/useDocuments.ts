
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Document = Tables<'documents'>;
type DocumentInsert = TablesInsert<'documents'>;

export const useDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, metadata: Omit<DocumentInsert, 'uploaded_by' | 'file_url' | 'file_name' | 'file_size' | 'mime_type'>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour uploader un document",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create document record
      const documentData: DocumentInsert = {
        ...metadata,
        uploaded_by: user.id,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      };

      const { data, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Document uploadé avec succès"
      });

      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader le document",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      // Increment download count
      await supabase
        .from('documents')
        .update({ download_count: (document.download_count || 0) + 1 })
        .eq('id', document.id);

      // Update local state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === document.id 
            ? { ...doc, download_count: (doc.download_count || 0) + 1 }
            : doc
        )
      );

      // Download file
      if (document.file_url) {
        const link = globalThis.document.createElement('a');
        link.href = document.file_url;
        link.download = document.file_name || document.title;
        link.click();
      }

      toast({
        title: "Téléchargement",
        description: `Téléchargement de "${document.title}" commencé`
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    }
  };

  const searchDocuments = async (query: string, filters: Record<string, string> = {}) => {
    try {
      setLoading(true);
      
      let queryBuilder = supabase
        .from('documents')
        .select('*')
        .eq('is_public', true);

      // Apply text search on title and description
      if (query.trim()) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // Apply document type filter
      if (filters.document_type) {
        queryBuilder = queryBuilder.eq('document_type', filters.document_type as any);
      }

      // Apply country filter
      if (filters.country) {
        queryBuilder = queryBuilder.eq('country', filters.country);
      }

      const { data, error } = await queryBuilder.order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error searching documents:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    downloadDocument,
    searchDocuments,
    refetch: fetchDocuments
  };
};
