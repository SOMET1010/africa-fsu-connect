import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AgencyResource {
  id: string;
  agency_id: string;
  title: string;
  description: string | null;
  resource_type: string;
  file_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  tags: string[] | null;
  download_count: number | null;
  access_level: string;
  allowed_roles: string[];
  shared_with_agencies: string[];
  uploaded_by: string | null;
  is_public: boolean;
  current_version: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  agency_name?: string;
  agency_acronym?: string;
}

export interface AgencyResourceVersion {
  id: string;
  resource_id: string;
  version: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  changes_summary: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface AgencyResourceComment {
  id: string;
  resource_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: string;
}

interface UseAgencyResourcesOptions {
  agencyId?: string;
}

export const useAgencyResources = (options?: UseAgencyResourcesOptions) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<AgencyResource[]>([]);
  const [versions, setVersions] = useState<AgencyResourceVersion[]>([]);
  const [comments, setComments] = useState<AgencyResourceComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchResources = useCallback(async (agencyId?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('agency_resources')
        .select('*, agencies!inner(name, acronym)')
        .order('created_at', { ascending: false });

      if (agencyId || options?.agencyId) {
        query = query.eq('agency_id', agencyId || options?.agencyId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const mapped = (data || []).map((r: any) => ({
        ...r,
        agency_name: r.agencies?.name,
        agency_acronym: r.agencies?.acronym,
      }));
      setResources(mapped);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les ressources",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [options?.agencyId, toast]);

  const uploadResource = useCallback(async (
    file: File,
    metadata: {
      agency_id: string;
      title: string;
      description?: string;
      resource_type: string;
      tags?: string[];
      access_level?: string;
      allowed_roles?: string[];
      shared_with_agencies?: string[];
    }
  ) => {
    if (!user) return;
    try {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `agency-docs/${metadata.agency_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { data, error } = await supabase
        .from('agency_resources')
        .insert({
          agency_id: metadata.agency_id,
          title: metadata.title,
          description: metadata.description || null,
          resource_type: metadata.resource_type,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          tags: metadata.tags || [],
          access_level: metadata.access_level || 'public',
          allowed_roles: metadata.allowed_roles || [],
          shared_with_agencies: metadata.shared_with_agencies || [],
          uploaded_by: user.id,
          is_public: (metadata.access_level || 'public') === 'public',
          current_version: '1.0',
        })
        .select()
        .single();

      if (error) throw error;

      // Create initial version
      await supabase.from('agency_resource_versions').insert({
        resource_id: data.id,
        version: '1.0',
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        changes_summary: 'Version initiale',
        uploaded_by: user.id,
      });

      toast({ title: "Succès", description: "Ressource ajoutée avec succès" });
      return data;
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'uploader la ressource", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [user, toast]);

  const uploadNewVersion = useCallback(async (
    resourceId: string,
    file: File,
    changesSummary: string
  ) => {
    if (!user) return;
    try {
      const { count } = await supabase
        .from('agency_resource_versions')
        .select('*', { count: 'exact', head: true })
        .eq('resource_id', resourceId);

      const newVersion = `${(count || 0) + 1}.0`;
      const fileName = `${resourceId}/v${newVersion}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`agency-docs/${fileName}`, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(`agency-docs/${fileName}`);

      const { data, error } = await supabase
        .from('agency_resource_versions')
        .insert({
          resource_id: resourceId,
          version: newVersion,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          changes_summary: changesSummary,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Update current version on resource
      await supabase
        .from('agency_resources')
        .update({ current_version: newVersion, file_url: publicUrl })
        .eq('id', resourceId);

      setVersions(prev => [data, ...prev]);
      toast({ title: "Succès", description: `Version ${newVersion} uploadée` });
      return data;
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'uploader la version", variant: "destructive" });
    }
  }, [user, toast]);

  const fetchVersions = useCallback(async (resourceId: string) => {
    const { data, error } = await supabase
      .from('agency_resource_versions')
      .select('*')
      .eq('resource_id', resourceId)
      .order('uploaded_at', { ascending: false });
    if (!error) setVersions(data || []);
  }, []);

  const fetchComments = useCallback(async (resourceId: string) => {
    const { data, error } = await supabase
      .from('agency_resource_comments')
      .select('*')
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false });
    if (!error) setComments(data || []);
  }, []);

  const addComment = useCallback(async (resourceId: string, comment: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('agency_resource_comments')
      .insert({
        resource_id: resourceId,
        user_id: user.id,
        user_name: user.email || 'Utilisateur',
        comment,
      })
      .select()
      .single();
    if (!error && data) {
      setComments(prev => [data, ...prev]);
      toast({ title: "Commentaire ajouté" });
    }
  }, [user, toast]);

  const deleteResource = useCallback(async (resource: AgencyResource) => {
    try {
      const { error } = await supabase
        .from('agency_resources')
        .delete()
        .eq('id', resource.id);
      if (error) throw error;
      setResources(prev => prev.filter(r => r.id !== resource.id));
      toast({ title: "Succès", description: "Ressource supprimée" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  }, [toast]);

  const downloadVersion = useCallback(async (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;
    const link = document.createElement('a');
    link.href = version.file_url;
    link.download = version.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [versions]);

  return useMemo(() => ({
    resources,
    versions,
    comments,
    loading,
    uploading,
    fetchResources,
    uploadResource,
    uploadNewVersion,
    fetchVersions,
    fetchComments,
    addComment,
    deleteResource,
    downloadVersion,
  }), [resources, versions, comments, loading, uploading, fetchResources, uploadResource, uploadNewVersion, fetchVersions, fetchComments, addComment, deleteResource, downloadVersion]);
};
