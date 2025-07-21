
import { useState, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Document = Tables<'documents'>;
type DocumentInsert = TablesInsert<'documents'>;

interface UseDocumentsResult {
  documents: Document[];
  loading: boolean;
  uploading: boolean;
  uploadDocument: (file: File, metadata: Omit<DocumentInsert, 'uploaded_by' | 'file_url' | 'file_name' | 'file_size' | 'mime_type'>) => Promise<Document | undefined>;
  downloadDocument: (document: Document) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useOptimizedDocuments = (): UseDocumentsResult => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Refs for preventing duplicate operations
  const fetchingRef = useRef(false);
  const uploadingRef = useRef(false);

  // Memoized fetch function
  const fetchDocuments = useCallback(async () => {
    if (fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;
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
      fetchingRef.current = false;
    }
  }, [toast]);

  // Memoized upload function
  const uploadDocument = useCallback(async (
    file: File, 
    metadata: Omit<DocumentInsert, 'uploaded_by' | 'file_url' | 'file_name' | 'file_size' | 'mime_type'>
  ): Promise<Document | undefined> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour uploader un document",
        variant: "destructive"
      });
      return;
    }

    if (uploadingRef.current) return;

    try {
      uploadingRef.current = true;
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
      uploadingRef.current = false;
    }
  }, [user, toast]);

  // Memoized download function
  const downloadDocument = useCallback(async (document: Document) => {
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
  }, [toast]);

  // Memoized return object
  const returnValue = useMemo(() => ({
    documents,
    loading,
    uploading,
    uploadDocument,
    downloadDocument,
    refetch: fetchDocuments
  }), [documents, loading, uploading, uploadDocument, downloadDocument, fetchDocuments]);

  return returnValue;
};
