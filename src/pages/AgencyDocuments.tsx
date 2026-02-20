import React, { useState, useEffect, useCallback } from "react";
import { useAgencyResources, type AgencyResource } from "@/hooks/useAgencyResources";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, Upload, Download, Eye, Trash2, Search,
  FileText, Globe, Lock, Users, History, MessageSquare,
  Clock, Building2, Filter, Plus
} from "lucide-react";

const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin_pays', label: 'Admin Pays' },
  { value: 'editeur', label: 'Éditeur' },
  { value: 'contributeur', label: 'Contributeur' },
  { value: 'point_focal', label: 'Point Focal' },
  { value: 'lecteur', label: 'Lecteur' },
];

const AgencyDocuments = () => {
  const { user, isAdmin } = useAuth();
  const {
    resources, versions, comments, loading, uploading,
    fetchResources, uploadResource, uploadNewVersion,
    fetchVersions, fetchComments, addComment, deleteResource, downloadVersion
  } = useAgencyResources();

  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<AgencyResource | null>(null);
  const [newComment, setNewComment] = useState('');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', resource_type: 'guide',
    access_level: 'public', allowed_roles: [] as string[],
    file: null as File | null,
  });

  // Version upload state
  const [versionUpload, setVersionUpload] = useState({ show: false, file: null as File | null, summary: '' });

  useEffect(() => {
    fetchResources();
    supabase.from('agencies').select('id, name, acronym').then(({ data }) => {
      if (data) setAgencies(data);
    });
  }, [fetchResources]);

  useEffect(() => {
    if (previewResource) {
      fetchVersions(previewResource.id);
      fetchComments(previewResource.id);
    }
  }, [previewResource, fetchVersions, fetchComments]);

  const filteredResources = resources.filter(r => {
    const matchSearch = !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchAgency = !selectedAgency || selectedAgency === 'all' || r.agency_id === selectedAgency;
    return matchSearch && matchAgency;
  });

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !selectedAgency) return;
    await uploadResource(uploadForm.file, {
      agency_id: selectedAgency,
      title: uploadForm.title,
      description: uploadForm.description,
      resource_type: uploadForm.resource_type,
      access_level: uploadForm.access_level,
      allowed_roles: uploadForm.allowed_roles,
    });
    setUploadOpen(false);
    setUploadForm({ title: '', description: '', resource_type: 'guide', access_level: 'public', allowed_roles: [], file: null });
    fetchResources();
  };

  const handleVersionUpload = async () => {
    if (!previewResource || !versionUpload.file || !versionUpload.summary) return;
    await uploadNewVersion(previewResource.id, versionUpload.file, versionUpload.summary);
    setVersionUpload({ show: false, file: null, summary: '' });
  };

  const getAccessIcon = (level: string) => {
    if (level === 'public') return <Globe className="h-3 w-3" />;
    if (level === 'authenticated') return <Users className="h-3 w-3" />;
    return <Lock className="h-3 w-3" />;
  };

  const getAccessLabel = (level: string) => {
    if (level === 'public') return 'Public';
    if (level === 'authenticated') return 'Authentifié';
    return 'Restreint';
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-transparent relative z-10">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              Bibliothèque des Agences
            </h1>
            <p className="text-muted-foreground mt-1">
              Documents partagés entre les agences du réseau UDC
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)} disabled={!selectedAgency}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un document
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedAgency} onValueChange={setSelectedAgency}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Toutes les agences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les agences</SelectItem>
                  {agencies.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      <span className="flex items-center gap-2">
                        <Building2 className="h-3 w-3" />
                        {a.acronym} — {a.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Chargement...</div>
        ) : filteredResources.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun document</h3>
            <p className="text-muted-foreground">Sélectionnez une agence et ajoutez vos premiers documents.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map(resource => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => setPreviewResource(resource)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">{resource.title}</CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1 shrink-0 ml-2">
                      {getAccessIcon(resource.access_level)}
                      {getAccessLabel(resource.access_level)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{resource.description || 'Aucune description'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3 w-3" />
                      <span>{resource.agency_acronym || 'Agence'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <History className="h-3 w-3" />
                        v{resource.current_version || '1.0'}
                      </span>
                      <span>{formatFileSize(resource.file_size)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary" className="capitalize text-xs">{resource.resource_type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(resource.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Dialog */}
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Ajouter un document d'agence
              </DialogTitle>
              <DialogDescription>
                Ce document sera partagé selon les règles d'accès que vous définissez.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input value={uploadForm.title} onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))} placeholder="Titre du document" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={uploadForm.description} onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={uploadForm.resource_type} onValueChange={v => setUploadForm(p => ({ ...p, resource_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="rapport">Rapport</SelectItem>
                      <SelectItem value="presentation">Présentation</SelectItem>
                      <SelectItem value="formulaire">Formulaire</SelectItem>
                      <SelectItem value="etude">Étude</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Niveau d'accès</Label>
                  <Select value={uploadForm.access_level} onValueChange={v => setUploadForm(p => ({ ...p, access_level: v, allowed_roles: v === 'restricted' ? p.allowed_roles : [] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public"><span className="flex items-center gap-2"><Globe className="h-3 w-3" /> Public</span></SelectItem>
                      <SelectItem value="authenticated"><span className="flex items-center gap-2"><Users className="h-3 w-3" /> Authentifié</span></SelectItem>
                      <SelectItem value="restricted"><span className="flex items-center gap-2"><Lock className="h-3 w-3" /> Restreint</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {uploadForm.access_level === 'restricted' && (
                <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
                  <Label className="text-sm">Rôles autorisés</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(role => (
                      <div key={role.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`upload-role-${role.value}`}
                          checked={uploadForm.allowed_roles.includes(role.value)}
                          onCheckedChange={(checked) => setUploadForm(p => ({
                            ...p,
                            allowed_roles: checked
                              ? [...p.allowed_roles, role.value]
                              : p.allowed_roles.filter(r => r !== role.value)
                          }))}
                        />
                        <Label htmlFor={`upload-role-${role.value}`} className="text-sm font-normal cursor-pointer">{role.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Fichier *</Label>
                <Input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv" onChange={e => setUploadForm(p => ({ ...p, file: e.target.files?.[0] || null }))} />
              </div>

              <Button
                onClick={handleUpload}
                disabled={!uploadForm.file || !uploadForm.title || !selectedAgency || uploading}
                className="w-full"
              >
                {uploading ? "Envoi en cours..." : "Uploader le document"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={!!previewResource} onOpenChange={(open) => !open && setPreviewResource(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
            {previewResource && (
              <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{previewResource.title}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{previewResource.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getAccessIcon(previewResource.access_level)}
                      {getAccessLabel(previewResource.access_level)}
                    </Badge>
                    <Badge>v{previewResource.current_version || '1.0'}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Agence:</span><p className="font-medium">{previewResource.agency_acronym}</p></div>
                  <div><span className="text-muted-foreground">Type:</span><p className="font-medium capitalize">{previewResource.resource_type}</p></div>
                  <div><span className="text-muted-foreground">Taille:</span><p className="font-medium">{formatFileSize(previewResource.file_size)}</p></div>
                </div>

                <div className="flex gap-2">
                  {previewResource.file_url && (
                    <Button onClick={() => window.open(previewResource.file_url!, '_blank')}>
                      <Download className="h-4 w-4 mr-2" /> Télécharger
                    </Button>
                  )}
                  {isAdmin() && (
                    <Button variant="destructive" onClick={() => { deleteResource(previewResource); setPreviewResource(null); }}>
                      <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Tabs */}
                <Tabs defaultValue="versions">
                  <TabsList>
                    <TabsTrigger value="versions">Versions ({versions.length})</TabsTrigger>
                    <TabsTrigger value="comments">Commentaires ({comments.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="versions" className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Historique</h3>
                      <Button size="sm" variant={versionUpload.show ? "secondary" : "default"} onClick={() => setVersionUpload(p => ({ ...p, show: !p.show }))}>
                        <Upload className="h-4 w-4 mr-2" /> Nouvelle version
                      </Button>
                    </div>

                    {versionUpload.show && (
                      <Card className="p-4 bg-muted/30 space-y-3">
                        <Input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={e => setVersionUpload(p => ({ ...p, file: e.target.files?.[0] || null }))} />
                        <Textarea value={versionUpload.summary} onChange={e => setVersionUpload(p => ({ ...p, summary: e.target.value }))} placeholder="Résumé des modifications..." rows={2} />
                        <Button size="sm" disabled={!versionUpload.file || !versionUpload.summary} onClick={handleVersionUpload}>Envoyer</Button>
                      </Card>
                    )}

                    <ScrollArea className="max-h-[300px]">
                      {versions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">Version initiale uniquement</p>
                      ) : (
                        <div className="space-y-2">
                          {versions.map((v, i) => (
                            <div key={v.id} className="border rounded-lg p-3 flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={i === 0 ? "default" : "secondary"}>v{v.version}</Badge>
                                  {i === 0 && <Badge variant="outline" className="text-xs">Actuelle</Badge>}
                                </div>
                                <p className="text-sm mt-1">{v.changes_summary}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(v.uploaded_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => downloadVersion(v.id)}>
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="comments" className="space-y-3 mt-4">
                    <div className="border rounded-lg p-3 bg-muted/30 space-y-2">
                      <Textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        rows={2}
                      />
                      <Button size="sm" disabled={!newComment.trim()} onClick={() => { addComment(previewResource.id, newComment); setNewComment(''); }}>
                        Publier
                      </Button>
                    </div>
                    <ScrollArea className="max-h-[300px]">
                      {comments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">Aucun commentaire</p>
                      ) : (
                        <div className="space-y-2">
                          {comments.map(c => (
                            <div key={c.id} className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{c.user_name}</span>
                                <span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                              </div>
                              <p className="text-sm mt-1">{c.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AgencyDocuments;
