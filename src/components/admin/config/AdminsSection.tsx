import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ConfigSection } from './ConfigSection';
import { Users, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PlatformAdmin } from '@/types/platformConfig';

interface AdminsSectionProps {
  admins: PlatformAdmin[];
  onChange: (admins: PlatformAdmin[]) => void;
}

const ROLE_LABELS: Record<PlatformAdmin['role'], string> = {
  super_admin: 'Super Administrateur',
  technical_admin: 'Administrateur Technique',
  content_admin: 'Administrateur Contenu',
};

export const AdminsSection = ({ admins, onChange }: AdminsSectionProps) => {
  const handleAdminChange = (index: number, field: keyof PlatformAdmin, value: string) => {
    const updated = [...admins];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addAdmin = () => {
    onChange([
      ...admins,
      {
        role: 'content_admin',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
      },
    ]);
  };

  const removeAdmin = (index: number) => {
    onChange(admins.filter((_, i) => i !== index));
  };

  const isComplete = admins.every(a => a.firstName && a.lastName && a.email);

  return (
    <ConfigSection
      title="Administrateurs de la plateforme"
      description="Équipe de gestion et contacts techniques"
      icon={<Users className="h-5 w-5" />}
      isComplete={isComplete}
    >
      <div className="space-y-6">
        {admins.map((admin, index) => (
          <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {ROLE_LABELS[admin.role]}
              </h4>
              {admins.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAdmin(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select
                  value={admin.role}
                  onValueChange={(value) => handleAdminChange(index, 'role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Administrateur</SelectItem>
                    <SelectItem value="technical_admin">Administrateur Technique</SelectItem>
                    <SelectItem value="content_admin">Administrateur Contenu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Organisation</Label>
                <Input
                  value={admin.organization}
                  onChange={(e) => handleAdminChange(index, 'organization', e.target.value)}
                  placeholder="UAT, ANSUT..."
                />
              </div>

              <div className="space-y-2">
                <Label>Prénom *</Label>
                <Input
                  value={admin.firstName}
                  onChange={(e) => handleAdminChange(index, 'firstName', e.target.value)}
                  placeholder="Prénom"
                />
              </div>

              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input
                  value={admin.lastName}
                  onChange={(e) => handleAdminChange(index, 'lastName', e.target.value)}
                  placeholder="Nom"
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={admin.email}
                  onChange={(e) => handleAdminChange(index, 'email', e.target.value)}
                  placeholder="email@organisation.org"
                />
              </div>

              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  type="tel"
                  value={admin.phone}
                  onChange={(e) => handleAdminChange(index, 'phone', e.target.value)}
                  placeholder="+XXX XX XX XX XX"
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addAdmin} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un administrateur
        </Button>
      </div>
    </ConfigSection>
  );
};
