
import React, { useState } from "react";
import { Upload, Plus, Lock, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import FileUpload from "@/components/shared/FileUpload";

interface DocumentUploadDialogProps {
  onUpload: (files: File[], metadata: any) => Promise<void>;
  isOpen?: boolean;
  onClose?: () => void;
}

const DocumentUploadDialog = ({ onUpload, isOpen: controlledIsOpen, onClose }: DocumentUploadDialogProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    document_type: 'other' as const,
    country: '',
    tags: [] as string[],
    access_level: 'public',
    allowed_roles: [] as string[]
  });

  const ROLES = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'country_admin', label: 'Admin Pays' },
    { value: 'editor', label: 'Éditeur' },
    { value: 'contributor', label: 'Contributeur' },
    { value: 'focal_point', label: 'Point Focal' },
    { value: 'reader', label: 'Lecteur' },
  ];

  const handleUpload = async (files: File[]) => {
    await onUpload(files, metadata);
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
    setMetadata({
      title: '',
      description: '',
      document_type: 'other',
      country: '',
      tags: [],
      access_level: 'public',
      allowed_roles: []
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (controlledIsOpen !== undefined && onClose) {
      if (!open) onClose();
    } else {
      setInternalIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ajouter un Nouveau Document
          </DialogTitle>
          <DialogDescription>
            Partagez vos ressources avec la communauté FSU africaine
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du document *</Label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Guide de bonnes pratiques pour..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez le contenu et l'utilité de ce document..."
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de document</Label>
                <Select 
                  value={metadata.document_type}
                  onValueChange={(value: any) => setMetadata(prev => ({ ...prev, document_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="report">Rapport</SelectItem>
                    <SelectItem value="presentation">Présentation</SelectItem>
                    <SelectItem value="form">Formulaire</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays d'origine</Label>
                <Input
                  id="country"
                  value={metadata.country}
                  onChange={(e) => setMetadata(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Ex: Côte d'Ivoire"
                />
              </div>
            </div>

            {/* Access Control Section */}
            <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
              <Label className="text-sm font-semibold">Contrôle d'accès</Label>
              <Select
                value={metadata.access_level}
                onValueChange={(value) => setMetadata(prev => ({ ...prev, access_level: value, allowed_roles: value === 'restricted' ? prev.allowed_roles : [] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <span className="flex items-center gap-2"><Globe className="h-3 w-3" /> Public — visible par tous</span>
                  </SelectItem>
                  <SelectItem value="authenticated">
                    <span className="flex items-center gap-2"><Users className="h-3 w-3" /> Authentifié — utilisateurs connectés</span>
                  </SelectItem>
                  <SelectItem value="restricted">
                    <span className="flex items-center gap-2"><Lock className="h-3 w-3" /> Restreint — rôles spécifiques</span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {metadata.access_level === 'restricted' && (
                <div className="space-y-2 pl-2">
                  <Label className="text-xs text-muted-foreground">Rôles autorisés :</Label>
                  {ROLES.map(role => (
                    <div key={role.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`role-${role.value}`}
                        checked={metadata.allowed_roles.includes(role.value)}
                        onCheckedChange={(checked) => {
                          setMetadata(prev => ({
                            ...prev,
                            allowed_roles: checked
                              ? [...prev.allowed_roles, role.value]
                              : prev.allowed_roles.filter(r => r !== role.value)
                          }));
                        }}
                      />
                      <Label htmlFor={`role-${role.value}`} className="text-sm font-normal cursor-pointer">{role.label}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="border-t pt-4">
            <FileUpload
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              maxSize={50}
              multiple={false}
              onFilesSelected={handleUpload}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
