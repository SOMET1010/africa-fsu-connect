import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CreateEventData } from "@/hooks/useEvents";

interface CreateEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newEvent: Partial<CreateEventData>;
  onEventChange: (event: Partial<CreateEventData>) => void;
  onSubmit: () => void;
}

export const CreateEventDialog = ({
  isOpen,
  onOpenChange,
  newEvent,
  onEventChange,
  onSubmit,
}: CreateEventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="bg-primary hover:bg-primary/90 enhanced-focus"
          aria-describedby="new-event-desc"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Nouvel événement
        </Button>
      </DialogTrigger>
      <span id="new-event-desc" className="sr-only">
        Ouvre un formulaire pour créer un nouvel événement
      </span>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un Nouvel Événement</DialogTitle>
          <DialogDescription>
            Organisez un événement pour la communauté FSU
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Titre de l'Événement *</Label>
              <Input 
                id="event-title" 
                placeholder="Ex: Webinaire Innovation" 
                value={newEvent.title}
                onChange={(e) => onEventChange({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-attendees">Nombre max de participants</Label>
              <Input 
                id="max-attendees" 
                type="number" 
                placeholder="100"
                value={newEvent.max_attendees || ""}
                onChange={(e) => onEventChange({ 
                  ...newEvent, 
                  max_attendees: e.target.value ? parseInt(e.target.value) : undefined 
                })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="Décrivez l'événement..."
              value={newEvent.description}
              onChange={(e) => onEventChange({ ...newEvent, description: e.target.value })}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début *</Label>
              <Input 
                id="start-date" 
                type="datetime-local"
                value={newEvent.start_date}
                onChange={(e) => onEventChange({ ...newEvent, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin *</Label>
              <Input 
                id="end-date" 
                type="datetime-local"
                value={newEvent.end_date}
                onChange={(e) => onEventChange({ ...newEvent, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="is-virtual"
              checked={newEvent.is_virtual}
              onCheckedChange={(checked) => onEventChange({ ...newEvent, is_virtual: checked })}
            />
            <Label htmlFor="is-virtual">Événement virtuel</Label>
          </div>

          {newEvent.is_virtual ? (
            <div className="space-y-2">
              <Label htmlFor="virtual-link">Lien de connexion</Label>
              <Input 
                id="virtual-link"
                placeholder="https://..."
                value={newEvent.virtual_link}
                onChange={(e) => onEventChange({ ...newEvent, virtual_link: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input 
                id="location"
                placeholder="Adresse de l'événement"
                value={newEvent.location}
                onChange={(e) => onEventChange({ ...newEvent, location: e.target.value })}
              />
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button onClick={onSubmit}>
              Créer l'Événement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
