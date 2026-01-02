import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InitiativeType } from './InitiativeTypeSelector';

const themes = [
  { value: 'connectivity', label: 'Connectivité' },
  { value: 'education', label: 'Éducation numérique' },
  { value: 'health', label: 'Santé numérique' },
  { value: 'governance', label: 'Gouvernance' },
  { value: 'inclusion', label: 'Inclusion numérique' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'other', label: 'Autre' },
];

const beneficiaries = [
  { value: 'rural', label: 'Populations rurales' },
  { value: 'youth', label: 'Jeunes' },
  { value: 'women', label: 'Femmes' },
  { value: 'schools', label: 'Établissements scolaires' },
  { value: 'health_centers', label: 'Centres de santé' },
  { value: 'general', label: 'Population générale' },
];

interface SimpleContributionFormProps {
  type: InitiativeType | null;
  formData: Record<string, any>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  isSubmitting?: boolean;
}

export const SimpleContributionForm = ({
  type,
  formData,
  onChange,
  onSubmit,
  onSaveDraft,
  isSubmitting = false,
}: SimpleContributionFormProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      onChange('attachments', [...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange('attachments', newFiles);
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'project': return 'votre projet';
      case 'practice': return 'cette bonne pratique';
      case 'resource': return 'cette ressource';
      default: return 'votre initiative';
    }
  };

  if (!type) {
    return null;
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          Décrivez {getTypeLabel()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Titre */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Titre <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Donnez un titre clair et descriptif"
            value={formData.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            className="h-11"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Décrivez votre initiative en quelques phrases. Qu'est-ce qui la rend unique ? Quels sont les résultats attendus ou obtenus ?"
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </div>

        {/* Thématique */}
        <div className="space-y-2">
          <Label htmlFor="theme" className="text-sm font-medium">
            Thématique principale
          </Label>
          <Select
            value={formData.theme || ''}
            onValueChange={(value) => onChange('theme', value)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sélectionnez une thématique" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.value} value={theme.value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bénéficiaires (pour projets) */}
        {type === 'project' && (
          <div className="space-y-2">
            <Label htmlFor="beneficiaries" className="text-sm font-medium">
              Bénéficiaires ciblés
            </Label>
            <Select
              value={formData.beneficiaries || ''}
              onValueChange={(value) => onChange('beneficiaries', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Qui bénéficie de ce projet ?" />
              </SelectTrigger>
              <SelectContent>
                {beneficiaries.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Pièces jointes */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Documents (optionnel)
          </Label>
          
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Glissez vos fichiers ici ou <span className="text-primary underline">parcourir</span>
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                PDF, Word, Excel, PowerPoint, Images
              </p>
            </label>
          </div>

          {/* Liste des fichiers */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span className="text-sm text-foreground truncate flex-1 mr-2">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="flex-1 sm:flex-none"
            disabled={isSubmitting}
          >
            Enregistrer
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="flex-1"
            disabled={isSubmitting || !formData.title || !formData.description}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Partager au réseau'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleContributionForm;
