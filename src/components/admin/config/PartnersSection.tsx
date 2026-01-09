import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ConfigSection } from './ConfigSection';
import { Handshake, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { InstitutionalPartner } from '@/types/platformConfig';

interface PartnersSectionProps {
  partners: InstitutionalPartner[];
  onChange: (partners: InstitutionalPartner[]) => void;
}

export const PartnersSection = ({ partners, onChange }: PartnersSectionProps) => {
  const handlePartnerChange = (index: number, field: keyof InstitutionalPartner, value: string) => {
    const updated = [...partners];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addPartner = () => {
    onChange([
      ...partners,
      {
        name: '',
        acronym: '',
        role: 'partner',
        website: '',
        logoUrl: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
      },
    ]);
  };

  const removePartner = (index: number) => {
    onChange(partners.filter((_, i) => i !== index));
  };

  const isComplete = partners.every(p => p.contactName && p.contactEmail);

  return (
    <ConfigSection
      title="Partenaires institutionnels"
      description="UAT, ANSUT et autres partenaires"
      icon={<Handshake className="h-5 w-5" />}
      isComplete={isComplete}
    >
      <div className="space-y-6">
        {partners.map((partner, index) => (
          <div key={index} className="p-4 border border-border/50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {partner.acronym || partner.name || `Partenaire ${index + 1}`}
              </h4>
              {partners.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePartner(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input
                  value={partner.name}
                  onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                  placeholder="Union Africaine des Télécommunications"
                />
              </div>

              <div className="space-y-2">
                <Label>Acronyme</Label>
                <Input
                  value={partner.acronym}
                  onChange={(e) => handlePartnerChange(index, 'acronym', e.target.value)}
                  placeholder="UAT"
                />
              </div>

              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select
                  value={partner.role}
                  onValueChange={(value) => handlePartnerChange(index, 'role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Partenaire principal</SelectItem>
                    <SelectItem value="pilot">Partenaire pilote</SelectItem>
                    <SelectItem value="partner">Partenaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Site web</Label>
                <Input
                  type="url"
                  value={partner.website}
                  onChange={(e) => handlePartnerChange(index, 'website', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Nom du contact *</Label>
                <Input
                  value={partner.contactName}
                  onChange={(e) => handlePartnerChange(index, 'contactName', e.target.value)}
                  placeholder="Prénom Nom"
                />
              </div>

              <div className="space-y-2">
                <Label>Email du contact *</Label>
                <Input
                  type="email"
                  value={partner.contactEmail}
                  onChange={(e) => handlePartnerChange(index, 'contactEmail', e.target.value)}
                  placeholder="email@organisation.org"
                />
              </div>

              <div className="space-y-2">
                <Label>Téléphone du contact</Label>
                <Input
                  type="tel"
                  value={partner.contactPhone}
                  onChange={(e) => handlePartnerChange(index, 'contactPhone', e.target.value)}
                  placeholder="+225 XX XX XX XX"
                />
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addPartner} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un partenaire
        </Button>
      </div>
    </ConfigSection>
  );
};
