
import React, { useState } from "react";
import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FileUpload from "@/components/shared/FileUpload";

interface DocumentUploadDialogProps {
  onUpload: (files: File[], metadata: any) => Promise<void>;
}

const DocumentUploadDialog = ({ onUpload }: DocumentUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    document_type: 'autre' as const,
    country: '',
    tags: [] as string[]
  });

  const handleUpload = async (files: File[]) => {
    await onUpload(files, metadata);
    setIsOpen(false);
    setMetadata({
      title: '',
      description: '',
      document_type: 'autre',
      country: '',
      tags: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    <SelectItem value="rapport">Rapport</SelectItem>
                    <SelectItem value="presentation">Présentation</SelectItem>
                    <SelectItem value="formulaire">Formulaire</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
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
