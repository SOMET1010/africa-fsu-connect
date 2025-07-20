
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgencies } from "@/hooks/useAgencies";
import type { Database } from '@/integrations/supabase/types';

type Project = Database['public']['Tables']['agency_projects']['Row'] & {
  agencies?: Database['public']['Tables']['agencies']['Row'];
};
type ProjectInsert = Database['public']['Tables']['agency_projects']['Insert'];

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSave: (project: ProjectInsert) => Promise<void>;
}

const PROJECT_STATUSES = [
  { value: 'planned', label: 'Planifié' },
  { value: 'ongoing', label: 'En cours' },
  { value: 'completed', label: 'Complété' },
  { value: 'suspended', label: 'Suspendu' }
];

export const ProjectDialog = ({ open, onOpenChange, project, onSave }: ProjectDialogProps) => {
  const { agencies } = useAgencies();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectInsert>>({
    title: '',
    description: '',
    status: 'planned',
    budget: null,
    beneficiaries: null,
    start_date: null,
    end_date: null,
    location: '',
    completion_percentage: 0,
    tags: []
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        status: project.status,
        budget: project.budget,
        beneficiaries: project.beneficiaries,
        start_date: project.start_date,
        end_date: project.end_date,
        location: project.location,
        completion_percentage: project.completion_percentage,
        tags: project.tags,
        agency_id: project.agency_id
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'planned',
        budget: null,
        beneficiaries: null,
        start_date: null,
        end_date: null,
        location: '',
        completion_percentage: 0,
        tags: []
      });
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.agency_id) return;

    setLoading(true);
    try {
      await onSave(formData as ProjectInsert);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Modifier le projet' : 'Nouveau projet'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="agency">Agence responsable *</Label>
              <Select
                value={formData.agency_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, agency_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une agence" />
                </SelectTrigger>
                <SelectContent>
                  {agencies.map((agency) => (
                    <SelectItem key={agency.id} value={agency.id}>
                      {agency.acronym} - {agency.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  budget: e.target.value ? Number(e.target.value) : null 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="beneficiaries">Bénéficiaires</Label>
              <Input
                id="beneficiaries"
                type="number"
                value={formData.beneficiaries || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  beneficiaries: e.target.value ? Number(e.target.value) : null 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="completion">Progression (%)</Label>
              <Input
                id="completion"
                type="number"
                min="0"
                max="100"
                value={formData.completion_percentage || 0}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  completion_percentage: Number(e.target.value) 
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Date de début</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_date">Date de fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={formData.tags?.join(', ') || ''}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Rural, Fibre optique, Education"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
